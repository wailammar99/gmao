import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PopupMessage from './message'; // Assuming PopupMessage component is implemented in './PopupMessage'
import { Avatar, Button, CssBaseline, TextField, FormControlLabel, Checkbox, Link, Grid, Box, Typography, Container, createTheme, ThemeProvider } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const defaultTheme = createTheme();

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();

  // Reset error state on component mount
  useEffect(() => {
    
  }, []);

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/login_react/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.status === 404) {
        setMessage('Le compte n\'est pas actif. Veuillez contacter l\'administrateur.');
        setShowMessage(true);
      } else if (response.status === 400) {
        setMessage('Nom d\'utilisateur ou mot de passe incorrect.');
        setShowMessage(true);
      } else if (response.status === 403) {
        setMessage('Votre compte existe pas  . Contactez l\'administrateur.');
        setShowMessage(true);
      }

      const { token, role, userId,user_username } = await response.json();
      
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem("username",user_username)
     
      localStorage.setItem('role', role); 
      sessionStorage.setItem("sesion",token);

      onLogin();

      if (role === 'admin') {
        navigate(`/admin_dashboard`);
      } else if (role === 'citoyen') {
        navigate(`/citoyen_dashboard/${userId}`);
      } else if (role === 'chefservice') {
        navigate(`/chef_service_dashboard/${userId}`);
      } else if (role === "technicien") {
        navigate(`/technicien_dashboard/${userId}`)
      } else if (role === "directeur") {
        navigate(`/directeur_dashboard`);
      }

      // Hide the message after 1500 milliseconds (1.5 seconds)
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    } catch (error) {
      console.error('Échec de la connexion:', error);
      setError('Échec de la connexion. Veuillez réessayer.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(username, password);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Connexion
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Nom d'utilisateur"
              name="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mot de passe"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Se souvenir de moi"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Connexion
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/passwordsetup" variant="body2">
                  Mot de passe oublié ?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/contact" variant="body2">
                  {"Vous n'avez pas de compte ? Inscrivez-vous"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      {/* Conditionally render PopupMessage if there's an error */}
      {showMessage && <PopupMessage message={message} color="danger" />}
    </ThemeProvider>
  );
};

export default Login;
