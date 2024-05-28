  import React, { useState, useEffect } from 'react';
  import { useParams } from 'react-router-dom';
  import Sidebar from './cityoendesign/sidebar/sidebar';
  import Navbar from './cityoendesign/navbar/navbar';
  import "./ConversationMessages.scss";

  const ConversationMessages = () => {
    const { id } = useParams();
    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState('');
    const [typeMessage, setTypeMessage] = useState('');
    const userId = localStorage.getItem('userId');
    const [ws1, setWs1] = useState(null);
    const [ws2, setWs2] = useState(null);
    const [authorized, setAuthorized] = useState(true);
    const [visibleMessageId, setVisibleMessageId] = useState(null);

    useEffect(() => {
      const fetchMessages = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/conversation/${id}/messages/`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          const publicMessages = data.filter(message => message.message_type === 'public');
          const formattedMessages = publicMessages.map(message => ({
            ...message,
            sender: { username: message.sender.username }
          }));
          setMessages(formattedMessages);
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
        if (data.message && data.message.type === 'public') { // Check if the message is public
          // Ensure WebSocket messages have the sender's username
          const newMessage = {
            ...data.message,
            sender: { username: data.message.sender.username }
          };
          setMessages(prevMessages => [...prevMessages, newMessage]);
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
        if (data.message && data.message.type === 'public') { // Check if the message is public
          // Ensure WebSocket messages have the sender's username
          const newMessage = {
            ...data.message,
            sender: { username: data.message.sender.username }
          };
          setMessages(prevMessages => [...prevMessages, newMessage]);
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
          type: "public",
          sender: userId,
        };
        ws1.send(JSON.stringify(messageData));
        setContent('');
      } else {
        console.error('WebSocket connection is not open or content is empty.');
      }
    };

    const handleInputChange = (e) => {
      setContent(e.target.value);
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
          setAuthorized(false);
        }
      } catch (error) {
        console.error('Error checking participant:', error);
      }
    };

    const handleMessageTypeChange = (e) => {
      setTypeMessage(e.target.value);
    };

    if (!authorized) {
      return <div>You are not authorized to view this conversation.</div>;
    }

    const toggleMessageVisibility = (index) => {
      setVisibleMessageId(visibleMessageId === index ? null : index);
    };

    return (
      <div className="list">
        <Sidebar />
        <div className="listContainer">
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
                          
                          <div
                            className={`chat-message ${message.sender ==userId  ? 'left' : 'right'} ${visibleMessageId === index ? 'show-details' : ''} pb-4`}
                            key={index}
                            onClick={() => toggleMessageVisibility(index)}
                          > {console.log('message.sender.id',message.sender.id)}
                          
                            <div className="text-muted small text-nowrap mt-2">
                              {message.horodatage}, {message.type ? message.type : message.message_type}
                            </div>
                            <div className={`flex-shrink-1 rounded py-2 px-3 mr-3 ${message.sender.id == userId ? 'bg-gray' : 'bg-blue'}`}>
                              <div className="font-weight-bold mb-1">Sender: {message.sender.username ? message.sender.username :message.sender}</div>
                              Content: {message.contenu}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="fixed-container">
                      <form className="mt-3" onSubmit={(e) => { e.preventDefault(); handleMessageSubmit(); }}>
                        <div className="form-group">
                          <label htmlFor="content">Message content:</label>
                          <input id="content" className="form-control" value={content} onChange={handleInputChange} />
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
    );
  };

  export default ConversationMessages;
