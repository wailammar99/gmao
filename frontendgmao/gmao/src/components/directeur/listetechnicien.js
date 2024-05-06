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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import PopupMessage from '../message';
import { useNavigate } from 'react-router-dom';
import { Pagination } from '@mui/material';

const Listtechnicien = () => {
  const [technicienData, setTechnicienData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({ selectedOption: '' });
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [message, setMessage] = useState(null);
  const [messageColor, setMessageColor] = useState('');
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5; // Number of users per page
  const [showMessage, setShowMessage] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState('');

  useEffect(() => {
    fetchData();
    fetchDropdownOptions();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/listecustomer/');
      if (response.ok) {
        const data = await response.json();
        const techniciens = data.filter(user => user.is_technicien);
        setTechnicienData(techniciens);
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

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

  const handleClick = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedUser(null);
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setFormData({ selectedOption: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:8000/api_assigne_service_user/${selectedUser.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service_id: formData.selectedOption }),
      });
      if (response.ok) {
        setMessage("Utilisateur est bien assigné");
        setMessageColor('success');
        setTimeout(() => {
          setOpenDialog(false);
          setShowMessage(false);
          fetchData(); // Refresh the list of technicians after assignment
          setFormData({ selectedOption: '' });
        }, 1500);
      } else {
        setMessage("Choisir un service s'il vous plaît");
        setMessageColor('warning');
      }
    } catch (error) {
      console.error('Error assigning service:', error);
      setMessage('Error assigning service');
      setMessageColor('danger');
    }
  };

  const handleActivate = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api_activer_compte/${id}`, { method: 'GET' });
      if (response.ok) {
        console.log('Compte utilisateur activé avec succès');
      } else {
        throw new Error('Failed to activate user account');
      }
    } catch (error) {
      console.error('Error activating user account:', error);
    }
  };

  const handleUpgrade = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/update_tehcncien/${id}/`, { method: 'POST' });
      if (response.ok) {
        console.log('Technician upgraded successfully');
        setUpgradeMessage("le tehncien est devenze chefservice ");
        setShowMessage(true);
        fetchData();
        setTimeout(() => setShowMessage(false), 3000);
      } else {
        console.error('Failed to upgrade technician');
        // Handle the error or show an error message
      }
    } catch (error) {
      console.error('Error upgrading technician:', error);
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = technicienData.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <div className="top">
          <h1>technicien </h1>
        </div>
        {message && <PopupMessage message={message} color={messageColor} />}
        {showMessage && <PopupMessage message={upgradeMessage} color="success" />}
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
                {currentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="tableCell">{user.id}</TableCell>
                    <TableCell className="tableCell">{user.username}</TableCell>
                    <TableCell className="tableCell">{user.email}</TableCell>
                    <TableCell className="tableCell">{user.first_name}</TableCell>
                    <TableCell className="tableCell">{user.last_name}</TableCell>
                    <TableCell className="tableCell">{user.service?.nom || "he needs assigned service"}</TableCell>
                    <TableCell className="tableCell">{user.is_active ? 'Yes' : 'No'}</TableCell>
                    <TableCell className="tableCell">
                      <Stack direction="row" spacing={2}>
                        {!user.is_active && <button onClick={() => handleActivate(user.id)} className="btn btn-success">Activer</button>}
                        <button type="button" className="btn btn-outline-warning" onClick={() => handleClick(user)}>Assigné Service</button>
                        <button type="button" className="btn btn-outline-success" onClick={() => handleUpgrade(user.id)}>update </button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </TableContainer>
            <Pagination
              count={Math.ceil(technicienData.length / usersPerPage)}
              page={currentPage}
              onChange={paginate}
            />
          </div>
        </div>
      </div>

      {/* Dialog to assign service */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Assigner un service</DialogTitle>
        <DialogContent>
          <div className="intervention-form" style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '20px' }}>
            <h2>Assign Service</h2>
            <form onSubmit={handleSubmit}>
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
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Listtechnicien;
