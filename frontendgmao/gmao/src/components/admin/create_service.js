import React, { useState } from 'react';
import AdminNavbar from './AdminNavbar';
import PopupMessage from '../message';

const CreateService = ({ onServiceCreated }) => {
  const [serviceName, setServiceName] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [showMessage, setShowMessage] = useState(false); // State to track whether to show the message

  const handleCreateService = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      const response = await fetch('http://127.0.0.1:8000/api_create_service/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom: serviceName,
          descriptions: serviceDescription // Corrected typo: descrtions -> descriptions
        }),
      });
      if (response.ok) {
        console.log('Service created successfully');
        setShowMessage(true); // Set showMessage to true to display the message
        // Invoke the callback function to notify the parent component
        onServiceCreated();
      } else {
        console.error('Failed to create service');
      }
    } catch (error) {
      console.error('Error creating service:', error);
    }
  };

  return (
    <div>
      <AdminNavbar />
      <h2>Create New Service</h2>
      {showMessage && <PopupMessage message="Service created successfully" color="success" />}
      <form onSubmit={handleCreateService}>
        <div className="mb-3">
          <label htmlFor="serviceName" className="form-label">Service Name</label>
          <input type="text" className="form-control" id="serviceName" value={serviceName} onChange={(e) => setServiceName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="serviceDescription" className="form-label">Service Description</label>
          <textarea className="form-control" id="serviceDescription" rows="3" value={serviceDescription} onChange={(e) => setServiceDescription(e.target.value)} required></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Create Service</button>
      </form>
    </div>
  );
};

export default CreateService;
