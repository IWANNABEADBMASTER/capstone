import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { useEffect, useState } from "react";

import Logo from "../favicon/Logo.png";
import "../css/Main.css";
import SideBar from "./Sidebar";

function Main() {
  const [username, setUsername] = useState("");

  // 로컬 스토리지에서 토큰을 가져옵니다.
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("access_token")
  );

  useEffect(() => {
    // 토큰이 존재할 경우에만 백엔드로부터 사용자 정보를 가져옵니다.
    if (accessToken !== null && accessToken.length > 0) {
      console.log(accessToken);
      // 백엔드에서 사용자 정보를 가져오는 함수 호출
      fetch("http://127.0.0.1:8000/main", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const { username } = data;
          setUsername(username);
        })
        .catch((error) => {
          // 오류 처리 로직을 작성합니다.
        });
    }
  }, [accessToken]);

  const handleLogout = () => {
    fetch("http://127.0.0.1:8000/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ token: accessToken }),
    })
      .then((response) => {
        if (response.ok) {
          // 서버에서 로그아웃 성공 응답을 받았을 때 클라이언트에서 토큰을 삭제하고 추가적인 처리를 진행할 수 있습니다.
          localStorage.removeItem("access_token");
          setAccessToken("");
          console.log("토큰 삭제");
          // 추가적인 로직을 진행하거나 다른 동작을 수행할 수 있습니다.
        } else {
          // 로그아웃 실패 시에 대한 처리를 진행합니다.
          console.log("로그아웃 실패");
          localStorage.removeItem("access_token");
        }
      })
      .catch((error) => {
        // 요청 실패 시에 대한 처리를 진행합니다.
        console.log("로그아웃 요청 에러", error);
      });
  };

  return (
    <div className="main">
      <div className="bar">
        <div>
          <img src={Logo} style={{ width: "75px", height: "75px" }} />
        </div>
        <div style={{ fontSize: "30px" }}>PlayListPro</div>
        <div>Search</div>
        <div>MyList</div>
        {accessToken !== null && accessToken.length > 0 ? (
          <div className="username">{username} 님</div>
        ) : (
          <div className="login">
            <Link to="/login">Log In</Link>
            <span style={{ margin: "0 5px" }}>/</span>
            <Link to="/signup">Sign In</Link>
          </div>
        )}
      </div>

      <SideBar handleLogout={handleLogout} />
    </div>
  );
}

export default Main;
