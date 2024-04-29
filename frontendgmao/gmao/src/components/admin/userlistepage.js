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
import PopupMessage from '../message';
import { Stack } from '@mui/material';
import { Navigate } from 'react-router-dom';

function UserListPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [modifiedUser, setModifiedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [showpop, setShowPop] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);

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

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (showpop) {
      const timer = setTimeout(() => {
        setShowPop(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showpop]);

  const handleModifyClick = (user) => {
    setModifiedUser(user);
    setShowModal(true);
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
        setMessage("L'utilisateur a été supprimé avec succès");
        setShowPop(true);
        fetchUsers();
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
        setShowModal(false);
        setMessage("L'utilisateur a été modifié avec succès");
        setShowPop(true);
        fetchUsers();
      } else {
        throw new Error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Liste des utilisateurs</h1>
      {showpop && <PopupMessage message={message} color="success" />}
      <TableContainer component={Paper} className="table">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Firstname</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Poste</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentUsers.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.first_name}</TableCell>
                <TableCell>{user.last_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.is_directeur && 'Directeur '}
                  {user.is_admin && 'Admin '}
                  {user.is_technicien && 'Technicien '}
                  {user.is_chefservice && 'Chef Service '}
                  {user.is_citoyen && 'Citoyen '}
                </TableCell>
                <TableCell>{user.service ? user.service.nom : 'Unknown'}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={2}>
                    <button onClick={() => handleDelete(user.id)} className="btn btn-danger">Supprimer</button>
                    <button onClick={() => handleModifyClick(user)} className="btn btn-warning">Modifier</button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ul className='pagination'>
        {usersPerPage >= users.length ? null : (
          <button onClick={() => paginate(currentPage - 1)} className='btn btn-secondary'>Prev</button>
        )}
        {currentUsers.map((user, index) => (
          <button key={index} onClick={() => paginate(index + 1)} className={`btn ${currentPage === index + 1 ? 'btn-primary' : 'btn-secondary'}`}>{index + 1}</button>
        ))}
        {usersPerPage >= users.length ? null : (
          <button onClick={() => paginate(currentPage + 1)} className='btn btn-secondary'>Next</button>
        )}
      </ul>
      {modifiedUser && (
        <div className={`modal ${showModal ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: showModal ? 'block' : 'none' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Modifier l'utilisateur</h5>
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
