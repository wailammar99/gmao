import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Widget = ({ type, userData }) => {
  const [Data, setData] = useState([]);

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
        'http://127.0.0.1:8000/listecustomer/',
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
        setData(data);
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

  // Calculate counts for different user types based on Data state
  const countTechnicien = Data ? Data.filter(user => user.is_technicien).length : 0;
  const countChefService = Data ? Data.filter(user => user.is_chefservice).length : 0;
  const countDirecteur = Data ? Data.filter(user => user.is_directeur).length : 0;
  const countCitoyen = Data ? Data.filter(user => user.is_citoyen).length : 0;

  let title;
  let count;

  // Set title and count based on the type
  switch (type) {  
    case "technicien":
      title = "Technicien";
      count = countTechnicien;
      break;
    case "chefservice":
      title = "Chef de service";
      count = countChefService;
      break;
    case "directeur":
      title = "Directeur";
      count = countDirecteur;
      break;
    case "citoyen":
      title = "Citoyen";
      count = countCitoyen;
      break;
    default:
      title = "";
      count = 0;
  }

  // Render your widget with appropriate title and count
  return (
    <div className="widget">
      <div className="left">
      <span className={`title ${title.toLowerCase()}`}>{title}</span>
        <span className="counter">{count}</span>
        <Link to="/UserListPage" style={{ textDecoration: "none" , color: "black" }} >
          <span className="link">Voir tous les service</span> 
        </Link>
      </div>
      <div className="right">
        <h1>{count}</h1>
      </div>
    </div>
  );
};

export default Widget;