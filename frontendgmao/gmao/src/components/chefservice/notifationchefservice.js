import React, { useState, useEffect } from 'react';
import { Button, TableCell, TableContainer, Paper, Table, TableHead, TableRow, TableBody } from '@mui/material';
import Navbar from './chefservicedesign/navbar/navbar';
import Sidebar from './chefservicedesign/sidebar/sidebar';
import PopupMessage from '../message';
import Pagination from '@mui/material/Pagination';

const NotificationPagechefservice = () => {
  const [notifications, setNotifications] = useState([]);
  const [showPopup, setShowPopup] = useState(false); // State to control showing/hiding the popup
  const [popupMessage, setPopupMessage] = useState(''); // State to hold the popup message
  const [popupColor, setPopupColor] = useState(''); // State to hold the popup color
  const [currentPage, setCurrentPage] = useState(1);
  const [notificationsPerPage] = useState(5); // Set number of notifications per page
  const [selectedStatus, setSelectedStatus] = useState(null); // State to hold the selected status filter

  useEffect(() => {
    fetchNotifications();
  }, []); // Fetch notifications when the component mounts

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
        setPopupMessage('Notification est bien supprimé');
        setPopupColor('success');
        setShowPopup(true);

        // Automatically hide the popup after 3 seconds
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

  const paginate = (event, value) => {
    setCurrentPage(value);
  };

  // Calculate the index of the first and last notification for the current page
  const indexOfLastNotification = currentPage * notificationsPerPage;
  const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;

  // Filter notifications based on the selected status
  const filteredNotifications = selectedStatus ? notifications.filter(notification => notification.status === selectedStatus) : notifications;

  // Get the notifications for the current page
  const currentNotifications = filteredNotifications.slice(indexOfFirstNotification, indexOfLastNotification);

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
        <Pagination
          count={Math.ceil(filteredNotifications.length / notificationsPerPage)} // Calculate the total number of pages based on the filtered notifications
          page={currentPage}
          onChange={paginate}
        />
      </div>
    </div>
  );
};

export default NotificationPagechefservice;
