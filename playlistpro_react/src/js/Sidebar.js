import React from "react";
import Home from "../favicon/Home.svg";
import Logout from "../favicon/Logout.png";
import Playlists from "../favicon/Playlists.svg";
import "../css/Sidebar.css";

const SideBar = ({ handleLogout }) => {
  return (
    <div className="sideBar">
      <div className="sideBarIcon">
        <img src={Home} alt="Home" />
      </div>
      <div>Home</div>
      <div className="sideBarIcon">
        <img src={Playlists} alt="Playlists" />
      </div>
      <div>Playlists</div>
      <div className="sideBarIcon" onClick={handleLogout}>
        <img src={Logout} alt="Logout" />
      </div>
    </div>
  );
};

export default SideBar;
