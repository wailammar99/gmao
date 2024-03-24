import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ConversationMessages = () => {
  const { id } = useParams(); // Extracting conversationId from URL parameter
  const [messages, setMessages] = useState([]);

  useEffect(() => {
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

    fetchMessages();
  }, [id]); // Fetch messages whenever the conversationId changes

  return (
    <div>
      <h2>Conversation Messages</h2>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            <p>Sender: {message.sender.username}</p>
            <p>Content: {message.contenu}</p>
            <p>Timestamp: {message.horodatage}</p>
            <p>type de message : {message.message_type}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConversationMessages;
