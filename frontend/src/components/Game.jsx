import { useState, useEffect } from "react";

function Game({ players, isHost, socket, current, roomCode }) {
    const [myInput, setMyInput] = useState("");
    
    const [error, setError] = useState("");
    const [message, setMessage] = useState(""); 

    const handleChange = (value) => {
        setMyInput(value); 
        socket.emit("updateGuess", roomCode, value);
    };


    if (error) return <p>{error}</p>;
    if (!current) return <p>No crops found</p>;

    return (
        <div>
            <h2>Guess the Object</h2>
            <p>Type your guess in your box below:</p>
            <p>Level: {current.id}</p>
            <p>{message}</p>
            
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
                    disabled={p.id !== socket.id}
                    />
                </div>
            ))}

        </div>
    );
}

export default Game;