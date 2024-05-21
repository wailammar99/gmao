import React from 'react';
import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AddIcon from '@mui/icons-material/Add';
import ListIcon from '@mui/icons-material/List';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Sidebar = () => {
  const handleLogout = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/logout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = '/login';
      } else {
        console.error('Failed to logout.');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="sidebar">
      <div className="top">
        <span className="logo">Administrator</span>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">PRINCIPAL</p>
          <Link to="/admin_dashboard" style={{ textDecoration: 'none' }}>
            <li>
              <DashboardIcon className="icon" />
              <span>Tableau de bord</span>
            </li>
          </Link>

          <p className="title">UTILISATEUR</p>
          <Link to="/UserListPage" style={{ textDecoration: 'none' }}>
            <li>
              <PersonOutlineIcon className="icon" />
              <span>Utilisateurs</span>
            </li>
          </Link>

          <Link to="/CreateUser" style={{ textDecoration: 'none' }}>
            <li>
              <AddIcon className="icon" />
              <span>Créer un utilisateur</span>
            </li>
          </Link>

          <p className="title">SERVICE</p>
          <Link to="/create-service" style={{ textDecoration: 'none' }}>
            <li>
              <AddIcon className="icon" />
              <span>Créer un service</span>
            </li>
          </Link>

          <Link to="/listeservice" style={{ textDecoration: 'none' }}>
            <li>
              <ListIcon className="icon" />
              <span>Liste des services</span>
            </li>
          </Link>

          <p className="title">UTILE</p>

          <Link to="/Notificationadmin" style={{ textDecoration: 'none' }}>
            <li>
              <NotificationsNoneIcon className="icon" />
              <span>Notifications</span>
            </li>
          </Link>

          <Link to="/contactadmin" style={{ textDecoration: 'none' }}>
            <li>
              <ContactMailIcon className="icon" />
              <span>Contact</span>
            </li>
          </Link>

          <p className="title">UTILISATEUR</p>

          <Link to="/adminprofil" style={{ textDecoration: 'none' }}>
            <li>
              <AccountCircleOutlinedIcon className="icon" />
              <span>Profil</span>
            </li>
          </Link>

          <Link to="/" style={{ textDecoration: 'none' }} onClick={handleLogout}>
            <li>
              <ExitToAppIcon className="icon" />
              <span>Déconnexion</span>
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
