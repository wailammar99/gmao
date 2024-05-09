import React, { useEffect, useState } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import "./widget.scss";


const Widget = ({ type }) => {
  const [interventionData, setInterventionData] = useState([]);

  useEffect(() => {
    fetchInterventionData();
  }, []); // Fetch data only once when the component mounts

  const fetchInterventionData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("Token not found. Redirecting to login...");
        return;
      }

      const response = await fetch(
        `http://127.0.0.1:8000/api_intervetion_citoyen/${localStorage.getItem('userId')}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setInterventionData(data.interventions || []);
      } else {
        console.error(
          "Failed to fetch intervention data:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error fetching intervention data:", error);
    }
  };

  // Calculate counts for different statuses
 // Calculate counts for different statuses
const getCountByStatus = (status) => {
  // Check if interventionData is an array before filtering
  if (!Array.isArray(interventionData)) {
    return 0; // Return 0 if data is not an array
  }
  return interventionData.filter(intervention => intervention.etat === status).length;
};

  // Define counts for each status
  const countInProgress = getCountByStatus("En cours");
  const countCompleted = getCountByStatus("Terminé");
  const countEnAttente = getCountByStatus("En attente");
  const countAssigne = getCountByStatus("Assigné");
  const countCloture = getCountByStatus("Clôture");
  const countAnnule = getCountByStatus("Annulé");
  const countNouveau = getCountByStatus("Nouveau");


  let title;
  let count;

  // Set title and count based on the type
  switch (type) {
    case "encour":
      title = "Interventions en cours";
      count = countInProgress;
      break; 
    case "termine":
      title = "Interventions terminées";
      count = countCompleted;
      break;
    case "enattend":
      title = "Interventions en attente";
      count = countEnAttente;
      break;
    case "Assigné":
      title = "Interventions assignées";
      count = countAssigne;
      break;
    case "Clôture":
      title = "Interventions clôturées";
      count = countCloture;
      break;
    case "Annulé":
      title = "Interventions annulées";
      count = countAnnule;
      break;
    case "Nouveau":
      title = "Nouvelles interventions";
      count = countNouveau;
      break;
    default:
      title = "";
      count = 0;
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{title}</span>
        <span className="link">See all interventions</span>
      </div>
      <div className="right">
        <h1>{count}</h1>
      </div>
    </div>
  );
};

export default Widget;
