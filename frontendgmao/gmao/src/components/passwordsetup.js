import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const PasswordResetForm = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/reset_password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        // Password reset email sent successfully
        // You can show a success message or redirect the user to a confirmation page
        console.log('Password reset email sent successfully');
      } else {
        // Handle errors if the password reset email fails to send
        console.error('Failed to send password reset email');
      }
    } catch (error) {
      console.error('Error sending password reset email:', error);
    }
  };

  return (
    <Box
      position="absolute"
      top="20%"
      left="40%"
      transform="translate(-50%, -50%)"
      width="300px"
      textAlign="center"
    >
      <LockOutlinedIcon sx={{ fontSize: 48, mb: 2 }} />
      <Typography variant="h5" component="h1" gutterBottom>
        Réinitialiser le mot de passe
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          id="email"
          label="Adresse email"
          name="email"
          autoFocus
          type='email'
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

export default PasswordResetForm;
