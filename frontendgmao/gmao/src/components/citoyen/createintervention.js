import React, { useEffect, useState, useCallback } from 'react';
import { useGeolocated } from "react-geolocated";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Sidebar from './cityoendesign/sidebar/sidebar';
import Navbar from './cityoendesign/navbar/navbar';
import PopupMessage from '../message';
import { useNavigate } from 'react-router-dom';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const CreateInterventionForm = ({ onInterventionCreated }) => {
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [titre, setTitre] = useState('');
  const [adresse, setAdresse] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupColor, setPopupColor] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
    },
    userDecisionTimeout: 5000,
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
      console.log("pas autorise");
    }
  }, [token, navigate]);

  useEffect(() => {
    if (coords) {
      setLatitude(coords.latitude);
      setLongitude(coords.longitude);
    }
  }, [coords]);

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
      const token = localStorage.getItem('token');
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
          latitude: latitude,
          longitude: longitude,
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

  const handleMapClick = useCallback((event) => {
    setLatitude(event.latLng.lat());
    setLongitude(event.latLng.lng());
  }, []);

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        {!isGeolocationAvailable ? (
          <div>Your browser does not support Geolocation</div>
        ) : !isGeolocationEnabled ? (
          <div>Geolocation is not enabled</div>
        ) : coords ? (
          <>
            <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
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
             
              
              <button type="submit" style={{ backgroundColor: '#007bff', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Créer une intervention</button>
            </form>
            <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={{ lat: latitude, lng: longitude }}
                zoom={15}
                onClick={handleMapClick}
              >
                {latitude && longitude && (
                  <Marker position={{ lat: latitude, lng: longitude }} />
                )}
              </GoogleMap>
            </LoadScript>
          </>
        ) : (
          <div>Getting the location data...</div>
        )}
        {showPopup && <PopupMessage message={popupMessage} color={popupColor} />}
      </div>
    </div>
  );
};

export default CreateInterventionForm;
