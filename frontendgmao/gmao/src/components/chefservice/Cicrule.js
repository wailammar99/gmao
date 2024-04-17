import React, { useState, useEffect } from 'react';
import { PieChart } from '@mui/x-charts';

const PieChartComponent = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [encour, setencour] = useState(0);
  const[termine,setterminer]=useState(0);
  const[Cloture,setCloture]=useState(0);
  const[assige,setassigne]=useState(0);
  const[nouveux,setnouveux]=useState(0);
  const[enattend,setattend]=useState(0);

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
      let t=0 ;
      let c=0;
      let a =0 ;
      let n=0;
      let att=0;
      const dataLength = data.length;
      console.log("total:",dataLength)
      data.forEach(intervention => {
        if (intervention.etat === "En cours") {
          en++;
        }
        if (intervention.etat=== "Terminé" )
        {
          t++;
        }
        if (intervention.etat=== "Clôture" )
        {
          c++;
        }
        if (intervention.etat=== "Assigné" )
        {
          a++;
        }
        if (intervention.etat==="Nouveau")
        {
          n++;
        } 
       if (intervention.etat==="En attente")
       {
        att++;
       }
      });
      en=(en*100)/dataLength;
      t=(t*100)/dataLength;
    
      att=(att*100)/dataLength;
      n=(n*100)/dataLength;
      setencour(en);
      setterminer(t);
      setCloture(c);
      setassigne(a);
      setnouveux(n);
      setattend(att);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const data = [
    { id: 0, value: encour},
    { id: 1, value: termine },
    { id: 2, value: assige},
    { id: 3, value: Cloture },
    { id: 4, value: nouveux },
    { id: 5, value: enattend },
    

    

  ];

  return (
    <PieChart
      series={[
        {
          data,
          highlightScope: { faded: 'global', highlighted: 'item' },
          faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
        },
      ]}
      height={200}
    />
  );
}

export default PieChartComponent;
