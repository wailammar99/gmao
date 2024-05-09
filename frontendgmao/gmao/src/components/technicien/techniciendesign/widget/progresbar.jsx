import React, { useEffect, useState } from 'react';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CircularProgressbar } from "react-circular-progressbar";
import { format } from 'date-fns';
import 'react-circular-progressbar/dist/styles.css';
import './progressbar.css';
import { colors } from '@mui/material';
import { differenceInDays } from 'date-fns';


const NavigationBar = () => {
  const [interventionData, setInterventionData] = useState([]);

  useEffect(() => {
    fetchInterventionData();
  }, []);

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

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setInterventionData(data);
    } catch (error) {
      console.error('Error fetching intervention data:', error);
    }
  };

  return (
    <div className='intervention-container'>
      {interventionData.map((intervention) => (
        <div className="featured" key={intervention.id}>
          <div className="top">
            <h1 className="title">{intervention.id}</h1>
            <MoreVertIcon fontSize="small" />
          </div>
          <div className="bottom">
            <div className="featuredChart">
              <CircularProgressbar value={intervention.etat}  text={`${differenceInDays(new Date(intervention.date_fin), new Date(intervention.date_debut))} jours `}  strokeWidth={5} />
            </div>
            <div className="summary">
              <div className="item">
                <div className="date">
                  <span className="itemTitle"  >Date de début:</span> <br></br>
                  <span className="resultAmount" style={{ color: "green" }}>{format(new Date(intervention.date_debut), 'dd/MM/yyyy')} </span> 
                </div>
              </div>
              <div className="item">
                <div className="date">
                  <span className="itemTitle">Date de fin:</span> <br></br>
                  <span className="resultAmount" style={{ color: "red" }}>{format(new Date(intervention.date_fin), 'dd/MM/yyyy')}</span>

                </div>
              </div>
              {/* Add other data items similarly */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NavigationBar;
