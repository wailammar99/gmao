import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Navbar from './directeurdesi/Navbar/navbardic';
import Sidebar from './directeurdesi/Sidebar/Sidebardic';
import { useNavigate } from 'react-router-dom';
import { Button, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Pagination } from '@mui/material';
import PopupMessage from '../message';

const Listerapport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5); // Number of users per page
  const [showMessage, setShowMessage] = useState(false); // State for controlling pop-up message
  const [messageContent, setMessageContent] = useState(""); // State for pop-up message content
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      
      if (!token || role !== 'directeur') {
        navigate('/login');
        return; // Return to avoid further execution of code
      }
      
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
  }, [navigate]);

  const generatePDF = async (rapportId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/generate/rapport/${rapportId}/`);
      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }
      const pdfBlob = await response.blob();
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const deleteRapport = async (rapportId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/delete/rapport/${rapportId}/`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete rapport');
      }
      setData(data.filter((rapport) => rapport.id !== rapportId));
      setMessageContent("Le rapport a été supprimé avec succès.");
      setShowMessage(true); // Show pop-up message
    } catch (error) {
      console.error('Error deleting rapport:', error);
    }
  };

  const handleCloseMessage = () => {
    setShowMessage(false);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 150 },
    { field: 'date_rapport', headerName: 'Date de création', width: 200 },
    { field: 'date_debut', headerName: 'Date de début', width: 200 },
    { field: 'date_fin', headerName: 'Date de fin', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <>
          <Button onClick={() => generatePDF(params.row.id)} variant="outlined">Générer PDF</Button>
          <Tooltip title="Supprimer">
            <IconButton onClick={() => deleteRapport(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    }
  ];

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = data.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <div style={{ height: 400, width: '100%' }}>
          <h2>Liste Rapport</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <DataGrid
                rows={currentUsers}
                columns={columns}
                pageSize={usersPerPage}
                rowsPerPageOptions={[5, 10, 20]}
                hideFooterPagination={true}
                hideFooter={true}
                disableSelectionOnClick
              />
              <Pagination
                count={Math.ceil(data.length / usersPerPage)}
                page={currentPage}
                onChange={paginate}
              />
            </>
          )}
        </div>
      </div>
      {showMessage && (
        <PopupMessage 
          message={messageContent} 
          color="success" 
          onClose={handleCloseMessage} 
        />
      )}
    </div>
  );
};

export default Listerapport;
