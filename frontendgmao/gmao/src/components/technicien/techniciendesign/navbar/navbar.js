import "./navbar.scss";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import NotificationPopup from "../../../directeur/NotificationPopup";
import { useState } from "react";
import MessagePopupTechnicien from "../../messagepopTechnicien";



const Navbar = ({onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Function to handle changes to the search input
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const handleSearchSubmit = () => {
    onSearch(searchQuery);
  };
 

  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="search">
        
          
        
        </div>
        <div className="items">
      
     
          <NotificationPopup />
        
          
      
        
           
           <MessagePopupTechnicien></MessagePopupTechnicien>
         </div>
      </div>
    </div>
  );
};

export default Navbar;