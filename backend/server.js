const express   = require('express');
const cors      = require('cors');
const app       = express();
const http      = require('http');
const server    = require('http').createServer(app);  
const io        = require('socket.io')(server);

const mongoose = require('mongoose');
const Crop = require('./models/Crop');
const User = require('./models/User');

const PORT          = 8080;
const DATABASE_HOST = 'localhost';
const DATABASE_PORT = 27017;

//Enable CORS for frontend requests
app.use(cors());

// database connect
const dbURL = `mongodb://${DATABASE_HOST}:${DATABASE_PORT}/zoomble`;
mongoose.connect(dbURL);

const db = mongoose.connection;
db.on('error', function(e) {
    console.log('error connecting');
});

db.on('open', function(e) {
    console.log('database connected!');
});

// change ALL OF THESE to absolute references
crops = [
    {id:1, src:"https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Chocolate_cake_%281%29.jpg/640px-Chocolate_cake_%281%29.jpg", answer:"cake", zoom:6, x:5, y:-19},
    {id:2, src:"https://upload.wikimedia.org/wikipedia/commons/4/49/Panthera_tigris_tigris.jpg", answer:"tiger", zoom:6, x:0, y:0},
    {id:3, src:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Pep-Farm-Cookie-Alt.jpg/1280px-Pep-Farm-Cookie-Alt.jpg", answer:"cookie", zoom:5, x:0, y:0},
    {id:4, src:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Safeway_cupcake_-_October_2024_-_Sarah_Stierch.jpg/640px-Safeway_cupcake_-_October_2024_-_Sarah_Stierch.jpg", answer:"cupcake", zoom:4, x:0, y:18},
    {id:5, src:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Elephant_-_Jardim_Zool%C3%B3gico_de_Bras%C3%ADlia_-_DSC09849.JPG/1280px-Elephant_-_Jardim_Zool%C3%B3gico_de_Bras%C3%ADlia_-_DSC09849.JPG?_=20120730232914", answer:"elephant", zoom:6, x:20, y:15},
    {id:6, src:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/US_keyboard_on_MacBook_Pro_15-inch_2018.jpg/640px-US_keyboard_on_MacBook_Pro_15-inch_2018.jpg", answer:"keyboard", zoom:5, x:-39, y:-18},
    {id:7, src:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Niagara_Falls_seen_from_Skylon_tower.jpg/640px-Niagara_Falls_seen_from_Skylon_tower.jpg", answer:"waterfall", zoom:4, x:10, y:5},
    {id:8, src:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Round_Table_Pizza_-_October_2024_-_Sarah_Stierch_01.jpg/640px-Round_Table_Pizza_-_October_2024_-_Sarah_Stierch_01.jpg", answer:"pizza", zoom:6, x:0, y:0},
    {id:9, src:"https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Staffordshire-bull-terrier-puppy-fawn-2166763.jpg/640px-Staffordshire-bull-terrier-puppy-fawn-2166763.jpg", answer:"puppy", zoom:5, x:0, y:0},
    {id:10, src:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Domestic_cat_2011_G02.jpg/1280px-Domestic_cat_2011_G02.jpg?_=20110112174248", answer:"cat", zoom:5, x:0, y:0},
    {id:11, src:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Strawberry_friut_red_strawberry.jpg/640px-Strawberry_friut_red_strawberry.jpg", answer:"strawberry", zoom:5, x:0, y:0},
    {id:12, src:"https://upload.wikimedia.org/wikipedia/commons/7/72/Zebra_eating.jpg", answer:"zebra", zoom:4, x:-10, y:10},
]

async function addInitCropsMongoDB() {
    const cropCount = await Crop.countDocuments();

    if (cropCount === 0) {
        console.log('Adding test crops to db ...')
        
        crops.forEach(crop => {
            const newCrop = new Crop(crop);
            newCrop.save()
                .then(() => console.log('Crop added with ID ' + crop.id))
                .catch(err => console.error('Error adding crop?! ID ' + crop.id + '\n' + err + '\n'))
        });

    } else {
        console.log('Crops already exist in db!!!')
        return;
    }
}
addInitCropsMongoDB();

//!! Class 2: tiny authorization middleware for protected routes
async function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    //we are expecting the auth header to be in the format "Bearer <token>", so we check for that and extract the token
    //"Bearer " is part of the HTTP standard for authorization headers and indicates that the client is sending a token for authentication.
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization header missing or invalid' });
    }

    const token = authHeader.substring(7); //just extract token part after "Bearer "
    const user = await User.findOne({ token: token });
    if (!user) {
        return res.status(401).json({ error: 'Invalid auth token' });
    }

    next();
}

/*************************************************/
/********* Defining (CRUD) API routes ************/
/*************************************************/

/************************/
/******* SERVER *********/
/******* AUTH ***********/
/************************/
app.get('/api/auth/exists', async (req, res) => {
    const user = await User.findOne({});
    res.json({ exists: !!user });
});

//login route
app.post('/api/auth/login', express.json(), async (req, res) => {
    const { username, password } = req.body || {};

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await User.findOne({ username, password });

    if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }

    res.json({
        message: 'Successfully logged in',
        token: user.token
    });
});
app.post('/api/auth/register', express.json(), async (req, res) => {
    const { username, password } = req.body || {};

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
    }

    // check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
    }

    const token = Math.random().toString(36).substring(2);

    const newUser = new User({
        username,
        password,
        token
    });

    await newUser.save();

    res.status(201).json({
        message: 'Account created',
        token
    });
});

/************************/
/******* SERVER *********/
/******** READ **********/
/************************/
//get all crops
app.get('/api/crops', async (req, res) => {
    const crops = await Crop.find({});
    res.json(crops);
});

/************************/
/******* SERVER *********/
/******** READ **********/
/************************/
//get crop by ID (unique id)
//In Express.js route definitions, the colon (:) prefix indicates a route parameter (also called a path parameter)
app.get('/api/crops/id/:id', async (req, res) => {
    //compare ID as string to avoid precision loss with large numbers
    const id = req.params.id;
    const crop = await Crop.findOne({ id:id })
    if (crop) {
        res.status(200).json(crop); //status code 200 = OK
    } else {
        res.status(404).json({ error: "Crop not found" });  //status 404 code = NOT FOUND
    }
});

/************************/
/******* SERVER *********/
/******* CREATE *********/
/************************/
//create new crop
app.post('/api/crops', requireAuth, express.json(), async (req, res) => {
    const newCrop = req.body;

    if (newCrop && newCrop.id && newCrop.src && newCrop.answer && newCrop.zoom) {

        let crop = new Crop(newCrop);
        crop.save()
            .then(() => console.log('Crop added with ID ' + crop.id))
            .catch(err => console.error('Error adding crop?! ID ' + crop.id + '\n' + err + '\n'));
        res.status(201).json(crop);
    } else {
        res.status(400).json({ error: "Invalid crop data" });
    }
});

/************************/
/******* SERVER *********/
/******* UPDATE *********/
/************************/
//update crop by unique id, i.e., ID
app.patch('/api/crops/id/:id', requireAuth, express.json(), async (req, res) => {
    console.log("PATCH request received");

    const cropId = req.params.id;
    let crop = await Crop.findOne({ id:cropId })

    if (crop) {
        // update only the fields provided in request body
        if (req.body.src !== "") crop.src = req.body.src;
        if (req.body.answer !== "") crop.answer = req.body.answer;
        if (req.body.zoom !== "") crop.zoom = req.body.zoom;
        if (req.body.x !== "") crop.x = req.body.x;
        if (req.body.y !== "") crop.y = req.body.y;
        crop.save()
            .then(() => console.log('Crop updated with ID ' + crop.id))
            .catch(err => console.error('Error updating crop?! ID ' + crop.id + '\n' + err + '\n'));
        res.status(200).json(crop);
    } else {
        res.status(404).json({ error: "Crop not found" });
    }
}); 

/************************/
/******* SERVER *********/
/******* DELETE *********/
/************************/
//delete by unique id, i.e., ID (can only delete one)
app.delete('/api/crops/id/:id', requireAuth, async (req, res) => {
    const cropId = req.params.id;
    const deleteStatus = await Crop.deleteOne({ id:cropId });
    if (deleteStatus === 0) {
        res.status(404).json({ error: "Crop not found" });
    } else {
        res.status(204).send();        
    }
});

/****************************/
/******* MULTI-PLAYER *******/
/********* FEATURES *********/
/****************************/

const rooms = {};

function generateRoomCode() {
    let res = Math.random().toString(36).substring(2, 6).toUpperCase()
    while (rooms[res]) {
        res = Math.random().toString(36).substring(2, 6).toUpperCase()
    }
    return res;
}

function startRound(code) {
    const room = rooms[code];
    let timeLeft = 10;

    room.timer = setInterval(() => {
        io.to(code).emit("timerUpdate", timeLeft);

        timeLeft--;

        if (timeLeft < 0) {
        clearInterval(room.timer);
        endRound(code);
        }
    }, 1000);
}

function endRound(code) {
    const room = rooms[code];

    // Freeze guesses
    const finalGuesses = room.players.map(p => ({
        name: p.name,
        guess: p.guess
    }));

    io.to(code).emit("roundEnded", finalGuesses);

    // Reset guesses
    room.players.forEach(p => p.guess = "");
}

//socket.io stuff
//https://socket.io/docs/v3/emit-cheatsheet/
io.on('connection', (socket) => {
    console.log(socket.id + ' connected');

    socket.on("disconnect", () => {
        for (const code in rooms) {
            const room = rooms[code];

            if (room.players[socket.id]) {
                delete room.players[socket.id];

                if (Object.keys(room.players).length === 0) {
                    delete rooms[code];
                } else {
                    io.to(code).emit("updatePlayers", Object.values(room.players));
                }
            }
        }
    });

    socket.on('createRoom', (username) => {
        const roomCode = generateRoomCode();
        rooms[roomCode] = {
            host: socket.id,
            players: { [socket.id]: { id: socket.id, username: username, guess: "", score: 0 } },
            gameState: "lobby",
            timer: null,
            currentCrop: null            
        };
        
        socket.join(roomCode);
        socket.emit('roomCreated', roomCode);
        io.to(roomCode).emit('playerJoined', Object.values(rooms[roomCode].players));
        console.log('Room ' + roomCode + ' created by ' + username + ' (' + socket.id + ')');
    });

    socket.on('joinRoom', (roomCode, username) => {
        const room = rooms[roomCode];
        if (!room) {
            socket.emit("errorMessage", "Room not found");
            return;
        }

        if (Object.keys(room.players).length >= 9) {
            socket.emit("errorMessage", "Room full");
            return;
        }

        room.players[socket.id] = { id: socket.id, username: username, guess: "", score: 0 };
        socket.join(roomCode);
        io.to(roomCode).emit('playerJoined', Object.values(room.players));
        console.log('Player ' + socket.id + ' (' + username + ') joined room ' + roomCode);
    });

    socket.on("startGame", (code) => {
        const room = rooms[code];
        
        if (socket.id !== room.host) return;

        room.gameState = "playing";
        io.to(code).emit("gameStarted");
    });

    socket.on("updateGuess", (code, guess) => {
        const room = rooms[code];
        const player = room.players.find(p => p.id === socket.id);

        if (player) {
            player.guess = guess;
            io.to(code).emit("updatePlayers", room.players);
        }
    });


});

//starts server
server.listen(PORT, () => { console.log("Server started on port: " + PORT) });