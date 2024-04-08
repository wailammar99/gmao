// AdminPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import "./pagechefservice.scss";
import Navbar from '../navbar/navbar';
import Sidebar from '../sidebar/sidebar';



const Chefservice = () => {
  return (
    <div className="chefservice-page">
      <Sidebar />
      <div className="chefservice-content">
        <Navbar />
        <div className="widgets">
        
        </div>
          
      </div>
    </div>
  );
};

export default Chefservice;