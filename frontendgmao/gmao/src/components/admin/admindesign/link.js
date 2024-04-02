

import Userliste from "../userlistepage";
import Navbar from "./home/navbar/navbar";
import Sidebar from "./home/sidebar/sidebar";

import "./link.scss"



const Link = () => {
  return (
    <div className="list">
      <Sidebar/>
      <div className="listContainer">
        <Navbar/>
        <Userliste/>
      </div>
    </div>
  )
}

export default Link;