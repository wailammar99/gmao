import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PopupMessage from './message';
import { Avatar, Button, CssBaseline, TextField, FormControlLabel, Checkbox, Link, Grid, Box, Typography, Container, createTheme, ThemeProvider } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';


const defaultTheme = createTheme();

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

      if (!response.ok) {
        throw new Error('mot ');
      }

      const { token, role, userId } = await response.json();
      
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);

      onLogin();

      if (role === 'admin') {
        navigate(`/admin_dashboard/${userId}`);
      } else if (role === 'citoyen') {
        navigate(`/citoyen_dashboard/${userId}`);
      }
      else if (role==='chefservice') {
        navigate(`/chef_service_dashboard/${userId}`);
      }
      else if (role==="technicien") {
        navigate(`/technicien_dashboard/${userId}`)
      }
      else if (role==="directeur") {
        navigate(`/directeur_dashboard`);
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed. Please try again.');
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
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
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
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      {/* Conditionally render PopupMessage if there's an error */}
      {error && <PopupMessage message={error} color="danger" />}
    </ThemeProvider>
  );
};

export default Login;
