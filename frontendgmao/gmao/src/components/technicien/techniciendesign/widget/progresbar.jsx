import React, { useEffect, useState } from 'react';
import { CircularProgressbar } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import { format, differenceInDays } from 'date-fns';

import './progressbar.css'; 

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

  const calculateDurationProgress = (startDate, endDate) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = Date.now();

    const totalDuration = end - start;
    const elapsedDuration = now - start;

    return Math.min(100, (elapsedDuration / totalDuration) * 100);
  };

  const calculateRemainingDays = endDate => {
    const end = new Date(endDate);
    const today = new Date();
    const remainingDays = differenceInDays(end, today);

    return remainingDays > 0 ? remainingDays : 0;
  };

  const calculateInterventionDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationInDays = differenceInDays(end, start);

    return durationInDays > 0 ? durationInDays : 0;
  };

  return (
    <div className='intervention-container'>
      {interventionData.map((intervention) => (
        <div className="featured" key={intervention.id}>
          <div className="top">
            <h1 className="title">{intervention.id}</h1>
          </div>
          <div className="bottom">
            <div className="featuredChart">
              <CircularProgressbar value={intervention.etat} text={`${calculateInterventionDuration(intervention.date_debut, intervention.date_fin)} days`} strokeWidth={5} />
            </div>
            <div className="summary">
              <div className="item">
                <div className="itemTitle">etat</div>
                <div className="itemResult negative">
                  <div className="resultAmount">{intervention.etat}</div>
                </div>
              </div>
              <div className="item">
                <div className="itemTitle">date de debut</div>
                <div className="itemResult positive">
                  <div className="resultAmount">{intervention.date_debut}</div>
                </div>
              </div>
              <div className="item">
                <div className="itemTitle">date de fin</div>
                <div className="itemResult positive">
                 
                  <div className="resultAmount">{intervention.date_fin}</div>
                </div>
              </div>
              <div className="item">
             
                <div className="itemResult positive">
                
                  <div className="resultAmount">
                    
                  </div>
               
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NavigationBar;
