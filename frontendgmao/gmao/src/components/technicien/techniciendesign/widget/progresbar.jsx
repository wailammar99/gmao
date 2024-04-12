import React, { useEffect, useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import { format, differenceInDays } from 'date-fns';

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
    <nav>
      {interventionData.map(intervention => (
        <div key={intervention.id} style={{ marginBottom: '10px' }}>
          <p>Intervention ID: {intervention.id}</p>
          <p>Start Date: {format(new Date(intervention.date_debut), 'MM/dd/yyyy')}</p>
          <p>End Date: {format(new Date(intervention.date_fin), 'MM/dd/yyyy')}</p>
          <p style={{ color: calculateRemainingDays(intervention.date_fin) <= 2 ? 'red' : 'inherit' }}>
            Remaining Days: {calculateRemainingDays(intervention.date_fin)}
          </p>
          <LinearProgress
            variant="determinate"
            value={calculateProgress(intervention.date_debut, intervention.date_fin)}
            sx={{
              '& .MuiLinearProgress-bar': {
                backgroundColor: calculateRemainingDays(intervention.date_fin) <= 2 ? 'red' : 'rgba(0, 0, 0, 0.54)'
              }
            }}
          />
        </div>
      ))}
    </nav>
  );
};

const calculateProgress = (startDate, endDate) => {
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

export default NavigationBar;
