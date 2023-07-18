import React from "react";
import { useEffect, useState } from "react";
import "../css/Main.css";
import Bar from "./Bar";
import SideBar from "./Sidebar";
import Search from "./Search";
import Searchresult from "./Searchresult";

function Main() {
  // 메인페이지에서 보여주는 화면 상태
  // 1. home 2. search 3. playlist
  const [state, setState] = useState("home");

  // 하위 컴포넌트에서 state 값 변경
  const handleStateChange = (newState) => {
    setState(newState);
  };

  // 사용자 이름
  const [username, setUsername] = useState("");
  // 사용자 로그인 여부
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 검색 쿼리
  const [query, setQuery] = useState("");
  // search 컴포넌트에서 query 값 변경
  const handleQueryChange = (newQuery) => {
    setQuery(newQuery);
  };

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
          setIsLoggedIn(true);
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
          setIsLoggedIn(false);
          handleStateChange("home");
          console.log("토큰 삭제");
          window.location.reload();
        } else {
          // 로그아웃 실패 시에 대한 처리를 진행합니다.
          console.log("로그아웃 실패");
          localStorage.removeItem("access_token");
          window.location.reload();
        }
      })
      .catch((error) => {
        // 요청 실패 시에 대한 처리를 진행합니다.
        console.log("로그아웃 요청 에러", error);
      });
  };

  return (
    <div className="main">
      <Bar isLoggedIn={isLoggedIn} username={username} />
      <SideBar
        handleLogout={handleLogout}
        state={state}
        handleStateChange={handleStateChange}
        isLoggedIn={isLoggedIn}
      />

      {state === "home" ? (
        isLoggedIn ? (
          <div className="welcome">{username}님, 환영합니다!</div>
        ) : (
          <div className="welcome">
            로그인을 하시면 다양한 정보 를 제공받으실 수 있습니다!
          </div>
        )
      ) : null}

      {state === "home" ? (
        <Search
          handleStateChange={handleStateChange}
          handleQueryChange={handleQueryChange}
        />
      ) : state === "search" ? (
        <Searchresult handleQueryChange={handleQueryChange} query={query} />
      ) : null}
    </div>
  );
}

export default Main;
