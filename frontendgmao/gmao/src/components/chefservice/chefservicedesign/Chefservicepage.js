import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import InterventionForm from './InterventionForm';
import Sidebar from './sidebar/sidebar';
import Navbar from './navbar/navbar';
import { Button, TableCell, TableContainer, Paper, Table, TableHead, TableRow, TableBody, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import InterventionFormTechnician from './InterventionFormTechnician';
import ConversationForm from '../../citoyen/ConversationForm';

const Chefservicepage = () => {
  const [interventions, setInterventions] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [showModall,setShowModall]=useState(false)
  const [selectedIntervention, setSelectedIntervention] = useState(null);
  const [isNoService, setIsNoService] = useState(false);
  const [showModalConversation, setShowModalConversation] = useState(false);
  const [conversationInterventionId, setConversationInterventionId] = useState(null);

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
        // Update the state immediately
        const updatedInterventions = interventions.map(intervention => {
          if (intervention.id === interventionId) {
            return { ...intervention, etat: 'Refused' };
          }
          return intervention;
        });
        setInterventions(updatedInterventions);
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

  const handleStartConversation = (interventionId) => {
    setConversationInterventionId(interventionId);
    setShowModalConversation(true);
    // Update the state immediately
    const updatedInterventions = interventions.map(intervention => {
      if (intervention.id === interventionId) {
        return { ...intervention, etat: 'Conversation Started' };
      }
      return intervention;
    });
    setInterventions(updatedInterventions);
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

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
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
                    <InterventionForm interventionId={selectedIntervention.id} onSubmit={handleFormSubmit} />
                  ) : (
                    <InterventionFormTechnician interventionId={selectedIntervention.id} onSubmit={handleFormSubmit} />
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

        <table className="table table-hover" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
             
              <th>Date de création</th>
              <th>Date de début</th>
              <th>Date de fin</th>
              <th>État</th>
              <th>Conversations</th>
             
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {interventions.map(intervention => (
              <tr key={intervention.id}>
                <td>{intervention.date_creation}</td>
                <td>{intervention.date_debut}</td>
                <td>{intervention.date_fin}</td>
                <td>{intervention.etat}</td>
                <td>
                  {intervention.conversation && intervention.conversation.id ? (
                    <Link to={`/conversation/${intervention.conversation.id}/citoyen/${localStorage.getItem('userId')}`}>
                      {intervention.conversation.title}
                    </Link>
                  ) : (
                    <button className="btn btn-primary" onClick={() => handleStartConversation(intervention.id)}>Start Conversation</button>
                  )}
                </td>
               
               
              
                <td>
                  <ul>
                    {intervention.equipements && intervention.equipements.map((equipementId) => {
                      const equipment = equipments.find(equip => equip.id === equipementId);
                      return (
                        <li key={equipment.id}>
                          {equipment ? equipment.nom : 'Unknown equipment'}
                        </li>
                      );
                    })}
                  </ul>
                </td>
                <td><button type="button" className="btn btn-outline-warning" onClick={() => toggleModal(intervention)}>Assign Intervention to Service</button></td>
                <td><button className="btn btn-danger" onClick={() => handleRefuseIntervention(intervention.id)}>Refuse Intervention</button></td>
                <td><button className="btn btn-info" onClick={() => handleOpenModall(intervention)}>Voir plus</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <Dialog open={showModall} onClose={handleCloseModall}>
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
