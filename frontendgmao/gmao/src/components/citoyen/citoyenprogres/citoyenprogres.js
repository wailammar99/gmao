import MoreVertIcon from "@mui/icons-material/MoreVert";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import "./figure.scss";
import { CircularProgressbar } from "react-circular-progressbar";
import { useState, useEffect } from "react";
import 'react-circular-progressbar/dist/styles.css';
 
const Featured = () => {
  const [interventions, setInterventions] = useState([]);
 
  useEffect(() => {
    fetchData();
  }, []);
 
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("Token not found. Redirecting to login...");
        return;
      }
 
      const response = await fetch(`http://127.0.0.1:8000/api_intervetion_citoyen/${localStorage.getItem('userId')}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
 
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setInterventions(data.interventions || []);
      } else {
        console.error('Failed to fetch interventions');
      }
    } catch (error) {
      console.error('Error fetching interventions:', error);
    }
  };
 
  const mapStateToPercentage = (state) => {
    switch (state) {
      case 'Nouveau':
        return 0;
      case 'Assigné':
        return 25;
      case 'En cours':
        return 50;
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
                <div className="itemContent">
                  <span className="itemTitle redText">État:</span>
                  <span className="redText resultAmount">{intervention.etat}</span>
                </div>
                <div className="itemContent">
                  <span className="itemTitle greenText">Date de début :</span>
                  <span className="greenText resultAmount">{intervention.date_debut}</span>
                </div>
                <div className="itemContent">
                  <span className="itemTitle greenText">Date de fin :</span>
                  <span className="greenText resultAmount">{intervention.date_fin}</span>
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