import React from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Alert from "./Alert";
import "../css/Update.css";
import Bar from "./Bar";

function Update() {
  const location = useLocation();
  const { username } = location.state;
  const navigate = useNavigate();

  // 로컬 스토리지에서 토큰을 가져옵니다.
  const accessToken = localStorage.getItem("access_token");

  // useSelector를 사용하여 Redux 스토어의 상태값(IP 주소)을 가져옵니다.
  const ipAddress = useSelector((state) => state.ipAddress);

  // 비밀번호
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordCheck, setNewPasswordCheck] = useState("");

  // 알림 창을 보여주는 변수
  const [showAlert, setShowAlert] = useState(false);
  // 알림 창에 들어갈 제목 변수
  const [title, setTitle] = useState("");
  // 알림 창에 들어갈 메시지 변수
  const [message, setMessage] = useState("");
  // 모달 창을 열고 닫을 함수
  const handleAlertButtonClick = () => {
    setShowAlert(false);
    if (sucessUpdate) {
      navigate("/");
    }
  };
  // 정보 수정 성공 변수
  const [sucessUpdate, setSucessUpdate] = useState(false);

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
      setShowAlert(true);
      setTitle("필수 정보 입력");
      setMessage("비밀번호를 입력해주세요.");
      return;
    }

    if (!newPassword) {
      setShowAlert(true);
      setTitle("필수 정보 입력");
      setMessage("새 비밀번호를 입력해주세요.");
      return;
    }

    if (newPassword !== newPasswordCheck) {
      setShowAlert(true);
      setTitle("필수 정보 입력");
      setMessage("새 비밀번호의 값이 서로 다릅니다.");
      return;
    }

    if (newPassword.length < 8) {
      setShowAlert(true);
      setTitle("형식 에러");
      setMessage("비밀번호는 8글자 이상으로 입력해주세요.");
      return;
    }

    if (password === newPassword) {
      setShowAlert(true);
      setTitle("비밀번호 에러");
      setMessage("이전 비밀번호와 다른 비밀번호를 입력하세요.");
      return;
    }

    // 백엔드로 새 비밀번호를 전송
    const data = {
      password: password,
      newPassword: newPassword,
    };

    fetch(`http://${ipAddress}:8000/update`, {
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
          setShowAlert(true);
          setTitle("변경 완료");
          setMessage(data.message);
          setSucessUpdate(true);
        } else {
          setShowAlert(true);
          setTitle("회원정보 에러");
          setMessage(data.message);
        }
      })
      .catch((error) => {
        setShowAlert(true);
        setTitle("네트워크 에러");
        setMessage(data.message);
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

export default Update;
