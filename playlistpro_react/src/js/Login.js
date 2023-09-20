import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import Bar from "./Bar";
import Alert from "./Alert";
import "../css/Login.css";
import Spotify from "../favicon/Spotify.png";

function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
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
  };

  const csrftoken = getCookie("csrftoken"); // csrftoken은 Django에서 제공하는 쿠키 이름입니다.

  // useSelector를 사용하여 Redux 스토어의 상태값(IP 주소)을 가져옵니다.
  const ipAddress = useSelector((state) => state.ipAddress);

  const handleUsernameChange = (event) => {
    setUserId(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (userId === "") {
      // 아이디가 비어있는 경우
      setShowAlert(true);
      setTitle("로그인 에러");
      setMessage("아이디를 입력해주세요.");
      return;
    }

    if (password === "") {
      // 비밀번호가 비어있는 경우
      setShowAlert(true);
      setTitle("로그인 에러");
      setMessage("비밀번호를 입력해주세요.");
      return;
    }

    const userData = {
      userId: userId,
      password: password,
    };

    // 서버로 전송할 데이터 객체(아이디, 비밀번호, 이름, 이메일)
    const postData = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken, // CSRF 토큰을 요청 헤더에 포함
      },
      body: JSON.stringify(userData),
    };

    fetch(`http://${ipAddress}:8000/login`, postData)
      .then((response) => response.json()) // 응답을 JSON 형식으로 파싱
      .then((data) => {
        const { message, access_token, success } = data;
        if (success) {
          localStorage.setItem("access_token", access_token);
          // 로그인 성공 후 메인 페이지로 이동
          navigate("/");
        } else {
          setShowAlert(true);
          setTitle("로그인 에러");
          setMessage(message); // 아이디 또는 비밀번호가 일치하지 않습니다.
        }
      })
      .catch((error) => {
        setShowAlert(true);
        setTitle("네트워크 에러");
        setMessage("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
      });
  };

  // getCookie 함수는 쿠키 값을 가져오기 위한 헬퍼 함수입니다.
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  const [AUTH_URL, setAUTH_URL] = useState("");
  useEffect(() => {
    fetch(`http://${ipAddress}:8000/spotify_url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken, // CSRF 토큰을 요청 헤더에 포함
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        const authEndpoint = "https://accounts.spotify.com/authorize";
        const scopes = [
          "streaming",
          "user-read-email",
          "user-read-private",
          "user-library-read",
          "user-library-modify",
          "user-read-playback-state",
          "user-modify-playback-state",
          "playlist-read-collaborative",
          "user-read-currently-playing",
          "playlist-read-private",
          "playlist-modify-public",
          "playlist-modify-private",
        ]; // 필요한 스코프를 배열로 나열
        const queryParams = `client_id=${data.clientId}&client_secret=${
          data.clientSecret
        }&redirect_uri=${encodeURIComponent(
          data.redirectUri
        )}&response_type=token&show_dialog=true&scope=${encodeURIComponent(
          scopes.join(" ")
        )}`; // scope 추가

        setAUTH_URL(`${authEndpoint}?${queryParams}`);
      })
      .catch((error) => {
        setShowAlert(true);
        setTitle("네트워크 에러");
        setMessage("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
      });
  }, [csrftoken]);

  return (
    <div>
      <Bar isLoggedIn={false} username={null} />

      <div className="login_container">
        <div className="login_title">Login</div>

        <a href={AUTH_URL}>
          <div className="spotify_title">
            <div className="title_wrapper">
              <img src={Spotify} alt="스포티파이 이미지" />
              <div className="spotify_login">Login with Spotify</div>
            </div>
          </div>
        </a>

        <form className="login_form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={userId}
            onChange={handleUsernameChange}
            placeholder="ID"
          />
          <br />
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Password"
          />
          <br />
          <button type="submit" className="login_buttom">
            Log In
          </button>
        </form>
        <div className="signup_buttom">
          계정이 없으신가요? <Link to="/signup">회원가입</Link>
        </div>
      </div>

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

export default Login;
