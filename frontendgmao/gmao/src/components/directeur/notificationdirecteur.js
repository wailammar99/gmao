import React, { useState, useEffect } from 'react';
import { Button, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Navbar from './directeurdesi/Navbar/navbardic';
import Sidebar from './directeurdesi/Sidebar/Sidebardic';
import PopupMessage from '../message';
import { Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { Tooltip, IconButton } from '@mui/material';

const Notificationdirecteur = () => {
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [usersPerPage] = useState(5);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupColor, setPopupColor] = useState('');
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const navigate = useNavigate("");

  useEffect(() => {
    if (token && role === "directeur") {
      fetchNotifications(currentPage);
    } else {
      navigate("/login");
    }
  }, [currentPage]);

  const fetchNotifications = async (page) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api_liste_notifcation/${localStorage.getItem('userId')}/?page=${page}&page_size=${usersPerPage}`, {
        method: 'GET'
      });
      if (response.ok) {
        const data = await response.json();
        if (data.notifications && data.pages) {
          setNotifications(data.notifications);
          setTotalPages(data.pages);
        } else {
          setNotifications([]);
          setTotalPages(1);
        }
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
        method: 'DELETE'
      });
      if (response.ok) {
        setPopupMessage('Notification supprimée avec succès');
        setPopupColor('success');
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
        }, 1500);
        fetchNotifications(currentPage);
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

  const paginate = (event, pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'message', headerName: 'Message', width: 200 },
    { field: 'created_at', headerName: 'date de creation', width: 600 },
    {
      field: 'action',
      headerName: 'Action',
      width: 200,
      renderCell: (params) => (
        <Tooltip title="supprimé" arrow>
          <IconButton onClick={() => deleteNotification(params.row.id)} color="error">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

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
            hideFooterPagination={true}
            hideFooter={true}
            hideFooterSelectedRowCount={true}
          />
        </div>
        {notifications && notifications.length > 0 && (
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={paginate}
          />
        )}
      </div>
    </div>
  );
};

export default Notificationdirecteur;
