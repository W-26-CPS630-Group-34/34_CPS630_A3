import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./css/App.css";
import Home from "./components/Home";
import Game from "./components/Game";
import Admin from "./components/Admin";

function App() {
  
  return (
    <Router>
      <div className="container">
        <h1>Zoomble ver3.0</h1>

        <nav>
          <Link to="/">Home</Link>
          <Link to="/game">Play Game</Link>
          <Link to="/admin">Admin</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;