import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';

import PopupMessage from '../../message';
import Navbar from './home/navbar/navbar';
import Sidebar from './home/sidebar/sidebar';

const Adminprofil = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control the dialog visibility
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [old_password, setOldpassword] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("Token not found. Redirecting to login...");
        // Navigate to login page
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/user_infoo/${localStorage.getItem('userId')}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data.user_info);
        setUsername(data.user_info.username);
        setEmail(data.user_info.email);
        setFirstname(data.user_info.first_name);
        setLastname(data.user_info.last_name);
      } else {
        console.error('Failed to fetch user data');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleFirstnameChange = (e) => {
    setFirstname(e.target.value);
  };

  const handleLastnameChange = (e) => {
    setLastname(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleOldpasswordChange = (e) => {
    setOldpassword(e.target.value);
  };

  const handlePassword1Change = (e) => {
    setPassword1(e.target.value);
  };

  const handlePassword2Change = (e) => {
    setPassword2(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/api_modfie_profil/${localStorage.getItem('userId')}/`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          email: email,
          firstname: firstname,
          lastname: lastname
        }),
      });
      if (response.ok) {
        setSuccessMessage('User information updated successfully.');
        setIsDialogOpen(false);
        fetchData();
      } else {
        throw new Error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setError(error.message);
    }
  };

  const handlePasswordFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/api_change_password/${localStorage.getItem('userId')}/`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          old_password: old_password,
          password1: password1,
          password2: password2
        }),
      });
      if (response.ok) {
        setSuccessMessage('Password updated successfully.');
        setShowPasswordForm(false);
        fetchData();
      } else {
        throw new Error('Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setError(error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const handleTogglePasswordForm = () => {
    setShowPasswordForm(!showPasswordForm);
  };

  return (
    <>
      <div className="list">
        <Sidebar />
        <div className="listContainer">
          <Navbar />
          <section style={{ backgroundColor: '#fff' }}>
            <div className="container py-5">
              {successMessage && <PopupMessage message={successMessage} color="success" />}
              <div className="row">
                <div className="col-lg-4">
                  <div className="card mb-4">
                    <div className="card-body text-center">
                      <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp" alt="avatar" className="rounded-circle img-fluid" style={{ width: '150px' }} />
                      <h5 className="my-3">{userData ? userData.name : 'Loading...'}</h5>
                      <p className="text-muted mb-1">{userData ? userData.role : 'Loading...'}</p>
                      <p className="text-muted mb-4">{userData ? userData.location : 'Loading...'}</p>
                      <div className="d-flex justify-content-center mb-2">
                        <Button variant="contained" color="primary" onClick={openDialog}>
                          Modify User Information
                        </Button>
                      </div>
                      <div className="d-flex justify-content-center mb-2">
                        <Button variant="contained" color="secondary" onClick={handleTogglePasswordForm}>
                          Modify Password
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-8">
                  <div className="card m-4">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-sm-3">
                          <p className="mb-0">First Name</p>
                        </div>
                        <div className="col-sm-9">
                          <p className="text-muted mb-0">{userData ? userData.first_name : 'Loading...'}</p>
                        </div>
                      </div>
                      <hr />
                      <div className="row">
                        <div className="col-sm-3">
                          <p className="mb-0">Email</p>
                        </div>
                        <div className="col-sm-9">
                          <p className="text-muted mb-0">{userData ? userData.email : 'Loading...'}</p>
                        </div>
                      </div>
                      <hr />
                      <div className="row">
                        <div className="col-sm-3">
                          <p className="mb-0">Last Name</p>
                        </div>
                        <div className="col-sm-9">
                          <p className="text-muted mb-0">{userData ? userData.last_name : 'Loading...'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Dialog for user information form */}
      <Dialog open={isDialogOpen} onClose={closeDialog}>
        <DialogTitle>Modify User Information</DialogTitle>
        <DialogContent>
          <form onSubmit={handleFormSubmit}>
            <TextField
              label="Username"
              value={username}
              onChange={handleUsernameChange}
              fullWidth
              required
              variant="outlined"
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              label="First Name"
              value={firstname}
              onChange={handleFirstnameChange}
              fullWidth
              required
              variant="outlined"
              margin="normal"
            />
            <TextField
              label="Last Name"
              value={lastname}
              onChange={handleLastnameChange}
              fullWidth
              required
              variant="outlined"
              margin="normal"
            />
            <TextField
              label="Email"
              value={email}
              onChange={handleEmailChange}
              fullWidth
              required
              variant="outlined"
              margin="normal"
            />
            <DialogActions>
              <Button onClick={closeDialog}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                Save Changes
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog for password form */}
      <Dialog open={showPasswordForm} onClose={handleTogglePasswordForm}>
        <DialogTitle>Modify Password</DialogTitle>
        <DialogContent>
          <form onSubmit={handlePasswordFormSubmit}>
            <TextField
              label="Old Password"
              value={old_password}
              onChange={handleOldpasswordChange}
              fullWidth
              required
              variant="outlined"
              margin="normal"
              type='password'
            />
            <TextField
              label="New Password"
              value={password1}
              onChange={handlePassword1Change}
              fullWidth
              required
              variant="outlined"
              margin="normal"
              type='password'
            />
            <TextField
              label="Confirm Password"
              value={password2}
              onChange={handlePassword2Change}
              fullWidth
              required
              variant="outlined"
              margin="normal"
              type='password'
            />
            <DialogActions>
              <Button onClick={handleTogglePasswordForm}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                Save Changes
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Adminprofil;
