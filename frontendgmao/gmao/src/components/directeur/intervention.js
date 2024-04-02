import React, { useState, useEffect } from 'react';

const Intervention = () => {
  const [interventionData, setInterventionData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/intervention/');
      if (response.ok) {
        const data = await response.json();
        setInterventionData(data);
      } else {
        console.error('Failed to fetch intervention data');
      }
    } catch (error) {
      console.error('Error fetching intervention data:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Liste des interventions</h1>
      <div>
        <table className="table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Date de création</th>
              <th>Date de début</th>
              <th>Date de fin</th>
              <th>État</th>
              <th>Citoyen</th>
              <th>Service</th>
              <th>Technicien de l'intervention</th>
            </tr>
          </thead>
          <tbody>
            {interventionData.map((intervention) => (
              <tr key={intervention.id}>
                <td>{intervention.description}</td>
                <td>{intervention.date_creation}</td>
                <td>{intervention.date_debut}</td>
                <td>{intervention.date_fin}</td>
                <td>{intervention.etat}</td>
                <td>{intervention.citoyen ? intervention.citoyen.email: 'unknow'}</td> 
                <td>{intervention.service ? intervention.service.nom : 'unknow'}</td>
                <td>{intervention.technicien}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Intervention;