import React, { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts';
import "./bar.scss";

const chartSetting = {
  yAxis: [
    {
      label: 'Nombre d\'interventions',
    },
  ],
  width: 1000,
  height: 500,
  sx: {
    [`.${axisClasses.left} .${axisClasses.label}`]: {
      transform: 'translate(-20px, 0)',
    },
  },
};

const BarsDataset = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interventionsParMois, setInterventionsParMois] = useState({});
  const token =localStorage.getItem("token");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/enterprise/${localStorage.getItem("enterprise_id")}/chefservice/${localStorage.getItem('userId')}/interventions`,
        {
          method:"GET",
          headers: {
            Authorization: `Token ${token}`, // Include the token in the request headers
          },

        });
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const resposedata = await response.json();
        const data=resposedata.data
        // Créer un objet pour stocker les interventions par mois et par état
        const interventionsParMois = {};

        data.forEach(intervention => {
          const dateDebut = new Date(intervention.date_debut);
          const mois = dateDebut.toLocaleString('default', { month: 'short' }); // Obtenez le nom abrégé du mois
          const etat = intervention.etat.toLowerCase();

          // Ajouter l'intervention au mois correspondant et incrémenter le nombre d'interventions pour cet état
          interventionsParMois[mois] = {
            ...interventionsParMois[mois],
            [etat]: (interventionsParMois[mois]?.[etat] || 0) + 1,
          };
        });

        setInterventionsParMois(interventionsParMois);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Créer le dataset pour le BarChart
  const dataset = Object.entries(interventionsParMois).map(([mois, interventions]) => ({
    month: mois, // Nom du mois
    ...interventions, // Nombre d'interventions pour chaque état
  }));

  const valueFormatter = (value) => `${value}`;

  return (
    <BarChart
      dataset={dataset}
      xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
      series={[
        { dataKey: 'encour', valueFormatter, label: 'En cours' },
        { dataKey: 'terminé', valueFormatter, label: 'Terminé' },
        { dataKey: 'clôture', valueFormatter, label: 'Clôture' },
        { dataKey: 'assigné', valueFormatter, label: 'Assigné' },
        { dataKey: 'nouveau', valueFormatter, label: 'Nouveau' },
        { dataKey: 'en attente', valueFormatter, label: 'En attente' },
      ]}
      {...chartSetting}
    />
  );
};

export default BarsDataset;
