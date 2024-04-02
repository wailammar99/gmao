import React, { useState, useEffect ,useRef } from 'react';
import Sidebar from './admindesign/home/sidebar/sidebar';
import Navbar from './admindesign/home/navbar/navbar';



const ListService = () => {
  const [userData, setUserData] = useState([]);
  
  const [serviceData, setServiceData] = useState([]);
 

  useEffect(() => {
    fetchData();
  }, []);

  

  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/Serviceliste/');
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleDeleteService = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/delete_service/${id}/`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setServiceData(prevServices => {
          const updatedServices = prevServices.filter(service => service.id !== id);
          return updatedServices;
        });
        console.log('Service supprimé avec succès');
        
      } else {
        throw new Error('Échec de la suppression du service');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du service :', error);
    }
  };

  return (
       <div className="list">
         <Sidebar/>
        <div className="listContainer">
         <Navbar/>
    <div className="container mt-5">
      <h1>Liste des services</h1>
      <div>
        <table className="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {userData.map((service) => (
              <tr key={service.id}>
                <td>{service.nom}</td>
                <td>{service.descrtions}</td>
                <td>
                  <button onClick={() => handleDeleteService(service.id)} className="btn btn-danger">Supprimer</button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
    </div>
  );
};

export default ListService;