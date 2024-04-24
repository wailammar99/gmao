import React, { useState, useEffect } from 'react';
import { PieChart } from '@mui/x-charts';
import "./circulecompte.scss" ;

const Circlecompte = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [admin, setamdin] = useState(0);
  const[citoyen,setcitoyen]=useState(0);
  const[chefservice,setchefservice]=useState(0);
  const[technicien,settechnicien]=useState(0);

 

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
      let tt = 0;
      let chefservice=0 ;
      let citoyen=0;
      let admin =0 ;
      let technicien=0;
     
      const dataLength = data.length;
      console.log("total:",dataLength)
      data.forEach(c => {
        if (c.is_admin ==true) {
          admin++;
        }
        if (c.is_technicien==true )
        {
          technicien++;
        }
        if (c.is_citoyen== true )
        {
          citoyen++;
        }
        if (c.is_chefservice==true )
        {
          chefservice++;
        }
       
      });
    
     setamdin(admin);
     setcitoyen(citoyen);
     setchefservice(chefservice);
     settechnicien(technicien);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const data = [
    { id: 0, value: admin,label:"admin"},
    { id: 1, value: chefservice ,label:"chefservice"},
    { id: 2, value: technicien,label:"techncien "},
    { id: 3, value: citoyen ,label:"citoyen"},
   
    

    

  ];

  return (
    <div className='chart'>

    <div className='top'>
    <h1 className='title'>les nombre de employer  </h1>
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

export default Circlecompte;
