import React, { useState } from 'react';

import Sidebar from './cityoendesign/sidebar/sidebar';
import Navbar from './cityoendesign/navbar/navbar';
import PopupMessage from '../message';




const CreateInterventionForm = ({ onInterventionCreated }) => {
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showPopup, setShowPopup] = useState(false); // State to manage popup visibility
  const [popupMessage, setPopupMessage] = useState('');
  const [popupColor, setPopupColor] = useState('');

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!token || !userId) {
        // Redirect to login page or show an error message indicating authentication is required
        console.error('User not authenticated');
        return;
      }
      const response = await fetch(` http://127.0.0.1:8000/api_create_intervention/${userId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          description: description,
          date_debut: startDate,
          date_fin: endDate,
        }),
      });

      if (response.ok) {
        
        setPopupMessage('Intervention created successfully');
        setPopupColor('success');
        setShowPopup(true);
        setDescription('');
        setStartDate('');
        setEndDate('');
      } else {
        console.error('Failed to create intervention');
        setPopupMessage('Failed to create intervention');
        setPopupColor('danger');
        setShowPopup(true);
      }
    } catch (error) {
      console.error('Error creating intervention:', error);
      setPopupMessage('Error creating intervention');
      setPopupColor('danger');
      setShowPopup(true);
    }
  };

  return (
    <div className="list">
    <Sidebar/>
   <div className="listContainer">
    <Navbar/>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <div>
          <label>Description:</label>
          <textarea value={description} onChange={handleDescriptionChange} style={{ width: '100%', padding: '8px', marginBottom: '10px' }} required />
        </div>
        
        <button type="submit" style={{ backgroundColor: '#007bff', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Create Intervention</button>
      </form>
      {showPopup && <PopupMessage message={popupMessage} color={popupColor} />}
      </div>
      </div>
  );
};

export default CreateInterventionForm;