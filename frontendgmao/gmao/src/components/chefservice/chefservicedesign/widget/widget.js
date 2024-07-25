import React, { useEffect, useState } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

const Widget = ({ type }) => {
  const [interventionData, setInterventionData] = useState([]);
  const token=localStorage.getItem("token");

  useEffect(() => {
    fetchInterventionData();
  }, [token]); // Fetch data only once when the component mounts

  const fetchInterventionData = async () => {
    try {
    
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        console.log("Token or userId not found. Redirecting to login...");
        return;
      }

      const response = await fetch(
        `http://127.0.0.1:8000/enterprise/${localStorage.getItem("enterprise_id")}/chefservice/${localStorage.getItem('userId')}/interventions`,
        {
          method: "GET",
          headers: {
          
            Authorization: `TOKEN ${token}`,
          },
        }
      );

      if (response.ok) {
        const resoposnedata = await response.json();
        const data=resoposnedata.data;
        setInterventionData(data);
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
  const getCountByStatus = (status) => {
    return interventionData.filter(intervention => intervention.etat === status).length;
  };

  // Define counts for each status
  const countInProgress = getCountByStatus("En cours");
  const countCompleted = getCountByStatus("Terminé");
  const countenatte=getCountByStatus("En attente");
  const countassigne=getCountByStatus("Assigné");
  const countcluture=getCountByStatus("Clôture");
  const counteAnnulie=getCountByStatus("Annulé");
  const countnouveux=getCountByStatus("Nouveau");

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
      title = "Interventions enattend";
      count = countenatte;
      break;
      case "Assigné":
      title = "Interventions Assigné";
      count = countassigne;
      break;
      case "Clôture":
      title = "Interventions Clôture";
      count = countcluture;
      break;
      case "Annulé":
        title = "Interventions Annulé";
        count = counteAnnulie;
        break;
        case "Nouveau":
          title = "Interventions Nouveau";
          count = countnouveux;
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
