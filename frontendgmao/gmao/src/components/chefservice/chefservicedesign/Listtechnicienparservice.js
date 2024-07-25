import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar/sidebar';
import Navbar from './navbar/navbar';
import { DataGrid } from '@mui/x-data-grid';
import Pagination from '@mui/material/Pagination';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Tooltip, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';


const Listtechnicien = () => {
  const [technicienData, setTechnicienData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTechnicien, setSelectedTechnicien] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetchData(currentPage);
    } else {
      navigate("/login");
    }
  }, [token, currentPage]);

  const fetchData = async (page) => {
    try {
      const userId = localStorage.getItem('userId');
      const enterpriseId = localStorage.getItem('enterprise_id');

      if (!userId || !token || !enterpriseId) {
        console.error('Required data not found in local storage');
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/enterprise/${enterpriseId}/chefservice/${userId}/techniciens?page=${page}`, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTechnicienData(data.data);
        setTotalPages(data.pages);
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

  const handleChangePage = (event, value) => {
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
              rows={technicienData}
              columns={columns}
              pageSize={10}
              checkboxSelection={false}
              disableSelectionOnClick
              autoHeight
            />
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handleChangePage}
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
