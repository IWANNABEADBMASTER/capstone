import React, { useState } from "react";
import { useSelector } from "react-redux";
import Alert from "./Alert";
import "../css/Createplaylist.css";

function Createplaylist({
  handleShowCreatePlaylistModal,
  handleCreatePlaylistSynchronization,
}) {
  // 플레이리스트 제목
  const [playlistTitle, setPlaylistTitle] = useState("");
  // 플레이리스트 설명
  const [playlistDescription, setPlaylistDescription] = useState("");

  // 알림 창을 보여주는 변수
  const [showAlert, setShowAlert] = useState(false);
  // 알림 창에 들어갈 제목 변수
  const [title, setTitle] = useState("");
  // 알림 창에 들어갈 메시지 변수
  const [message, setMessage] = useState("");
  // 모달 창을 열고 닫을 함수
  const handleAlertButtonClick = () => {
    setShowAlert(false);
    // 모달 닫기
    handleShowCreatePlaylistModal();
  };

  // 로컬 스토리지에서 토큰을 가져옵니다.
  const accessToken = localStorage.getItem("access_token");
  // 스포티파이 인증 토큰
  const accessToken2 = localStorage.getItem("access_token2");
  const csrftoken = getCookie("csrftoken"); // csrftoken은 Django에서 제공하는 쿠키 이름입니다.

  // useSelector를 사용하여 Redux 스토어의 상태값(IP 주소)을 가져옵니다.
  const ipAddress = useSelector((state) => state.ipAddress);

  const handleSubmit = () => {
    if (!playlistTitle.trim()) {
      setShowAlert(true);
      setTitle("플레이리스트 생성 실패");
      setMessage("플레이리스트 제목을 입력하세요.");
      return;
    }

    if (!playlistDescription.trim()) {
      setShowAlert(true);
      setTitle("플레이리스트 생성 실패");
      setMessage("플레이리스트 설명을 입력하세요.");
      return;
    }

    if (accessToken !== null && accessToken.length > 0) {
      fetch(`http://${ipAddress}:8000/main`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const { userId } = data;

          const userData = {
            userId: userId,
            playlistname: playlistTitle,
            playlistcomment: playlistDescription,
          };
          const postData = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrftoken, // CSRF 토큰을 요청 헤더에 포함
            },
            body: JSON.stringify(userData),
          };

          fetch(`http://${ipAddress}:8000/createplaylist`, postData)
            .then((response) => {
              if (response.ok) {
                // 요청이 성공한 경우
                return response.json(); // JSON 형식으로 변환된 응답 반환
              } else {
                // 요청이 실패한 경우
                setShowAlert(true);
                setTitle("플레이리스트 생성 실패");
                setMessage("플레이리스트 생성이 실패했습니다.");
              }
            })
            .then((data) => {
              if (data.success) {
                // 플레이리스트 화면 재렌더링
                handleCreatePlaylistSynchronization();
                // 모달 닫기
                handleShowCreatePlaylistModal();
              } else {
                setShowAlert(true);
                setTitle("플레이리스트 생성 실패");
                setMessage("플레이리스트 생성 중 오류가 발생했습니다.");
              }
            })
            .catch((error) => {
              setShowAlert(true);
              setTitle("플레이리스트 생성 에러");
              setMessage("플레이리스트 생성 중 오류가 발생했습니다.");
            });
        });
    } else if (accessToken2 !== null && accessToken2.length > 0) {
      // 액세스 토큰을 사용하여 사용자 정보를 가져오는 API 요청
      fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken2}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          // API 응답에서 사용자의 아이디 가져오기
          const userData = {
            userId: data.id || "",
            playlistname: playlistTitle,
            playlistcomment: playlistDescription,
          };
          const postData = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrftoken, // CSRF 토큰을 요청 헤더에 포함
            },
            body: JSON.stringify(userData),
          };

          fetch(`http://${ipAddress}:8000/createplaylist`, postData)
            .then((response) => {
              if (response.ok) {
                // 요청이 성공한 경우
                return response.json(); // JSON 형식으로 변환된 응답 반환
              } else {
                // 요청이 실패한 경우
                setShowAlert(true);
                setTitle("플레이리스트 생성 실패");
                setMessage("플레이리스트 생성이 실패했습니다.");
              }
            })
            .then((data) => {
              if (data.success) {
                // 플레이리스트 화면 재렌더링
                handleCreatePlaylistSynchronization();
                // 모달 닫기
                handleShowCreatePlaylistModal();
              } else {
                setShowAlert(true);
                setTitle("플레이리스트 생성 실패");
                setMessage("플레이리스트 생성 중 오류가 발생했습니다.");
              }
            })
            .catch((error) => {
              setShowAlert(true);
              setTitle("플레이리스트 생성 에러");
              setMessage("플레이리스트 생성 중 오류가 발생했습니다.");
            });
        });
    }
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
    <div className="createplaylist_container">
      <div className="createplaylist_content">
        <input
          type="text"
          placeholder="제목"
          value={playlistTitle}
          onChange={(e) => setPlaylistTitle(e.target.value)}
        />
        <br />
        <input
          type="text"
          placeholder="설명"
          value={playlistDescription}
          onChange={(e) => setPlaylistDescription(e.target.value)}
        />
        <br />
        <div className="button_container">
          <button onClick={handleShowCreatePlaylistModal}>취소</button>
          <button onClick={handleSubmit}>완료</button>
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

export default Createplaylist;
