import React, { useState, useEffect } from 'react';
import UserForm from './userform';
import Sidebar from './admindesign/home/sidebar/sidebar';

import Navbar from './admindesign/home/navbar/navbar';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
// import "./userliste.scss";

function UserListPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [modifiedUser, setModifiedUser] = useState(null);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/listecustomer/');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUsers();
  }, []);

 

  const handleModifyClick = (user) => {
    setModifiedUser(user);
    setShowModal(true); // Show modal when "Modify" button is clicked
  };
  const handleDelete = async (id) => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api_delete_user/${id}`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
            }
           
        });
        if (response.ok) {
          setUsers(users.filter(user => user.id !== id));
        } else {
          throw new Error('Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }; 

  const handleFormSubmit = async (updatedUserData) => {
    if (!modifiedUser) {
      console.error('Modified user is undefined');
      return;
    }
  
    try {
      const response = await fetch(`http://127.0.0.1:8000/api_mofifie_user/${modifiedUser.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUserData),
      });
      if (response.ok) {
        setUsers(users.map(user => user.id === modifiedUser.id ? updatedUserData : user));
        setModifiedUser(null);
        setShowModal(false); // Close modal after form submission
      } else {
        throw new Error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div >
        
    
      <h1>Customer List</h1>
      <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
      <TableCell className="tableCell">ID</TableCell>
      <TableCell className="tableCell">Username</TableCell>
      <TableCell className="tableCell">Firstname</TableCell>
      <TableCell className="tableCell">Last Name</TableCell>
      <TableCell className="tableCell">Email</TableCell>
      <TableCell className="tableCell">Poste</TableCell>
      <TableCell className="tableCell">Service</TableCell>
      <TableCell className="tableCell">Actions</TableCell>
      </TableRow>
        </TableHead>
        <TableBody>
    {users.map(user => { 
      if (user.is_directeur || user.is_admin || user.is_technicien || user.is_chefservice || user.is_citoyen) {
        return (
          <TableRow key={user.id}>
            <TableCell className="tableCell">{user.id}</TableCell>
            <TableCell className="tableCell">{user.username}</TableCell>
            <TableCell className="tableCell">{user.first_name}</TableCell>
            <TableCell className="tableCell">{user.last_name}</TableCell>
            <TableCell className="tableCell">{user.email}</TableCell>
            <TableCell className="tableCell">
              {user.is_directeur && 'Directeur '}
              {user.is_admin && 'Admin '}
              {user.is_technicien && 'Technicien '}
              {user.is_chefservice && 'Chef Service '}
              {user.is_citoyen && 'Citoyen '}
              </TableCell>
            <TableCell className="tableCell">{user.service ? user.service.nom : 'Unknown'}</TableCell>
            <TableCell className="tableCell">
               <button onClick={() => handleDelete(user.id)} className="btn btn-danger">Supprimer</button>
                <button onClick={() => handleModifyClick(user)} className="btn btn-secondary">Modify</button>
                </TableCell>
                </TableRow>
         
        );
      } 
    })}
  </TableBody>
  </Table>
</TableContainer>

      {modifiedUser && (
        <div className={`modal ${showModal ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{display: showModal ? 'block' : 'none'}}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Modify User</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <UserForm user={modifiedUser} onSubmit={handleFormSubmit} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
 
  );
}

export default UserListPage;