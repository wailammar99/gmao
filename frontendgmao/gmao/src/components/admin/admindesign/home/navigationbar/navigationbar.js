
import React, { useState, useEffect } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Link } from "react-router-dom";
import "./navigationbar.scss" ;

const Featured = () => {
  const [t, setT] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/Serviceliste/');
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
