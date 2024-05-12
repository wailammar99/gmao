import React, { useState, useEffect } from 'react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts';

const Circleactivenoactive = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [active, setActive] = useState(0);
  const [noActive, setNoActive] = useState(0);
  
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

      let activeCount = 0;
      let noActiveCount = 0;

      // Assuming the response contains an array of objects with a property 'is_active'
      data.forEach(c => {
        if (c.is_active) {
          activeCount++;
        } else {
          noActiveCount++;
        }
      });

      setActive(activeCount);
      setNoActive(noActiveCount);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const total = active + noActive;

  const data = [
    { id: 0, value: active, label: `Active` },
    { id: 1, value: noActive, label: `Inactive` },
  ];

  return (
    <div className='chart'>
      <div className='top'>
        <h1 className='title'>Nombre de comptes actifs et inactifs</h1>
        <PieChart
          series={[
            {
              data,
              arcLabel: (item) => ` ${((item.value / total) * 100).toFixed(2)}%`,
              arcLabelMinAngle: 10, // Adjust minimum angle for label visibility
              highlightScope: { faded: 'global', highlighted: 'item' },
              faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
            }
          ]}
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fill: 'white',
              fontWeight: 'bold',
            },
          }}
          animation={true}
          height={200}
        />
      </div>
    </div>
  );
}

export default Circleactivenoactive;
