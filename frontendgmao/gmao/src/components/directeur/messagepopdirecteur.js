import React, { useEffect, useState } from 'react';
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import { Link } from 'react-router-dom';

const MessagePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [interventions, setInterventions] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/intervention/');
      if (response.ok) {  
        const data = await response.json();
        const interventionsWithConversation = data.filter(intervention => intervention.conversation);
        setInterventions(interventionsWithConversation);
      } else {
        console.error('Failed to fetch intervention data');
      }
    } catch (error) {
      console.error('Error fetching intervention data:', error);
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
  };

  return (
    <div className="notification-popup">
      <Button onClick={handleOpen}>
        <ChatBubbleOutlineOutlinedIcon className="icon" />
        
      </Button>
      <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Les Conversations</DialogTitle>
        <DialogContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Intervention id</TableCell>
                <TableCell>Conversation Title</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {interventions.map((intervention) => (
                  <TableRow key={intervention.id}>
                    <TableCell>{intervention.id }</TableCell>
                    <TableCell className="tableCell">
                      {intervention.conversation ? (
                        <Link to={`/conversation/${intervention.conversation.id}/directeur/${localStorage.getItem('userId')}`} onClick={handleClose}>
                          {intervention.conversation.title}
                        </Link>
                      ) : (
                        'no conversation'
                      )}
                    </TableCell>
                  </TableRow>
                )
              )}
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

export default MessagePopup;
