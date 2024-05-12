import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar/sidebar';
import Navbar from './navbar/navbar';
import { DataGrid } from '@mui/x-data-grid';
import Pagination from '@mui/material/Pagination';
import { useNavigate } from 'react-router-dom';

 
const Listtechnicien = () => {
  const [technicienData, setTechnicienData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [interventionsPerPage] = useState(7);
  const token=localStorage.getItem("token");
  const role =localStorage.getItem("role");
  const navigate =useNavigate();
 
  useEffect(() => {
    if (token)
      {
        fetchData();

      }
      else {
        navigate("/login");
      }

   
  }, [token]);
 
  const fetchData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
 
      if (!userId || !token) {
        console.error('User ID or token not found in local storage');
        return;
      }
 
      const response = await fetch(`http://127.0.0.1:8000/api_liste_technicien_par_service/${userId}/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
 
      if (response.ok) {
        const data = await response.json();
        const techniciens = data.filter(user => user.is_technicien && user.is_active === true);
        const flattenedTechniciens = techniciens.map(user => ({
          ...user,
          service_nom: user.service ? user.service.nom : "he needs assigned service",
        }));
        setTechnicienData(flattenedTechniciens);
       
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
   
  const columns = [
 
    { field: 'username', headerName: 'Username', width: 150 },
    { field: 'email', headerName: 'Email', width: 150 },
    { field: 'first_name', headerName: 'First Name', width: 150 },
    { field: 'last_name', headerName: 'Last Name', width: 150 },
    { field: 'service_nom', headerName: 'Service', width: 150 },
  ]
 
  const indexOfLastIntervention = currentPage * interventionsPerPage;
  const indexOfFirstIntervention = indexOfLastIntervention - interventionsPerPage;
  const currentInterventions = technicienData.slice(indexOfFirstIntervention, indexOfLastIntervention);
 
  const paginate = (event, value) => {
    setCurrentPage(value);
  };
 
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <div className="top">
          <h1>Les Techniciens</h1>
        </div>
        <div className="botom">
          <div style={{ height: 500, width: '100%' }}>
            <DataGrid
              rows={currentInterventions}
              columns={columns}
              checkboxSelection={false}
              hideFooterPagination={true}
              autoHeight={true} // Remove scrollbar
            />
             <Pagination
              count={Math.ceil(technicienData.length / interventionsPerPage)}
              page={currentPage}
              onChange={paginate}
            />
          </div>
        </div>
      </div>        
    </div>
  );
};
 
export default Listtechnicien;
 