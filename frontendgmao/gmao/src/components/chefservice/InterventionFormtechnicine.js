import React, { useState, useEffect } from 'react';

const InterventionFormtechnicine = ({ interventionId, onSubmit }) => {
  const [formData, setFormData] = useState({
    selectedOption: '', // State for the selected service
  });

  const [dropdownOptions, setDropdownOptions] = useState([]);

  useEffect(() => {
    fetchDropdownOptions();
  }, []);

  const fetchDropdownOptions = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/liste_technicien/${interventionId}/`);
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
      const response = await fetch(`http://127.0.0.1:8000/api_assigne_service/${interventionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: formData.selectedOption,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        onSubmit(formData);
        setFormData({
          selectedOption: '',
        });
      } else {
        console.error('Failed to assign service');
      }
    } catch (error) {
      console.error('Error assigning service:', error);
    }
  };

  return (
    <div className="intervention-form">
      <h2>Assign Service</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="selectedOption" className="form-label">Select Service:</label>
          <select name="selectedOption" id="selectedOption" className="form-control" value={formData.selectedOption} onChange={handleChange}>
            <option value="">Select a service</option>
            {dropdownOptions.map(option => (
              <option key={option.id} value={option.id}>{option.username}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Assign Service</button>
      </form>
    </div>
  );
};

export default InterventionFormtechnicine;
