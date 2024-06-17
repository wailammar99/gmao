
import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button } from '@mui/material';

const UpdateForm = ({ id, open, handleClose, fetchData ,initialFormData}) => {
  const [formData, setFormData] = useState({ title: '', description: '', adresse: '' });
  const token = localStorage.getItem("token");

  useEffect(() => {
    setFormData(initialFormData);
    if (id) {
      fetchInterventionData(id);
      
    }
  }, [id,initialFormData]);

  const fetchInterventionData = async (interventionId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/intervention/${id}/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(data);
      } else {
        alert('Failed to fetch intervention data');
      }
    } catch (error) {
      console.error('Error fetching intervention data:', error);
      alert('An error occurred while fetching the intervention data');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/intervention/${id}/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Intervention updated successfully!');
        handleClose();
        fetchData();
      } else {
        alert('Failed to update intervention');
      }
    } catch (error) {
      console.error('Error updating intervention:', error);
      alert('An error occurred while updating the intervention');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Update Intervention</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please fill out the form to update the intervention.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          InputProps={{
            disableUnderline: true,
            style: { backgroundColor: 'transparent', boxShadow: 'none' },
          }}
          label="Title"
          type="text"
          fullWidth
          variant="standard"
          value={formData.title}
          onChange={handleChange}
          sx={{ marginBottom: 5 }}
        />
        <TextField
          margin="dense"
          name="description"
          label="Description"
          type="text"
          fullWidth
          variant="standard"
          value={formData.description}
          onChange={handleChange}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          margin="dense"
          name="adresse"
          label="Address"
          type="text"
          fullWidth
          variant="standard"
          value={formData.adresse}
          onChange={handleChange}
          sx={{ marginBottom: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Update</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateForm;
