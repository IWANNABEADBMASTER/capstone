import React from "react";
import { Link } from "react-router-dom";
import Logo from "../favicon/Logo.png";
import "../css/Bar.css";

function Bar({ isLoggedIn, username }) {
  return (
    <div className="bar">
      <div>
        <img src={Logo} style={{ width: "75px", height: "75px" }} />
      </div>
      <div style={{ fontSize: "30px" }}>PlayListPro</div>
      <div>Search</div>
      <div>MyList</div>
      {isLoggedIn ? (
        <div className="username">{username} 님</div>
      ) : (
        <div className="login">
          <Link to="/login">Log In</Link>
          <span style={{ margin: "0 5px" }}>/</span>
          <Link to="/signup">Sign In</Link>
        </div>
      )}
    </div>
  );
}

export default Bar;
