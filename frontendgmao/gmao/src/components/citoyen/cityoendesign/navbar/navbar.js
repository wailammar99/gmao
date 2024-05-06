import "./navbar.scss";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import NotificationPopup from "../../../directeur/NotificationPopup";
import MessagePopupCitoyen from "./messagepopcitoyen";


const Navbar = () => {
 

  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="search">
          <input type="text" placeholder="Search..." />
          <SearchOutlinedIcon />
        </div>
        <div className="items">
          <div className="item">
            <LanguageOutlinedIcon className="icon" />
            English
          </div>
          <div className="item">
            <DarkModeOutlinedIcon
              className="icon"
             
            />
          </div>
          <div className="item">
         <MessagePopupCitoyen></MessagePopupCitoyen>
            
          </div>
          <NotificationPopup></NotificationPopup>
          <div className="item">
            <ListOutlinedIcon className="icon" />
          </div>
         
            
          
     
          <div className="item">
            <ListOutlinedIcon className="icon" />
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Navbar;