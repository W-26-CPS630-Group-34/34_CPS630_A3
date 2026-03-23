# Zoomble V2 (CPS330 Assignment 2, Group 34)
Zoomble is a web game where users attempt to guess the subject of an image based on a very zoomed in selection of it. Users can also source their own images and create their own levels. Note that answers are singular words, so as to keep answers from getting too long and convoluted.

## Extended Content (Coming Soon???)
In the future, it would be great to add a second step to the creation page. Users have to estimate the final look of their level, but an interactive viewer that renders the image as seen in-game would solve this issue.

Users can only provide externally sourced images. The schema should allow users to add their own images. This would require changes to the 
CRUD forms too, adding a section for file upload.

In transferring over the game from static HTML/CSS to React, many of the original visual elements were lost, such as animation and colour changing backgrounds. These were not added due to time constraints, it would be great to add them back in the future.

# Run Frontend
```
cd frontend
npm install
npm run dev
```

# Run Backend
```
cd backend
npm install
npm run start
```

Server will begin running on localhost, port 8080. 
Database will run on localhost, port 27017
App will run on localhost, port 5173
Head to http://localhost:5173/ to experience the game!

## Reflection
There were many difficulties with the development of the frontend. The person who originally wrote the frontend made many mistakes and created lots of bugs and errors. This caused development to grind to a halt as another individual had to come in and fix their mess. It is suspected that use of AI caused many of these errors. There were also many incorrect API calls and references to object attributes that do not exist.