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
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import PopupMessage from '../message';
import { Pagination } from '@mui/material';

const CompteNoActive = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("");
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    selectedOption: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5); // Number of users per page

  useEffect(() => {
    fetchData();
    fetchDropdownOptions();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(false); // Reset showMessage after 5 seconds
    }, 2000);

    return () => clearTimeout(timer);
  }, [showMessage]);

  const fetchDropdownOptions = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/Serviceliste/');
      if (response.ok) {
        const data = await response.json();
        setDropdownOptions(data);
      } else {
        console.error('Failed to fetch dropdown options');
      }
    } catch (error) {
      console.error('Error fetching dropdown options:', error);
    }
  };

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
              return { ...user, is_active: true };
            }
            return user;
          });
          setShowMessage(true); // Show message for successful activation
          setMessage("Compte utilisateur activé avec succès");
          setColor("success");
          fetchData();
          return updatedUsers;
        });
      } else if (response.status === 401) {
        setShowMessage(true); // Show message for unauthorized access
        setMessage("Il faut assigner un service s'il vous plaît");
        setColor("warning");
      } else {
        throw new Error('Failed to activate user account');
      }
    } catch (error) {
      console.error('Error activating user account:', error);
    }
  };

  const handleAssignServiceClick = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:8000/api_assigne_service_user/${selectedUser.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: formData.selectedOption,
        }),
      });
      if (response.ok) {
        setMessage("Utilisateur est bien assigné");
        setColor('success');
         setShowMessage(true); // Set showMessage to true here
      setTimeout(() => {
        setOpenDialog(false);
      }, 3000);
        setOpenDialog(false);
        fetchData(); 
      } else {
        setMessage("Choisir un service s'il vous plaît");
        setColor('warning');
      }
    } catch (error) {
      console.error('Error assigning service:', error);
      setMessage('Error assigning service');
      setColor('danger');
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setFormData({
      selectedOption: value,
    });
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <div className="top">
          <h1>Comptes Inactifs</h1>
          {showMessage && <PopupMessage message={message} color={color} />}
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
                  <TableCell>Service</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.first_name}</TableCell>
                    <TableCell>{user.last_name}</TableCell>
                    <TableCell>{user.service ? user.service.nom : "Utilisateur pas de service"}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={2}>
                        <Button onClick={() => handleActivate(user.id)} variant="outlined" sx={{ color: 'Black', border: '1px solid green', '&:hover': { bgcolor: 'green', }, }}>Activer</Button>
                        <button onClick={() => handleAssignServiceClick(user)} className="btn btn-outline-warning">Assign Service</button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </TableContainer>
            <Pagination count={Math.ceil(users.length / usersPerPage)} page={currentPage} onChange={paginate} />
          </div>
        </div>
      </div>
      {/* Dialog to assign service */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Assigner un service</DialogTitle>
        {showMessage && <PopupMessage message={message} color={color} />}
        <DialogContent>
          <div className="intervention-form" style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '20px' }}>
            <h2>Assign Service</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-3">
                <label htmlFor="selectedOption" className="form-label">Select Service:</label>
                <select name="selectedOption" id="selectedOption" className="form-control" value={formData.selectedOption} onChange={handleChange} style={{ width: '100%', padding: '10px', marginBottom: '10px' }}>
                  <option value="">Select a service</option>
                  {dropdownOptions.map(option => (
                    <option key={option.id} value={option.id}>{option.nom}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px', borderRadius: '5px', backgroundColor: '#007bff', border: 'none' }}>Assign Service</button>
            </form>
            {/* Render message if any */}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CompteNoActive;
