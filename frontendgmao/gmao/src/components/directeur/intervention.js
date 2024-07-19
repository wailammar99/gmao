import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Paper from "@mui/material/Paper";
import Sidebar from './directeurdesi/Sidebar/Sidebardic';
import Navbar from './directeurdesi/Navbar/navbardic';
import { Link } from 'react-router-dom';
import { Tooltip, IconButton, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Pagination from '@mui/material/Pagination';

const Intervention = () => {
  const [interventionData, setInterventionData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedIntervention, setSelectedIntervention] = useState(null);
  const [filteredInterventions, setFilteredInterventions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [interventionsPerPage] = useState(7);
  const [totalPages, setTotalPages] = useState(0);
  const en_id = localStorage.getItem('enterprise_id');

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const fetchData = async (page) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/enterprise/${en_id}/intervention/?page=${page}&per_page=${interventionsPerPage}`);
      if (response.ok) {
        const data = await response.json();
        setInterventionData(data.interventions);
        setFilteredInterventions(data.interventions); // Set initial filtered interventions
        setTotalPages(data.pages);
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
    { field: 'date_debut', headerName: 'Date de début', width: 200, renderCell: (params) => (
      params.value ? params.value : 'Intervention pas assignée'
    )},
    { field: 'date_fin', headerName: 'Date de fin', width: 200, renderCell: (params) => (
      params.value ? params.value : 'Intervention pas assignée'
    )},
    { field: 'etat', headerName: 'État', width: 200 },
    {
      field: 'conversation',
      headerName: 'Conversation',
      width: 200,
      renderCell: (params) => (
        params.row.conversation ? (
          <Link to={`/conversation/${params.row.conversation ? params.row.conversation.id : ''}/directeur/${localStorage.getItem('userId')}`}>
            {params.row.conversation ? params.row.conversation.title : ' '}
          </Link>
        ) : "no conversation "
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Tooltip title="Voir Plus" arrow>
          <IconButton onClick={() => handleOpenDialog(params.row)} color="primary">
            <AddIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
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
        <div className="bottom">
          <div style={{ height: 500, width: '100%' }}>
            <DataGrid
              rows={filteredInterventions}
              columns={columns}
              checkboxSelection={false}
              hideFooterPagination={true}
              autoHeight={true} // Supprimer la barre de défilement
            />
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </div>
        </div>
      </div>

      {/* Dialog pour afficher plus d'informations sur l'intervention */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Détails de l'intervention</DialogTitle>
        <DialogContent>
          {selectedIntervention && (
            <>
              {selectedIntervention.description && <p>Description: {selectedIntervention.description}</p>}
              {<p>Titre: {selectedIntervention.titre ? selectedIntervention.titre : "sans titre"}</p>}
              {<p>Adresse: {selectedIntervention.adresse ? selectedIntervention.adresse : "sans adresse "}</p>}
              {<p>Date de création: {selectedIntervention.date_creation}</p>}
              {<p>Date de début: {selectedIntervention.date_debut ? selectedIntervention.date_debut : "intervention pas assignée"}</p>}
              {<p>Date de fin: {selectedIntervention.date_fin ? selectedIntervention.date_fin : "intervention pas assignée"}</p>}
              {<p>État: {selectedIntervention.etat}</p>}
              {<p>Service: {selectedIntervention.service ? selectedIntervention.service.nom :"pas de service"}</p>}
              {<p>Technicien: {selectedIntervention.technicien ? selectedIntervention.technicien : "pas assigné"}</p>}
              {<p>En attente: {selectedIntervention.raison ? selectedIntervention.raison.description : "l'intervention pas en attente"}</p>}
              {<p>Citoyen: {selectedIntervention.citoyen ? selectedIntervention.citoyen.email :"intervetion preventive pas de citoyen "}</p>}
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
