
import React from 'react';
import { Link } from 'react-router-dom';
import "./homecityoen.scss";
import Sidebar from './sidebar/sidebar';
import Navbar from './navbar/navbar';
import Widget from './widget/widget';
import Featured from '../citoyenprogres/citoyenprogres';





const Pagecityoen = () => {
  return (
    <div className="cityoen-page">
      <Sidebar />
      <div className="cityoen-content">
      <Navbar />
      <div className="widgets">
      <Widget type="Nouveau" />
      <Widget type="Assigné" />
          <Widget type="encour" />
          <Widget type="termine" />
          <Widget type="enattend" />
         
          <Widget type="Clôture" />
        </div>
        <div className='figure'><Featured></Featured></div>
      </div>
    </div>
  );
};

export default Pagecityoen;