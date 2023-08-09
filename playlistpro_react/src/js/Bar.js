import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Peristalsis from "./Peristalsis";
import Alert from "./Alert";
import Logo from "../favicon/Logo.png";
import "../css/Bar.css";

function Bar({ isLoggedIn, isSpotifyLoggedIn, username }) {
  // 알림 창을 보여주는 변수
  const [showAlert, setShowAlert] = useState(false);
  // 알림 창에 들어갈 제목 변수
  const [title, setTitle] = useState("");
  // 알림 창에 들어갈 메시지 변수
  const [message, setMessage] = useState("");
  // 모달 창을 열고 닫을 함수
  const handleAlertButtonClick = () => {
    setShowAlert(false);
  };

  const navigate = useNavigate();
  // 업데이트 페이지로 리다이렉트
  function handleRedirectToUpdate() {
    if (isSpotifyLoggedIn) {
      setShowAlert(true);
      setTitle("사용자 정보 수정 에러");
      setMessage("스포티파이 계정은 사용자 정보 수정이 불가능합니다.");
    } else {
      navigate("/update", { state: { username: username } });
    }
  }

  return (
    <div className="bar">
      <div>
        <a href="/">
          <img
            src={Logo}
            style={{ width: "75px", height: "75px" }}
            alt="로고 이미지"
          />
        </a>
      </div>
      <div style={{ fontSize: "30px" }}>
        <a href="/">PlayListPro</a>
      </div>
      {isSpotifyLoggedIn ? (
        <div>
          <Peristalsis />
        </div>
      ) : (
        <div className="none" />
      )}
      {isLoggedIn || isSpotifyLoggedIn ? (
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

      {showAlert && (
        <Alert
          title={title}
          message={message}
          handleAlertButtonClick={handleAlertButtonClick}
        />
      )}
    </div>
  );
}

export default Bar;
