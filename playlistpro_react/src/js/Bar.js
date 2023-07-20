import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../favicon/Logo.png";
import "../css/Bar.css";

function Bar({ isLoggedIn, username }) {
  const navigate = useNavigate();
  // 업데이트 페이지로 리다이렉트
  function handleRedirectToUpdate() {
    navigate("/update", { state: { username: username } });
  }

  return (
    <div className="bar">
      <div>
        <a href="/">
          <img src={Logo} style={{ width: "75px", height: "75px" }} />
        </a>
      </div>
      <div style={{ fontSize: "30px" }}>
        <a href="/">PlayListPro</a>
      </div>
      <div>Search</div>
      <div>MyList</div>
      {isLoggedIn ? (
        <div className="username" onClick={() => handleRedirectToUpdate()}>
          {username} 님
        </div>
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