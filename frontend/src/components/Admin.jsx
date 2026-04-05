import { useEffect, useState } from "react";
import Login from "./Login";

function Admin() {
  const API = "http://localhost:8080/api/crops";

  const [levels, setLevels] = useState([]);
  const [id, setId] = useState("");
  const [src, setSrc] = useState("");
  const [answer, setAnswer] = useState("");
  const [zoom, setZoom] = useState("");
  const [x, setX] = useState("");
  const [y, setY] = useState("");

  //!! Class 3: keep auth token in app state and pass it to protected actions
  const [authToken, setAuthToken] = useState('');

  const fetchLevels = () => {
    fetch(API)
      .then(res => res.json())
      .then(data => setLevels(data));
  };

  useEffect(() => {
    fetchLevels();
  }, []);

  // CREATE
  const createLevel = async () => {
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, src, answer, zoom, x, y }) // sending data
    });

    setId("");
    setSrc("");
    setAnswer("");
    setZoom("");
    setX("");
    setY("");
    fetchLevels();
  };

  // UPDATE
  const updateLevel = async () => {
    await fetch(`${API}/id/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ src, answer, zoom, x, y }) // sending data (exclude id since it's in URL)
    });

    setId("");
    setSrc("");
    setAnswer("");
    setZoom("");
    setX("");
    setY("");
    fetchLevels();
  };

  // DELETE
  const deleteLevel = async (id) => {
    await fetch(`${API}/id/${id}`, { method: "DELETE" });
    fetchLevels();
  };

  // add a button here to trigger UPDATE functionality instead
  // add login requirement: only show this admin panel if user is logged in (i.e., has auth token in app state)
  return (
    <div>
      <h2>Admin Panel</h2>
      <Login authToken={authToken} setAuthToken={setAuthToken} />

      {authToken && ( 
        <>
          <h3>Create/Update Level</h3>
          <input
            placeholder="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <input
            placeholder="Image"
            value={src}
            onChange={(e) => setSrc(e.target.value)}
          />
          <input
            placeholder="Answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <br/>
          <input
            placeholder="Zoom"
            value={zoom}
            onChange={(e) => setZoom(e.target.value)}
          />
          <input
            placeholder="X"
            value={x}
            onChange={(e) => setX(e.target.value)}
          />
          <input
            placeholder="Y"
            value={y}
            onChange={(e) => setY(e.target.value)}
          />
          <br/>
          <button onClick={createLevel}>Add</button>
          <button onClick={updateLevel}>Update</button>
          <br/><br/>
          <h3>All Levels</h3>
          <ul>
            {levels.map(level => (
              <li key={level.id}>
                <span>Level {level.id}: {level.answer} </span>
                <button onClick={() => deleteLevel(level.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
      </>)}
    </div>
  );
}

export default Admin;