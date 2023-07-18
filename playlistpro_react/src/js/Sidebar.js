import React from "react";
import { useNavigate } from "react-router-dom";

import Home from "../favicon/Home.png";
import Clickhome from "../favicon/Clickhome.png";
import Playlist from "../favicon/Playlist.png";
import Clickplaylist from "../favicon/Clickplaylist.png";
import Search from "../favicon/Search.png";
import Clicksearch from "../favicon/Clicksearch.png";
import Logout from "../favicon/Logout.png";
import "../css/Sidebar.css";

const SideBar = ({ handleLogout, state, handleStateChange, isLoggedIn }) => {
  const navigate = useNavigate();
  // 로그인 상태에서만 하단의 로그아웃 배경색 지정
  const sideBarClass = isLoggedIn ? "sideBar" : "noStyleSideBar";

  // 로그인 페이지로 리다이렉트
  function handleRedirectToLogin() {
    alert("먼저 로그인을 해주세요");
    navigate("/login");
  }

  return (
    <div className={sideBarClass}>
      <div className="sideBarIcon" onClick={() => handleStateChange("home")}>
        <div>
          {state === "home" ? (
            <img src={Clickhome} alt="Clickhome" />
          ) : (
            <img src={Home} alt="Home" />
          )}
        </div>
        <div>Home</div>
      </div>

      <div className="sideBarIcon" onClick={() => handleStateChange("search")}>
        <div>
          {state === "search" ? (
            <img src={Clicksearch} alt="Clicksearch" />
          ) : (
            <img src={Search} alt="Search" />
          )}
        </div>
        <div>Search</div>
      </div>

      <div
        className="sideBarIcon"
        onClick={() =>
          isLoggedIn ? handleStateChange("playlist") : handleRedirectToLogin()
        }
      >
        <div>
          {state === "playlist" ? (
            <img src={Clickplaylist} alt="Clickplaylist" />
          ) : (
            <img src={Playlist} alt="Playlist" />
          )}
        </div>
        <div>Playlists</div>
      </div>

      {isLoggedIn ? (
        <div className="sideBarIcon" onClick={handleLogout}>
          <img src={Logout} alt="Logout" />
        </div>
      ) : (
        <div />
      )}
    </div>
  );
};

export default SideBar;
