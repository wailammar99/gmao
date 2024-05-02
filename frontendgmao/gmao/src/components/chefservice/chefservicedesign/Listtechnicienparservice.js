import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar/sidebar';
import Navbar from './navbar/navbar';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Pagination } from '@mui/material';


const Listtechnicien = () => {
  const [technicienData, setTechnicienData] = useState([]);
  const [interventionsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    fetchData();
  }, []);

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
        const techniciens = data.filter(user => user.is_technicien);
        setTechnicienData(techniciens);
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const paginate = (event, value) => {
    setCurrentPage(value);
  };

  const indexOfLastIntervention = currentPage * interventionsPerPage;
  const indexOfFirstIntervention = indexOfLastIntervention - interventionsPerPage;
  const currentInterventions = technicienData.slice(indexOfFirstIntervention, indexOfLastIntervention);

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <div className="top">
          <h1>Les Techniciens</h1>
        </div>
        <div className="bottom">
          <div>
            <TableContainer component={Paper} className="table">
              <TableHead>
                <TableRow>
                  <TableCell className="tableCell">ID</TableCell>
                  <TableCell className="tableCell">Username</TableCell>
                  <TableCell className="tableCell">Email</TableCell>
                  <TableCell className="tableCell">First Name</TableCell>
                  <TableCell className="tableCell">Last Name</TableCell>
                  <TableCell className="tableCell">Service</TableCell>
                  <TableCell className="tableCell">Is Active</TableCell>
                  <TableCell className="tableCell">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentInterventions.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="tableCell">{user.id}</TableCell>
                    <TableCell className="tableCell">{user.username}</TableCell>
                    <TableCell className="tableCell">{user.email}</TableCell>
                    <TableCell className="tableCell">{user.first_name}</TableCell>
                    <TableCell className="tableCell">{user.last_name}</TableCell>
                    <TableCell className="tableCell">{user.service?.nom ? user.service.nom : "Needs assigned service"}</TableCell>
                    <TableCell className="tableCell">{user.is_active ? 'Yes' : 'No'}</TableCell>
                    <TableCell className="tableCell">
                      {/* Add action buttons here */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </TableContainer>
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
