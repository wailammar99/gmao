
import React, { useState, useEffect } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Link, useNavigate } from "react-router-dom";
import "./navigationbar.scss" ;

const Featured = () => {
  const [t, setT] = useState(0);
  const token =localStorage.getItem("token");
  const role =localStorage.getItem("role");
  const en_id=localStorage.getItem("enterprise_id");
  const navigate=useNavigate();
  useEffect(() => {
    if (token && role==="admin")
      {
        fetchData();
      }
      else 
      {
        navigate("/login");
      }
    
  }, [token,role]);

  const fetchData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/enterprise/${en_id}/services`,
      {
        method:"GET",
        headers: {
          'Authorization': `token ${token}`,

      }});
      if (response.ok) {
        const data = await response.json();
        const taille = data.length;
        setT(taille);
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  return (
    <div className="featured">
      <div className="top">
        <h1 className="title">Les services</h1>
      </div>
      <div className="bottom">
        <div className="featuredChart">
          <CircularProgressbar value={t} text={`${t}`} />
        </div>
        <Link to="/listeservice" style={{ textDecoration: "none" , color: "black" }}>
          <span className="link">Voir tous les service</span>
        </Link>
      </div>
    </div>
  );
};

export default Featured;
