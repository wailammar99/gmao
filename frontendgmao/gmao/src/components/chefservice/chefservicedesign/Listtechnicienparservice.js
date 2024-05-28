import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar/sidebar';
import Navbar from './navbar/navbar';
import { DataGrid, GridAddIcon } from '@mui/x-data-grid';
import Pagination from '@mui/material/Pagination';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Tooltip, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add'

const Listtechnicien = () => {
  const [technicienData, setTechnicienData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [interventionsPerPage] = useState(7);
  const [selectedTechnicien, setSelectedTechnicien] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetchData();
    } else {
      navigate("/login");
    }
  }, [token]);

  const fetchData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      if (!userId || !token) {
        console.error('User ID or token not found in local storage');
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/api_liste_technicien_par_service/${userId}/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const techniciens = data.filter(user => user.is_technicien && user.is_active === true);
        const flattenedTechniciens = techniciens.map(user => ({
          ...user,
          service_nom: user.service ? user.service.nom : "he needs assigned service",
        }));
        setTechnicienData(flattenedTechniciens);
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleRowClick = (params) => {
    setSelectedTechnicien(params.row);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const columns = [
    { field: 'username', headerName: 'Username', width: 150 },
    { field: 'email', headerName: 'Email', width: 150 },
    { field: 'first_name', headerName: 'Nom', width: 150 },
    { field: 'last_name', headerName: 'Prenom', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Tooltip title="Voir plus" arrow>
          <IconButton onClick={() => handleRowClick(params)}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const indexOfLastIntervention = currentPage * interventionsPerPage;
  const indexOfFirstIntervention = indexOfLastIntervention - interventionsPerPage;
  const currentInterventions = technicienData.slice(indexOfFirstIntervention, indexOfLastIntervention);

  const paginate = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <div className="top">
          <h1>Les Techniciens</h1>
        </div>
        <div className="bottom">
          <div style={{ height: 500, width: '100%' }}>
            <DataGrid
              rows={currentInterventions}
              columns={columns}
              checkboxSelection={false}
              hideFooterPagination={true}
              autoHeight={true} // Remove scrollbar
            />
            <Pagination
              count={Math.ceil(technicienData.length / interventionsPerPage)}
              page={currentPage}
              onChange={paginate}
            />
          </div>
        </div>
      </div>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Technician Information</DialogTitle>
        <DialogContent>
          {selectedTechnicien && (
            <div>
              <p><strong>Username:</strong> {selectedTechnicien.username}</p>
              <p><strong>Email:</strong> {selectedTechnicien.email}</p>
              <p><strong>Nom:</strong> {selectedTechnicien.first_name}</p>
              
              <p><strong>Prenom:</strong> {selectedTechnicien.last_name}</p>
              <p><strong>Date de Naissance:</strong> {selectedTechnicien.date_de_naissance}</p>
              <p><strong>Service:</strong> {selectedTechnicien.service_nom}</p>
              <p><strong>Telephone:</strong> {selectedTechnicien.telephone}</p>
              <p><strong>Adresse:</strong> {selectedTechnicien.adresse}</p>
</div>
)}
</DialogContent>
<DialogActions>
<Button onClick={handleCloseDialog}>Fermer</Button>
</DialogActions>
</Dialog>
</div>
);
};

export default Listtechnicien;






