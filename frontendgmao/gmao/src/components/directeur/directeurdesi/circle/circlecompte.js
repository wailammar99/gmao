import React, { useState, useEffect } from 'react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts';

const Circlecompte = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [admin, setAdmin] = useState(0);
  const [citoyen, setCitoyen] = useState(0);
  const [chefService, setChefService] = useState(0);
  const [technicien, setTechnicien] = useState(0);
  const en_id=localStorage.getItem("enterprise_id")
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/enterprise/${en_id}/users`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      let admins = 0;
      let chefServices = 0;
      let citoyens = 0;
      let techniciens = 0;

      data.forEach(c => {
        if (c.is_admin) {
          admins++;
        }
        if (c.is_technicien) {
          techniciens++;
        }
        if (c.is_citoyen) {
          citoyens++;
        }
        if (c.is_chefservice) {
          chefServices++;
        }
      });

      setAdmin(admins);
      setCitoyen(citoyens);
      setChefService(chefServices);
      setTechnicien(techniciens);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const data = [
    { id: 1, value: chefService, label: "chefservice" },
    { id: 2, value: technicien, label: "technicien" },
    { id: 3, value: citoyen, label: "citoyen" },
  ];

  return (
    <div className='chart'>
      <div className='top'>
        <h1 className='title'>Nombre d'employés par catégorie</h1>
        <PieChart
          series={[
            {
              arcLabel: (item) => ` ${Math.round(item.value / data.reduce((acc, curr) => acc + curr.value, 0) * 100)}%`,
              arcLabelMinAngle: 45,
              data,
              highlightScope: { faded: 'global', highlighted: 'item' },
              faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
              animation: true, // Enable animation
            },
          ]}
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fill: 'white', // Set the color to black
              fontWeight: 'bold',
            },
          }}
          height={200}
        />
      </div>
    </div>
  );
}

export default Circlecompte;
