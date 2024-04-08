import React, { useState, useEffect } from 'react';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Sidebar from './directeurdesi/Sidebar/Sidebardic';
import Navbar from './directeurdesi/Navbar/navbardic';
import { Link } from 'react-router-dom';

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
    <div className="list">
      <Sidebar/>
      <div className="listContainer">
        <Navbar/>
        <div className="top">
          <h1>Les interventions</h1>
        </div>
        <div className="botom">
          <TableContainer component={Paper} className="table">
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className="tableCell">Date de création</TableCell>
                  <TableCell className="tableCell">Date de début</TableCell>
                  <TableCell className="tableCell">Date de fin</TableCell>
                  <TableCell className="tableCell">État</TableCell>
                  <TableCell className="tableCell">Citoyen</TableCell>
                  <TableCell className="tableCell">Service</TableCell>
                  <TableCell className="tableCell">Technicien</TableCell>
                  <TableCell className="tableCell">Conversation</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {interventionData.map((intervention) => (
                  <TableRow key={intervention.id}>
                    <TableCell className="tableCell">{intervention.date_creation}</TableCell>
                    <TableCell className="tableCell">{intervention.date_debut}</TableCell>
                    <TableCell className="tableCell">{intervention.date_fin}</TableCell>
                    <TableCell className="tableCell">{intervention.etat}</TableCell>
                    <TableCell className="tableCell">{intervention.citoyen ? intervention.citoyen.email : 'unknow'}</TableCell>
                    <TableCell className="tableCell">{intervention.service ? intervention.service.nom : 'unknow'}</TableCell>
                    <TableCell className="tableCell">{intervention.technicien}</TableCell>
                    <TableCell className="tableCell">
                      {/* Render a link to ConversationMessages component */}
                      {intervention.conversation && intervention.conversation.id ? (
                        <Link to={`/conversation/${intervention.conversation.id}/citoyen/${localStorage.getItem('userId')}`}>
                    {intervention.conversation.title}
                  </Link>
                        
                      ) : (
                        'no conversation'
                      )}
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

export default Intervention;
