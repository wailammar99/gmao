// AdminNavbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../../logoutbutton';

const AdminNavbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">admin dashbord</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/" className="nav-link active" aria-current="page">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/userlist" className="nav-link">liste de utilisateur </Link>
            </li>
            <li className="nav-item">
              <Link to="/create_user" className="nav-link">Create utilisateur</Link>
            </li>
            <li className="nav-item">
            <Link to="/profil" className="nav-link">profil </Link>
            </li>
            <li className="nav-item">
            <Link to="/create_service" className="nav-link">Create service </Link>
            </li>
            <li className="nav-item">
            <LogoutButton></LogoutButton>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
