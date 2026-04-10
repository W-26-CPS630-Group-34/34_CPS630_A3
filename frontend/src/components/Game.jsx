import { useState, useEffect } from "react";

function Game({ players, isHost, socket, current, roomCode, gameState, timer, next }) {
    const [myInput, setMyInput] = useState("");
     

    const handleChange = (value) => {
        setMyInput(value); 
        socket.emit("updateGuess", roomCode, value);
    };


    if (!current) return <p>No crops found</p>;

    return (
        <div>
            <h2>Guess the Object</h2>
            <p>Type your guess in your box below!</p>
            <p>Level: {current.id}</p>
            <p>Time Remaining: {timer} seconds</p>
            <p>{gameState === "completed" ? `Time's up! The answer was: ${current.answer}` : ""}</p>
            
            <div className="img">
                <img
                    src={current.src}
                    alt="Level"
                    style={{
                        transform: `scale(${current.zoom}) translate(${current.x}%, ${current.y}%)`
                    }}
                />
            </div>

            { players.map((p) => (
                <div key={p.id}>
                    <p>
                    {p.username} {p.id === socket.id ? "(You)" : ""}
                    </p>

                    <input
                    value={p.id === socket.id ? myInput : p.guess}
                    onChange={(e) => handleChange(e.target.value)}
                    disabled={p.id !== socket.id || gameState == "completed"}
                    />

                    <p>Score: {p.score}</p>
                </div>
            ))}

            {isHost && gameState === "completed" && (
                <button onClick={next}>Next Round</button>
            )}

        </div>
    );
}

export default Game;