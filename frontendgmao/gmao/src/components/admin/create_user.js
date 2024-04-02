
import React, { useState } from 'react';
import PopupMessage from '../message';
import Sidebar from './admindesign/home/sidebar/sidebar';
import Navbar from './admindesign/home/navbar/navbar';


const CreateUser = ({ onUserCreated }) => {
  const [username, setUsername] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [email, setEmail] = useState('');
  const [isDirecteur, setIsDirecteur] = useState(false);
  const [isTechnicien, setIsTechnicien] = useState(false);
  const [ischefservice, setIschefservice] = useState(false);
  const [isadmin, setIsadmin] = useState(false);
  const [is_citoyen, setiscitoyen] = useState(false);
  const [first_name, setfirst_name] = useState('');
  const [last_name, setlast_name] = useState('');
  const [phone, setPhone] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/api_create_user/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password1: password1,
          password2: password2,
          email: email,
          is_directeur: isDirecteur,
          is_technicien: isTechnicien,
          is_chefservice: ischefservice,
          is_admin: isadmin,
          is_citoyen: is_citoyen,
          last_name: last_name,
          first_name: first_name,
          phone: phone,
        }),
      });
      if (response.ok) {
        console.log('User created successfully');
        setShowMessage(true);
        onUserCreated();
      } else {
        console.error('Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <div className="list">
         <Sidebar/>
        <div className="listContainer">
         <Navbar/>
     
      <h2>Create New User</h2>
      {showMessage && <PopupMessage message="User created successfully" color="success" />}
      <form onSubmit={handleCreateUser}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input type="text" className="form-control" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="nom" className="form-label">Nom</label>
          <input type="text" className="form-control" id="nom" value={first_name} onChange={(e) => setfirst_name(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="prenom" className="form-label">Prenom</label>
          <input type="text" className="form-control" id="prenom" value={last_name} onChange={(e) => setlast_name(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="password1" className="form-label">Password</label>
          <input type="password" className="form-control" id="password1" value={password1} onChange={(e) => setPassword1(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="password2" className="form-label">Confirm Password</label>
          <input type="password" className="form-control" id="password2" value={password2} onChange={(e) => setPassword2(e.target.value)} required />
        </div>
        <div className="mb-3 form-check">
          <input type="checkbox" className="form-check-input" id="isDirecteur" checked={isDirecteur} onChange={(e) => setIsDirecteur(e.target.checked)} />
          <label className="form-check-label" htmlFor="isDirecteur">Is Directeur</label>
        </div>
        <div className="mb-3 form-check">
          <input type="checkbox" className="form-check-input" id="isTechnicien" checked={isTechnicien} onChange={(e) => setIsTechnicien(e.target.checked)} />
          <label className="form-check-label" htmlFor="isTechnicien">Is Technicien</label>
        </div>
        <div className="mb-3 form-check">
          <input type="checkbox" className="form-check-input" id="is_citoyen" checked={is_citoyen} onChange={(e) => setiscitoyen(e.target.checked)} />
          <label className="form-check-label" htmlFor="is_citoyen">Is Citoyen</label>
        </div>
        <div className="mb-3 form-check">
          <input type="checkbox" className="form-check-input" id="is_chefservice" checked={ischefservice} onChange={(e) => setIschefservice(e.target.checked)} />
          <label className="form-check-label" htmlFor="is_chefservice">Is Chef Service</label>
        </div>
        <div className="mb-3 form-check">
          <input type="checkbox" className="form-check-input" id="is_admin" checked={isadmin} onChange={(e) => setIsadmin(e.target.checked)} />
          <label className="form-check-label" htmlFor="is_admin">Is Admin</label>
        </div>
        <button type="submit" className="btn btn-primary">Create User</button>
        </form>
    </div>
    </div>
      );
    };
    
    export default CreateUser;