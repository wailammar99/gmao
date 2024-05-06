import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import { Link } from 'react-router-dom';

const MessagePopupCitoyen = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [interventions, setInterventions] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('REPNSEEEEE',token
        
      )
      if (!token) {
        console.log("Token not found. Redirecting to login...");
        // Redirect to login page or handle unauthorized access
        return;
      }
      
      const response = await fetch(`http://127.0.0.1:8000/api_intervetion_citoyen/${localStorage.getItem('userId')}/`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('RESPONSE ',response)
      if (!response.ok) {
        throw new Error('Failed to fetch intervention data');
      }
      
      const data = await response.json();
      
      // Check if data is an array
      if (!Array.isArray(data)) {
        throw new Error('Response data is not an array');
      }
      
      setInterventions(data);
      
    } catch (error) {
      console.error('Error fetching intervention data:', error);
    }
  };
  
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="notification-popup">
      <Button onClick={() => setIsOpen(true)}>
        <ChatBubbleOutlineOutlinedIcon className="icon" />
        <span className="counter">{interventions.length}</span>
      </Button>
      <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Les Conversations</DialogTitle>
        <DialogContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Intervention IDdddddddddddd</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {interventions.map((intervention, index) => (
                <TableRow key={index}>
                  <TableCell>{intervention.id}</TableCell>
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

export default MessagePopupCitoyen;
