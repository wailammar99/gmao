import React, { useState, useEffect } from 'react';
import Chefservicenavbar from './chefservicenavbar';
import { useParams, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import InterventionForm from './intervetionfrom';
import ConversationForm from '../citoyen/ConversationForm';
import InterventionFormtechnicine from './InterventionFormtechnicine'; // Corrected import statement

const Chefservicepage = () => {
  const [interventions, setInterventions] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [selectedIntervention, setSelectedIntervention] = useState(null);
  const [isNoService, setIsNoService] = useState(false); // State to track if the service is "noservice"
  const [showModalConversation, setShowModalConversation] = useState(false); // State to control showing Conversation Form modal
  const [conversationInterventionId, setConversationInterventionId] = useState(null); // State to store the intervention id for starting conversation

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
      if (!response.ok) {
        throw new Error('Failed to refuse intervention');
      }
      const data = await response.json();
      
    } catch (error) {
      
    }
  };

  const toggleModal = (intervention) => {
    setSelectedIntervention(intervention);
    // Check if the service is "noservice"
    setIsNoService(intervention.service && intervention.service.nom === 'noservice');
    setShowModal(!showModal);
  };

  const handleFormSubmit = (formData) => {
    console.log('Form submitted:', formData);
  };

  const handleStartConversation = (interventionId) => {
    setConversationInterventionId(interventionId);
    setShowModalConversation(true);
  };

  return (
    <div>
      <Chefservicenavbar />
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
              <div className="modal-body">
                {/* Conditionally render the appropriate form component based on the service type */}
                {isNoService ? (
                  <InterventionForm interventionId={selectedIntervention.id} onSubmit={handleFormSubmit} />
                ) : (
                  <InterventionFormtechnicine interventionId={selectedIntervention.id} onSubmit={handleFormSubmit} />
                )}
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
<th>technicien</th>
<th>equimpent</th>
<th>Action</th>
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
</tr>
))}
</tbody>
</table>
</div>
);
};

export default Chefservicepage;

           
