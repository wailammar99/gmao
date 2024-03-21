import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/login_react/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        // If response is not OK, throw an error
        throw new Error('Login failed');
      }

      // Extract the authentication token, user ID, and role from the response
      const { token, role, userId } = await response.json();
      
      // Store the token and user ID in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);

      // Call onLogin function passed from parent component
      onLogin();

      // Redirect based on the user's role
      if (role === 'admin') {
        navigate(`/admin_dashboard/${userId}`);
      } else if (role === 'citoyen') {
        navigate('/citoyen_dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed. Please try again.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(username, password);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;
