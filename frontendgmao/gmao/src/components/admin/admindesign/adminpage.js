// AdminPage.js
import React from 'react';
import "./adminpage.scss";
import Sidebar from './home/sidebar/sidebar';
import Navbar from './home/navbar/navbar';
import Widget from './home/widget/widget';
import PieChartComponent from './home/char/char';
import Featured from './home/navigationbar/navigationbar';



const AdminPage = () => {
  return (
    <div className="admin-page">
      <Sidebar />
      <div className="admin-content">
        <Navbar />
        <div className="widgets">
          <Widget type="technicien" />
          <Widget type="chefservice" />
          <Widget type="directeur" />
          <Widget type="citoyen" />
        </div>
        
        <div style={{ display: 'flex' }}>
  <div className="chart" style={{ flex: 1 }}>
    <PieChartComponent></PieChartComponent>
  </div>
  <div className="navi" style={{ flex: 1 }}>
    <Featured></Featured>
  </div>
</div> 
      </div>
    </div>
  );
};

export default AdminPage;