import React, { useEffect, useState } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import "./widgetdic.scss"; // Assuming you have some styles for the component

const Widget = ({ type }) => {
  const [interventionData, setInterventionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInterventionData();
  }, []); // Fetch data only once when the component mounts

  const fetchInterventionData = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const en_id = localStorage.getItem("enterprise_id");

      if (!token || !userId || !en_id) {
        console.log("Token, userId, or enterprise_id not found.");
        return;
      }

      const response = await fetch(
        `http://127.0.0.1:8000/enterprise/${en_id}/intervention/`,
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
        console.log("Fetched data:", data);
        setInterventionData(Array.isArray(data) ? data : []);
        setLoading(false);
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.error("Error fetching intervention data:", error);
      setError(error);
      setLoading(false);
    }
  };

  // Calculate counts for different statuses
  const getCountByStatus = (status) => {
    if (!Array.isArray(interventionData)) {
      return 0;
    }
    return interventionData.filter(intervention => intervention.etat === status).length;
  };

  // Define counts for each status
  const countInProgress = getCountByStatus("En cours");
  const countCompleted = getCountByStatus("Terminé");
  const countEnAttente = getCountByStatus("En attente");
  const countAssigne = getCountByStatus("Assigné");
  const countCloture = getCountByStatus("Clôture");
  const countNouveau = getCountByStatus("Nouveau");
  

  let title;
  let count;

  // Set title and count based on the type
  switch (type) {
    case "encour":
      title = "En cours";
      count = countInProgress;
      break;
    case "termine":
      title = "Terminées";
      count = countCompleted;
      break;
    case "enattend":
      title = "En attente";
      count = countEnAttente;
      break;
    case "Assigné":
      title = "Assigné";
      count = countAssigne;
      break;
    case "Clôture":
      title = "Clôture";
      count = countCloture;
      break;
    case "Nouveau":
      title = "Nouveau";
      count = countNouveau;
      break;
    default:
      title = "Unknown";
      count = 0;
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{title}</span>
        <span className="link">See all interventions</span>
      </div>
      <div className="right">
        <h1>{count}</h1>
        <KeyboardArrowUpIcon className="icon" />
        <PersonOutlinedIcon className="icon" />
      </div>
    </div>
  );
};

export default Widget;
