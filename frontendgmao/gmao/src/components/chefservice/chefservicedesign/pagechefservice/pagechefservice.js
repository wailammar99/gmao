import React, { useEffect } from 'react';
import "./pagechefservice.scss";
import Navbar from '../navbar/navbar';
import Sidebar from '../sidebar/sidebar';
import Widget from '../widget/widget';
import PieChartComponent from '../circule/Cicrule';
import BarsDataset from '../bar/bar';
import Enattendecom from '../enattendedashbord/enattende';
import { Navigate, useNavigate } from 'react-router-dom';


const Chefservice = () => {
  const token =localStorage.getItem("token");
  const role =localStorage.getItem("role");
  const navigate=useNavigate();
  useEffect(() => {
    if (token && role==="chefservice")
      {
       console.log("autorise   ");
      } 
      else 
      {
        console.log("de enter dans le dahbord chefservice");
      navigate("/login");}
  }, [token]);
 
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
          <Widget type="Nouveau" />
          

          
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
