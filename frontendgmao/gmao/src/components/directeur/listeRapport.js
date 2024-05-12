import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Navbar from './directeurdesi/Navbar/navbardic';
import Sidebar from './directeurdesi/Sidebar/Sidebardic';




const Listerapport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/allrapport/');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        setData(jsonData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const generatePDF = async (rapportId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/generate/rapport/${rapportId}/`);
      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }
      // Convert response to blob
      const pdfBlob = await response.blob();
      // Create URL for the blob
      const pdfUrl = URL.createObjectURL(pdfBlob);
      // Open the PDF in a new tab
      window.open(pdfUrl);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 150 },
    { field: 'date_rapport', headerName: 'date de creation', width: 150 },
    { field: 'date_debut', headerName: 'date debut ', width: 150 },
    { field: 'date_fin', headerName: 'date debut ', width: 150 },
    {
        field: 'actions',
        headerName: 'Actions',
        width: 150,
        renderCell: (params) => (
          <button onClick={() => generatePDF(params.row.id)} variant="outlined">generate pdf </button>
        ),
      }

    
   
    // Add more columns as needed
  ];

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
    <div style={{ height: 400, width: '100%' }}>
      <h2>Liste Rapport </h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <DataGrid
          rows={data}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          checkboxSelection
          disableSelectionOnClick
        />
      )}
    </div>
    </div>
    </div>
  );
};

export default Listerapport;
