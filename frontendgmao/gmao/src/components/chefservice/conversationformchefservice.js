import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './chefservicedesign/sidebar/sidebar';
import Navbar from './chefservicedesign/navbar/navbar';
import "./ConversationMessageschefservice.scss";

const ConversationMessageschefservice = () => {
  const { id } = useParams(); // Extracting conversationId from URL parameter
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [typeMessage, setTypeMessage] = useState(''); // State to track message type
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

  const handleMessageSubmit = async (type) => { // Modified to take type argument
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
        body: JSON.stringify({ description: 'Your description', contenu: content, type_message: type }), // Use the provided type argument
      });

      if (response.ok) {
        // Message sent successfully, refresh messages
        fetchMessages();
        setContent(''); // Clear the content input field
        setTypeMessage(''); // Reset type message after sending
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />   
        <main class="content">
            <div class="container p-0">
              <h1 class="h3 mb-3">Messages</h1>
              <div class="col-12 col-lg-7 col-xl-9">
					  <div class="py-2 px-4 border-bottom d-none d-lg-block">
						<div class="d-flex align-items-center py-1">
							<div class="position-relative">
								{/* <img src="https://bootdey.com/img/Content/avatar/avatar3.png" class="rounded-circle mr-1" alt="Sharon Lessman" width="40" height="40"> */}
							</div>
							{/* <div class="flex-grow-1 pl-3">
								<strong>Sharon Lessman</strong>
								
							</div> */}
						</div> 
					</div>  

          <div className="fixed-container-wrapper">
          <div className="scrolling-container">
  <div class="position-relative">
    <div class="chat-messages p-4">
      {messages.map((message, index) => (
        <div class="chat-message-right pb-4" key={index}>
          <div>
            <div class="text-muted small text-nowrap mt-2">{message.horodatage},type message{message.message_type}</div>
          </div>
          <div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
            <div class="font-weight-bold mb-1">Sender:{message.sender.username}</div>
            Content:{message.contenu}
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

          {/* <ul className="list-group">
            {messages.map((message, index) => (
              <li key={index} className="list-group-item my-3">
                <p>Sender: {message.sender.username}</p>
                <p>Content: {message.contenu}</p>
                <p>Timestamp: {message.horodatage}</p>
                <p>Type de message: {message.message_type}</p>
              </li>
            ))}
          </ul> */}
          <div className="fixed-container">
          <form className="mt-3">
            <div className="form-group">
              <label htmlFor="content">Message content:</label>
              <input id="content" className="form-control" value={content} onChange={(e) => setContent(e.target.value)} />
            </div>
            <div>
  <div className="form-check">
    <input
      type="radio"
      id="public"
      className="form-check-input"
      name="messageType"
      value="public"
      checked={typeMessage === 'public'}
      onChange={() => setTypeMessage('public')}
    />
    <label htmlFor="public" className="form-check-label">Public</label>
  </div>
  <div className="form-check">
    <input
      type="radio"
      id="private"
      className="form-check-input"
      name="messageType"
      value="private"
      checked={typeMessage === 'private'}
      onChange={() => setTypeMessage('private')}
    />
    <label htmlFor="private" className="form-check-label">Private</label>
  </div>
</div>

            <button type="submit" className="btn btn-primary mt-2" onClick={() => handleMessageSubmit(typeMessage)}>Send Message</button>
          </form>
</div>

          </div>
        </div>
        </div>
        </main>
      </div>
    </div>
  );
};

export default ConversationMessageschefservice;