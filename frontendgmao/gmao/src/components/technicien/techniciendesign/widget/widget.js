import React, { useEffect, useState } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { Link } from "react-router-dom";

const Widget = ({ type }) => {
  const [interventionData, setInterventionData] = useState([]);

  useEffect(() => {
    fetchInterventionData();
  }, []); // Fetch data only once when the component mounts

  const fetchInterventionData = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        console.log("Token or userId not found. Redirecting to login...");
        return;
      }

      const response = await fetch(
        `http://127.0.0.1:8000/liste_intervetion_technicien/${userId}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
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
      title = "enattend";
      count = countenatte;
      break;
      case "Assigné":
      title = "Assigné";
      count = countassigne;
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{title}</span>
        <Link to="/technicienpage"style={{ textDecoration: "none" }} >
        <span className="link">See all interventions</span>
        </Link>
       
      </div>
      <div className="right">
        <h1>{count}</h1>
        <div className="percentage positive">
      
        </div>
        
      </div>
    </div>
  );
};

export default Widget;
