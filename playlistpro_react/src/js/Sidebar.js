import React from "react";
import Home from "../favicon/Home.png";
import Clickhome from "../favicon/Clickhome.png";
import Playlist from "../favicon/Playlist.png";
import Clickplaylist from "../favicon/Clickplaylist.png";
import Search from "../favicon/Search.png";
import Clicksearch from "../favicon/Clicksearch.png";
import Logout from "../favicon/Logout.png";
import "../css/Sidebar.css";

const SideBar = ({ handleLogout, state, handleStateChange, isLoggedIn }) => {
  // 로그인 상태에서만 하단의 로그아웃 배경색 지정
  const sideBarClass = isLoggedIn ? "sideBar" : "noStyleSideBar";

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

      {isLoggedIn ? (
        <div
          className="sideBarIcon"
          onClick={() => handleStateChange("playlist")}
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
      ) : (
        <div />
      )}

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
