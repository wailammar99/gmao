import React, { useEffect, useState } from 'react';
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import { Link } from 'react-router-dom';
 
 
const MessagePopupCitoyen = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [interventions, setInterventions] = useState([]);
 
  useEffect(() => {
    fetchData();
  }, []);
 
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("Token not found. Redirecting to login...");
        // Rediriger vers la page de connexion ou gérer l'accès non autorisé
        return;
      }
 
      const response = await fetch(`http://127.0.0.1:8000/api_intervetion_citoyen/${localStorage.getItem('userId')}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
 
      if (response.ok) {
        const data = await response.json();
        console.log(data); // Journalisez les données de réponse pour voir leur structure
        setInterventions(data.interventions || []);
      } else {
        console.error('Failed to fetch interventions');
      }
    } catch (error) {
      console.error('Error fetching interventions:', error);
    }
  };
 
  const handleOpen = () => {
    setIsOpen(true);
  };
 
  const handleClose = () => {
    setIsOpen(false);
  };
 
  const handleLinkClick = () => {
    setIsOpen(false);
  };
 
  return (
    <div className="notification-popup">
      <Button onClick={handleOpen}>
        <ChatBubbleOutlineOutlinedIcon className="icon" />
        <span className="counter">{interventions.reduce((total, intervention) => total + (intervention.conversations ? intervention.conversations.length : 0), 0)}</span>
      </Button>
      <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Les Conversations</DialogTitle>
        <DialogContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Titre de l'intervention</TableCell>
                <TableCell>Titre de la conversation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {interventions.filter(intervention => intervention.conversation).map(intervention => (
                <TableRow key={intervention.id}>
                  <TableCell>{intervention.conversation.title}</TableCell>
                  <TableCell className="tableCell">
                    <Link to={`/conversation/${intervention.conversation.id}/citoyen/${localStorage.getItem('userId')}`} onClick={handleLinkClick}>
                      <ChatBubbleOutlineOutlinedIcon />
                      {intervention.conversation.title}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
 
export default MessagePopupCitoyen;