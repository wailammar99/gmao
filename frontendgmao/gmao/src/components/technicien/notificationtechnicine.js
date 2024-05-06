
import React, { useState, useEffect } from 'react';
import { Button, TableCell, TableContainer, Paper, Table, TableHead, TableRow, TableBody } from '@mui/material';
import Navbar from './techniciendesign/navbar/navbar';
import Sidebar from './techniciendesign/sidebar/sidebar';
import PopupMessage from '../message';
import { Pagination } from '@mui/material';

const NotificationPageTechnicine = () => {
  const [notifications, setNotifications] = useState([]);
  const [showPopup, setShowPopup] = useState(false); // State to control showing/hiding the popup
  const [popupMessage, setPopupMessage] = useState(''); // State to hold the popup message
  const [popupColor, setPopupColor] = useState(''); // State to hold the popup color
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [notificationsPerPage] = useState(5); // Number of notifications per page

  useEffect(() => {
    fetchNotifications();
  }, [currentPage]); // Fetch notifications whenever currentPage changes

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/api_liste_notifcation/${localStorage.getItem('userId')}/`, {
        method: 'GET'
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
        method: 'DELETE'
      });
      if (response.ok) {
        // Show success message
        setPopupMessage('Notification supprimée avec succès');
        setPopupColor('success');
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
        }, 1500);
        // Fetch notifications again to update the list
        fetchNotifications();
      } else {
        // Show error message
        setPopupMessage('Failed to delete notification');
        setPopupColor('error');
        setShowPopup(true);
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      // Show error message
      setPopupMessage('Error deleting notification');
      setPopupColor('error');
      setShowPopup(true);
    }
  };

  // Pagination logic
  const indexOfLastNotification = currentPage * notificationsPerPage;
  const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
  const currentNotifications = notifications.slice(indexOfFirstNotification, indexOfLastNotification);

  // Change page
  const handlePageChange = (event, pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <h1>Notifications</h1>
        {/* Render PopupMessage if showPopup is true */}
        {showPopup && <PopupMessage message={popupMessage} color={popupColor} />}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentNotifications.map(notification => (
                <TableRow key={notification.id}>
                  <TableCell>{notification.id}</TableCell>
                  <TableCell>{notification.message}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="secondary" onClick={() => deleteNotification(notification.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination count={Math.ceil(notifications.length / notificationsPerPage)} page={currentPage} onChange={handlePageChange} />
      </div>
    </div>
  );
};

export default NotificationPageTechnicine;
