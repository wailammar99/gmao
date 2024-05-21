import "./navbar.scss";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import NotificationPopup from "../../../directeur/NotificationPopup";
import MMessagePopupCitoyen from "./messagepopcitoyen";


const Navbar = () => {
 

  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="search">
         
         
        </div>
        <div className="items">
     
          <div className="item">
        
         <MMessagePopupCitoyen/>
            
          </div>
          <NotificationPopup></NotificationPopup>
        
         
            
          
     
     
          
        </div>
      </div>
    </div>
  );
};

export default Navbar;