
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
            <span>Dashboard</span>
          </li>
          </Link>

          <p className="title">USER</p>
            
          <Link to="http://localhost:3000/listecostumer" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon" />
              <span>Users</span>
            </li>
            </Link>

         
            <li>
            <AddIcon className="icon" />
              <span>Creat User</span>
            </li>
           

          <li>
            <CreditCardIcon className="icon" />
            <span>Orders</span>
          </li>
          <li>
            <LocalShippingIcon className="icon" />
            <span>Delivery</span>
          </li>
          <p className="title">USEFUL</p>
          <li>
            <InsertChartIcon className="icon" />
            <span>Stats</span>
          </li>

          <li>
            <NotificationsNoneIcon className="icon" />
            <span>Notifications</span>
          </li>
          <p className="title">SERVICE</p>
          <li>
         
            <li>
            <AddIcon className="icon" />
            <span>Create System </span>
            </li>
          </li>
         
          <li>
            <ListIcon className="icon" />
            <span>Liste Service</span>
          </li>
          
          <li>
            <SettingsApplicationsIcon className="icon" />
            <span>Settings</span>
          </li>

          <p className="title">USER</p>
          <li>
            <AccountCircleOutlinedIcon className="icon" />
            <span>Profile</span>
          </li>
          
          <Link to="/" style={{ textDecoration: "none" }} onClick={handleLogout}>
           <li>
                <ExitToAppIcon className="icon" />
                  Logout
             </li>
           </Link>
        
        </ul>
      </div>
      
      </div>
   
  );
};

export default Sidebar;
