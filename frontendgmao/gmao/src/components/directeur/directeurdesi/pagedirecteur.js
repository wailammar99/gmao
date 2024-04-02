
import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebardic';

import Navbar from './Navbar/navbardic';
import Widget from './Widget/widgetdic';
import './pagedirecteur.scss';




const Pagedirecteur = () => {
  return (
    <div className="directeur-page">
      <Sidebar />
      <div className="directeur-content">
      <Navbar />
      <div className="widgets">
          <Widget type="user" />
          <Widget type="order" />
          <Widget type="earning" />
          <Widget type="balance" />
        </div>
          
      </div>
    </div>
  );
};

export default Pagedirecteur;