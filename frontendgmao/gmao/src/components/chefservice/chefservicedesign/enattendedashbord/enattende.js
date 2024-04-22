import React, { useState, useEffect } from 'react';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';

const Enattendecom = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const userId = localStorage.getItem('userId');

        const response = await fetch(`http://127.0.0.1:8000/api_intervetion_chefservice/${userId}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const responseData = await response.json();

        const filteredData = responseData.filter(intervention => intervention.etat === "En attente");

        setData(filteredData);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Raison</TableCell>
            <TableCell>Date de création</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((intervention, index) => (
            <TableRow key={index}>
              <TableCell >{intervention.id}</TableCell>
              <TableCell  style={{ color: 'red' }}>{intervention.raison.description}</TableCell>
              <TableCell>{intervention.raison.date_de_creation}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Enattendecom;
