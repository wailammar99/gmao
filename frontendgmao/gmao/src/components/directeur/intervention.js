import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Paper from "@mui/material/Paper";
import Sidebar from './directeurdesi/Sidebar/Sidebardic';
import Navbar from './directeurdesi/Navbar/navbardic';
import { Link } from 'react-router-dom';

import Pagination from '@mui/material/Pagination';

const Intervention = () => {
  const [interventionData, setInterventionData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedIntervention, setSelectedIntervention] = useState(null);
  const [filteredInterventions, setFilteredInterventions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [interventionsPerPage] = useState(7);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/intervention/');
      if (response.ok) {
        const data = await response.json();
        setInterventionData(data);
        setFilteredInterventions(data); // Set initial filtered interventions
      } else {
        console.error('Failed to fetch intervention data');
      }
    } catch (error) {
      console.error('Error fetching intervention data:', error);
    }
  };

  const handleOpenDialog = (intervention) => {
    setSelectedIntervention(intervention);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedIntervention(null);
    setOpenDialog(false);
  };

  const filterInterventionsByType = (etat) => {
    if (etat === 'all') {
      setFilteredInterventions(interventionData); // Show all interventions
    } else {
      const filtered = interventionData.filter(intervention => intervention.etat === etat); // Filter interventions by type
      setFilteredInterventions(filtered);
    }
  };

  const columns = [
    // { field: 'date_creation', headerName: 'Date de création', width: 200 },
    { field: 'date_debut', headerName: 'Date de début', width: 200 },
    { field: 'date_fin', headerName: 'Date de fin', width: 200 },
    { field: 'etat', headerName: 'État', width: 200 },
    {
      field: 'conversation',
      headerName: 'Conversation',
      width: 200,
      renderCell: (params) => (
        <Link to={`/conversation/${params.row.conversation ? params.row.conversation.id : ''}/directeur/${localStorage.getItem('userId')}`}>
          {params.row.conversation ? params.row.conversation.title : ''}
        </Link>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Button onClick={() => handleOpenDialog(params.row)} variant="outlined">Voir Plus</Button>
      ),
    },
  ];
 
  const indexOfLastIntervention = currentPage * interventionsPerPage;
  const indexOfFirstIntervention = indexOfLastIntervention - interventionsPerPage;
  const currentInterventions = filteredInterventions.slice(indexOfFirstIntervention, indexOfLastIntervention);
 
  const paginate = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className="list">
      <Sidebar/>
      <div className="listContainer">
        <Navbar/>
        <div className="top">
          <h1>Les interventions</h1>
          <div>
            {/* Boutons pour filtrer les interventions */}
            <Button onClick={() => filterInterventionsByType('all')}>Tous</Button>
            <Button onClick={() => filterInterventionsByType('Nouveau')}>Nouveau</Button>
            <Button onClick={() => filterInterventionsByType('En attente')}>En attente</Button>
            <Button onClick={() => filterInterventionsByType('En cours')}>En cours</Button>
            <Button onClick={() => filterInterventionsByType('Assigné')}>Assigné</Button>
            <Button onClick={() => filterInterventionsByType('Terminé')}>Terminé</Button>
            <Button onClick={() => filterInterventionsByType('Annulé')}>Annulé</Button>
            <Button onClick={() => filterInterventionsByType('Clôture')}>Clôture</Button>
          </div>
        </div>
        <div className="botom">
          <div style={{ height: 500, width: '100%' }}>
            <DataGrid
              rows={currentInterventions}
              columns={columns}
              checkboxSelection={false}
              hideFooterPagination={true}
              autoHeight={true} // Supprimer la barre de défilement
            />
             <Pagination
            count={Math.ceil(filteredInterventions.length / interventionsPerPage)}
            page={currentPage}
            onChange={paginate}
          />
          </div>
        </div>
      </div>
      
      {/* Dialog pour afficher plus d'informations sur l'intervention */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Intervention Details</DialogTitle>
        <DialogContent>
          {selectedIntervention && (
            <>
              {selectedIntervention.description && <p>Description: {selectedIntervention.description}</p>}
              {selectedIntervention.date_creation && <p>Date de création: {selectedIntervention.date_creation}</p>}
              {selectedIntervention.date_debut && <p>Date de début: {selectedIntervention.date_debut}</p>}
              {selectedIntervention.date_fin && <p>Date de fin: {selectedIntervention.date_fin}</p>}
              {selectedIntervention.etat && <p>État: {selectedIntervention.etat}</p>}
              {selectedIntervention.service && selectedIntervention.service.nom && <p>Service : {selectedIntervention.service.nom}</p>}
              {selectedIntervention.technicien && <p>Technicien : {selectedIntervention.technicien}</p>}
              {selectedIntervention.raison && selectedIntervention.raison.description && <p>En attente : {selectedIntervention.raison.description}</p>}
              {selectedIntervention.citoyen && selectedIntervention.citoyen.email && <p>Citoyen: {selectedIntervention.citoyen.email}</p>}
            </>
          )}
        </DialogContent>
       
        <DialogActions>
          <Button onClick={handleCloseDialog}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Intervention;