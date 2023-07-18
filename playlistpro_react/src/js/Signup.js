import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Bar from "./Bar";
import "../css/Login.css";
import Spotify from "../favicon/Spotify.png";

const Signup = () => {
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleUseridChange = (event) => {
    setUserId(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); //새로고침 방지

    if (username == "") {
      // 이름이 비어있는 경우
      alert("이름을 입력해주세요.");
      return;
    }

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

    if (email == "") {
      // 이메일이 비어있는 경우
      alert("이메일을 입력해주세요.");
      return;
    }

    if (!/^.{2,5}$/.test(username)) {
      alert("이름은 2~5글자로 입력해주세요.");
      return;
    }

    if (!/^[a-zA-Z0-9]{4,12}$/.test(userId)) {
      alert("아이디는 4~12글자의 영문 대소문자로만 입력해주세요.");
      return;
    }

    if (password.length < 8) {
      alert("비밀번호는 8글자 이상으로 입력해주세요.");
      return;
    }

    const csrftoken = getCookie("csrftoken"); // csrftoken은 Django에서 제공하는 쿠키 이름입니다.

    const userData = {
      userId: userId,
      password: password,
      username: username,
      email: email,
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

    fetch("http://127.0.0.1:8000/signup", postData)
      .then((response) => {
        if (response.ok) {
          // 요청이 성공한 경우
          return response.json(); // JSON 형식으로 변환된 응답 반환
        } else {
          // 요청이 실패한 경우
          alert("회원가입이 실패했습니다.");
        }
      })
      .then((data) => {
        // 서버에서 반환한 데이터 처리
        if (data.success) {
          alert("회원가입 성공!");
          // 회원가입 성공 후 로그인 페이지로 이동
          navigate("/login");
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        alert("회원가입 중 오류가 발생했습니다.", error);
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
        <div className="login_title">Create Account </div>

        <a href="/spotifysignup">
          <div className="spotify_title">
            <div className="title_wrapper">
              <img src={Spotify} alt="Spotify" />
              <div className="spotify_login">Sign up with Spotify</div>
            </div>
          </div>
        </a>

        <form onSubmit={handleSubmit} className="login_form">
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            placeholder="Full Name"
          />
          <br />
          <input
            type="text"
            value={userId}
            onChange={handleUseridChange}
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
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Email Address"
          />
          <br />
          <button type="submit" className="login_buttom">
            Create Account
          </button>
        </form>
        <div className="signup_buttom">
          Already have an account ? <a href="/login">Login</a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
