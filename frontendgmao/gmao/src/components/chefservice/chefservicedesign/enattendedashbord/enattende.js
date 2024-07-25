import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Button, Typography } from '@mui/material';

const Enattendecom = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const token=localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const userId = localStorage.getItem('userId');

        const response = await fetch(`http://127.0.0.1:8000/enterprise/${localStorage.getItem("enterprise_id")}/chefservice/${localStorage.getItem('userId')}/interventions`, {
          method: 'GET',
          headers: {
            Authorization: `Token ${token}`, // Include the token in the request headers
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const responseData = await response.json();
        const data=responseData.data ;

        const filteredData = data.filter(intervention => intervention.etat === "En attente");

        setData(filteredData);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const columns = [
    
    { field: 'raison', headerName: 'Raison', width: 600, renderCell: (params) => <Button style={{ color: 'red' }}>{params.value.description}</Button> },
    
   
  ];

  return (
    <div>
      <Typography variant="h5" gutterBottom style={{ marginLeft: '10px' }}>Interventions en attente</Typography>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={data}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          autoHeight={true}
        />
      </div>
    </div>
  );
};

export default Enattendecom;
