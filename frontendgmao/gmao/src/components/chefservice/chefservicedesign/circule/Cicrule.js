import React, { useState, useEffect } from 'react';
import { PieChart } from '@mui/x-charts';
import "./circule.scss" ;

const PieChartComponent = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [encour, setencour] = useState(0);
  const [termine, setterminer] = useState(0);
  const [Cloture, setCloture] = useState(0);
  const [assige, setassigne] = useState(0);
  const [nouveux, setnouveux] = useState(0);
  const [enattend, setattend] = useState(0);
  const [annuler, setannule] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api_intervetion_chefservice/${localStorage.getItem('userId')}/`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      let en = 0;
      let t = 0;
      let c = 0;
      let a = 0;
      let n = 0;
      let att = 0;
      let ann = 0;
      const dataLength = data.length;
      console.log("total:", dataLength)
      data.forEach(intervention => {
        switch (intervention.etat) {
          case "En cours":
            en++;
            break;
          case "Terminé":
            t++;
            break;
          case "Clôture":
            c++;
            break;
          case "Assigné":
            a++;
            break;
          case "Nouveau":
            n++;
            break;
          case "En attente":
            att++;
            break;
          case "Annulé":
            ann++;
            break;
          default:
            break;
        }
      });
      en = (en * 100) / dataLength;
      t = (t * 100) / dataLength;
      c = (c * 100) / dataLength;
      a = (a * 100) / dataLength;
      ann = (ann * 100) / dataLength;
      att = (att * 100) / dataLength;
      n = (n * 100) / dataLength;
      setencour(en);
      setterminer(t);
      setCloture(c);
      setassigne(a);
      setnouveux(n);
      setattend(att);
      setannule(ann);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const data = [
    { id: 0, value: encour, label: "En cour", legendItemText: "En cour" },
    { id: 1, value: termine, label: "Termine", legendItemText: "Termine" },
    { id: 2, value: assige, label: "Assigné", legendItemText: "Assigné" },
    { id: 3, value: Cloture, label: "Clorute", legendItemText: "Clorute" },
    { id: 4, value: nouveux, label: "Nouveux", legendItemText: "Nouveux" },
    { id: 5, value: enattend, label: "En attend ", legendItemText: "En attend" },
    { id: 6, value: annuler, label: "Annuler ", legendItemText: "Annuler" },
  ];

  return (
    <div className='chart'>
      <div className='top'>
        <h1 className='title'>Percentage of interventions</h1>
        <PieChart
          series={[
            {
              data,
              highlightScope: { faded: 'global', highlighted: 'item' },
              faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
            },
          ]}
          height={250}
        />
      </div>
    </div>
  );
}

export default PieChartComponent;
