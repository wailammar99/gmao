import React, { useState } from 'react';
import Navbar from './directeurdesi/Navbar/navbardic';
import Sidebar from './directeurdesi/Sidebar/Sidebardic';
import PopupMessage from '../message';
import { useNavigate } from 'react-router-dom';

const Rapportform = ({ onInterventionCreated }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showPopup, setShowPopup] = useState(false); // State to manage popup visibility
  const [popupMessage, setPopupMessage] = useState('');
  const [popupColor, setPopupColor] = useState('');
  const navigate=useNavigate();
  const en_id =localStorage.getItem('enterprise_id');

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

 
      const response = await fetch(`http://127.0.0.1:8000/enterprise/${en_id}/rapport/create/`, {
        method: 'POST',
        body: JSON.stringify({
          date_debut: startDate,
          date_fin: endDate,
        }),
      });

      if (response.ok) {
        const data = await response.json();
       
        setPopupMessage('Rapport est bien créé');
        setPopupColor('success');
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate("/listerapport");
        }, 1500);

        setStartDate('');
        setEndDate('');
      
      }
      
        else if (response.status===401)
          {
            setPopupMessage('enter les dates correctement');
        setPopupColor('danger');
       
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
       
        
        }, 1500);
      


       
          }
    
  };

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        {showPopup && <PopupMessage message={popupMessage} color={popupColor} />}
        <form
          onSubmit={handleSubmit}
          style={{
            maxWidth: '900px',
            margin: '60px auto',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '5px',
          }}
        >
          <div>
            <div className="mb-3">
              <label htmlFor="startDate" className="form-label">
                Date de début:
              </label>
              <input
                type="date"
                name="startDate"
                id="startDate"
                className="form-control"
                required
                onChange={handleStartDateChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="endDate" className="form-label">
                Date de fin:
              </label>
              <input
                type="date"
                name="endDate"
                id="endDate"
                className="form-control"
                onChange={handleEndDateChange}
              />
            </div>
            <div className="mb-3">
              <button
                type="submit"
                style={{
                  backgroundColor: '#007bff',
                  color: '#fff',
                  padding: '10px 20px',
                  border: 'none',
                }}
              >
                Create Rapport
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Rapportform;
