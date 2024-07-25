import React, { useState, useEffect } from 'react';
import { Map, Marker } from 'pigeon-maps';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import Sidebar from './chefservicedesign/sidebar/sidebar';
import Navbar from './chefservicedesign/navbar/navbar';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const defaultPosition = [0, 0]; // Default position for the map
const containerStyle = {
  width: '100%',
  height: '500px', // Adjust the height to make the map smaller
  position: 'relative' // Ensure the container is relative to position the buttons inside it
};

const buttonContainerStyle = {
  position: 'absolute',
  top: '10px',
  left: '10px',
  display: 'flex',
  flexDirection: 'column',
  zIndex: 1000, // Ensure the buttons are on top of the map
};

const buttonStyle = {
  margin: '5px 0',
  padding: '5px 10px',
  backgroundColor: '#fff',
  border: '1px solid #ccc',
  borderRadius: '3px',
  cursor: 'pointer',
};

const InterventionMap = () => {
  const [interventions, setInterventions] = useState([]); // Store interventions
  const [position, setPosition] = useState(defaultPosition); // Position selected by user
  const [zoom, setZoom] = useState(12); // Manage the zoom level
  const [page, setPage] = useState(1); // Current page
  const [hasMore, setHasMore] = useState(true); // Check if there are more interventions to load
  const [selectedIntervention, setSelectedIntervention] = useState(null); // Selected intervention for details dialog
  const [currentIndex, setCurrentIndex] = useState(0); // Current index for navigation
  const token = localStorage.getItem('token');
  const userid = localStorage.getItem('userId');

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

    // Fetch initial interventions
    fetchInterventions(page);
  }, [token, page]);

  const fetchInterventions = async (page) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/enterprise/${localStorage.getItem("enterprise_id")}/chefservice/${localStorage.getItem('userId')}/interventions`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      });

      if (response.ok) {
        const responsedata = await response.json();
        const data =responsedata.data
        console.log('Fetched interventions:', data); // Log fetched data

        if (data.length > 0) {
          setInterventions((prevInterventions) => [...prevInterventions, ...data]);
        } else {
          setHasMore(false); // No more interventions to load
        }
      } else {
        console.error('Failed to fetch interventions:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching interventions:', error);
    }
  };

  const loadMoreInterventions = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleMarkerClick = (intervention) => {
    setSelectedIntervention(intervention);
  };

  const handleClose = () => {
    setSelectedIntervention(null);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % interventions.length;
    const nextIntervention = interventions[nextIndex];
    if (nextIntervention) {
      setCurrentIndex(nextIndex);
      setPosition([parseFloat(nextIntervention.latitude), parseFloat(nextIntervention.longitude)]);
    }
  };

  const handlePrevious = () => {
    const prevIndex = (currentIndex - 1 + interventions.length) % interventions.length;
    const prevIntervention = interventions[prevIndex];
    if (prevIntervention) {
      setCurrentIndex(prevIndex);
      setPosition([parseFloat(prevIntervention.latitude), parseFloat(prevIntervention.longitude)]);
    }
  };

  const handleZoomIn = () => {
    setZoom((prevZoom) => prevZoom + 1);
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => prevZoom - 1);
  };

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <div style={containerStyle}>
          <Map center={position} zoom={zoom} height={containerStyle.height}>
            {interventions.map((intervention) => {
              // Ensure latitude and longitude are valid numbers
              const lat = parseFloat(intervention.latitude);
              const lng = parseFloat(intervention.longitude);

              if (!isNaN(lat) && !isNaN(lng)) {
                return (
                  <Marker
                    key={intervention.id}
                    width={50}
                    anchor={[lat, lng]}
                    onClick={() => handleMarkerClick(intervention)}
                  />
                );
              } else {
                console.error('Invalid coordinates for intervention:', intervention);
                return null;
              }
            })}
          </Map>
          <div style={buttonContainerStyle}>
            <button onClick={handleZoomIn} style={buttonStyle}>+</button>
            <button onClick={handleZoomOut} style={buttonStyle}>-</button>
          </div>
        </div>
        <div style={{ marginTop: '20px', marginLeft: '440px' }}>
          <ArrowBackIosIcon
            variant="contained"
            color="primary"
            onClick={handlePrevious}
            style={{ marginRight: '10px' }}
          >
            Précédente
          </ArrowBackIosIcon>
          <ArrowForwardIosIcon
            variant="contained"
            color="primary"
            onClick={handleNext}
          >
            Suivant
          </ArrowForwardIosIcon>
        </div>
        {selectedIntervention && (
          <Dialog open={Boolean(selectedIntervention)} onClose={handleClose}>
            <DialogTitle>Intervention Details</DialogTitle>
            <DialogContent>
              <Typography variant="body1"><strong>ID:</strong> {selectedIntervention.id}</Typography>
              <Typography variant="body1"><strong>Titre:</strong> {selectedIntervention.titre || 'Titre non disponible'}</Typography>
              <Typography variant="body1"><strong>Description:</strong> {selectedIntervention.description || 'Description non disponible'}</Typography>
              <Typography variant="body1"><strong>Date de création:</strong> {selectedIntervention.date_creation || 'Date de création non disponible'}</Typography>
              <Typography variant="body1"><strong>Date de début:</strong> {selectedIntervention.date_debut || 'Date de début non disponible'}</Typography>
              <Typography variant="body1"><strong>Date de fin:</strong> {selectedIntervention.date_fin || 'Date de fin non disponible'}</Typography>
              <Typography variant="body1"><strong>Citoyen:</strong> {selectedIntervention.citoyen.email || 'Citoyen non disponible'}</Typography>
              <Typography variant="body1"><strong>ID du technicien:</strong> {selectedIntervention.technicien || 'Technicien non disponible'}</Typography>
              <Typography variant="body1"><strong>Service:</strong> {selectedIntervention.service.nom || 'Service non disponible'}</Typography>
              <Typography variant="body1"><strong>Raison:</strong> {selectedIntervention.raison ? selectedIntervention.raison.description : 'Raison non disponible'}</Typography>
              <Typography variant="body1"><strong>Adresse:</strong> {selectedIntervention.adresse || 'Adresse non disponible'}</Typography>
              <Typography variant="body1"><strong>Latitude:</strong> {selectedIntervention.latitude || 'Latitude non disponible'}</Typography>
              <Typography variant="body1"><strong>Longitude:</strong> {selectedIntervention.longitude || 'Longitude non disponible'}</Typography>
              <Typography variant="body1"><strong>État:</strong> {selectedIntervention.etat || 'État non disponible'}</Typography>
              <Typography variant="body1"><strong>Conversation:</strong> {selectedIntervention.conversation ?  selectedIntervention.conversation.titre : 'Conversation non disponible'}</Typography>
              {/* Display associated equipments */}
              {selectedIntervention.equipements && selectedIntervention.equipements.length > 0 ? (
                <Typography variant="body1"><strong>Équipements:</strong> {selectedIntervention.equipements.join(', ')}</Typography>
              ) : (
                <Typography variant="body1"><strong>Équipements:</strong> Équipements non disponibles</Typography>
              )}
              {/* Add more details as needed */}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default InterventionMap;
