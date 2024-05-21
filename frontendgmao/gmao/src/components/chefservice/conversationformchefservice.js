import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './chefservicedesign/sidebar/sidebar';
import Navbar from './chefservicedesign/navbar/navbar';
import "./ConversationMessageschefservice.scss"

const ConversationMessageschefservice = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [typeMessage, setTypeMessage] = useState('');
  const userId = localStorage.getItem('userId');
  const [ws1, setWs1] = useState(null);
  const [ws2, setWs2] = useState(null);
  const [authorized, setAuthorized] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/conversation/${id}/messages/`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
    checkParticipant();

    const ws1 = new WebSocket(`ws://127.0.0.1:8000/ws/conversation/${id}/${userId}/`);
    const ws2 = new WebSocket(`ws://127.0.0.1:8000/ws/broadcast/${id}/`);

    ws1.onopen = () => {
      console.log('WebSocket 1 connected');
    };

    ws1.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.message) {
        setMessages(prevMessages => [...prevMessages, data.message]);
      }
    };

    ws1.onclose = () => {
      console.log('WebSocket 1 closed');
    };

    ws2.onopen = () => {
      console.log('WebSocket 2 connected');
    };

    ws2.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.message) {
        setMessages(prevMessages => [...prevMessages, data.message]);
      }
    };

    ws2.onclose = () => {
      console.log('WebSocket 2 closed');
    };

    setWs1(ws1);
    setWs2(ws2);

    return () => {
      if (ws1) {
        ws1.close();
      }
      if (ws2) {
        ws2.close();
      }
    };
  }, [id, userId]);

  const handleMessageSubmit = () => {
    if (ws1 && ws1.readyState === WebSocket.OPEN && content.trim() !== '') {
      const messageData = {
        type: 'send_message',
        message: content,
        type: typeMessage,
        sender: userId
      };
      ws1.send(JSON.stringify(messageData));
      setContent('');
    } else {
      console.error('WebSocket connection is not open or content is empty.');
    }
  };
  const checkParticipant = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/test_particement/${id}/citoyen/${userId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error('User is not authorized');
        setAuthorized(false); // Set authorized to false if user is not authorized
      }
    } catch (error) {
      console.error('Error checking participant:', error);
    }
  };

 
  checkParticipant();

  const handleInputChange = (e) => {
    setContent(e.target.value);
  };

  const handleMessageTypeChange = (e) => {
    setTypeMessage(e.target.value);
  };
  if (!authorized) {
    return <div>You are not authorized to view this conversation.</div>;
  }


  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-2">
          <Sidebar />
        </div>
        <div className="col-10">
          <Navbar />
          <main className="content">
            <div className="container p-0">
              <h1 className="h3 mb-3">Messages</h1>
              <div className="col-12 col-lg-7 col-xl-9">
                <div className="py-2 px-4 border-bottom d-none d-lg-block">
                  <div className="d-flex align-items-center py-1">
                    <div className="position-relative"></div>
                  </div>
                </div>

                <div className="fixed-container-wrapper">
                  <div className="scrolling-container">
                    <div className="position-relative">
                      <div className="chat-messages p-4">
                        {messages.map((message, index) => (
                          <div className="chat-message-right pb-4" key={index}>
                            <div>
                              <div className="text-muted small text-nowrap mt-2">
                                {message.horodatage}, type message: {message.type ? message.type : message.message_type}
                              </div>
                            </div>
                            <div className="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
                              <div className="font-weight-bold mb-1">Sender: {message.sender.username ? message.sender.username : "username unknown"}</div>
                              Content: {message.contenu}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="fixed-container">
                      <form className="mt-3">
                        <div className="form-group">
                          <label htmlFor="content">Message content:</label>
                          <input id="content" className="form-control" value={content} onChange={handleInputChange} />
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
                              onChange={handleMessageTypeChange}
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
                              onChange={handleMessageTypeChange}
                            />
                            <label htmlFor="private" className="form-check-label">Private</label>
                          </div>
                        </div>

                        <button type="button" className="btn btn-primary mt-2" onClick={handleMessageSubmit}>Send Message</button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ConversationMessageschefservice;
