import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../css/Update.css";
import Bar from "./Bar";

function Update() {
  const location = useLocation();
  const { username } = location.state;
  const navigate = useNavigate();

  // 로컬 스토리지에서 토큰을 가져옵니다.
  const accessToken = localStorage.getItem("access_token");

  // 비밀번호
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordCheck, setNewPasswordCheck] = useState("");

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleNewPasswordCheckChange = (event) => {
    setNewPasswordCheck(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // 비밀번호 유효성 검사
    if (!password) {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    if (!newPassword) {
      alert("새 비밀번호를 입력해주세요.");
      return;
    }

    if (newPassword !== newPasswordCheck) {
      alert("새 비밀번호의 값이 서로 다릅니다.");
      return;
    }

    if (newPassword.length < 8) {
      alert("비밀번호는 8글자 이상으로 입력해주세요.");
      return;
    }

    if (password == newPassword) {
      alert("이전 비밀번호와 다른 비밀번호를 입력하세요.");
      return;
    }

    // 백엔드로 새 비밀번호를 전송
    const data = {
      password: password,
      newPassword: newPassword,
    };

    fetch("http://127.0.0.1:8000/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log(data.message);
          // 로그인 성공 후 메인 페이지로 이동
          navigate("/");
        } else {
          console.log(data.message);
        }
      })
      .catch((error) => {
        console.log(data.message);
      });
  };

  return (
    <div>
      <Bar isLoggedIn={true} username={username} />

      <div className="update_container">
        <div className="update_title">비밀번호 수정하기</div>

        <form className="update_form" onSubmit={handleSubmit}>
          <div className="password_label">현재 비밀번호</div>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Password"
          />
          <br />
          <div className="password_label">새 비밀번호</div>
          <input
            type="password"
            value={newPassword}
            onChange={handleNewPasswordChange}
            placeholder="New Password"
          />
          <br />
          <div className="password_label">새 비밀번호 확인</div>
          <input
            type="password"
            value={newPasswordCheck}
            onChange={handleNewPasswordCheckChange}
            placeholder="New Password"
          />
          <br />
          <button type="submit" className="update_buttom">
            변경하기
          </button>
        </form>
      </div>
    </div>
  );
}

export default Update;
