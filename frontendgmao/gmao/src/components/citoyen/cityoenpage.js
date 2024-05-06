import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './cityoendesign/sidebar/sidebar';
import Navbar from './cityoendesign/navbar/navbar';
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import Pagination from '@mui/material/Pagination';

const Citoyenpage = () => {
  const [interventions, setInterventions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [interventionsPerPage] = useState(5); // Number of interventions per page

  useEffect(() => {
    fetchData();
  }, [currentPage]); // Fetch data when the currentPage changes

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("Token not found. Redirecting to login...");
        // Redirect to login page or handle unauthorized access
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/api_intervetion_citoyen/${localStorage.getItem('userId')}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data); // Log the response data to see its structure
        setInterventions(data.interventions || []); // Ensure interventions is initialized as an empty array if data.interventions is undefined
      } else {
        console.error('Failed to fetch interventions');
      }
    } catch (error) {
      console.error('Error fetching interventions:', error);
    }
  };

  const indexOfLastIntervention = currentPage * interventionsPerPage;
  const indexOfFirstIntervention = indexOfLastIntervention - interventionsPerPage;
  const currentInterventions = interventions.slice(indexOfFirstIntervention, indexOfLastIntervention);

  const paginate = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <h1>Interventions</h1>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="Interventions table">
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Date de création</TableCell>
                <TableCell>Date de début</TableCell>
                <TableCell>Date de fin</TableCell>
                <TableCell>État</TableCell>
                <TableCell>Conversations</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentInterventions.map((intervention) => (
                <TableRow key={intervention.id}>
                  <TableCell>{intervention.description}</TableCell>
                  <TableCell>{intervention.date_creation}</TableCell>
                  <TableCell>{intervention.date_debut}</TableCell>
                  <TableCell>{intervention.date_fin}</TableCell>
                  <TableCell>{intervention.etat}</TableCell>
                  <TableCell>
                    {/* Render a Link to ConversationMessages component with conversation ID */}
                    {intervention.conversation && intervention.conversation.id ? (
                      <Link to={`/conversation/${intervention.conversation.id}/citoyen/${localStorage.getItem('userId')}`}>
                        <ChatBubbleOutlineOutlinedIcon />
                        {intervention.conversation.title}
                      </Link>
                    ) : (
                      'pas de conversation '
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
          count={Math.ceil(interventions.length / interventionsPerPage)}
          page={currentPage}
          onChange={paginate}
          variant="outlined"
          
        />
      </div>
    </div>
  );
};

export default Citoyenpage;
