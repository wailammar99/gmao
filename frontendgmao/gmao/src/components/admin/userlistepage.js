import React, { useState, useEffect } from 'react';
import UserForm from './userform';
import PopupMessage from '../message';
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

function UserListPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [modifiedUser, setModifiedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [showpop, setShowPop] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/listecustomer/');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data); // Initially, display all users
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

  const filterUsersByType = (role) => {
    if (role === 'all') {
      setFilteredUsers(users); // Afficher tous les utilisateurs
    } else {
      const filtered = users.filter(user => user[`is_${role}`]); // Filtrer les utilisateurs par rôle
      setFilteredUsers(filtered);
    }
    setCurrentPage(1); // Reset current page to 1 when filtering
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Liste des utilisateurs</h1>
      <div>
        {/* Boutons pour filtrer par rôle */}
        <Button onClick={() => filterUsersByType('all')}>All</Button>
        <Button onClick={() => filterUsersByType('admin')}>Admin</Button>
        <Button onClick={() => filterUsersByType('technicien')}>Technicien</Button>
        <Button onClick={() => filterUsersByType('chefservice')}>Chef Service</Button>
        <Button onClick={() => filterUsersByType('directeur')}>Directeur</Button>
        <Button onClick={() => filterUsersByType('citoyen')}>Citoyen</Button>
      </div>
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
                <TableCell>{user.service ? user.service.nom : 'Inconnu'}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={2}>
                  <Button onClick={() => handleDelete(user.id)} variant="outlined" color="error">Supprimer</Button>
                  <Button onClick={() => handleModifyClick(user)} color="secondary">Modifier</Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ul className='pagination'>
        {usersPerPage >= users.length ? null : (
          <Button onClick={() => paginate(currentPage - 1)} variant="contained" color="primary">Précédent</Button>
        )}
        {currentUsers.map((user, index) => (
          <Button key={index} onClick={() => paginate(index + 1)} variant="contained" color={currentPage === index + 1 ? "primary" : "secondary"}>{index + 1}</Button>
        ))}
        {usersPerPage >= users.length ? null : (
          <Button onClick={() => paginate(currentPage + 1)} variant="contained" color="primary">Suivant</Button>
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
