import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { TextField, Button, List, ListItem, ListItemText, Card } from '@mui/material'; // Importing components from Material-UI

const ConversationMessages = () => {
  const { id } = useParams(); // Extracting conversationId from URL parameter
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
  const messagesEndRef = useRef(null); // Ref for scrolling to bottom
  const [showMessage, setShowMessage] = useState(false); // State to control showing error message
  const [authorized, setAuthorized] = useState(true); // State to control authorization

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.log("Token not found. Redirecting to login...");
        // Redirect to login page or handle unauthorized access
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/conversation/${id}/messages/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data); // Log the response data to see its structure
        setMessages(data || []); // Ensure messages is initialized as an empty array if data is undefined
      } else {
        console.error('Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
    checkParticipant(); // Check participant authorization when component mounts
  }, [id]); // Fetch messages whenever the conversationId changes

  const checkParticipant = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/test_particement/${id}/citoyen/${userId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setShowMessage(true); // Show error message if user is not authorized
        setAuthorized(false); // Set authorized to false if user is not authorized
      }
    } catch (error) {
      console.error('Error checking participant:', error);
    }
  };

  const handleMessageSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');

      if (!token || !authorized) {
        console.log("Token not found or user not authorized. Redirecting to login...");
        // Redirect to login page or handle unauthorized access
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/conversation/${id}/citoyen/${userId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description: 'Your description', contenu: content }),
      });

      if (response.ok) {
        // Message sent successfully, refresh messages
        fetchMessages();
        setContent(''); // Clear the content input field
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const onSubmitMessage = (message) => {
    handleMessageSubmit(message);
    scrollToBottom();
  };

  return (
    <div>
      <div className="container">
        <h2 className="mt-5">Conversation Messages</h2>
        {authorized ? (
          <Card variant="outlined" className="p-2 h-96 overflow-auto">
            <List>
              {messages.map((message, index) => (
                <ListItem key={index} className="my-3">
                  <ListItemText
                    primary={`Sender: ${message.sender.username}`}
                    secondary={`Content: ${message.contenu}`}
                  />
                  <ListItemText secondary={`Timestamp: ${message.horodatage}`} />
                  <ListItemText secondary={`Type de message : ${message.message_type}`} />
                </ListItem>
              ))}
            </List>
            <div ref={messagesEndRef} />
          </Card>
        ) : (
          <p>You are not authorized to access this conversation.</p>
        )}
        {authorized && (
          <form onSubmit={handleMessageSubmit} className="mt-3">
            {showMessage && <p>You are not authorized to access this conversation.</p>}
            <TextField
              label="Message content"
              variant="outlined"
              fullWidth
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Button type="submit" variant="contained" color="primary" className="mt-3">
              Send Message
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ConversationMessages;
