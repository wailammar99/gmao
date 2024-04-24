import React, { useState, useEffect } from 'react';
import UserformA from './directeurdesi/UserformA';
import Sidebar from './directeurdesi/Sidebar/Sidebardic';
import Navbar from './directeurdesi/Navbar/navbardic';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const Listtechnicien = () => {
  const [technicienData, setTechnicienData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserForm, setShowUserForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/listecustomer/');
      if (response.ok) {
        const data = await response.json();
        const techniciens = data.filter(user => user.
          is_chefservice);
        setTechnicienData(techniciens);
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleClick = (user) => {
    setSelectedUser(user);
    setShowUserForm(true);
    console.log("Selected user:", user);
  };

  const handleActivate = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api_activer_compte/${id}`, {
        method: 'GET',
      });
      if (response.ok) {
        setTechnicienData(prevUsers => {
          const updatedUsers = prevUsers.map(user => {
            if (user.id === id) {
              return { ...user, is_active: true };
            }
            return user;
          });
          return updatedUsers;
        });
        console.log('Compte utilisateur activé avec succès');
      } else {
        throw new Error('Failed to activate user account');
      }
    } catch (error) {
      console.error('Error activating user account:', error);
    }
  };

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <div className="top">
          <h1>Les chef service</h1>
        </div>
        <div className="botom">
          <div>
            <TableContainer component={Paper} className="table">
              <TableHead>
                <TableRow>
                  <TableCell className="tableCell">ID</TableCell>
                  <TableCell className="tableCell">Username</TableCell>
                  <TableCell className="tableCell">Email</TableCell>
                  <TableCell className="tableCell">first_name</TableCell>
                  <TableCell className="tableCell">last_name</TableCell>
                  <TableCell className="tableCell">Service</TableCell>
                  <TableCell className="tableCell">Is Active</TableCell>
                  <TableCell className="tableCell">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {technicienData.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="tableCell">{user.id}</TableCell>
                    <TableCell className="tableCell">{user.username}</TableCell>
                    <TableCell className="tableCell">{user.email}</TableCell>
                    <TableCell className="tableCell">{user.first_name}</TableCell>
                    <TableCell className="tableCell">{user.last_name}</TableCell>
                    <TableCell className="tableCell">{user.service?.nom ? user.service.nom : "he needs assigned service"}</TableCell>
                    <TableCell className="tableCell">{user.is_active ? 'Yes' : 'No'}</TableCell>
                    <TableCell className="tableCell">
                      {!user.is_active && (
                        <button onClick={() => handleActivate(user.id)} className="btn btn-success">Activer</button>
                      )}
                      <button type="button" className="btn btn-outline-warning" onClick={() => handleClick(user)}>Assigné Service</button>
                      {showUserForm && selectedUser && selectedUser.id === user.id && (
                        <UserformA userId={user.id} />
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

export default Listtechnicien;
