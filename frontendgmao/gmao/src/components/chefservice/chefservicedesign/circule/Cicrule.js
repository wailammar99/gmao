import React, { useState, useEffect } from 'react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts';
import "./circule.scss";

const PieChartComponent = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [encour, setEncour] = useState(0);
  const [termine, setTermine] = useState(0);
  const [cloture, setCloture] = useState(0);
  const [assigne, setAssigne] = useState(0);
  const [nouveau, setNouveau] = useState(0);
  const [enAttente, setEnAttente] = useState(0);
  const [annule, setAnnule] = useState(0);
  const token=localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api_intervetion_chefservice/${localStorage.getItem('userId')}/`,
      {
        method:"GET",
        headers: {
          Authorization: `Token ${token}`, // Include the token in the request headers
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();

      let enCoursCount = 0;
      let termineCount = 0;
      let clotureCount = 0;
      let assigneCount = 0;
      let nouveauCount = 0;
      let enAttenteCount = 0;
      let annuleCount = 0;

      const dataLength = data.length;
      
      data.forEach(intervention => {
        switch (intervention.etat) {
          case "En cours":
            enCoursCount++;
            break;
          case "Terminé":
            termineCount++;
            break;
          case "Clôture":
            clotureCount++;
            break;
          case "Assigné":
            assigneCount++;
            break;
          case "Nouveau":
            nouveauCount++;
            break;
          case "En attente":
            enAttenteCount++;
            break;
          case "Annulé":
            annuleCount++;
            break;
          default:
            break;
        }
      });

      setEncour(enCoursCount);
      setTermine(termineCount);
      setCloture(clotureCount);
      setAssigne(assigneCount);
      setNouveau(nouveauCount);
      setEnAttente(enAttenteCount);
      setAnnule(annuleCount);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const total = encour + termine + cloture + assigne + nouveau + enAttente + annule;
  const data = [
    { id: 0, value: encour, label: "En cours", legendItemText: "En cours" },
    { id: 1, value: termine, label: "Terminé", legendItemText: "Terminé" },
    { id: 2, value: cloture, label: "Clôture", legendItemText: "Clôture" },
    { id: 3, value: assigne, label: "Assigné", legendItemText: "Assigné" },
    { id: 4, value: nouveau, label: "Nouveau", legendItemText: "Nouveau" },
    { id: 5, value: enAttente, label: "En attente", legendItemText: "En attente" },
    { id: 6, value: annule, label: "Annulé", legendItemText: "Annulé" },
  ];

  return (
    <div className='chart'>
      <div className='top'>
        <h1 className='title'>Percentage of interventions</h1>
        <PieChart
          series={[
            {
              data,
              arcLabel: (item) => `${Math.round((item.value / total) * 100)}%`,
              arcLabelMinAngle: 10, // Adjust minimum angle for label visibility
              highlightScope: { faded: 'global', highlighted: 'item' },
              faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
            },
          ]}
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fill: 'white',
              fontWeight: 'bold',
            },
          }}
          height={250}
        />
      </div>
    </div>
  );
}

export default PieChartComponent;
