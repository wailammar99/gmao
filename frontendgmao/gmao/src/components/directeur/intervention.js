import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
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
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedIntervention, setSelectedIntervention] = useState(null);
  const [filterByState, setFilterByState] = useState(null);

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

  const handleOpenDialog = (intervention) => {
    setSelectedIntervention(intervention);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedIntervention(null);
    setOpenDialog(false);
  };

  const filterInterventionsByState = (state) => {
    setFilterByState(state);
  };

  const filteredInterventions = filterByState
    ? interventionData.filter(intervention => intervention.etat === filterByState)
    : interventionData;

  return (
    <div className="list">
      <Sidebar/>
      <div className="listContainer">
        <Navbar/>
        <div className="top">
          <h1>Les interventions</h1>
          <div>
            {/* Boutons pour filtrer par état */}
            {['Nouveau', 'En attente', 'En cours', 'Assigné', 'Terminé', 'Annulé', 'Clôture'].map(state => (
              <Button key={state} onClick={() => filterInterventionsByState(state)}>{state}</Button>
            ))}
          </div>
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
                  <TableCell className="tableCell">conversation</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredInterventions.map((intervention) => (
                  <TableRow key={intervention.id}>
                    <TableCell className="tableCell">{intervention.date_creation}</TableCell>
                    <TableCell className="tableCell">{intervention.date_debut}</TableCell>
                    <TableCell className="tableCell">{intervention.date_fin}</TableCell>
                    <TableCell className="tableCell">{intervention.etat}</TableCell>
                    <TableCell className="tableCell">
                      {intervention.conversation && intervention.conversation.id ? (
                        <Link to={`/conversation/${intervention.conversation.id}/citoyen/${localStorage.getItem('userId')}`}>
                          {intervention.conversation.title}
                        </Link>
                      ) : (
                        'no conversation'
                      )}
                    </TableCell>
                    <TableCell className="tableCell">
                      <Button className='btn btn-info' onClick={() => handleOpenDialog(intervention)} variant="outlined">Voir Plus</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      
      {/* Dialog to display more information */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Intervention Details</DialogTitle>
        <DialogContent>
          {selectedIntervention && (
            <>
              <p>description:{selectedIntervention.description} </p>
              <p>Date de création: {selectedIntervention.date_creation}</p>
              <p>Date de début: {selectedIntervention.date_debut}</p>
              <p>Date de fin: {selectedIntervention.date_fin}</p>
              <p>etat :{selectedIntervention.etat}</p>
              <p>service :{selectedIntervention.service.nom}</p>
              <p>technicien :{selectedIntervention.technicien? selectedIntervention.technicien :"le intervetion est pas assigne "}</p>
              <p>En attend :{selectedIntervention.raison ?selectedIntervention.raison.description:"le inetrvetion est pas en atteande "}</p>
              <p>citoyen: {selectedIntervention.citoyen?selectedIntervention.citoyen.email :"ya pas citoyen "}</p>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Intervention;
