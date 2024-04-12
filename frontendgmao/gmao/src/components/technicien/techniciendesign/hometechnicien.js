import React from 'react';
import { Link } from 'react-router-dom';
import "./hometechnicien.scss";
import Sidebar from './sidebar/sidebar';
import Navbar from './navbar/navbar';
import Widget from './widget/widget';
import NavigationBar from './widget/progresbar';

const Pagetechnicien = () => {
  return (
    <div className="technicien-page">
      <Sidebar />
      <div className="technicien-content">
        <Navbar />
        <div className="widgets">
          <Widget type="encour" />
          <Widget type="termine" />
          <Widget type="enattend" />
          <Widget type="Assigné" />
        </div>
        <div className="chart-container">
          <NavigationBar />
        </div>
      </div>
    </div>
  );
};

export default Pagetechnicien;
