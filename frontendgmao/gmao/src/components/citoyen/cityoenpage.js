import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './cityoendesign/sidebar/sidebar';
import Navbar from './cityoendesign/navbar/navbar';
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import { DataGrid } from '@mui/x-data-grid';
import { Button, ButtonGroup, Pagination, Tooltip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import UpdateForm from './updateform';
import ModeIcon from '@mui/icons-material/Mode';
import InfoIcon from '@mui/icons-material/Info';

const Citoyenpage = () => {
  const [interventions, setInterventions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredInterventions, setFilteredInterventions] = useState([]);
  const [open, setOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [selectedIntervention, setSelectedIntervention] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const interventionsPerPage = 5;

  useEffect(() => {
    if (token && role === "citoyen") {
      fetchData();
    } else {
      navigate("/login");
    }
  }, [token, role]);

  const fetchData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api_intervetion_citoyen/${localStorage.getItem('userId')}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setInterventions(data.interventions || []);
        setFilteredInterventions(data.interventions || []);
      } else {
        console.error('Failed to fetch interventions');
      }
    } catch (error) {
      console.error('Error fetching interventions:', error);
    }
  };

  const fetchTechnicians = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/listecustomer/is_technicine`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTechnicians(data);
      } else {
        console.error('Failed to fetch technicians');
      }
    } catch (error) {
      console.error('Error fetching technicians:', error);
    }
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleClickOpen = (id) => {
    setSelectedIntervention(interventions.find(intervention => intervention.id === id));
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInfoOpen = async (id) => {
    setSelectedIntervention(interventions.find(intervention => intervention.id === id));
    await fetchTechnicians();
    setInfoOpen(true);
  };

  const handleInfoClose = () => {
    setInfoOpen(false);
    setSelectedIntervention(null);
  };

  const filterInterventionsByType = (etat) => {
    if (etat === 'all') {
      setFilteredInterventions(interventions);
    } else {
      const filtered = interventions.filter(intervention => intervention.etat === etat);
      setFilteredInterventions(filtered);
    }
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredInterventions.length / interventionsPerPage);
  const indexOfLastIntervention = currentPage * interventionsPerPage;
  const indexOfFirstIntervention = indexOfLastIntervention - interventionsPerPage;
  const currentInterventions = filteredInterventions.slice(indexOfFirstIntervention, indexOfLastIntervention);

  const columns = [
    { field: 'description', headerName: 'Description', width: 200 },
    { field: 'date_creation', headerName: 'Date de création', width: 150 },
    { field: 'date_debut', headerName: 'Date de début', width: 150, renderCell: (params) => (
      params.value ? params.value : 'Date non disponible'
    )},
    { field: 'date_fin', headerName: 'Date de fin', width: 150, renderCell: (params) => (
      params.value ? params.value : 'Date non disponible'
    )},
    { field: 'etat', headerName: 'État', width: 120 },
    {
      field: 'conversation',
      headerName: 'Conversations',
      width: 180,
      renderCell: (params) => (
        params.row.conversation && params.row.conversation.id ? (
          <Link to={`/conversation/${params.row.conversation.id}/citoyen/${localStorage.getItem('userId')}`}>
            <ChatBubbleOutlineOutlinedIcon />
            {params.row.conversation.title}
          </Link>
        ) : 'pas de conversation'
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <>
         {params.row.etat === 'Nouveau' && (
            <Tooltip title="Modifier" arrow>
              <IconButton
                onClick={() => handleClickOpen(params.row.id)}
                color="primary"
              >
                <ModeIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Voir plus" arrow>
            <IconButton
              onClick={() => handleInfoOpen(params.row.id)}
              color="secondary"
            >
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    }
  ];

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <h1>Interventions</h1>
        <div>
          {/* Buttons to filter interventions */}
          <Button onClick={() => filterInterventionsByType('all')}>Tous</Button>
          <Button onClick={() => filterInterventionsByType('Nouveau')}>Nouveau</Button>
          <Button onClick={() => filterInterventionsByType('En attente')}>En attente</Button>
          <Button onClick={() => filterInterventionsByType('En cours')}>En cours</Button>
          <Button onClick={() => filterInterventionsByType('Assigné')}>Assigné</Button>
          <Button onClick={() => filterInterventionsByType('Terminé')}>Terminé</Button>
          <Button onClick={() => filterInterventionsByType('Annulé')}>Annulé</Button>
          <Button onClick={() => filterInterventionsByType('Clôture')}>Clôture</Button>
        </div>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={currentInterventions}
            columns={columns}
            pageSize={interventionsPerPage}
            hideFooter={true}
            hideFooterPagination={true}
            hideFooterSelectedRowCount={true}
          />
        </div>
        <div className="pagination">
          <ButtonGroup color="primary" aria-label="outlined primary button group">
            <Pagination 
              count={totalPages} 
              page={currentPage} 
              onChange={handlePageChange} 
            />
          </ButtonGroup>
        </div>
        <UpdateForm
          id={selectedIntervention?.id}
          open={open}
          handleClose={handleClose}
          fetchData={fetchData}
          initialFormData={selectedIntervention || { title: '', description: '', adresse: '' }}
        />
        <Dialog open={infoOpen} onClose={handleInfoClose}>
          <DialogTitle>Intervention Details</DialogTitle>
          <DialogContent>
            {selectedIntervention && (
              <>
                <p><strong>Titre:</strong> {selectedIntervention.titre}</p>
                <p><strong>Description:</strong> {selectedIntervention.description}</p>
                <p><strong>Adresse:</strong> {selectedIntervention.adresse}</p>
                <p><strong>Date de création:</strong> {selectedIntervention.date_creation}</p>
                <p><strong>Date de début:</strong> {selectedIntervention.date_debut || 'N/A'}</p>
                <p><strong>Date de fin:</strong> {selectedIntervention.date_fin || 'N/A'}</p>
                <p><strong>Latitude:</strong> {selectedIntervention.latitude || 'N/A'}</p>
                <p><strong>Longitude:</strong> {selectedIntervention.longitude || 'N/A'}</p>
                <p><strong>Technicien:</strong> {
                  selectedIntervention && technicians.map(tech => (
                    tech.id === selectedIntervention.technicien ? `${tech.email} ` : 'N/A'
                  ))
                }</p>
                <p><strong>Service:</strong> {selectedIntervention.service?.nom || 'N/A'}</p>
                <p><strong>Raison:</strong> {selectedIntervention.raison?.description || 'N/A'}</p>
                <p><strong>Conversation:</strong> {selectedIntervention.conversation?.title || 'N/A'}</p>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleInfoClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Citoyenpage;
