import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Sidebar from './directeurdesi/Sidebar/Sidebardic';
import Navbar from './directeurdesi/Navbar/navbardic';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import PopupMessage from '../message';
import { useNavigate } from 'react-router-dom';
import { Pagination } from '@mui/material';
import Stack from '@mui/material/Stack';

const Listtechnicien = () => {
  const [technicienData, setTechnicienData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const[showMessage,setshowmessage]=useState(false);
  const [formData, setFormData] = useState({
    selectedOption: '',
  });
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [message, setMessage] = useState(null);
  const [messageColor, setMessageColor] = useState('');
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [interventionsPerPage, setInterventionsPerPage] = useState(5);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    fetchData();
    fetchDropdownOptions();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/listecustomer/');
      if (response.ok) {
        const data = await response.json();
        const techniciens = data.filter(user => user.is_chefservice && user.is_active==true);
        const flattenedTechniciens = techniciens.map(user => ({
          ...user,
          service_nom: user.service ? user.service.nom : "he needs assigned service",
        }));
        setTechnicienData(flattenedTechniciens);
        setTotalUsers(flattenedTechniciens.length);
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
        setshowmessage(true);
        setMessageColor('success');

        setTimeout(() => {
          setshowmessage(false);
          setOpenDialog(false);
        }, 3000);
        fetchData();
        setFormData({
          selectedOption: '',
        });
      } else if (response.status==403) {
        setMessage("Choisir un service s'il vous plaît");
        setMessageColor('warning');
        setshowmessage(true);
        setTimeout(() => {
          setshowmessage(false);
        }, 1500);
      }
    } catch (error) {
      console.error('Error assigning service:', error);
      setMessage('Error assigning service');
      setMessageColor('danger');
    }
  };

  const handleActivate = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api_activer_compte/${id}/`, {
        method: 'GET',
      });
      if (response.ok) {
        console.log('Compte utilisateur activé avec succès');
        setMessage("Compte utilisateur activé avec succès");
        setshowmessage(true);
        setMessageColor("success");
        fetchData();
        setTimeout(() => {
          setshowmessage(false);
        }, 1500);
      } else if(response.status===401){
        console.log('vous devez assige service ');
        setMessage("vous devez assige service");
        setshowmessage(true);
        setMessageColor("danger");
        setTimeout(() => {
          setshowmessage(false);
        }, 1500);
        
      }
    } catch (error) {
      console.error('Error activating user account:', error);
    }
  };


  const totalInterventions = totalUsers;
  const indexOfLastIntervention = currentPage * interventionsPerPage;
  const indexOfFirstIntervention = indexOfLastIntervention - interventionsPerPage;
  const currentInterventions = technicienData.slice(indexOfFirstIntervention, indexOfLastIntervention);

  const paginate = (event, value) => {
    setCurrentPage(value);
  };

  const columns = [
   
    { field: 'username', headerName: 'Username', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'first_name', headerName: 'First Name', width: 150 },
    { field: 'last_name', headerName: 'Last Name', width: 150 },
    { field: 'service_nom', headerName: 'Service', width: 150 },
    { field: 'is_active', headerName: 'Is Active', width: 120 },
    {
      field: 'action',
      headerName: 'Action',
      width: 200,
      renderCell: (params) => (
        <Stack direction="row" spacing={2}>
          {!params.row.is_active && (
            <Button onClick={() => handleActivate(params.row.id)} variant="contained" color="success">Activer</Button>
          )}
          <Button onClick={() => handleClick(params.row)} variant="outlined" color="warning">Assigné Service</Button>
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
          <h1>Les chef service</h1>
          {showMessage && <PopupMessage message={message} color={messageColor} />}
        </div>
        <div className="botom">
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={currentInterventions}
              columns={columns}
              pageSize={interventionsPerPage}
              hideFooterPagination={true}
             
            />
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
              <Button type="submit" variant="contained" style={{ width: '100%', padding: '10px', borderRadius: '5px', backgroundColor: '#007bff', border: 'none' }}>Assign Service</Button>
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
