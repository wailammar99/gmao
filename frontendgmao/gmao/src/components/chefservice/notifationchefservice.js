import React, { useState, useEffect } from 'react';
import { Button, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Navbar from './chefservicedesign/navbar/navbar';
import Sidebar from './chefservicedesign/sidebar/sidebar';
import PopupMessage from '../message';
import { Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotificationPagechefservice = () => {
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupColor, setPopupColor] = useState('');
  const token = localStorage.getItem('token');
  const role=localStorage.getItem("role");

 const Navigate=useNavigate();
  useEffect(() => {
    if (token && role ==="chefservice")
      {
        fetchNotifications();

      }
      else 
      {
        Navigate("/login");
      }
    
  }, [currentPage,token,role]); // Fetch notifications whenever currentPage changes

  const fetchNotifications = async () => {
    try {
    
      const response = await fetch(`http://127.0.0.1:8000/api_liste_notifcation/${localStorage.getItem('userId')}/`, {
        method: 'GET',
        headers:
        {
          Authorization: `Token ${token}`
        }
        
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
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
       
      });
      if (response.ok) {
        setPopupMessage('Notification supprimée avec succès');
        setPopupColor('success');
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
        }, 1500);
        fetchNotifications(); // Refetch notifications after deletion
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

  // Pagination logic
  const indexOfLastNotification = currentPage * usersPerPage;
  const indexOfFirstNotification = indexOfLastNotification - usersPerPage;
  const currentNotifications = notifications.slice(indexOfFirstNotification, indexOfLastNotification);

  // Change page
  const paginate = (event, pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'message', headerName: 'Message', width: 200},
    { field: 'created_at', headerName: 'date de creation', width: 600},

    {
      field: 'action',
      headerName: 'Action',
      width: 200,
      renderCell: (params) => (
        <Button variant="contained" color="secondary" onClick={() => deleteNotification(params.row.id)}>supprimée</Button>
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
            rows={currentNotifications}
            columns={columns}
            pageSize={usersPerPage}
            rowsPerPageOptions={[usersPerPage]}
            hideFooterPagination={true}
            
            hideFooter={true}
            hideFooterSelectedRowCount={true}
          />
        </div>
        <Pagination count={Math.ceil(notifications.length / usersPerPage)} page={currentPage} onChange={paginate} />
      </div>
    </div>
  );
};

export default NotificationPagechefservice;
