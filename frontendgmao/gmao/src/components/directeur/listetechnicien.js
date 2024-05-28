import React, { useState, useEffect } from 'react';
import Sidebar from './directeurdesi/Sidebar/Sidebardic';
import Navbar from './directeurdesi/Navbar/navbardic';
import { DataGrid } from '@mui/x-data-grid';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

import PopupMessage from '../message';
import { useNavigate } from 'react-router-dom';
import { Pagination } from '@mui/material';
import { Tooltip, IconButton, Stack } from '@mui/material';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';




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
  const token=localStorage.getItem("token");
  const role =localStorage.getItem("role");
  


  useEffect(() => {
    if (token && role =="directeur")
      {
        fetchData();
        fetchDropdownOptions();
     
      }
      else 
      {
        navigate("/login");
      }
     }, [token,role]);

  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/listecustomer/');
      if (response.ok) {
        const data = await response.json();
        const techniciens = data.filter(user => user.is_technicien && user.is_active === true);
        const flattenedTechniciens = techniciens.map(user => ({
          ...user,
          service_nom: user.service ? user.service.nom : "he needs assigned service",
        }));
        setTechnicienData(flattenedTechniciens);
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: formData.selectedOption,
        }),
      });
      if (response.ok) {
        setMessage("Utilisateur est bien assigné");
        setShowMessage(true);
        setMessageColor('success');

        setTimeout(() => {
          setShowMessage(false);
          setOpenDialog(false);
        }, 3000);
        fetchData();
        setFormData({
          selectedOption: '',
        });
      } else if (response.status==403) {
        setMessage("Choisir un service s'il vous plaît");
        setMessageColor('warning');
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
        }, 1500);
      }
    } catch (error) {
      console.error('Error assigning service:', error);
      setMessage('Error assigning service');
      setMessageColor('danger');
    }
  };

  const handleUpgrade = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/update_tehcncien/${id}/`, { method: 'POST' });
      if (response.ok) {
        console.log('Technician upgraded successfully');
        setMessage("le tehncien est devenze chefservice ");
        setMessageColor("success");
        setShowMessage(true);
        fetchData();
        setTimeout(() => setShowMessage(false), 3000);
      } else if ( response.status===404)  {
        console.log('on peut pas faire cetter action ');
        setMessage("impossible de faire action , on a deja une chef service  ");
        setMessageColor("warning");
        setShowMessage(true);
        fetchData();
        setTimeout(() => setShowMessage(false), 3000);

        
        // Handle the error or show an error message
      }
    } catch (error) {
      console.error('Error upgrading technician:', error);
    }
  };

  const totalUsers = technicienData.length;
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = technicienData.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (event, value) => {
    setCurrentPage(value);
  };

  const columns = [
    { field: 'username', headerName: 'Username', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'first_name', headerName: 'First Name', width: 150 },
    { field: 'last_name', headerName: 'Last Name', width: 150 },
    { field: 'service_nom', headerName: 'Service', width: 150 },
    {
      field: 'action',
      headerName: 'Action',
      width: 200,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
        <Tooltip title="Assigné" arrow>
          <IconButton onClick={() => handleClick(params.row)} color="warning">
            <AssignmentTurnedInIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Mise a jour "  arrow>
          <IconButton onClick={() => handleUpgrade(params.row.id)} color="success">
            <CheckCircleOutlineIcon />
          </IconButton>
        </Tooltip>
      </Stack>
      ),
    },
  ];

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <div className="top">
          <h1>technicien </h1>
        </div>
        {showMessage && <PopupMessage message={message} color={messageColor} />}
        
        <div className="botom">
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={currentUsers}
              columns={columns}
              pageSize={usersPerPage}
              hideFooterPagination={true}
            />
            <Pagination
              count={Math.ceil(totalUsers / usersPerPage)}
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
