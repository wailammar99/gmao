import React, { useState, useEffect } from 'react';
import { Button, TableCell, TableContainer, Paper, Table, TableHead, TableRow, TableBody } from '@mui/material';
import Navbar from './directeurdesi/Navbar/navbardic';
import Sidebar from './directeurdesi/Sidebar/Sidebardic';
import PopupMessage from '../message';
import { Pagination } from '@mui/material';

const Notificationdirecteur = () => {
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupColor, setPopupColor] = useState('');

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
        setPopupMessage('Notification supprimée avec succès');

        setPopupColor('success');
        setShowPopup(true);
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

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <h1>Notifications</h1>
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
        <Pagination count={Math.ceil(notifications.length / usersPerPage)} page={currentPage} onChange={paginate} />
      </div>
    </div>
  );
};

export default Notificationdirecteur;
