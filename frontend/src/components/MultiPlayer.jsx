import { useState, useEffect, useRef } from "react";
import Lobby from "./Lobby";

const SOCKET_SERVER_URL = "http://localhost:8080";

function MultiPlayer() {
    const socketRef = useRef(null);
    const [roomCode, setRoomCode] = useState("");
    const [roomCodeInput, setRoomCodeInput] = useState("");
    const [playerName, setPlayerName] = useState("");
    const [players, setPlayers] = useState([]);
    const [gameState, setGameState] = useState("home");
    const [isHost, setIsHost] = useState(false);

    useEffect(() => {
        const socket = io(SOCKET_SERVER_URL, {
            transports: ["websocket"],
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("Connected to socket server", socket.id);
        });

        socket.on("roomCreated", (code) => {
            setRoomCode(code);
            setRoomCodeInput(code);
            setIsHost(true);
        });

        socket.on("playerJoined", (players) => {
            setPlayers(players);
            setGameState("lobby");
        });

        socket.on("updatePlayers", (players) => {
            setPlayers(players);
        });

        socket.on("errorMessage", (message) => {
            alert(message);
        });

        socket.on("gameStarted", () => {
            setGameState("game");
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    function createRoom(e) {
        e.preventDefault();

        if (!playerName.trim()) {
            alert("Please enter a screen name before creating a room.");
            return;
        }

        socketRef.current?.emit("createRoom", playerName);
    }

    function joinRoom(e) {
        e.preventDefault();

        if (!playerName.trim()) {
            alert("Please enter a screen name before joining a room.");
            return;
        }

        if (!roomCodeInput.trim()) {
            alert("Please enter a room code.");
            return;
        }

        const code = roomCodeInput.trim().toUpperCase();
        setRoomCode(code);
        socketRef.current?.emit("joinRoom", code, playerName);
    }

    function startGame() {
        if (!roomCode) return;
        socketRef.current?.emit("startGame", roomCode);
    }

    return (
        <>
            {gameState === "home" && (
                <form>
                    <input
                        type="text"
                        placeholder="Enter a Fun Screen Name"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                    />
                    <button onClick={createRoom} type="button">
                        Create Room
                    </button>
                    <input
                        type="text"
                        placeholder="Enter Room Code"
                        value={roomCodeInput}
                        onChange={(e) => setRoomCodeInput(e.target.value)}
                    />
                    <button onClick={joinRoom} type="button">
                        Join Room
                    </button>
                </form>
            )}

            {gameState === "lobby" && (
                <Lobby
                    roomCode={roomCode}
                    players={players}
                    isHost={isHost}
                    onStartGame={startGame}
                />
            )}

            {gameState === "game" && (
                <div>
                    <h2>Game started!</h2>
                    <p>The game is now in progress.</p>
                </div>
            )}
        </>
    );
}

export default MultiPlayer;