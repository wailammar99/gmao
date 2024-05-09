import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './cityoendesign/sidebar/sidebar';
import Navbar from './cityoendesign/navbar/navbar';
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import { DataGrid } from '@mui/x-data-grid'; // Import DataGrid
import { ButtonGroup, Button } from '@mui/material';
import Pagination from '@mui/material/Pagination';

const Citoyenpage = () => {
  const [interventions, setInterventions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const interventionsPerPage = 5; // Number of interventions per page

  useEffect(() => {
    fetchData();
  }, [currentPage]); // Fetch data when the currentPage changes

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("Token not found. Redirecting to login...");
        // Redirect to login page or handle unauthorized access
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/api_intervetion_citoyen/${localStorage.getItem('userId')}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data); // Log the response data to see its structure
        setInterventions(data.interventions || []); // Ensure interventions is initialized as an empty array if data.interventions is undefined
      } else {
        console.error('Failed to fetch interventions');
      }
    } catch (error) {
      console.error('Error fetching interventions:', error);
    }
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  // Calculate total number of pages
  const totalPages = Math.ceil(interventions.length / interventionsPerPage);

  // Get current interventions for the current page
  const indexOfLastIntervention = currentPage * interventionsPerPage;
  const indexOfFirstIntervention = indexOfLastIntervention - interventionsPerPage;
  const currentInterventions = interventions.slice(indexOfFirstIntervention, indexOfLastIntervention);

  // Columns for DataGrid
  const columns = [
    { field: 'description', headerName: 'Description', width: 200 },
    { field: 'date_creation', headerName: 'Date de création', width: 150 },
    { field: 'date_debut', headerName: 'Date de début', width: 150 },
    { field: 'date_fin', headerName: 'Date de fin', width: 150 },
    { field: 'etat', headerName: 'État', width: 120 },
    {
      field: 'conversation',
      headerName: 'Conversations',
      width: 180,
      renderCell: (params) => (
        params.row.conversation && params.row.conversation.id ? (
          <Link to={`/conversation/${params.row.conversation.id}/citoyen/${localStorage.getItem('userId')}`}>
            <ChatBubbleOutlineOutlinedIcon />
            {params.row.conversation.title}
          </Link>
        ) : (
          'pas de conversation'
        )
      ),
    },
  ];

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <h1>Interventions</h1>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={currentInterventions}
            columns={columns}
            pageSize={interventionsPerPage}
            hideFooter={true}
            hideFooterPagination={true}
            hideFooterSelectedRowCount={true}
          />
        </div>
        <div className="pagination">
          <ButtonGroup color="primary" aria-label="outlined primary button group" >
            <Pagination 
              count={totalPages} 
              page={currentPage} 
              onChange={handlePageChange} 
            />
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
};

export default Citoyenpage;
