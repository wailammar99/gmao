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
import PopupMessage from '../message';
import { useNavigate } from 'react-router-dom';
import { Pagination } from '@mui/material';

const Listtechnicien = () => {
  const [technicienData, setTechnicienData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    selectedOption: '',
  });
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [message, setMessage] = useState(null);
  const [messageColor, setMessageColor] = useState('');
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [interventionsPerPage, setInterventionsPerPage] = useState(5);
  const [totalUsers, setTotalUsers] = useState(0); // State variable to store total number of users
  useEffect(() => {
    fetchData();
    fetchDropdownOptions();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/listecustomer/');
      if (response.ok) {
        const data = await response.json();
        const techniciens = data.filter(user => user.is_chefservice);
        setTechnicienData(techniciens);
        setTotalUsers(techniciens.length); // Count the total number of users
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
    setFormData({
      selectedOption: value,
    });
  };

  const handleSubmit = async (e) => {
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
        setMessageColor('success');
        setTimeout(() => {
          setOpenDialog(false);
        }, 3000);
        fetchData(); // Refresh the list of technicians after assignment
        setFormData({
          selectedOption: '',
        });
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

  // Define handleActivate function
  const handleActivate = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api_activer_compte/${id}`, {
        method: 'GET',
      });
      if (response.ok) {
        console.log('Compte utilisateur activé avec succès');
      } else {
        throw new Error('Failed to activate user account');
      }
    } catch (error) {
      console.error('Error activating user account:', error);
    }
  };

  // Pagination logic
  const totalInterventions = totalUsers; // Since we are paginating users, totalInterventions is the same as totalUsers
  const indexOfLastIntervention = currentPage * interventionsPerPage;
  const indexOfFirstIntervention = indexOfLastIntervention - interventionsPerPage;
  const currentInterventions = technicienData.slice(indexOfFirstIntervention, indexOfLastIntervention);

  const paginate = (event, value) => {
    setCurrentPage(value);
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
                {currentInterventions.map((user) => (
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </TableContainer>
            <Pagination
              count={Math.ceil(totalInterventions / interventionsPerPage)}
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
            {message && <PopupMessage message={message} color={messageColor} />}
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
