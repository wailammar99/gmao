// AdminPage.js
import React from 'react';

import "./adminpage.scss";
import Sidebar from './home/sidebar/sidebar';

import Navbar from './home/navbar/navbar';
import Widget from './home/widget/widget';

const AdminPage = () => {
  return (
    <div className="admin-page">
      <Sidebar />
      <div className="admin-content">
        <Navbar />
        
        
      
          
      </div>
    </div>
  );
};

export default AdminPage;