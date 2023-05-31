import React, { useState } from "react";
import { Link } from "react-router-dom";

const Signup = () => {
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
          console.log(data.post);
        }
        alert("회원가입 성공!");
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
      <h1>회원가입</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>이름</label>
          <input type="text" value={username} onChange={handleUsernameChange} />
        </div>
        <div>
          <label>아이디</label>
          <input type="text" value={userId} onChange={handleUseridChange} />
        </div>
        <div>
          <label>이메일</label>
          <input type="email" value={email} onChange={handleEmailChange} />
        </div>
        <div>
          <label>비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit">가입하기</button>
      </form>

      <Link to="/login">
        <button>로그인</button>
      </Link>
    </div>
  );
};

export default Signup;
