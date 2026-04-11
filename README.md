# Zoomble V3 (CPS330 Assignment 3, Group 34)
Zoomble is a web game where users attempt to guess the subject of an image based on a very zoomed in selection of it. Users can also source their own images and create their own levels. Note that answers are singular words, so as to keep answers from getting too long and convoluted.

## Extended Content (Coming Soon???)
Future features for this web app, beyond the scope of this project, could include a category system. Images in the bank would be organized into specific topics or subjects, allowing players to select one or multiple categories instead of drawing from a general pool. This would be similar to Trivial Pursuit, where players can avoid weaker subjects and focus on areas they find more interesting.

At the moment, only images can be added to the game, but adding support for video files could significantly increase variety. The system could capture screenshots from videos and use them as prompts. However, implementing this would be challenging, as it may require detecting and focusing on specific objects within a video before generating a usable image. As an alternative, the game could follow a simpler approach used by movie-based guessing games, where a random frame from a film is selected and slightly zoomed in, and players must guess the movie.
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
The main difficult of this assignment was still focused on the frontend. This time around the difficulty with the frontend revolved around the amount sheer work the were need to be added to the frontend made it challenaging. The backend work was much more simplier, as the main focus was the implementation of the Socket.IO for multip-player. The idea was to make a multiy-player system similar to a Quizzlet or Kahoot, where a room is created by the host and room code was assigned to join the host. Frontend wise, the page kept either crashing or dissappear when trying to add feature that helped with the Princpiples of Nielsen Usability. A specific issue that was notedable was the implemtation of a timer system. That took a significant amount of time out of this project.
