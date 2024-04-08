
import React from 'react';
import { Link } from 'react-router-dom';
import "./hometechnicien.scss";
import Sidebar from './sidebar/sidebar';
import Navbar from './navbar/navbar';
import Widget from './widget/widget';



const Pagetechnicien = () => {
  return (
    <div className="technicien-page">
      <Sidebar />
      <div className="technicien-content">
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

export default Pagetechnicien;