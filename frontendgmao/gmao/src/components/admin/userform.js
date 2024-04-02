import React, { useState, useEffect } from 'react';



function UserForm({ user, onSubmit }) {
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      });
    } else {
      // Reset form data when user is null
      setFormData({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
   
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="username" className="form-label">Username:</label>
        <input type="text" name="username" id="username" className="form-control" value={formData.username} onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label htmlFor="first_name" className="form-label">First Name:</label>
        <input type="text" name="first_name" id="first_name" className="form-control" value={formData.first_name} onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label htmlFor="last_name" className="form-label">Last Name:</label>
        <input type="text" name="last_name" id="last_name" className="form-control" value={formData.last_name} onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email:</label>
        <input type="email" name="email" id="email" className="form-control" value={formData.email} onChange={handleChange} />
      </div>
      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
   
  );
}

export default UserForm;
