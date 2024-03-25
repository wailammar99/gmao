// AdminNavbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../../logoutbutton';

const userId=localStorage.getItem('userid')
const Chefservicenavbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">chef service  dashbord</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/chefservice_dashboard/id:" className="nav-link active" aria-current="page">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="" className="nav-link">create  intervetion   </Link>
            </li>
         
            <li className="nav-item">
            <Link to="/profil" className="nav-link">profil </Link>
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

export default Chefservicenavbar;
