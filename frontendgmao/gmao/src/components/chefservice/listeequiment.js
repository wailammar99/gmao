import React, { useState, useEffect } from 'react';
import Sidebar from './chefservicedesign/sidebar/sidebar';
import Navbar from './chefservicedesign/navbar/navbar';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import PopupMessage from '../message';
import { Navigate, useNavigate } from 'react-router-dom';
import { Tooltip, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeIcon from '@mui/icons-material/Mode';
import AddIcon from '@mui/icons-material/Add';
import { Pagination } from '@mui/material';

const ListEquipement = () => {
  const [equipements, setEquipements] = useState([]);
  const [selectedEquipement, setSelectedEquipement] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMessage, setShowMessage] = useState(false);
  const [messageColor, setMessageColor] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const role = localStorage.getItem("role");
  const userid = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || role !== "chefservice") {
      console.log("Vous n'avez pas accès à cette page.");
      navigate("/login");
    } else {
      fetchData();
    }
  }, [token, role]);

  const fetchData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/equipements/${userid}/`, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
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
          Authorization: `Token ${token}`,
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
    { field: 'marque', headerName: 'marque', width: 200 },
    {
      field: 'actions',
      headerName: 'Action',
      width: 400,
      renderCell: (params) => (
        <>
          <Tooltip title="Supprimer">
            <IconButton
              onClick={() => handleDeleteEquipement(params.row.id)}
              variant="outlined"
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Voir Plus">
            <IconButton
              onClick={() => handleViewMore(params.row)}
              variant="outlined"
              color="primary"
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  const pageSize = 5; // Nombre d'éléments par page
  const indexOfLastEquipement = currentPage * pageSize;
  const indexOfFirstEquipement = indexOfLastEquipement - pageSize;
  const currentEquipements = equipements.slice(indexOfFirstEquipement, indexOfLastEquipement);

  const paginate = (event, pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
            rows={currentEquipements}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            autoHeight={true}
            hideFooterPagination={true}
            hideFooter={true}
          />
                    <Pagination
            count={Math.ceil(equipements.length / pageSize)}
            page={currentPage}
            onChange={paginate}
          />

          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>Informations sur l'équipement</DialogTitle>
            <DialogContent>
              {selectedEquipement && (
                <>
                  <Typography>Nom: {selectedEquipement.nom}</Typography>
                  <Typography>marque: {selectedEquipement.marque}</Typography>
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

