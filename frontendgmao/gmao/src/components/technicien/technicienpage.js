import React, { useState, useEffect } from 'react';
import { Button, TableCell, TableContainer, Paper, Table, TableHead, TableRow, TableBody, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Link } from 'react-router-dom';
import Sidebar from './techniciendesign/sidebar/sidebar';
import Navbar from './techniciendesign/navbar/navbar';
import EnAttenteForm from './EnAttenteForm';
import ConversationForm from '../citoyen/ConversationForm';
import PopupMessage from '../message';
import Pagination from '@mui/material/Pagination';

const Technicienpage = () => {
  const [interventions, setInterventions] = useState([]);
  const [equipments, setEquipments] = useState([]);
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
  const [popupMessage, setPopupMessage] = useState({ message: '', color: 'success' });
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    fetchData();
    fetchEquipmentData();
  }, []);

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

  const handleStartIntervention = async (interventionId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api_demarer_inetrvetion/${interventionId}/`, {
        method: 'PUT',
      });
      if (response.ok) {
        setShowPopup(true);
        setPopupMessage({ message: 'intervention est bien démarrée avec succès', color: 'success' });
        setTimeout(() => {
          setPopupMessage(false);
        }, 1500);
      } else {
        throw new Error('Failed to start intervention');
      }
      updateInterventionStatus(interventionId, 'En cours');
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
        }, 1500);
        fetchData();
      } else {
        throw new Error('Failed to finish intervention');
      }
      updateInterventionStatus(interventionId, 'Terminé');
    } catch (error) {
      console.error('Error finishing intervention:', error);
    }
  };

  const updateInterventionStatus = (interventionId, status) => {
    setInterventions(interventions.map(intervention => {
      if (intervention.id === interventionId) {
        return { ...intervention, etat: status };
      }
      return intervention;
    }));
  };

  const handleToggleEnAttenteForm = (interventionId) => {
    setShowEnAttenteForm(!showEnAttenteForm);
    setInterventionId(interventionId); // Set the intervention_id
  };

  const handleFormSubmit = (formData) => {
    console.log('Form submitted:', formData);
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
  };

  const handleSearch = (query) => {
    console.log('Searching for:', query);
  };

  const paginate = (event, pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastIntervention = currentPage * interventionsPerPage;
  const indexOfFirstIntervention = indexOfLastIntervention - interventionsPerPage;
  const currentInterventions = interventions.slice(indexOfFirstIntervention, indexOfLastIntervention);

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar onSearch={handleSearch} />
        <h1>Interventions</h1>
        <div className="filterButtons">
          <Button onClick={() => filterInterventionsByStatus('En cours')}>en cours</Button>
          <Button onClick={() => filterInterventionsByStatus('En attente')}>En attente</Button>
          <Button onClick={() => filterInterventionsByStatus('Terminé')}>Terminé</Button>
          <Button onClick={() => filterInterventionsByStatus('Assigné')}>Assigné</Button>
        </div>
        {showPopup && <PopupMessage message={popupMessage.message} color={popupMessage.color} />}

        <TableContainer component={Paper} className="table">
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Date de début</TableCell>
                <TableCell>Date de fin</TableCell>
                <TableCell>État</TableCell>
                <TableCell>Conversations</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentInterventions.map(intervention => (
                <TableRow key={intervention.id}>
                  <TableCell>{intervention.date_debut}</TableCell>
                  <TableCell>{intervention.date_fin}</TableCell>
                  <TableCell>{intervention.etat}</TableCell>
                  <TableCell>
                    {intervention.conversation && intervention.conversation.id ? (
                      <Link to={`/conversation/${intervention.conversation.id}/citoyen/${localStorage.getItem('userId')}`}>
                        {intervention.conversation.title}
                      </Link>
                    ) : (
                      <Button variant="outlined" onClick={() => handleStartConversation(intervention.id)}>Start Conversation</Button>
                    )}
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
                  </TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {intervention.etat === 'Assigné' && (
                        <Button onClick={() => handleStartIntervention(intervention.id)} variant="contained" color="primary">démarrer</Button>
                      )}
                      {intervention.etat === 'En cours' && (
                        <>
                          <Button onClick={() => handleFinishIntervention(intervention.id)} variant="contained" color="success">terminé</Button>
                          <Button onClick={() => handleToggleEnAttenteForm(intervention.id)} variant="outlined" color="error">En attente</Button>
                        </>
                      )}
                      <Button onClick={() => handleOpenModal(intervention)} variant="outlined" className='primary'>Voir plus</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination count={Math.ceil(interventions.length / interventionsPerPage)} page={currentPage} onChange={paginate} />
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
