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
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';


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
        localStorage.removeItem('token');
        localStorage.removeItem('userId');

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
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Technicien</span>
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">PRINCIPAL</p>
          <Link to="/technicien_dashboard/:Id" style={{ textDecoration: "none" }}>
          <li>
            <DashboardIcon className="icon" />
            <span>Tableau de bord</span>
          </li>
          </Link>


            <p className="title">INTERVENTION</p>

           <Link to="/technicienpage" style={{ textDecoration: "none" }}>
          <li>
            <CreditCardIcon className="icon" />
            <span>Intervention</span>
          </li>
          </Link>

         
         
          
          <Link  to={"/calender/technien" } style={{ textDecoration: "none" }}>
          <li>
          <CalendarMonthIcon className="icon" />
            <span>Calendrier </span>
          </li>
          </Link>
          <Link  to={"/map/technien" } style={{ textDecoration: "none" }}>
          <li>
          <CalendarMonthIcon className="icon" />
            <span>vue goalocalisation  </span>
          </li>
          </Link>
         
         

          <p className="title">UTILISATEUR</p>
          <Link to={"/technicienprofil"} style={{ textDecoration: "none" }}>
          <li>
            <AccountCircleOutlinedIcon className="icon" />
            <span>Profil</span>
          </li>
          </Link>
          <Link to={"/technicinenotificationpage"}  style={{ textDecoration: "none" }}>
          <li>
            <NotificationsNoneIcon className="icon" />
            <span>Notifications</span>
          </li>
          </Link>
          <Link to="/login" style={{ textDecoration: "none" }} onClick={handleLogout}>
           <li>
                <ExitToAppIcon className="icon" />
                  Déconnexion
             </li>
           </Link>
        
        </ul>
      </div>
      
      </div>
   
  );
};

export default Sidebar;
