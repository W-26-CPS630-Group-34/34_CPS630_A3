import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./css/App.css";
import Home from "./components/Home";
import SinglePlayer from "./components/SinglePlayer";
import Admin from "./components/Admin";
import MultiPlayer from "./components/MultiPlayer";

function App() {
  
  return (
    <Router>
      <div className="container">
        <h1>Zoomble ver3.0</h1>

        <nav>
          <Link to="/">Home</Link>
          <Link to="/single">Play Alone</Link>
          <Link to="/multi">Play With Friends</Link>
          <Link to="/admin">Admin</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/single" element={<SinglePlayer />} />
          <Route path="/multi" element={<MultiPlayer />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;