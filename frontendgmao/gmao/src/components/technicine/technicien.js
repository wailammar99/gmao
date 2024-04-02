import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import ConversationForm from '../citoyen/ConversationForm';
import EnAttenteForm from './EnAttenteButton';
// Import EnAttenteForm component

const Technicienpage = () => {
  const [interventions, setInterventions] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedIntervention, setSelectedIntervention] = useState(null);
  const [isNoService, setIsNoService] = useState(false);
  const [showModalConversation, setShowModalConversation] = useState(false);
  const [conversationInterventionId, setConversationInterventionId] = useState(null);
  const [showEnAttenteForm, setShowEnAttenteForm] = useState(false);
  const [interventionId, setInterventionId] = useState(null); // State to hold the intervention_id

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
 
  const handleFormSubmit = (formData) => {
    console.log('Form submitted:', formData);
  };

  const handleStartConversation = (interventionId) => {
    setConversationInterventionId(interventionId);
    setShowModalConversation(true);
  };

  const handleToggleEnAttenteForm = (interventionId) => {
    setShowEnAttenteForm(!showEnAttenteForm);
    setInterventionId(interventionId); // Set the intervention_id
  };

  const handleStartIntervention = async (interventionId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api_demarer_inetrvetion/${interventionId}/`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error('Failed to refuse intervention');
      }
      const data = await response.json();
      
    } catch (error) {
      console.error('Error starting intervention:', error);
    }
  };
  const handlefinishIntervention = async (interventionId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api_finish_inetrvetion/${interventionId}/`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error('Failed to refuse intervention');
      }
      const data = await response.json();
      
    } catch (error) {
      console.error('Error starting intervention:', error);
    }
  };
  return (
    <div>
      <h1>Interventions</h1>
      {/* Modal to display the InterventionForm */}
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
              
              </div>
            </div>
          </div>
      )}

      {/* Render the Conversation Form modal */}
      {showModalConversation && (
        <ConversationForm
          show={showModalConversation}
          onClose={() => setShowModalConversation(false)}
          interventionId={conversationInterventionId}
        />
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

      <table className="table table-hover" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Description</th>
            <th>Date de création</th>
            <th>Date de début</th>
            <th>Date de fin</th>
            <th>État</th>
            <th>Conversations</th>
            <th>Service</th>
            <th>Citoyen</th>
            <th>Technicien</th>
            <th>Raison</th>
            <th>Équipement</th>
            <th>Action</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {interventions.map(intervention => (
            <tr key={intervention.id}>
              <td>{intervention.description}</td>
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
                  <button onClick={() => handleStartConversation(intervention.id)}>Start Conversation</button>
                )}
              </td>
              <td>{intervention.service ? intervention.service.nom : ''}</td>
              <td>{intervention.citoyen ? intervention.citoyen.email : ''}</td>
              <td>{intervention.technicien}</td>
              <td>{intervention.raison ? intervention.raison.description : "null"}</td>
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
              <td>
                <button onClick={() => handleStartIntervention(intervention.id)} className="btn btn-primary">Start Intervention</button>
              </td>
              <td>
                <button onClick={() => handlefinishIntervention(intervention.id)} className="btn btn-primary">terminer Intervention</button>
              </td>
              
              {/* Button to toggle the EnAttenteForm visibility */}
              <td>
                <button onClick={() => handleToggleEnAttenteForm(intervention.id)} className="btn btn-primary">En attente</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Technicienpage;
