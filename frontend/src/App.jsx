import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Admin from "./pages/Admin";

function App() {
  return (
    <Router>
      <div className="container">
        <h1>Zoomble ver2.0</h1>

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