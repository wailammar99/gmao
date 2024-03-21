import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for navigation

const Citoyenpage = () => {
  const [userData, setUserData] = useState([]);
  const navigate = useNavigate(); // Use useNavigate hook for navigation

 

  // Define handleLogout function
  const handleLogout = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/logoot/', {
        method: 'POST',
        credentials: 'include', // Include credentials for session-based authentication
      });
      if (response.ok) {
      
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
    <div>
      <h2>Welcome, cioyen !</h2>
      {/* Display admin-specific content */}
      <ul>
        {userData.map((user) => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Citoyenpage;
