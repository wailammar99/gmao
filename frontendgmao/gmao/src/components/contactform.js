import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Select, MenuItem, Paper, IconButton } from '@mui/material';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import { useNavigate } from 'react-router-dom';
import { Map, Marker } from 'pigeon-maps';
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook for translation

import PopupMessage from './message';

const locations = [
  { id: 2, lat: 35.086444, lng: -1.864806, address: 'Los Angeles, CA 90001, US' },
  { id: 1, lat: 35.086453, lng: -15.1533, address: 'ghazaouet ,tlecmen' },
  // Add more locations as needed
];

const MapComponent = ({ location }) => {
  return (
    <Map height={300} defaultCenter={[location.lat, location.lng]} defaultZoom={11}>
      <Marker width={50} anchor={[location.lat, location.lng]} />
    </Map>
  );
};

const Contact = () => {
  const { t } = useTranslation(); // Use the useTranslation hook to access translation functions

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8000/CreateContact/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          nom: name,
          telephone: phone,
          sujet_type: reason,
          message: message,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        <PopupMessage message={message.data} color={"success"} />; // Show success message
      } else {
        const errorData = await response.json();
        alert(errorData.error); // Show error message
      }
    } catch (error) {
      console.error('An error occurred:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1) {
      setCurrentPage(1);
    } else if (newPage > locations.length) {
      setCurrentPage(locations.length);
    } else {
      setCurrentPage(newPage);
    }
  };

  const currentLocation = locations[currentPage - 1];

  return (
    <div className="contact-wrapper">
      <Paper className="contact-paper" elevation={3}>
        <Box flex="1" paddingRight="20px">
          <ContactMailIcon sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h5" component="h1" gutterBottom>
            {t('title')} 
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              id="email"
              label={t('email')} 
              name="email"
              type="email"
              autoFocus
              margin="normal"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              fullWidth
              id="phone"
              required
              label={t('phone')} 
              name="phone"
              type="tel"
              autoFocus
              margin="normal"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <TextField
              fullWidth
              required
              id="name"
              label={t('name')} 
              name="name"
              type="text"
              autoFocus
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Select
              fullWidth
              id="reason"
              required
              label={t('reason')} 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              margin="normal"
            >
              <MenuItem value="Probleme">{t('problem')}</MenuItem>
              <MenuItem value="Publicite">{t('advertisement')}</MenuItem>
              <MenuItem value="Suggestion">{t('suggestion')}</MenuItem>
              <MenuItem value="Abonnement">{t('subscription')}</MenuItem>
              <MenuItem value="Autre">{t('other')}</MenuItem>
            </Select>
            <TextField
              fullWidth
              id="message"
              label={t('message')} 
              name="message"
              type="text"
              required
              autoFocus
              margin="normal"
              multiline
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
            >
              {t('send')} {/* Use translation for the button text */}
            </Button>
          </form>
        </Box>
        <Box flex="1" paddingLeft="20px">
          <Typography variant="h6" component="h2" gutterBottom>
            {t('contactInfo')} {/* Use translation for the contact info title */}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>{t('address')}:</strong><br />
            {currentLocation.address}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>{t('emailLabel')}:</strong><br />
            info@example.com
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>{t('phoneLabel')}:</strong><br />
            +01 234 567 88
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>{t('faxLabel')}:</strong><br />
            +01 234 567 89
          </Typography>
          <MapComponent location={currentLocation} />
          <Box display="flex" justifyContent="center" mt={2}>
            <IconButton onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              
            </IconButton>
            <Typography variant="body1" align="center" sx={{ lineHeight: '48px', mx: 2 }}>
            
            </Typography>
            <IconButton onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === locations.length}>
              
            </IconButton>
          </Box>
        </Box>
      </Paper>
    </div>
  );
};

export default Contact;
