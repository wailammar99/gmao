import React, { useState } from 'react';
import PopupMessage from '../message';


function EnAttenteForm({ onClose, onSubmit,interventionId  }) {
  const [description, setDescription] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState({ message: '', color: 'success' });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:8000/api_create_raison/${interventionId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });
      if (response.ok)
      {
        setShowPopup(true);
        setPopupMessage({ message: 'Intervention est bien en attent  ', color: 'success' });
        setTimeout(() => {
          setPopupMessage(false);
        }, 1500);
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const showMessage = (message, color) => {
    // Set the message and color for the PopupMessage component
    setPopupMessage({ message, color });
    // Show the PopupMessage component
    setShowPopup(true);
  };


  return (

    <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog" role="document">
      {showPopup && <PopupMessage message={popupMessage.message} color={popupMessage.color} />}
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">En attente</h5>
            <button type="button" className="close" onClick={onClose} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description:</label>
                <input type="text" id="description" className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnAttenteForm;