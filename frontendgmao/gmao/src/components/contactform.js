import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Select, MenuItem } from '@mui/material';
import ContactMailIcon from '@mui/icons-material/ContactMail';
 
const Contact = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState('');
 
  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique pour gérer l'envoi du formulaire
  };
 
  return (
    <Box
      position="absolute"
      top="5%"
      left="25%"
      transform="translate(-50%, -50%)"
      width="600px"
      padding="20px"
      borderRadius="10px"
      boxShadow="0 0 10px rgba(0, 0, 0, 0.1)" // Ajout de l'ombre pour le cadre 3D
      bgcolor="#fff"
      textAlign="center"
    >
      <ContactMailIcon sx={{ fontSize: 48, mb: 2 }} />
      <Typography variant="h5" component="h1" gutterBottom>
        Contactez-moi
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          id="email"
          label="Adresse email"
          name="email"
          type="email"
          autoFocus
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
         <TextField
          fullWidth
          id="phone"
          label="Numéro de téléphone"
          name="phone"
          type="tel"
          autoFocus
          margin="normal"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <TextField
          fullWidth
          id="name"
          label="Nom"
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
          label="Raison"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        >
          <MenuItem value="Probleme">Problème</MenuItem>
          <MenuItem value="Publicite">Publicité</MenuItem>
          <MenuItem value="Subjection">Suggestion</MenuItem>
          <MenuItem value="Abonnemment">Abonnemment</MenuItem>
          <MenuItem value="Autre">Autre</MenuItem>
        </Select>
        <TextField
          fullWidth
          id="message"
          label="Message"
          name="message"
          type="text"
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
          Envoyer
        </Button>
      </form>
    </Box>
  );
};
 
export default Contact