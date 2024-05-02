import React, { useState, useEffect } from 'react';
import ServiceForm from './ServiceForm';
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

function ListService() {
  const [services, setServices] = useState([]);
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [servicesPerPage] = useState(6);
  const [showForm, setShowForm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/Serviceliste/');
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
        fetchData();
      } else {
        throw new Error('Échec de la suppression du service');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du service :', error);
    }
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

  const handleCloseMessage = () => {
    setMessage('');
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = services.slice(indexOfFirstService, indexOfLastService);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const handleOpenForm = (service) => {
    setSelectedService(service);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setSelectedService(null);
    setShowForm(false);
  };

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <div className="top">
          <h1>Liste des services</h1>
        </div>
        <div className="bottom">
          <TableContainer component={Paper} className="table">
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className="tableCell">Nom</TableCell>
                  <TableCell className="tableCell">Description</TableCell>
                  <TableCell className="tableCell">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="tableCell">{service.nom}</TableCell>
                    <TableCell className="tableCell">{service.descrtions}</TableCell>
                    <TableCell className="tableCell">
                    <Stack direction="row" spacing={2}>
                      <button onClick={() => handleDeleteService(service.id)} className="btn btn-danger">Supprimer</button>
                      <button onClick={() => handleOpenForm(service)} className="btn btn-warning">Modifier</button>
                    </Stack>
                      {message && (
                        <PopupMessage message={message} color="success" onClose={handleCloseMessage} />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <ul className='pagination'>
            {servicesPerPage >= services.length ? null : (
              <button onClick={() => paginate(currentPage - 1)} className='btn '>Précédent</button>
            )}
            {currentServices.map((service, index) => (
              <button key={index} onClick={() => paginate(index + 1)} className={`btn ${currentPage === index + 1 ? 'btn-primary' : 'btn'}`}>{index + 1}</button>
            ))}
            {servicesPerPage >= services.length ? null : (
              <button onClick={() => paginate(currentPage + 1)} className='btn '>Suivant</button>
            )}
          </ul>
        </div>
      </div>
      {showForm && (
        <ServiceForm className="modal-body"
          service={selectedService}
          onUpdate={(updatedServiceData) => handleUpdateService(selectedService.id, updatedServiceData)}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}

export default ListService;
