import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle,Pagination } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Sidebar from './techniciendesign/sidebar/sidebar';
import Navbar from './techniciendesign/navbar/navbar';
import EnAttenteForm from './EnAttenteForm';
import ConversationForm from '../citoyen/ConversationForm';
import PopupMessage from '../message';
import { Link } from 'react-router-dom';
const Technicienpage = () => {
  const [interventions, setInterventions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedIntervention, setSelectedIntervention] = useState(null);
  const [isNoService, setIsNoService] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
 
  const [currentPage, setCurrentPage] = useState(1);
  const [interventionsPerPage] = useState(4);
  const [showModalConversation, setShowModalConversation] = useState(false);
  const [conversationInterventionId, setConversationInterventionId] = useState(null);
  const [showEnAttenteForm, setShowEnAttenteForm] = useState(false);
  const [interventionId, setInterventionId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [equipments, setEquipments] = useState([]);
  const [popupMessage, setPopupMessage] = useState({ message: '', color: 'success' });
  const [selectedStatus, setSelectedStatus] = useState('');
  const[FilteredInterventions,setFilteredInterventions]=useState('');


  useEffect(() => {
    fetchData();
    fetchEquipmentData();
  }, []);
  const fetchEquipmentData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/liste_equipment/');
      if (response.ok) {
        const equipmentData = await response.json();
        setEquipments(equipmentData);
      } else {
        console.error('Failed to fetch equipment data');
      }
    } catch (error) {
      console.error('Error fetching equipment data:', error);
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("Token not found. Redirecting to login...");
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/liste_intervetion_technicien/${localStorage.getItem('userId')}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setInterventions(data || []);
      } else {
        console.error('Failed to fetch interventions');
      }
    } catch (error) {
      console.error('Error fetching interventions:', error);
    }
  };

  const handleStartIntervention = async (interventionId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api_demarer_inetrvetion/${interventionId}/`, {
        method: 'PUT',
      });
      if (response.ok) {
        setShowPopup(true);
        setPopupMessage({ message: 'intervention est bien démarrée avec succès', color: 'success' });
        setTimeout(() => {
          setShowPopup(false);
          fetchData();
        }, 1500);
      } else {
        throw new Error('Failed to start intervention');
      }
      
    } catch (error) {
      console.error('Error starting intervention:', error);
    }
  };

  const handleFinishIntervention = async (interventionId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api_finish_inetrvetion/${interventionId}/`, {
        method: 'PUT',
      });
      if (response.ok) {
        setShowPopup(true);
        setPopupMessage({ message: 'intervention est bien terminée avec succès', color: 'success' });
        setTimeout(() => {
          setPopupMessage(false);
          fetchData();
        }, 1500);
        fetchData();
      } else {
        throw new Error('Failed to finish intervention');
      }
      
    } catch (error) {
      console.error('Error finishing intervention:', error);
    }
  };


  const handleToggleEnAttenteForm = (interventionId) => {
    setShowEnAttenteForm(!showEnAttenteForm);
    setInterventionId(interventionId); // Set the intervention_id
  };

  const handleOpenModal = (intervention) => {
    setSelectedIntervention(intervention);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const showMessage = (message, color) => {
    setPopupMessage({ message, color });
    setShowPopup(true);
  };

  const handleStartConversation = async (interventionId) => {
    setConversationInterventionId(interventionId);
    setShowModalConversation(true);
  };

  const filterInterventionsByStatus = (status) => {
    setSelectedStatus(status);
    if (status === '') {
      // If status is empty, set filtered interventions to all interventions
      setFilteredInterventions(interventions);
    } else {
      // Filter interventions based on selected status
      const filtered = interventions.filter(intervention => intervention.etat === status);
      setFilteredInterventions(filtered);
    }
    // Reset current page to 1 whenever filter changes
    setCurrentPage(1);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Perform search logic here
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleFormSubmit = (formData) => {
    console.log('Form submitted:', formData);
  };
  

  // Calculate range of interventions to display based on current page and interventions per page

  const columns = [
    { field: 'date_debut', headerName: 'Date de début', width: 200 },
    { field: 'date_fin', headerName: 'Date de fin', width: 200 },
    { field: 'etat', headerName: 'État', width: 150 },
    {
      field: 'conversation', // Assuming 'conversation' is an object within each intervention
      headerName: 'Conversation', 
      width: 150,
      renderCell: (params) => {
        if (params.row.conversation && params.row.conversation.id) {
          return (
            <Link to={`/conversation/${params.row.conversation.id}/technicien/${localStorage.getItem('userId')}`}>
              {params.row.conversation.title}
            </Link>
          );
        } else {
          return (
            <Button variant="outlined" onClick={() => handleStartConversation(params.row.id)}>demarer</Button>
          );
        }
      } // Closing parenthesis was missing here
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 300,
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {params.row.etat === 'Assigné' && (
            <Button onClick={() => handleStartIntervention(params.row.id)} variant="contained" color="primary">démarrer</Button>
          )}
          {params.row.etat === 'En cours' && (
            <>
              <Button onClick={() => handleFinishIntervention(params.row.id)} variant="contained" color="success">terminé</Button>
              <Button onClick={() => handleToggleEnAttenteForm(params.row.id)} variant="outlined" color="error">En attente</Button>
            </>
          )}
          <Button onClick={() => handleOpenModal(params.row)} variant="outlined" className='primary'>Voir plus</Button>
        </div>
      ),
    },
  ];
  
  const indexOfLastIntervention = currentPage * interventionsPerPage;
  const indexOfFirstIntervention = indexOfLastIntervention - interventionsPerPage;
  // Slice the interventions array to get the interventions for the current page
  const currentInterventions = FilteredInterventions.slice(indexOfFirstIntervention, indexOfLastIntervention);

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar onSearch={handleSearch} />
        <h1>Interventions</h1>
        <div className="filterButtons">
          <Button onClick={() => filterInterventionsByStatus('En cours')}>En cours</Button>
          <Button onClick={() => filterInterventionsByStatus('En attente')}>En attente</Button>
          <Button onClick={() => filterInterventionsByStatus('Terminé')}>Terminé</Button>
          <Button onClick={() => filterInterventionsByStatus('Assigné')}>Assigné</Button>
          <Button onClick={() => filterInterventionsByStatus('')}>Tous</Button>
        </div>
        {showEnAttenteForm && (
                      <EnAttenteForm
                        onClose={() => setShowEnAttenteForm(false)}
                        onSubmit={(formData) => {
                          handleFormSubmit(formData);
                          setShowEnAttenteForm(false);
                        }}
                        interventionId={interventionId}
                      />
                    )}
                    {showModalConversation && (
                      <ConversationForm
                        show={showModalConversation}
                        onClose={() => setShowModalConversation(false)}
                        interventionId={conversationInterventionId}
                      />
                    )}
        <DataGrid
          rows={currentInterventions}
          columns={columns}
          pageSize={interventionsPerPage}
          pagination={false}
          autoHeight={true}
          hideFooter={true}
          hideFooterPagination={true}
        />
        <div>
        <Pagination
  count={Math.ceil(FilteredInterventions.length / interventionsPerPage)}
  page={currentPage}
  onChange={(event, page) => handlePageChange(page)}
  variant="outlined"
  shape="rounded"
/>
   
        </div>
        {showPopup && <PopupMessage message={popupMessage.message} color={popupMessage.color} />}
        <Dialog open={showModal} onClose={handleCloseModal}>
          <DialogTitle>Details de l'intervention</DialogTitle>
          <DialogContent>
            {selectedIntervention && (
              <div>
                {/* Intervention details */}
                <p>Description: {selectedIntervention.description}</p>
                <p>Date de création : {selectedIntervention.date_creation}</p>
                <p>Date de début : {selectedIntervention.date_debut}</p>
                <p>Date de fin : {selectedIntervention.date_fin}</p>
                <p>État : {selectedIntervention.etat}</p>
                <p>Citoyen : {selectedIntervention.citoyen?.email ? selectedIntervention.citoyen.email : "null"}</p>
    <p>Service : {selectedIntervention.service.nom ? selectedIntervention.service.nom : "NULL"}</p>
    <p>Équipements :
      <ul>
        {selectedIntervention.equipements && selectedIntervention.equipements.map((equipementId) => {
          const equipment = equipments.find(equip => equip.id === equipementId);
          return (
            <li key={equipment.id}>
              {equipment ? equipment.nom : 'Unknown equipment'}
            </li>
          );
        })}
      </ul>
    </p>
    <p>Raison : {selectedIntervention.raison ? selectedIntervention.raison.description : "No raison"}</p>
                {/* Add other details here */}
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="primary">
              Fermer
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Technicienpage;
