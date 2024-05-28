import React, { useState, useEffect } from 'react';
import { Map, Marker } from 'pigeon-maps';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import Sidebar from './techniciendesign/sidebar/sidebar';
import Navbar from './techniciendesign/navbar/navbar' ;
const defaultPosition = [0, 0]; // Default position for the map

const InterventionMapTechncicien = () => {
  const [interventions, setInterventions] = useState([]); // Store interventions
  const [position, setPosition] = useState(defaultPosition); // Position selected by user
  const [page, setPage] = useState(1); // Current page
  const [hasMore, setHasMore] = useState(true); // Check if there are more interventions to load
  const [selectedIntervention, setSelectedIntervention] = useState(null); // Selected intervention for details dialog
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
      const response = await fetch(`http://127.0.0.1:8000/liste_intervetion_technicien/${localStorage.getItem('userId')}/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
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

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
      <Map center={position} zoom={12} height={300}>
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
      {hasMore && (
        <Button onClick={loadMoreInterventions} style={{ marginTop: '20px' }}>
          Load More
        </Button>
      )}
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

export default InterventionMapTechncicien;
