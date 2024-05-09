import React from 'react';
import "./pagechefservice.scss";
import Navbar from '../navbar/navbar';
import Sidebar from '../sidebar/sidebar';
import Widget from '../widget/widget';
import PieChartComponent from '../circule/Cicrule';
import BarsDataset from '../bar/bar';
import Enattendecom from '../enattendedashbord/enattende';


const Chefservice = () => {
  return (
    <div className="chefservice-page">
      <Sidebar />
      <div className="chefservice-content">
        <Navbar />
        <div className="widgets">
          {/* Original Widget components */}
          <Widget type="Annulé" />
          <Widget type="encour" />
          <Widget type="termine" />
          <Widget type="enattend" />
          <Widget type="Assigné" />
          <Widget type="Clôture" />
          

          
        </div>
       
        <div className='chart'> <PieChartComponent></PieChartComponent>
        
        </div>
        <div className='bar'>
        <BarsDataset></BarsDataset>
        
        </div>
        <div className='enatte'><Enattendecom></Enattendecom></div>
        
        {/* Donut Chart */}
       
      </div>
    </div>
    
  );
};

export default Chefservice;
