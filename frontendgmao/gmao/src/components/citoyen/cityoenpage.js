import React, { useState, useEffect } from 'react';

import { useParams, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Sidebar from './cityoendesign/sidebar/sidebar';
import Navbar from './cityoendesign/navbar/navbar';
import ConversationMessages from './conversationmessage';
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";


// Import the ConversationMessages component



const Citoyenpage = () => {
  const [interventions, setInterventions] = useState([]);
  const [conversations, setConversations] = useState([]);
  const { id } = useParams();
  
  useEffect(() => {
    fetchData();
    fetchConversations(); // Fetch conversations
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("Token not found. Redirecting to login...");
        // Redirect to login page or handle unauthorized access
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/api_intervetion_citoyen/${localStorage.getItem('userId')}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data); // Log the response data to see its structure
        setInterventions(data.interventions || []); // Ensure interventions is initialized as an empty array if data.interventions is undefined
      } else {
        console.error('Failed to fetch interventions');
      }
    } catch (error) {
      console.error('Error fetching interventions:', error);
    }
  };

  // Function to fetch conversations
  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("Token not found. Redirecting to login...");
        // Redirect to login page or handle unauthorized access
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/con`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data); // Log the response data to see its structure
        setConversations(data || []); // Set conversations state
      } else {
        console.error('Failed to fetch conversations');
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  // Function to compare intervention conversation with conversation id
  const getConversationTitle = (intervention) => {
    const conversation = intervention.conversation; // Get the conversation object directly
    return conversation ? conversation.title : 'Conversation Not Found';
  };

  return (
    <div className="list">
         <Sidebar/>
        <div className="listContainer">
         <Navbar/>
      
      <h1>Interventions</h1>
      <table className="table table-hover" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Description</th>
            <th>Date de création</th>
            <th>Date de début</th>
            <th>Date de fin</th>
            <th>État</th>
            <th>Conversations</th>
          </tr>
        </thead>
        <tbody>
          {interventions.map(intervention => (
            <tr key={intervention.id}>
              <td>{intervention.description}</td>
              <td>{intervention.date_creation}</td>
              <td>{intervention.date_debut}</td>
              <td>{intervention.date_fin}</td>
              <td>{intervention.etat}</td>
              <td>
                {/* Render a Link to ConversationMessages component with conversation ID */}
                {intervention.conversation && intervention.conversation.id ? (
                  <Link to={`/conversation/${intervention.conversation.id}/citoyen/${localStorage.getItem('userId')}`}>
                 <ChatBubbleOutlineOutlinedIcon>
                  
                 </ChatBubbleOutlineOutlinedIcon>
                    {intervention.conversation.title}
                   
                  </Link>
                ) : (
                  'pas de conversation '
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default Citoyenpage;