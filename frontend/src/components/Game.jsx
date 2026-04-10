import { useState, useEffect } from "react";

function Game(players, isHost, socket) {
    const [levels, setLevels] = useState([]);
    const [current, setCurrent] = useState(null);
    const [index, setIndex] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState(""); 

    // Fisher-Yates shuffle function
    const shuffle = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };
    
    useEffect(() => {
        
        setError("");
    
        fetch("http://localhost:8080/api/crops")
            .then(res => res.json())
            .then(data => {
                setLoading(false);
                const shuffled = [...data]; // copy the array
                shuffle(shuffled); // shuffle in place
                setLevels(shuffled);
                if (shuffled.length > 0) {
                    setCurrent(shuffled[0]); // set the first level as current
                }
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setError("Server error. Please Try Again");
                setLoading(false);
            });
        
    }, []);

    const nextImage = () => {
        setIndex(prev => (prev + 1) % levels.length);
        setCurrent(levels[index]);
        setMessage("");
    };

    const resetGame = () => {
        if (levels.length > 0) {
            const reshuffled = [...levels];  
            shuffle(reshuffled);             

            setLevels(reshuffled);          
            setIndex(0);                      
            setCurrent(reshuffled[0]);
            setMessage("");
        }
    };

    if (loading) return <p>Loading Levels...</p>;
    if (error) return <p>{error}</p>;
    if (!current) return <p>No levels found</p>;

    return (
        <div>
            <h2>Guess the Object</h2>
            <p>Type your guess, press Enter or click Guess. Use Hint if needed.</p>
            <p>Level: {current.id}</p>
            
            <div className="img">
                <img
                    src={current.src}
                    alt="Level"
                    style={{
                        transform: `scale(${current.zoom}) translate(${current.x}%, ${current.y}%)`
                    }}
                />
            </div>

        </div>
    );
}

export default Game;