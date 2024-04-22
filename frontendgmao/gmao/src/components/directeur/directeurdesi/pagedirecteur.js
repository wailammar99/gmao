
import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebardic';

import Navbar from './Navbar/navbardic';
import Widget from './Widget/widgetdic';
import "./pagedirecteur.scss"
import BarsDirecteur from './bar/bar';




const Pagedirecteur = () => {
  return (
    <div className="directeur-page">
      <Sidebar />
      <div className="directeur-content">
      <Navbar />
      <div className="widgets">
      <Widget type="encour" />
          <Widget type="termine" />
          <Widget type="enattend" />
          <Widget type="Assigné" />
          <Widget type="Clôture" />
          <Widget type="Nouveau" />
          
        </div>
        <div ><BarsDirecteur></BarsDirecteur></div>
       
          
      </div>
    </div>
  );
};

export default Pagedirecteur;