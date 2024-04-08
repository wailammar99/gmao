import React, { useEffect, useState } from 'react';
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const NotificationPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error("User ID not found in local storage");
      }
      
      const response = await fetch(`http://127.0.0.1:8000/api_liste_notification_unread/${userId}/`, {
        method: "GET"
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markNotificationsAsRead = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error("User ID not found in local storage");
      }
      
      await fetch(`http://127.0.0.1:8000/api_notification_change/${userId}/`, {
        method: "PUT"
      });
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = async () => {
    await markNotificationsAsRead();
    setIsOpen(false);
   
    setNotifications([]); // Clear notifications after marking as read
  };

  return (
    <div className="notification-popup">
      <Button onClick={handleOpen}>
        <NotificationsNoneOutlinedIcon className="icon" />
        <span className="counter">{notifications.length}</span>
      </Button>
      <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Notifications</DialogTitle>
        <DialogContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Notification ID</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
         
          
            <TableBody>
  {notifications.map(notification => (
    <TableRow key={notification.id}>
      <TableCell>{notification.id}</TableCell>
      <TableCell>{notification.message}</TableCell>
    
    </TableRow>
  ))}
</TableBody>

             
            
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NotificationPopup;
