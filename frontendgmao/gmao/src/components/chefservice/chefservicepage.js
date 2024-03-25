import React, { useState, useEffect } from 'react';
import Chefservicenavbar from './chefservicenavbar';
import { useParams, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Chefservicepage = () => {
  const [interventions, setInterventions] = useState([]);
  const { id } = useParams();
  
  useEffect(() => {
    fetchData();
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

  return (
    <div>
      <Chefservicenavbar />
      <h1>Interventions</h1>
      <table className="table table-hover" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Description</th>
            <th>Date de création</th>
            <th>Date de début</th>
            <th>Date de fin</th>
            <th>État</th>
            <th>Conversations</th>
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
                  'pas de conversation'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Chefservicepage;
