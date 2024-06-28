import "./Sidebardic.scss";
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
import SummarizeIcon from '@mui/icons-material/Summarize';
import CreateIcon from '@mui/icons-material/Create';
import { Link } from "react-router-dom";

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
        window.location.href = '/login'; // Rediriger vers la page de connexion
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
        <Link to="/directeur_dashboard" style={{ textDecoration: "none" }}>
          <span className="logo">Directeur</span>
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">MAIN</p>
          <Link to="/directeur_dashboard" style={{ textDecoration: "none" }}>
          <li>
            <DashboardIcon className="icon" />
            <span>Tableau de bord</span>
          </li>
          </Link>

          <p className="title">USER</p>
            
          <Link to="http://localhost:3000/Listchefservice" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon" />
              <span>Chef service</span>
            </li>
            </Link>

            <Link to="http://localhost:3000/Listtechnicien" style={{ textDecoration: "none" }}>
            <li>
            <PersonOutlineIcon className="icon" />
              <span> Technicien</span>
            </li>
           </Link>
           <Link to="http://localhost:3000/comptenouveux" style={{ textDecoration: "none" }}>
            <li>
            <PersonOutlineIcon className="icon" />
              <span> Les nouveaux comptes </span>
            </li>
           </Link>


           <p className="title">INTERVENTION</p>

           <Link to="http://localhost:3000/intervention" style={{ textDecoration: "none" }}>
          <li>
            <CreditCardIcon className="icon" />
            <span>Intervention</span>
          </li>
          </Link>

          
          <p className="title">USEFUL</p>
         

          
          <Link to={"/notificationdiracteur"}  style={{ textDecoration: "none" }} >
          <li>
          <NotificationsNoneIcon className="icon" />
            <span>Notifications</span>
          </li>
          </Link>
          <p className="title">RAPPORT</p>
          <Link to={"/listerapport"} style={{ textDecoration: "none" }} >
          <li>
          <SummarizeIcon className="icon"></SummarizeIcon>
         
          <span>Liste rapport </span>
          </li>
          </Link>

        
          <Link to={"/RaportForm"} style={{ textDecoration: "none" }} >
          <li>
          <CreateIcon className="icon"></CreateIcon>
          <span>Créer rapport</span>
          </li>
          </Link>

           
          
        

          <p className="title">USER</p>
          <Link to={"/profildirecteur"} style={{ textDecoration: "none" }} >

          <li>
            <AccountCircleOutlinedIcon className="icon" />
            <span>Profil</span>
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
