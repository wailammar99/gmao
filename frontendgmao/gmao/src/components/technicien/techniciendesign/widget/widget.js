import React, { useEffect, useState } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";

const Widget = ({ type }) => {
  const [interventionCount, setInterventionCount] = useState(0);

  useEffect(() => {
    if (type === "user") {
      fetchInterventionCount();
    }
  }, [type]);

  const fetchInterventionCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
  
      if (!token || !userId) {
        console.log("Token or userId not found. Redirecting to login...");
        return;
      }
  
      const response = await fetch(`http://127.0.0.1:8000/liste_intervetion_technicien/${userId}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });
  
      if (response.ok) {
        const data = await response.json();
        // Assuming data is an array of interventions, set count to the length of the array
        setInterventionCount(data.length);
      } else {
        console.error("Failed to fetch intervention count:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching intervention count:", error);
    }
  };

  let data;
  let amount = interventionCount; // Set the amount to intervention count

  const diff = 20; // temporary

  switch (type) {
    case "user":
      data = {
        title: "intervention",
        isMoney: false,
        link: "See all interventions",
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "order":
      data = {
        title: "ORDERS",
        isMoney: false,
        link: "View all orders",
        icon: (
          <ShoppingCartOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
            }}
          />
        ),
      };
      break;
    case "earning":
      data = {
        title: "EARNINGS",
        isMoney: true,
        link: "View net earnings",
        icon: (
          <MonetizationOnOutlinedIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        ),
      };
      break;
    case "balance":
      data = {
        title: "BALANCE",
        isMoney: true,
        link: "See details",
        icon: (
          <AccountBalanceWalletOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "purple",
            }}
          />
        ),
      };
      break;
    default:
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {data.isMoney && "$"} {amount}
        </span>
        <span className="link">{data.link}</span>
      </div>
      <div className="right">
        <div className="percentage positive">
          <KeyboardArrowUpIcon />
          {diff} %
        </div>
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
