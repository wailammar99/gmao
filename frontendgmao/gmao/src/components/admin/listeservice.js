import React, { useState, useEffect } from 'react';
import ServiceForm from './ServiceForm';
import Sidebar from './admindesign/home/sidebar/sidebar';
import Navbar from './admindesign/home/navbar/navbar';
import Paper from "@mui/material/Paper";
import { Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import PopupMessage from '../message';
import Pagination from '@mui/material/Pagination';
import { useNavigate } from 'react-router-dom';
import { Tooltip, IconButton } from '@mui/material';
import ModeIcon from '@mui/icons-material/Mode'
import DeleteIcon from '@mui/icons-material/Delete';


function ListService() {
  const [services, setServices] = useState([]);
  const [message, setMessage] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [servicesPerPage] = useState(5);
  const [showForm, setShowForm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const token=localStorage.getItem("token");
  const role =localStorage.getItem("role");
  const navigate=useNavigate();

  useEffect(() => {
    if (token && role==="admin")
      {
        fetchData();    
      }
      else
      {
        navigate("/login");
      }
    
  }, [token,role]);

  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/Serviceliste/',
      {
        method:"GET",
        
        
          headers: {
            'Authorization': `token ${token}`,
        

      }});
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      } else {
        console.error('Failed to fetch service data');
      }
    } catch (error) {
      console.error('Error fetching service data:', error);
    }
  };

  const handleDeleteService = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/delete_service/${id}/`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setServices(prevServices => prevServices.filter(service => service.id !== id));
        setMessage('Le service a été supprimé avec succès.');
        
        setTimeout(() => {
          setMessage("");
        }, 1500);
        fetchData();
      } else {
        throw new Error('Échec de la suppression du service');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du service :', error);
    }
  };

 
  const handleCloseMessage = () => {
    setMessage('');
  };
  const handleUpdateService = async (id, updatedServiceData) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/modifie_service/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedServiceData),
      });

      if (response.ok) {
        setMessage('Le service a été modifié avec succès.');
        fetchData();
      } else {
        throw new Error('Failed to update service');
      }
    } catch (error) {
      console.error('Error updating service:', error);
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleOpenForm = (service) => {
    setSelectedService(service);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setSelectedService(null);
    setShowForm(false);
  };

  const columns = [
    { field: 'nom', headerName: 'Nom', flex: 1 },
    { field: 'descrtions', headerName: 'Description', flex: 1 },
    {
      field: 'actions',
      headerName: 'Action',
      flex: 1,
      renderCell: (params) => (
        <>
          <Tooltip title="Supprimer" arrow>
        <IconButton
          onClick={() => handleDeleteService(params.row.id)}
          color="error"
          sx={{ cursor: 'pointer' }}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>

      {/* Edit Button */}
      <Tooltip title="Modifier" arrow>
        <ModeIcon
          onClick={() => handleOpenForm(params.row)}
          variant="outlined"
          color="secondary"
          sx={{ cursor: 'pointer' }}
        >
          Modifier
        </ModeIcon>
      </Tooltip>
        
        </>
        
      ),
    },
  ];
 

  const paginate = (event, value) => setCurrentPage(value);

  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = services.slice(indexOfFirstService, indexOfLastService);

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <div className="top">
          <h1>Liste des services</h1>
          {message && (
                        <PopupMessage message={message} color="success" onClose={handleCloseMessage} />
                      )}
        
        </div>
        <div className="bottom">
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={currentServices}
              columns={columns}
              pageSize={servicesPerPage}
              rowCount={services.length}
              pagination
              hideFooter={true}
              hideFooterPagination={true}
              onPageChange={(params) => paginate(params.page)}
              paginationMode="server"
            />
            <Pagination
            count={Math.ceil(services.length / servicesPerPage)}
            page={currentPage}
            onChange={paginate}
          />
          </div>
          
          {message && (
            <PopupMessage message={message} color="success" onClose={handleCloseMessage} />
          )}
        </div>
      </div>
      {showForm && (
        <ServiceForm
          service={selectedService}
          onUpdate={(updatedServiceData) => handleUpdateService(selectedService.id, updatedServiceData)}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}

export default ListService;
