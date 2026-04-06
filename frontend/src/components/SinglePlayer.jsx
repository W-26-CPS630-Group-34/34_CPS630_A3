import { useEffect, useState } from "react";

function SinglePlayer() {
  const [levels, setLevels] = useState([]);
  const [current, setCurrent] = useState(null);
  const [index, setIndex] = useState(0);
  const [guess, setGuess] = useState("");

  // Fisher-Yates shuffle function
  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/crops")
      .then(res => res.json())
      .then(data => {
        const shuffled = [...data]; // copy the array
        shuffle(shuffled); // shuffle in place
        setLevels(shuffled);
        if (shuffled.length > 0) {
          setCurrent(shuffled[0]); // set the first level as current
        }
      })
      .catch(err => console.log(err));
  }, []);

  const checkAnswer = () => {
    if (current && guess === current.answer) {
      alert("Correct!");
      // move to the next index, wrap around if at the end
      setIndex(prev => (prev + 1) % levels.length); 
      // set current to the next level in the shuffled levels array
      setCurrent(levels[index]);
    } else {
      alert("Wrong. Try again!");
    }
  };

  if (!current) return <p>Loading...</p>;

  return (
    <div>
      <h2>Guess the Object</h2>

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
      />
      <br/>
      <button onClick={checkAnswer}>Guess</button>
    </div>
  );
}

export default SinglePlayer;