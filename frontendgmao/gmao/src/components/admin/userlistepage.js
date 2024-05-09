import React, { useState, useEffect } from 'react';
import UserForm from './userform';
import Sidebar from './admindesign/home/sidebar/sidebar';
import Navbar from './admindesign/home/navbar/navbar';
import Table from "@mui/material/Table";
import { Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Pagination from '@mui/material/Pagination';
import PopupMessage from '../message';

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [modifiedUser, setModifiedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(6);
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("");
  const [showPop, setShowPop] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/listecustomer/');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      const modifiedData = data.map(user => ({
        ...user,
        service_nom: user.service ? user.service.nom : null
      }));
      setUsers(modifiedData);
      setFilteredUsers(modifiedData);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users. Please try again later.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
        setMessage("L'utilisateur a été supprimé avec succès");
        setShowPop(true);
        setColor("success");
        setTimeout(() => {
          setShowPop(false);
          fetchUsers();
        }, 1500);
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
        setShowPop(true);
        setColor("success");
        setMessage("utilisteur est bien modfifie");
        setTimeout(() => {
          setShowPop(false);
          setShowModal(false);
          fetchUsers();
        }, 1500);
      } else {
        throw new Error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const columns = [
    { field: 'username', headerName: 'Username', width: 200 },
    { field: 'first_name', headerName: 'prenom', width: 200 },
    { field: 'last_name', headerName: 'nom', width: 200 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'service_nom', headerName: 'Service', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 400,
      renderCell: (params) => (
        <>
          <Button onClick={() => handleDelete(params.row.id)} variant="outlined" color="error">Supprimer</Button>
          <Button onClick={() => handleModifyClick(params.row)} color="secondary" variant='outlined'>Modifier</Button>
        </>
      ),
    },
  ];

  const filterUsersByType = (type) => {
    if (type === 'all') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => user[`is_${type}`]);
      setFilteredUsers(filtered);
    }
    setCurrentPage(1); // Reset pagination when filter changes
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser); // Use filteredUsers for pagination

  const paginate = (event, value) => setCurrentPage(value);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="list">
      <div className="listContainer">
        <h1>Customer List</h1>
        {showPop && <PopupMessage message={message} color={color} />}
        <div>
          {/* Add buttons for filtering users */}
          <Button onClick={() => filterUsersByType('all')}>All</Button>
          <Button onClick={() => filterUsersByType('admin')}>Admin</Button>
          <Button onClick={() => filterUsersByType('technicien')}>Technicien</Button>
          <Button onClick={() => filterUsersByType('chefservice')}>Chef Service</Button>
          <Button onClick={() => filterUsersByType('directeur')}>Directeur</Button>
          <Button onClick={() => filterUsersByType('citoyen')}>Citoyen</Button>
        </div>
        <DataGrid
          rows={currentUsers}
          columns={columns}
          checkboxSelection={false}
          hideFooterPagination={true}
          hideFooter={true}
          autoHeight={true} // Remove scrollbar
        />
        <Pagination
          count={Math.ceil(filteredUsers.length / usersPerPage)} // Use filteredUsers.length for pagination count
          page={currentPage}
          onChange={paginate}
        />
        {modifiedUser && (
          <div className={`modal ${showModal ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: showModal ? 'block' : 'none' }}>
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
    </div>
  );
}

export default UserListPage;
