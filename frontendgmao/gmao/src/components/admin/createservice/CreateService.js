import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import PopupMessage from '../../message';
import "./createservice.scss"
import Navbar from '../admindesign/home/navbar/navbar';
import Sidebar from '../admindesign/home/sidebar/sidebar';

const CreateService = ({ onServiceCreated }) => {
  const [serviceName, setServiceName] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);
  const navigate = useNavigate();

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
          descriptions: serviceDescription
        }),
      });
      if (response.ok) {
        setSuccessMessage(true);
        console.log('Service created successfully');
        // Invoke the callback function to notify the parent component
        onServiceCreated();
      
        // Navigate back to the admin dashboard
        navigate('/admin_dashboard');
        
      } else {
        console.error('Failed to create service');
      }
    } catch (error) {
      console.error('Error creating service:', error);
    }
  };
 
  return (

    <div className="list">
         <Sidebar/>
        <div className="listContainer">
         <Navbar/>
      <h2>Create New Service</h2>
      <form onSubmit={handleCreateService}>
        <div className="formInput">
          <label htmlFor="serviceName" className="form-label">Service Name</label>
          <input type="text" className="form-control" id="serviceName" value={serviceName} onChange={(e) => setServiceName(e.target.value)} required />
        </div>
        <div className="formInput">
          <label htmlFor="serviceDescription" className="form-label">Service Description</label>
          <textarea className="form-control" id="serviceDescription" rows="3" value={serviceDescription} onChange={(e) => setServiceDescription(e.target.value)} required></textarea>
        </div>
        <button type="submit"  className="btn btn-primary" onClick={handleCreateService}>Create Service</button>
        {successMessage && (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
          <PopupMessage message='Service créé avec succès'  color="success"/>
        </div>
      )}
      </form>
    </div>
    </div>
  );
};
 
export default CreateService;