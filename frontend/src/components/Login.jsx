import { useState, useEffect } from 'react';

function Login({ authToken, setAuthToken }) {
  //!! Class 3: simple login form for demo auth token retrieval
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [adminExists, setAdminExists] = useState(null);
  const BASE = 'http://localhost:8080';

    // check if admin already exists
  useEffect(() => {
    fetch(`${BASE}/api/auth/exists`)
      .then(res => res.json())
      .then(data => setAdminExists(data.exists))
      .catch(() => setAdminExists(false));
  }, []);
//when login button clicked, find the user's record on db, and let the user in
const handleLogin = async () => {
  try {
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }

    setAuthToken(data.token);

  } catch (err) {
    alert(err.message);
  }
};
//when create acc button clicked, store their acc info to db, and assign token
const handleRegister = async () => {
  try {
    const res = await fetch(`${BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Register failed');
    }

    setAuthToken(data.token);

  } catch (err) {
    alert(err.message);
  }
};
  const handleLogout = () => {
    setAuthToken('');
    setUsername('');
    setPassword('');
  };

  return (
  <div id="login-panel">
  {authToken ? (
    <>
      <p>Welcome!</p>
      <button onClick={handleLogout}>Logout</button>
    </>
  ) : (
    <>
      <h2>Create/Login an Account</h2>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      
      <div style={{ marginTop: '10px' }}>
        <button onClick={handleLogin}>
          Login
        </button>
        <button onClick={handleRegister} style={{ marginLeft: '10px' }}>
          Create Account
        </button>
      </div>
    </>
  )}
</div>
);
}

export default Login;