import React, { useState, useEffect ,useRef } from 'react';
import Sidebar from './admindesign/home/sidebar/sidebar';
import Navbar from './admindesign/home/navbar/navbar';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

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
      const response = await fetch(`http://127.0.0.1:8000/api_delete_service/${id}/`, {
       
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
         <div className="top">
      <h1>Liste des services</h1>
      </div>
      <div className="botom">
      <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
           
          <TableCell className="tableCell">Nom</TableCell>
          <TableCell className="tableCell">Description</TableCell>
          <TableCell className="tableCell">Action</TableCell>
            
          </TableRow>
          </TableHead>
          <TableBody>
            {userData.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="tableCell">{service.nom}</TableCell>
                <TableCell className="tableCell">{service.descrtions}</TableCell>
                <TableCell className="tableCell">
                  <button onClick={() => handleDeleteService(service.id)} className="btn btn-danger">Supprimer</button>
                  </TableCell>

                  </TableRow>
          ))}
        </TableBody>
         </Table>
      </TableContainer>
      </div>
    </div>
    </div>
   
  );
};

export default ListService;