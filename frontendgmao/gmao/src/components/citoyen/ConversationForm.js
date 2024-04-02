// ConversationForm.js
import React, { useState } from 'react';

const ConversationForm = ({ interventionId, onClose }) => {
  const [title, setTitle] = useState('');

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("Token not found. Redirecting to login...");
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/api_create_converstion/${interventionId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({title}),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message); // Log success message
        onClose(); // Close the form after successful submission
      } else {
        console.error('Failed to start conversation');
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  return (
    <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Start Conversation</h5>
            <button type="button" className="close" onClick={onClose} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="title">Conversation Title:</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">Start Conversation</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationForm;
