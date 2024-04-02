import React, { useState, useEffect, useRef } from 'react';

const Listtechnicien = () => {
  const [technicienData, setTechnicienData] = useState([]); // Déclarer setTechnicienData

  const forceUpdate = useRef(null);

  useEffect(() => {
    forceUpdate.current = () => {}; // Initialiser forceUpdate.current
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/listecustomer/');
      if (response.ok) {
        const data = await response.json();
        // Filtrer les données pour les techniciens
        const techniciens = data.filter(user => user.is_technicien);
        setTechnicienData(techniciens);
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  
  const handleActivate = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api_activer_compte/${id}`, {
        method: 'GET',
      });
      if (response.ok) {
        setTechnicienData(prevUsers => {
          const updatedUsers = prevUsers.map(user => {
            if (user.id === id) {
              return { ...user, is_active: true }; // Mettre à jour l'état d'activation
            }
            return user;
          });
          return updatedUsers;
        });
        console.log('Compte utilisateur activé avec succès');
      } else {
        throw new Error('Failed to activate user account');
      }
    } catch (error) {
      console.error('Error activating user account:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Comptes des Techniciens</h1>
      <div>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>first_name</th>
              <th>last_name</th>
              <th>Is Active</th>
            </tr>
          </thead>
          <tbody>
            {technicienData.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.is_active ? 'Yes' : 'No'}</td>
                {!user.is_active && (
                  <td><button onClick={() => handleActivate(user.id)} className="btn btn-success">Activer</button></td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Listtechnicien;