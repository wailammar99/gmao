import React, { useState, useEffect } from 'react';
import { PieChart } from '@mui/x-charts';
import "./char.scss";

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
      const response = await fetch(`http://127.0.0.1:8000/listecustomer/`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      let dir = 0;
      let chefs=0 ;
      let te=0;
      let cit =0 ;
    
      const dataLength = data.length;
      console.log("total:",dataLength)
      data.forEach(listecustomer => {
        if (listecustomer.is_directeur == true) {
            dir++;
        }
        if (listecustomer.is_chefservice== true)
        {
            chefs++;
        }
        if (listecustomer.is_technicien== true  )
        {
            te++;
        }
        if (listecustomer.is_citoyen== true )
        {
            cit++;
        }
       
      });
      dir=(dir*100)/dataLength;
      chefs=(chefs*100)/dataLength;
    
      te=(te*100)/dataLength;
      cit=(cit*100)/dataLength;
      setencour(dir);
      setterminer(chefs);
      setCloture(te);
      setassigne(cit);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const data = [
    { id: 0, value: encour , label :'directeur'},
    { id: 1, value: termine,label :'chef service' },
    { id: 2, value: assige,label :'technicien'},
    { id: 3, value: Cloture,label :'cityoen' },
   
    

    

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