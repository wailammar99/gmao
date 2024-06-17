import React, { useState, useEffect } from 'react';
import { Map, Marker } from 'pigeon-maps';
import Sidebar from './cityoendesign/sidebar/sidebar';
import Navbar from './cityoendesign/navbar/navbar';
import PopupMessage from '../message';
import { useNavigate } from 'react-router-dom';

const containerStyle = {
  width: '50%',
  height: '150px' // Adjust the height to make the map smaller
};

const defaultPosition = [0, 0]; // Default position for the map

const CreateInterventionForm = ({ onInterventionCreated }) => {
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [titre, setTitre] = useState('');
  const [adresse, setAdresse] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupColor, setPopupColor] = useState('');
  const [position, setPosition] = useState(defaultPosition); // Position selected by user
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Get user's current location when the component mounts
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPosition([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.error('Error getting current location:', error);
      }
    );
  }, []);

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleTitreChange = (e) => {
    setTitre(e.target.value);
  };

  const handleAdresseChange = (e) => {
    setAdresse(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userId = localStorage.getItem('userId');
      if (!token || !userId) {
        navigate("/login");
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/api_create_intervention/${userId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          description: description,
          date_debut: startDate,
          date_fin: endDate,
          titre: titre,
          adresse: adresse,
          latitude: position[0], // Use the current position
          longitude: position[1], // Use the current position
        }),
      });

      if (response.ok) {
        setPopupMessage('Intervention créée avec succès');
        setPopupColor('success');
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate("/Citoyenpage");
        }, 1500);
        // Clear form fields after successful submission
        setDescription('');
        setStartDate('');
        setEndDate('');
        setTitre('');
        setAdresse('');
      } else if (response.status === 401) {
        console.error('Failed to create intervention');
        setPopupMessage('Veuillez remplir le formulaire');
        setPopupColor('danger');
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
        }, 1500);
      }
    } catch (error) {
      console.error('Error creating intervention:', error);
      setPopupMessage('Erreur lors de la création de l\'intervention');
      setPopupColor('danger');
      setShowPopup(true);
    }
  };

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        
        <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px', }}>
          <div>
            <label>Titre:</label>
            <input type="text" value={titre} onChange={handleTitreChange} style={{ width: '100%', padding: '8px', marginBottom: '10px' }} required />
          </div>
          <div>
            <label>Adresse:</label>
            <input type="text" value={adresse} onChange={handleAdresseChange} style={{ width: '100%', padding: '8px', marginBottom: '10px' }} required />
          </div>
          <div>
            <label>Description:</label>
            <textarea value={description} onChange={handleDescriptionChange} style={{ width: '100%', padding: '8px', marginBottom: '10px' }} required />
          </div>
          <Map
            center={position}
            height={containerStyle.height}
            onClick={({ latLng }) => setPosition([latLng[0], latLng[1]])} // Update position when map is clicked
          >
            <Marker anchor={position} />
          </Map>
          <button type="submit" style={{ backgroundColor: '#007bff', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Créer une intervention</button>
        </form>
        {showPopup && <PopupMessage message={popupMessage} color={popupColor} />}
      </div>
    </div>
  );
};

export default CreateInterventionForm;
