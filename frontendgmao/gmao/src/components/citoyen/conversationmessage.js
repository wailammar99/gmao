import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ConversationMessages = () => {
  const { id } = useParams(); // Extracting conversationId from URL parameter
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage

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
  }, [id]); // Fetch messages whenever the conversationId changes

  const handleMessageSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.log("Token not found. Redirecting to login...");
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

  return (
    <div>
      
      <div className="container">
        <h2 className="mt-5">Conversation Messages</h2>
        <ul className="list-group">
          {messages.map((message, index) => (
            <li key={index} className="list-group-item my-3"> {/* Added margin-y class */}
              <p>Sender: {message.sender.username}</p>
              <p>Content: {message.contenu}</p>
              <p>Timestamp: {message.horodatage}</p>
              <p>Type de message : {message.message_type}</p>
            </li>
          ))}
        </ul>
        <form onSubmit={handleMessageSubmit} className="mt-3">
          <div className="form-group">
            <label htmlFor="content">Message content:</label>
            <input id="content" className="form-control" value={content} onChange={(e) => setContent(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default ConversationMessages;