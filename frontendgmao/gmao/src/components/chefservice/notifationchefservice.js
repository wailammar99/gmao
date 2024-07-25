import React, { useState, useEffect } from 'react';
import { Button, Paper, Tooltip, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Navbar from './chefservicedesign/navbar/navbar';
import Sidebar from './chefservicedesign/sidebar/sidebar';
import PopupMessage from '../message';
import { Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';

const NotificationPagechefservice = () => {
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [usersPerPage] = useState(5);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupColor, setPopupColor] = useState('');
  const token = localStorage.getItem('token');
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  useEffect(() => {
    if (token && role === "chefservice") {
      fetchNotifications(currentPage);
    } else {
      navigate("/login");
    }
  }, [currentPage, token, role]);

  const fetchNotifications = async (page) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api_notification_liste/${localStorage.getItem('userId')}/?page=${page}`, {
        method: 'GET',
        headers: {
          Authorization: `Token ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
        setTotalPages(data.total_pages);
      } else {
        console.error('Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api_delete_one_notification/${id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Token ${token}`
        }
      });
      if (response.ok) {
        setPopupMessage('Notification supprimée avec succès');
        setPopupColor('success');
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
        }, 1500);
        fetchNotifications(currentPage); // Refetch notifications after deletion
      } else {
        setPopupMessage('Failed to delete notification');
        setPopupColor('error');
        setShowPopup(true);
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      setPopupMessage('Error deleting notification');
      setPopupColor('error');
      setShowPopup(true);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'message', headerName: 'Message', width: 200 },
    { field: 'created_at', headerName: 'Date de Création', width: 200 },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => (
        <Tooltip title="Supprimer" arrow>
          <IconButton onClick={() => deleteNotification(params.row.id)} color="error">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const paginate = (event, pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <h1>Notifications</h1>
        {showPopup && <PopupMessage message={popupMessage} color={popupColor} />}
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={notifications}
            columns={columns}
            pageSize={usersPerPage}
            rowsPerPageOptions={[usersPerPage]}
            hideFooterPagination
            hideFooter
            hideFooterSelectedRowCount
          />
        </div>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={paginate}
          color="primary"
        />
      </div>
    </div>
  );
};

export default NotificationPagechefservice;
