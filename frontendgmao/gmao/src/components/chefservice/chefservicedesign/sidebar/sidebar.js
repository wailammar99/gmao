import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import StoreIcon from "@mui/icons-material/Store";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import AddIcon from '@mui/icons-material/Add';
import ListIcon from '@mui/icons-material/List';
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Link } from "react-router-dom";
import MessageIcon from '@mui/icons-material/Message';
import ConstructionIcon from '@mui/icons-material/Construction';

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
        // Clear local storage or perform any other logout actions
       sessionStorage.clear();
       localStorage.clear();

        // Redirect to the login page or any other desired route
        window.location.href = '/login'; // Redirect to the login page
      } else {
        console.error('Failed to logout.');
        // Handle logout failure, display error message, etc.
      }
    } catch (error) {
      console.error('Error logging out:', error);
      // Handle any network errors or exceptions
    }
  };
  
  return (
    <div className="sidebar">
      <div className="top">
        <span className="logo">Chef de Service</span>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">PRINCIPAL</p>
          <Link to="http://localhost:3000/chef_service_dashboard/Id:" style={{ textDecoration: "none" }}>
            <li>
              <DashboardIcon className="icon" />
              <span>Tableau de bord</span>
            </li>
          </Link>

          <p className="title">UTILISATEUR</p>
          <li>
            <Link to="http://localhost:3000/ListtechnicienParservice" style={{ textDecoration: "none" }}>
              <PersonOutlineIcon className="icon" />
              <span>Technicien</span>
            </Link>
          </li>

          <p className="title">UTILE</p>
          <Link to="http://localhost:3000/Chefservicepage" style={{ textDecoration: "none" }}>
            <li>
              <InsertChartIcon className="icon" />
              <span>Toutes les interventions</span>
            </li>
          </Link>
          <Link to="http://localhost:3000/intevetion/map/" style={{ textDecoration: "none" }}>
            <li>
              <InsertChartIcon className="icon" />
              <span>intervention vue geo</span>
            </li>
          </Link>
          <Link to="http://localhost:3000/create/intevention/preventive/" style={{ textDecoration: "none" }}>
            <li>
            <AddIcon className="icon" />  
              <span>Creé intevention preventive </span>
            </li>
          </Link>
          <p className="title">ÉQUIPEMENTS</p>
          <Link to="http://localhost:3000/listeequipement" style={{ textDecoration: "none" }}>
            <li>
              <ConstructionIcon className="icon" />
              <span>Équipements</span>
            </li>
          </Link>
          <Link to="/createequiment" style={{ textDecoration: "none" }}>
            <li>
              <AddIcon className="icon" />
              <span>Ajouter un équipement</span>
            </li>
          </Link>

          <p className="title">UTILISATEUR</p>
          <Link to={"/chefservice/profil"} style={{ textDecoration: "none" }}>
            <li>
              <AccountCircleOutlinedIcon className="icon" />
              <span>Profil</span>
            </li>
          </Link>
          <Link to={"/chefservicenotificationpage"}  style={{ textDecoration: "none" }}>
            <li>
              <NotificationsNoneIcon className="icon" />
              <span>Notifications</span>
            </li>
          </Link>

          <Link to="/login" style={{ textDecoration: "none" }} onClick={handleLogout}>
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
