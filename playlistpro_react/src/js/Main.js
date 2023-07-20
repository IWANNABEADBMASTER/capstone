import React from "react";
import { useEffect, useState } from "react";
import "../css/Main.css";
import Bar from "./Bar";
import SideBar from "./Sidebar";
import Search from "./Search";
import Searchresult from "./Searchresult";
import LoadingSpinner from "./LoadingSpinner";
import Alert from "./Alert";

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

  // 로딩 상태를 나타내는 변수
  const [isLoading, setIsLoading] = useState(true);

  // 알림 창을 보여주는 변수
  const [showAlert, setShowAlert] = useState(false);
  // 알림 창에 들어갈 제목 변수
  const [title, setTitle] = useState("");
  // 알림 창에 들어갈 메시지 변수
  const [message, setMessage] = useState("");
  // 모달 창을 열고 닫을 함수
  const handleAlertButtonClick = () => {
    setShowAlert(false);
    // 로그인 상태 만료 시 로그아웃 후 새로고침
    if (expiration) {
      handleLogout();
    }
  };
  // 로그인 상태가 만료되었는지를 나타내는 변수
  const [expiration, setExpiration] = useState(false);

  useEffect(() => {
    setIsLoading(true); // 데이터 로딩 시작 시 로딩 상태를 true로 설정

    // 토큰이 존재할 경우에만 백엔드로부터 사용자 정보를 가져옵니다.
    if (accessToken !== null && accessToken.length > 0) {
      // 백엔드에서 사용자 정보를 가져오는 함수 호출
      fetch("http://127.0.0.1:8000/main", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const { username } = data;
          if (data.success) {
            setUsername(username);
            setIsLoggedIn(true);
          } else {
            setShowAlert(true);
            setTitle("로그인 에러");
            setMessage("로그인 정보가 만료되었으므로 다시 로그인해주세요.");
            setExpiration(true);
            return;
          }
        })
        .catch((error) => {
          setShowAlert(true);
          setTitle("네트워크 에러");
          setMessage("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
        })
        .finally(() => {
          setIsLoading(false); // 데이터 로딩 완료 시 로딩 상태를 false로 설정
        });
    } else {
      setIsLoading(false); // 데이터 로딩 완료 시 로딩 상태를 false로 설정
    }

    // 스포티파이 토큰 관리 ----------------------------------------------------------
    // 스포티파이 토큰 관리 ----------------------------------------------------------
    const accessToken2 = extractAccessTokenFromHash();
    if (accessToken2) {
      // 액세스 토큰을 사용하여 사용자 정보를 가져오는 API 요청
      fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken2}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          // API 응답에서 사용자의 디스플레이 이름 가져오기
          const displayName = data.display_name || "";
          console.log(displayName);
        })
        .catch((error) => {
          console.error("Error fetching Spotify user info:", error);
        });
    }
    // 스포티파이 토큰 관리 ----------------------------------------------------------
    // 스포티파이 토큰 관리 ----------------------------------------------------------
  }, []);

  const handleLogout = () => {
    setIsLoading(true); // 데이터 로딩 시작 시 로딩 상태를 true로 설정
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
          window.location.reload();
        } else {
          // 로그아웃 실패 시에 대한 처리를 진행합니다.
          localStorage.removeItem("access_token");
          window.location.reload();
        }
      })
      .catch((error) => {
        // 요청 실패 시에 대한 처리를 진행합니다.
        setShowAlert(true);
        setTitle("네트워크 에러");
        setMessage("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
      })
      .finally(() => {
        setIsLoading(false); // 데이터 로딩 완료 시 로딩 상태를 false로 설정
      });
  };

  const extractAccessTokenFromHash = () => {
    const hash = window.location.hash.substr(1);
    const params = new URLSearchParams(hash);
    return params.get("access_token");
  };

  return (
    <div className="main">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
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
                로그인을 하시면 다양한 정보를 제공받으실 수 있습니다!
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

export default Main;
