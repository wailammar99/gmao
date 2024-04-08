import React, { useEffect, useState } from "react";
import Sidebar from './techniciendesign/sidebar/sidebar';
import Navbar from './techniciendesign/navbar/navbar';
import { Calendar, momentLocalizer } from "react-big-calendar";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const localizer = momentLocalizer(moment);

const Calendertechncien = () => {
  const [interventions, setInterventions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedIntervention, setSelectedIntervention] = useState(null);
  const [equipments, setEquipments] = useState([]);

  useEffect(() => {
    fetchInterventions();
    fetchEquipmentData();
  }, []);

  const fetchInterventions = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        console.log("Token or userId not found. Redirecting to login...");
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/liste_intervetion_technicien/${userId}/`,{
        method:"GET",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        const formattedInterventions = data.map(intervention => ({
          id: intervention.id,
          title: intervention.description, // Use description as title
          start: new Date(intervention.date_debut),
          end: new Date(intervention.date_fin),
          interventionData: intervention, // Store the entire intervention data in the event object
          equipements: intervention.equipements || [] // Ensure equipements is an array
        }));
        setInterventions(formattedInterventions);
      } else {
        console.error("Failed to fetch interventions:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching interventions:", error);
    }
  };

  const handleEventClick = (event) => {
    setSelectedIntervention(event.interventionData);
    handleOpenDialog();
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const fetchEquipmentData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/liste_equipment/');
      if (response.ok) {
        const equipmentData = await response.json();
        setEquipments(equipmentData);
      } else {
        console.error('Failed to fetch equipment data');
      }
    } catch (error) {
      console.error('Error fetching equipment data:', error);
    }
  };

  const eventStyleGetter = (event) => {
    // Define colors based on event states
    let backgroundColor;
    switch (event.interventionData.etat) {
     
      case 'En attente':
        backgroundColor = 'red';
        break;
      case 'En cours':
        backgroundColor = 'blue';
        break;
      case 'Assigné':
        backgroundColor = 'green';
        break;
      case 'Terminé':
        backgroundColor = 'purple';
        break;
      case 'Annulé':
        backgroundColor = 'red';
        break;
      case 'Clôture':
        backgroundColor = 'gray';
        break;
      default:
        backgroundColor = 'gray';
    }

    return {
      style: {
        backgroundColor: backgroundColor,
      },
    };
  };

  return (
    <div>
      <div className="list">
        <Sidebar />
        <div className="listContainer">
          <Navbar />
          <Calendar
            localizer={localizer}
            events={interventions}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            onSelectEvent={handleEventClick}
            eventPropGetter={eventStyleGetter} // Set event style based on state
          />
        </div>
      </div>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Intervention Details</DialogTitle>
        <DialogContent>
          {selectedIntervention && (
            <div>
              <p>ID: {selectedIntervention.id}</p>
              <p>Description: {selectedIntervention.description}</p>
              
              <p>citoyen :{selectedIntervention.citoyen ? selectedIntervention.citoyen.email : "no citoyen"}</p>
              <p>date_creation :{selectedIntervention.date_creation ? selectedIntervention.date_creation : ""}</p>
              <p>Équipements :
                <ul>
                  {selectedIntervention.equipements && selectedIntervention.equipements.map((equipementId) => {
                    const equipment = equipments.find(equip => equip.id === equipementId);
                    return (
                      <li key={equipment.id}>
                        {equipment ? equipment.nom : 'Unknown equipment'}
                      </li>
                    );
                  })}
                </ul>
              </p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Calendertechncien;
