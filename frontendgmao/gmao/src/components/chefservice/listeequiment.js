import React, { useState, useEffect } from 'react';
import Sidebar from './chefservicedesign/sidebar/sidebar';
import Navbar from './chefservicedesign/navbar/navbar';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import PopupMessage from '../message';
import { Navigate, useNavigate } from 'react-router-dom';


const ListEquipement = () => {
  const [equipements, setEquipements] = useState([]);
  const [selectedEquipement, setSelectedEquipement] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [messageColor, setMessageColor] = useState('');
  const token = localStorage.getItem('token');
  const role =localStorage.getItem("role");
  const userid=localStorage.getItem("userId");
  const navigate=useNavigate("");
 console.log("tokennnnnnnnnnnnn",token);
 const sesion =sessionStorage.getItem("sesion");
 



  useEffect(() => {
    if (token && role==="chefservice" )
      {
        fetchData(); 
      }
      else 
      {
        console.log ("vous pouver pas accces a cette page ")
        navigate("/login")
      }
    
  }, [token,role]);

  const fetchData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/equipements/${userid}/`,
      {
        method:"GET",
        headers: {
          Authorization: `Token ${token}`, // Include the token in the request headers
        },

      });
      if (response.ok) {
        const data = await response.json();
        setEquipements(data);
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleDeleteEquipement = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/delete_equiment/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        console.log('Équipement supprimé avec succès');
        setMessage('Équipement supprimé avec succès');
        setMessageColor('success');
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
        }, 1500);
        fetchData();
      } else {
        throw new Error('Échec de la suppression de l\'équipement');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'équipement :', error);
    }
  };
  const handleViewMore = (equipement) => {
    setSelectedEquipement(equipement);
    setOpenDialog(true);
  };

  const columns = [
    { field: 'nom', headerName: 'Nom', width: 200 },
    { field: 'marque', headerName: 'Description', width: 200 },
    {
      field: 'actions',
      headerName: 'Action',
      width: 400,
      renderCell: (params) => (
        <>
            <Button onClick={() => handleDeleteEquipement(params.row.id)} variant="outlined" color="error">
          Supprimer
        </Button>
        <Button onClick={() => handleViewMore(params.row)} variant="outlined" color="primary">
          Voir Plus
        </Button>
        </>
        
      ),
    },
  ];

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <div className="top">
          <h1>Liste des Equipements</h1>
        </div>
        <div className="bottom">
          <DataGrid
            rows={equipements}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            autoHeight={true}
          />
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>Informations sur l'équipement</DialogTitle>
            <DialogContent>
              {selectedEquipement && (
                <>
                  <Typography>Nom: {selectedEquipement.nom}</Typography>
                  <Typography>Description: {selectedEquipement.marque}</Typography>
                  <Typography>Prix: {selectedEquipement.prix}</Typography>
        <Typography>Stock: {selectedEquipement.stock}</Typography>
        <Typography>Date d'ajout: {selectedEquipement.date_ajout}</Typography>
        <Typography>Statut: {selectedEquipement.statut ? 'Actif' : 'Inactif'}</Typography>
        <Typography>Numéro de série: {selectedEquipement.numero_serie}</Typography>
        <Typography>Date d'expiration: {selectedEquipement.date_expiration}</Typography>
        <Typography>Caractéristiques techniques: {selectedEquipement.caracteristiques_techniques}</Typography>
                </>
              )}
            </DialogContent>
          </Dialog>
          {showMessage && <PopupMessage message={message} color={messageColor} />}
        </div>
      </div>
    </div>
  );
};

export default ListEquipement;
