import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Bar from "./Bar";
import "../css/Login.css";
import Spotify from "../favicon/Spotify.png";

function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUserId(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (userId == "") {
      // 아이디가 비어있는 경우
      alert("아이디를 입력해주세요.");
      return;
    }

    if (password == "") {
      // 비밀번호가 비어있는 경우
      alert("비밀번호를 입력해주세요.");
      return;
    }

    const csrftoken = getCookie("csrftoken"); // csrftoken은 Django에서 제공하는 쿠키 이름입니다.

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

    fetch("http://127.0.0.1:8000/login", postData)
      .then((response) => response.json()) // 응답을 JSON 형식으로 파싱
      .then((data) => {
        const { message, access_token, success } = data;
        if (success) {
          localStorage.setItem("access_token", access_token);
          // 로그인 성공 후 메인 페이지로 이동
          navigate("/");
        } else {
          alert(message);
        }
      })
      .catch((error) => {
        alert("로그인 중 오류가 발생했습니다.", error);
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

  return (
    <div>
      <Bar isLoggedIn={false} username={null} />

      <div className="login_container">
        <div className="login_title">Login</div>

        <a href="/spotifylogin">
          <div className="spotify_title">
            <div className="title_wrapper">
              <img src={Spotify} alt="Spotify" />
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
          계정이 없으신가요? <a href="/signup">회원가입</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
