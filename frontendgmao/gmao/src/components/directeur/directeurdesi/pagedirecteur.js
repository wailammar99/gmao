import React, { useEffect } from 'react';
import { Link, useHistory,Navigate, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebardic';
import Navbar from './Navbar/navbardic';
import Widget from './Widget/widgetdic';
import "./pagedirecteur.scss"
import BarsDirecteur from './bar/bar';
import Circlecompte from './circle/circlecompte';
import Circleactivenoactive from './circle/circleactiveetpasactive';

const Pagedirecteur = () => {
  const navigate=useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to the login page if token doesn't exist
      navigate('/login');
    }
  }, []);

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
        <div className='bar'>
          <BarsDirecteur/>
        </div>
        <div className='chart'>
          <Circlecompte></Circlecompte>
          <Circleactivenoactive></Circleactivenoactive>
        </div>
      </div>
    </div>
  );
};

export default Pagedirecteur;
