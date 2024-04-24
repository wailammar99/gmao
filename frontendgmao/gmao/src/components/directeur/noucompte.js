import React, { useState, useEffect } from 'react';
import Sidebar from './directeurdesi/Sidebar/Sidebardic';
import Navbar from './directeurdesi/Navbar/navbardic';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import UserformA from './directeurdesi/UserformA';
import PopupMessage from '../message';

const CompteNoActive = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/listecustomer/');
      if (response.ok) {
        const data = await response.json();
        // Filter users where is_active is false
        const filteredUsers = data.filter(user => !user.is_active);
        setUsers(filteredUsers);
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleActivate = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api_activer_compte/${id}/`, {
        method: 'GET',
      });
      if (response.ok) {
        setUsers(prevUsers => {
          const updatedUsers = prevUsers.map(user => {
            if (user.id === id) {
              return {...user, is_active: true };
            }
            return user;
          });
          return updatedUsers;
        });
        setShowMessage(true); // Show message for successful activation
        console.log('Compte utilisateur activé avec succès');
      } else if (response.status === 401) {
        setShowMessage(true); // Show message for unauthorized access
      } else {
        throw new Error('Failed to activate user account');
      }
    } catch (error) {
      console.error('Error activating user account:', error);
    }
  };

  const handleAssignServiceClick = (user) => {
    setSelectedUser(user);
    setShowUserForm(true);
  };

  // Define messages for each case
  const messages = {
    success: "Compte utilisateur activé avec succès",
    unauthorized: "Il faut assigner un service",
    error: "Erreur lors de l'activation du compte utilisateur"
  };

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <div className="top">
          <h1>Comptes Inactifs</h1>
          {showMessage && <PopupMessage message={messages.unauthorized} color="success" />}
        </div>
        <div className="bottom">
          <div>
            <TableContainer component={Paper} className="table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell> activation </TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.first_name}</TableCell>
                    <TableCell>{user.last_name}</TableCell>
                    <TableCell>{user.is_active ? 'is activate ' :'no activate '}</TableCell>
                    <TableCell>
                      <button onClick={() => handleActivate(user.id)} className="btn btn-success">Activer</button>
                      <button onClick={() => handleAssignServiceClick(user)} className="btn btn-outline-warning">Assign Service</button>
                      {showUserForm && selectedUser && selectedUser.id === user.id && (
                        <UserformA userId={user.id} onSubmit={() => setShowUserForm(false)} />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </TableContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompteNoActive;
