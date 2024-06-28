import React, { useEffect, useState } from 'react';
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import { Link } from 'react-router-dom';

const MessagePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [interventions, setInterventions] = useState([]);
  const userId = localStorage.getItem('userId');
  const token=localStorage.getItem('token');
  

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api_intervetion_chefservice/${userId}/`,
      {
        headers: {
          Authorization: `TOKEN ${token}`,
        }
      });
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
        <span>{interventions.reduce((total, intervention) => total + (intervention.conversations ? intervention.conversations.length : 0), 0)}</span>
      </Button>
      <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Les Conversations</DialogTitle>
        <DialogContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Intervention Title</TableCell>
                <TableCell>Conversation Title</TableCell>
                <TableCell>Date de création</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {interventions.map((intervention) => (
                <TableRow key={intervention.id}>
                  <TableCell>{intervention.conversation ? intervention.conversation.title : 'No conversation title'}</TableCell>
                  <TableCell className="tableCell">
                    {intervention.conversation ? (
                      <Link to={`/conversation/${intervention.conversation.id}/chefservice/${userId}`} onClick={handleClose}>
                        {intervention.conversation.title}
                      </Link>
                    ) : (
                      'no conversation'
                    )}
                  </TableCell>
                  <TableCell>{intervention.date_creation}</TableCell>
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

export default MessagePopup;
