import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "./Alert";
import Home from "../favicon/Home.png";
import Clickhome from "../favicon/Clickhome.png";
import Playlist from "../favicon/Playlist.png";
import Clickplaylist from "../favicon/Clickplaylist.png";
import Search from "../favicon/Search.png";
import Clicksearch from "../favicon/Clicksearch.png";
import Logout from "../favicon/Logout.png";
import "../css/Sidebar.css";

const SideBar = ({
  handleLogout,
  state,
  handleStateChange,
  isLoggedIn,
  isSpotifyLoggedIn,
}) => {
  const navigate = useNavigate();

  // 알림 창을 보여주는 변수
  const [showAlert, setShowAlert] = useState(false);
  // 알림 창에 들어갈 제목 변수
  const [title, setTitle] = useState("");
  // 알림 창에 들어갈 메시지 변수
  const [message, setMessage] = useState("");
  // 모달 창을 열고 닫을 함수
  const handleAlertButtonClick = () => {
    setShowAlert(false);
    // 로그인을 안한 경우, 알림 창을 보여주고 알림 창을 닫으면 로그인 페이지로 이동
    navigate("/login");
  };

  // 로그인 상태에서만 하단의 로그아웃 배경색 지정
  const sideBarClass = isLoggedIn ? "sideBar" : "noStyleSideBar";

  // 로그인 페이지로 리다이렉트
  function handleRedirectToLogin() {
    setShowAlert(true);
    setTitle("플레이리스트가 없습니다");
    setMessage("먼저 로그인을 해주세요.");
  }

  return (
    <div className={sideBarClass}>
      <div className="sideBarIcon" onClick={() => handleStateChange("home")}>
        <div>
          {state === "home" ? (
            <img src={Clickhome} alt="홈 클릭 시" />
          ) : (
            <img src={Home} alt="홈" />
          )}
        </div>
        <div>Home</div>
      </div>

      <div className="sideBarIcon" onClick={() => handleStateChange("search")}>
        <div>
          {state === "search" ? (
            <img src={Clicksearch} alt="검색 클릭 시" />
          ) : (
            <img src={Search} alt="검색" />
          )}
        </div>
        <div>Search</div>
      </div>

      <div
        className="sideBarIcon"
        onClick={() =>
          isLoggedIn || isSpotifyLoggedIn
            ? handleStateChange("playlist")
            : handleRedirectToLogin()
        }
      >
        <div>
          {state === "playlist" ? (
            <img src={Clickplaylist} alt="플레이리스트 클릭 시" />
          ) : (
            <img src={Playlist} alt="플레이리스트" />
          )}
        </div>
        <div>Playlists</div>
      </div>

      {isLoggedIn || isSpotifyLoggedIn ? (
        <div className="sideBarIcon" onClick={handleLogout}>
          <img src={Logout} alt="로그아웃" />
        </div>
      ) : (
        <div />
      )}

      {showAlert && (
        <Alert
          title={title}
          message={message}
          handleAlertButtonClick={handleAlertButtonClick}
        />
      )}
    </div>
  );
};

export default SideBar;
