import React, { useState, useEffect } from 'react';
import { Button, TableCell, TableContainer, Paper, Table, TableHead, TableRow, TableBody,Dialog, DialogTitle, DialogContent, DialogActions} from '@mui/material';
import { Link } from 'react-router-dom';
import Sidebar from './techniciendesign/sidebar/sidebar';
import Navbar from './techniciendesign/navbar/navbar';
import EnAttenteForm from './EnAttenteForm';
import ConversationForm from '../citoyen/ConversationForm';
import PopupMessage from '../message';


const Technicienpage = () => {
  const [interventions, setInterventions] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedIntervention, setSelectedIntervention] = useState(null);
  const [isNoService, setIsNoService] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');


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
      if (response.ok)
      {
        setShowPopup(true);
        setPopupMessage({ message: 'Intervention started successfully', color: 'success' });
      }
      if (!response.ok) {
        throw new Error('Failed to start intervention');
      }
      const data = await response.json();
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
      console.log(response);
if (response.ok) {
  setShowPopup(true);
  setPopupMessage({ message: 'Intervention finish  successfully', color: 'success' });
  fetchData();
}

      if (response.ok)
      {
        setShowPopup(true);
        setPopupMessage({ message: 'Intervention finish  successfully', color: 'success' });
        fetchData();
      }
      if (!response.ok) {
        throw new Error('Failed to finish intervention');
      }
      const data = await response.json();
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
    // Set the message and color for the PopupMessage component
    setPopupMessage({ message, color });
    // Show the PopupMessage component
    setShowPopup(true);
  };

  // Add similar functions for other actions like starting conversation, creating reasons, etc.
  const handleStartConversation = async (interventionId) => {
    try {
      // Open the ConversationForm popup
     
      // Set the conversation intervention ID
      setConversationInterventionId(interventionId);
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };
  const filterInterventionsByStatus = (status) => {
    setSelectedStatus(status);
  };
  const handleSearch = (query) => {
    // Implement your search functionality here
    console.log('Searching for:', query);
    // You can perform any search-related actions here
  };

  return (
    <div className="list">
      <Sidebar/>
      <div className="listContainer">
      <Navbar onSearch={handleSearch} />
        <h1>Interventions</h1>
        <div className="filterButtons">
          <Button onClick={() => filterInterventionsByStatus('En cours')}>en cour </Button>
          <Button onClick={() => filterInterventionsByStatus('En attente')}>En attente</Button>
          <Button onClick={() => filterInterventionsByStatus('Terminé')}>Terminé</Button>
          <Button onClick={() => filterInterventionsByStatus('Assigné')}>Assigné</Button>
          {/* Add buttons for other statuses */}
        </div>
        {showPopup && <PopupMessage message={popupMessage.message} color={popupMessage.color} />}

        <TableContainer component={Paper} className="table">
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
              
                <TableCell>Date de création</TableCell>
                <TableCell>Date de début</TableCell>
                <TableCell>Date de fin</TableCell>
                <TableCell>État</TableCell>
                <TableCell>Conversations</TableCell>
                
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
           
            {interventions
  .filter(intervention => !selectedStatus || intervention.etat === selectedStatus).map(intervention => (
    <TableRow key={intervention.id}>
    
    
                
   
                  <TableCell>{intervention.date_creation}</TableCell>
                  <TableCell>{intervention.date_debut}</TableCell>
                  <TableCell>{intervention.date_fin}</TableCell>
                  <TableCell>{intervention.etat}</TableCell>
                  <TableCell>
                    {intervention.conversation && intervention.conversation.id ? (
                      <Link to={`/conversation/${intervention.conversation.id}/citoyen/${localStorage.getItem('userId')}`}>
                        {intervention.conversation.title}
                      </Link>
                    ) : (
                      <button onClick={() => handleStartConversation(intervention.id)}>Start Conversation</button>
                    )}
                     {/* Render the EnAttenteForm component when showEnAttenteForm is true */}
                     {showEnAttenteForm && (
        <EnAttenteForm
          onClose={() => setShowEnAttenteForm(false)} // Close the form when needed
          onSubmit={(formData) => {
            // Submit the form data
            handleFormSubmit(formData);
            // Close the form after submission
            setShowEnAttenteForm(false);
          }}
          interventionId={interventionId} // Pass the intervention_id as a prop
        />
      )}
                  </TableCell>
                  <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {intervention.etat=='Assigné' && (
                  <TableCell> <Button onClick={() => handleStartIntervention(intervention.id)} variant="contained" color="primary">
                  Start Intervention
                </Button></TableCell>
                )}
                {intervention.etat=='En cours' && (
                   <TableCell>
                   <TableCell> <Button onClick={() => handleFinishIntervention(intervention.id)} variant="contained" color="success">
                      Finish Intervention
                    </Button></TableCell>
                   
                   <TableCell>
                   <Button onClick={() => handleToggleEnAttenteForm(intervention.id)} variant="outlined" color="error">En attente</Button>
                   </TableCell>
                   
                   
               
                    </TableCell>
                  )}
                 
                  <Button onClick={() => handleOpenModal(intervention)} variant="outlined" className='primary'>Voir plus</Button>
                  </div>
                  </TableCell>
                  
                
               
               
                 
                    
                    {/* Add other action buttons here */}
                  
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog open={showModal} onClose={handleCloseModal}>
          <DialogTitle>Details de l'intervention</DialogTitle>
          <DialogContent>
          {selectedIntervention && (
  <div>
    <p>Description : {selectedIntervention.description}</p>
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
    {/* Ajoutez d'autres détails de l'intervention ici */}
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
