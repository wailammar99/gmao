import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import InterventionForm from './InterventionForm';
import Sidebar from './sidebar/sidebar';
import Navbar from './navbar/navbar';
import { Button, TableCell, TableContainer, Paper, Table, TableHead, TableRow, TableBody, Dialog, DialogTitle, DialogContent, DialogActions, TablePagination } from '@mui/material';
import InterventionFormTechnician from './InterventionFormTechnician';
import ConversationForm from '../../citoyen/ConversationForm';
import PopupMessage from '../../message';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';


const Chefservicepage = () => {
  const [interventions, setInterventions] = useState([]);
  const [interventionId, setInterventionId] = useState(null);
  const [equipments, setEquipments] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState({ message: '', color: 'success' });
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [showModall, setShowModall] = useState(false)
  const [selectedIntervention, setSelectedIntervention] = useState(null);
  const [isNoService, setIsNoService] = useState(false);
  const [interventionsPerPage] = useState(4);
  const [showModalConversation, setShowModalConversation] = useState(false);
  const [conversationInterventionId, setConversationInterventionId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

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

      const response = await fetch(`http://127.0.0.1:8000/api_intervetion_chefservice/${localStorage.getItem('userId')}/`, {
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

  const handleRefuseIntervention = async (interventionId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api_refuse_intervention/${interventionId}/`, {
        method: 'GET',
      });
      
      if (response.ok) {
        // Show the popup message
        setShowPopup(true);
        setPopupMessage({ message: 'Intervention est bien refusée', color: 'success' });
  
        // Reset the popup message state after 3 seconds (adjust as needed)
        setTimeout(() => {
          setShowPopup(false);
          setPopupMessage({ message: '', color: 'success' });
        }, 1500);
  
        // Fetch updated data after refusing intervention
        fetchData();
      } else {
        console.error('Failed to refuse intervention');
      }
    } catch (error) {
      console.error('Error refusing intervention:', error);
    }
  };
  

  const hadllecloture = async (interventionId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api_cloture_inetrvetion/${interventionId}/`, {
        method: 'PUT',
      });
      if (response.ok) {
        setShowPopup(true);
        setPopupMessage({ message: 'Intervention est bien cloture', color: 'success' });
  
        // Reset the popup message state after 3 seconds (adjust as needed)
        setTimeout(() => {
          setShowPopup(false);
          setPopupMessage({ message: '', color: 'success' });
        }, 1500);
  
        // Fetch updated data after refusing intervention
        fetchData();
        
      } else {
        console.error('Failed to refuse intervention');
      }
    } catch (error) {
      console.error('Error refusing intervention:', error);
    }
  };


  const toggleModal = (intervention) => {
    setSelectedIntervention(intervention);
    setIsNoService(intervention.service && intervention.service.nom === 'noservice');
    setShowModal(!showModal);
    // Close the conversation modal if it's open
    setShowModalConversation(false);
  };

  const handleFormSubmit = (formData) => {
    console.log('Form submitted:', formData);
  };

  const handleStartConversation = async (interventionId) => {
    setConversationInterventionId(interventionId);
    setShowModalConversation(true);
 
    
    // Close the assignment modal if it's open
    setShowModal(false);
  };

  const handleOpenModal = (intervention) => {
    setSelectedIntervention(intervention);
    setShowModal(true);
    // Close the conversation modal if it's open
    setShowModalConversation(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOpenModall = (intervention) => {
    setSelectedIntervention(intervention);
    setShowModall(true);
    // Close the conversation modal if it's open
    setShowModalConversation(false);
  };

  const handleCloseModall = () => {
    setShowModall(false);
  };

  const filterInterventionsByStatus = (status) => {
    setSelectedStatus(status);
  };

  const handleSearch = (query) => {
    // Implement your search functionality here
    console.log('Searching for:', query);
    // You can perform any search-related actions here
  };

  const updateInterventionStatus = (interventionId, status) => {
    setInterventions(interventions.map(intervention => {
      if (intervention.id === interventionId) {
        return { ...intervention, etat: status };
      }
      return intervention;
    }));
  };

  const filteredInterventions = interventions.filter(intervention => !selectedStatus || intervention.etat === selectedStatus);
  const indexOfLastIntervention = currentPage * interventionsPerPage;
  const indexOfFirstIntervention = indexOfLastIntervention - interventionsPerPage;
  const currentInterventions = filteredInterventions.slice(indexOfFirstIntervention, indexOfLastIntervention);

  const paginate = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <h1>Interventions</h1>
        <Button onClick={() => filterInterventionsByStatus('En cours')}>en cour </Button>
        <Button onClick={() => filterInterventionsByStatus('En attente')}>En attente</Button>
        <Button onClick={() => filterInterventionsByStatus('Terminé')}>Terminé</Button>
        <Button onClick={() => filterInterventionsByStatus('Assigné')}>Assigné</Button>
        <Button onClick={() => filterInterventionsByStatus('Nouveau')}>Nouveau</Button>
        <Button onClick={() => filterInterventionsByStatus('Clôture')}>Clôture</Button>

        <Button onClick={() => filterInterventionsByStatus('')}>Tous</Button> {/* Add this button */}
        {showPopup && <PopupMessage message={popupMessage.message} color={popupMessage.color} />}
        {showModal && selectedIntervention && (
          <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Intervention</h5>
                  <button type="button" className="close" onClick={() => setShowModal(false)} aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  {isNoService ? (
                    <InterventionForm interventionId={selectedIntervention.id} onSubmit={handleFormSubmit} onClose={() => setShowModal(false)} />
                  ) : (
                    <InterventionFormTechnician interventionId={selectedIntervention.id} onSubmit={handleFormSubmit} onClose={() => setShowModal(false)} />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {showModalConversation && (
          <ConversationForm
            show={showModalConversation}
            onClose={() => setShowModalConversation(false)}
            interventionId={conversationInterventionId}
          />
        )}

        <TableContainer component={Paper}>
          <Table>
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
              {currentInterventions.map(intervention => (
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
                      <Button  variant="outlined" onClick={() => handleStartConversation(intervention.id)}>Start Conversation</Button>
      
                    )}
                  </TableCell>
                  {showModalConversation && (
          <ConversationForm
            show={showModalConversation}
            onClose={() => setShowModalConversation(false)}
            interventionId={conversationInterventionId}
          />
        )}
                  <TableCell>
          
                    <div style={{ display: "flex", flexDirection: "row", gap: "0.5rem" }}>
                      <button type="button" className="btn btn-outline-warning" onClick={() => toggleModal(intervention)}>Assign</button>
                      <button className="btn btn-danger" onClick={() => handleRefuseIntervention(intervention.id)}>Refuse</button>
                      <button className="btn btn-success" onClick={() => hadllecloture(intervention.id)}>Cloture</button>
                    </div>
                    <td><button className="btn btn-info" onClick={() => handleOpenModall(intervention)}> plus</button></td>
               
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
          count={Math.ceil(filteredInterventions.length / interventionsPerPage)}
          page={currentPage}
          onChange={paginate}
        />

        <Dialog open={showModall} onClose={handleCloseModall}>
          <DialogTitle>Details de l'intervention</DialogTitle>
          <DialogContent>
            {selectedIntervention && (
              <div>
                <p>Description : {selectedIntervention.description}</p>
                <p>Date de création : {selectedIntervention.date_creation}</p>
                <p>Date de début : {selectedIntervention.date_debut ? selectedIntervention.date_debut :"ya pas de date "}</p>
                <p>Date de fin : {selectedIntervention.date_fin ? selectedIntervention.date_fin :"ya pas de date "}</p>
                <p>État : {selectedIntervention.etat}</p>
                <p>Citoyen : {selectedIntervention.citoyen?.email ? selectedIntervention.citoyen.email : "intervetion preventive"}</p>
                <p>Service : {selectedIntervention.service.nom ? selectedIntervention.service.nom : "NULL"}</p>
                <p>tehcnicne id  : {selectedIntervention.technicien ? selectedIntervention.technicien : "le intervetion est pas assigne au tecnicien"}</p>
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
            <Button onClick={handleCloseModall} color="primary">
              Fermer
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Chefservicepage;
