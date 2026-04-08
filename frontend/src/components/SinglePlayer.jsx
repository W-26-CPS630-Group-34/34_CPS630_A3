import { useEffect, useState } from "react";


function SinglePlayer() {
  const [levels, setLevels] = useState([]);
  const [current, setCurrent] = useState(null);
  const [index, setIndex] = useState(0);
  const [guess, setGuess] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); 
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [hint, setHint] = useState(false);
  const [highScore, setHighScore] = useState(0);

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

  const updateHighScore = () => {
    setHighScore(prevHigh => {
      const newScore = score + 1;
      return newScore > prevHigh ? newScore : prevHigh;

    });
  };

  const checkAnswer = () => {
    setMessage("");
    
    if (current && guess.toLowerCase().trim() === current.answer.toLowerCase().trim()) {
      setMessage("Correct!");
      setIsCorrect(true);
      setIndex(prev => (prev + 1) % levels.length); 
      setCurrent(levels[index]);
      setScore(prev => prev + 1);
      updateHighScore();
      setHint(false);
    } else {
      setMessage("Wrong. Try again!");
      setIsCorrect(false);
    }
    setGuess("");
  };

  const nextImage = () => {
    setIndex(prev => (prev + 1) % levels.length);
    setCurrent(levels[index]);
    setGuess("");
    setMessage("");
    setIsCorrect(false);
    setHint(false);
  };

  const prevImage = () => {
    setIndex(prev => (prev - 1 + levels.length) % levels.length);
    setCurrent(levels[index]);
    setGuess("");
    setMessage("");
    setIsCorrect(false);
    setHint(false);
  };

  const resetGame = () => {
    if (levels.length > 0) {
      const reshuffled = [...levels];  
      shuffle(reshuffled);             
  
      setLevels(reshuffled);          
      setIndex(0);                      
      setCurrent(reshuffled[0]);        
      setGuess("");                    
      setScore(0);
      setMessage("");
      setIsCorrect(false);
      setHint(false);
    }
  };

  if (loading) return <p>Loading Levels...</p>;
  if (error) return <p>{error}</p>;
  if (!current) return <p>No levels found</p>;

  return (
    <div>
      <h2>Guess the Object</h2>
      <p>Type your guess, press Enter or click Guess. Use Hint if needed.</p>
      <p className={message === "Correct!" ? "correct" : "wrong"}>{message}</p>
      
    
      <p>Score: {score} </p>
      <p>High Score: {highScore} </p>
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
    
    <br/>
      <input
      
        placeholder="Your guess"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (isCorrect) {
              setScore(prev => prev + 1);
              nextImage();
              setHint(false);
              updateHighScore();
            } else {
              checkAnswer();
            }
            setGuess("");
          }
        }}
      />
      
      <br/>
      {hint && current && (
        <p>Hint: Starts with "{current.answer[0]}"</p>
      )}
      <button onClick={checkAnswer}>Guess</button>
      <button type="button" onClick={() => setHint(prev => !prev)}>
  {hint ? "Hide Hint" : "Show Hint"}</button>
      <button onClick={resetGame}>Reset</button>
      <button onClick={prevImage}>Previous</button>
      <button onClick={nextImage}>Next</button>
      
    </div>
  );
}

export default SinglePlayer;