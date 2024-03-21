// LogoutButton.js

import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/logoot/', {
        method: 'POST',
        // Include credentials for session-based authentication
      });
      if (response.ok) {
        console.log("is workign ");
        // Handle successful logout (e.g., redirect to login page)
        navigate('/login'); // Redirect to login page after logout
      } else {
        // Handle logout error
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Handle logout failure
    }
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default LogoutButton;
