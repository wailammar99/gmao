import React, { useState, useEffect } from 'react';
import PopupMessage from '../../message';

const UserformA = ({ userId, onSubmit }) => {
  const [formData, setFormData] = useState({
    selectedOption: '', // State for the selected service
  });

  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [message, setMessage] = useState(null);
  const [messageColor, setMessageColor] = useState('');

  useEffect(() => {
    fetchDropdownOptions();
  }, []);

  const fetchDropdownOptions = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/Serviceliste/');
      if (response.ok) {
        const data = await response.json();
        setDropdownOptions(data);
      } else {
        console.error('Failed to fetch dropdown options');
      }
    } catch (error) {
      console.error('Error fetching dropdown options:', error);
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setFormData({
      selectedOption: value,
    });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:8000/api_assigne_service_user/${userId}/`, { // Corrected userId
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: formData.selectedOption,
        }),
      });
      if (response.status==200) {
        const data = await response.json();
        console.log(data.message);
        setMessage(data.message); // Set message
        setMessageColor('success'); // Set message color
        onSubmit(formData);
        setFormData({
          selectedOption: '',
        });
      } else {
        console.error('Failed to assign service');
        setMessage('Failed to assign service'); // Set message
        setMessageColor('danger'); // Set message color
      }
    } catch (error) {
      console.error('Error assigning service:', error);
      setMessage('Error assigning service'); // Set message
      setMessageColor('danger'); // Set message color
    }
  };

  return (
  
    <div className="intervention-form" style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '20px' }}>
      <h2>Assign Service</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="selectedOption" className="form-label">Select Service:</label>
          <select name="selectedOption" id="selectedOption" className="form-control" value={formData.selectedOption} onChange={handleChange} style={{ width: '100%', padding: '10px', marginBottom: '10px' }}>
            <option value="">Select a service</option>
            {dropdownOptions.map(option => (
              <option key={option.id} value={option.id}>{option.nom}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px', borderRadius: '5px', backgroundColor: '#007bff', border: 'none' }}>Assign Service</button>
      </form>
      {/* Render PopupMessage component if message exists */}
      
    </div>
  );
};

export default UserformA;
