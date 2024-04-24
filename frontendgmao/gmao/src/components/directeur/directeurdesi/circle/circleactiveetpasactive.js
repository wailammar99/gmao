import React, { useState, useEffect } from 'react';
import { PieChart } from '@mui/x-charts';
import "./circulecompte.scss" ;

const Circleactivenoactive = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [admin, setamdin] = useState(0);
  const[active,setactive]=useState(0);
  const[noactive,setnoactive]=useState(0);

 

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/listecustomer/');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
    
   let active =0 ;
   let noactive =0;
     
     
      const dataLength = data.length;
      console.log("total:",dataLength)
      data.forEach(c => {
        if (c.is_active ==true) {
          active++;
        }
       else 
       {
        noactive ++ ;
       }
       
      });
    
     setactive(active);
     setnoactive(noactive);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const data = [
    { id: 0, value: active,label:"active" },
    { id: 1, value: noactive ,label:"noactive"},
 
   
    

    

  ];

  return (
    <div className='chart'>

    <div className='top'>
    <h1 className='title'>les nombre de compte active et noactive   </h1>
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
    </div>
    </div>
  );
}

export default Circleactivenoactive;
