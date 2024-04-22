import MoreVertIcon from "@mui/icons-material/MoreVert";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import "./figure.scss";
import { CircularProgressbar } from "react-circular-progressbar";
import { useState, useEffect } from "react";
import 'react-circular-progressbar/dist/styles.css';


const Featured = () => {
  const [interventions, setInterventions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedIntervention, setSelectedIntervention] = useState(null);

  useEffect(() => {
    fetchData();
  }, []); // Fetch data when component mounts
  const handleOpenDialog = (intervention) => {
    setSelectedIntervention(intervention);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedIntervention(null);
  };
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("Token not found. Redirecting to login...");
        // Redirect to login page or handle unauthorized access
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/api_intervetion_citoyen/${localStorage.getItem('userId')}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data); // Log the response data to see its structure
        setInterventions(data.interventions || []); // Ensure interventions is initialized as an empty array if data.interventions is undefined
      } else {
        console.error('Failed to fetch interventions');
      }
    } catch (error) {
      console.error('Error fetching interventions:', error);
    }
  };

  // Fonction pour mapper les états aux pourcentages
  const mapStateToPercentage = (state) => {
    switch (state) {
      case 'Nouveau':
        return 0;
  
      case 'Assigné':
        return 25;
      case 'En cours':
        return 50; // Exemple : assigné peut être considéré comme 50% complété
      case 'Terminé':
        return 75;
    
      case 'Clôture':
        return 100;
      default:
        return "pause";
    }
  };

  return (
    
    <div className="ff">
       
      {interventions.map((intervention, index) => (
        <div className="featured" key={index}>
          <div className="top">
         
            <h1 className="title">{intervention.id}</h1>
            <MoreVertIcon fontSize="small" />
          </div>
          <div className="bottom">
            <div className="featuredChart">
              <CircularProgressbar value={mapStateToPercentage(intervention.etat)} text={`${mapStateToPercentage(intervention.etat)}%`} strokeWidth={5} />
            </div>
            <div className="summary">
              <div className="item">
                <div className="itemTitle">etat</div>
                <div className="itemResult negative">
                  
                  <div className="resultAmount">{intervention.etat}</div>
                </div>
              </div>
              <div className="item">
                <div className="itemTitle">date de debut </div>
                <div className="itemResult positive">
                
                  <div className="resultAmount">{intervention.date_debut}</div>
                </div>
              
              </div>
              <div className="item" >
                <div className="itemTitle">date de fin </div>
                <div className="itemResult positive">
                  <KeyboardArrowUpOutlinedIcon fontSize="small"/>
                  <div className="resultAmount">{intervention.date_fin}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      ))}

    </div>
  );
};
 
export default Featured;
