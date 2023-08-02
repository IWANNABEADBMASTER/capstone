import React, { useState, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";
import Alert from "./Alert";
import Createplaylist from "./Createplaylist";
import Getplaylist from "./Getplaylist";
import "../css/Playlist.css";
import Createplaylistbutton from "../favicon/Createplaylistbutton.png";
import Noimg from "../favicon/Noimg.png";

function Playlist() {
  const [playlists, setPlaylists] = useState([]);

  // 플레이리스트 생성 모달 창을 보여줄 변수
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false);
  // 플레이리스트 생성 모달창을 열고 닫는 함수
  const handleShowCreatePlaylistModal = () => {
    setShowCreatePlaylistModal(!showCreatePlaylistModal);
  };

  // 플레이리스트를 스포티파이로부터 가져오는 모달 창을 보여줄 변수
  const [showGetPlaylistModal, setShowGetPlaylistModal] = useState(false);
  // 플레이리스트를 가져오는 모달창을 열고 닫는 함수
  const handleShowGetPlaylistModal = () => {
    setShowGetPlaylistModal(!showGetPlaylistModal);
  };

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
  };

  // 로컬 스토리지에서 토큰을 가져옵니다.
  const accessToken = localStorage.getItem("access_token");
  // 로컬 스토리지에서 스포티파이 토큰을 가져옵니다.
  const accessToken2 = localStorage.getItem("access_token2");
  const csrftoken = getCookie("csrftoken"); // csrftoken은 Django에서 제공하는 쿠키 이름입니다.

  useEffect(() => {
    setIsLoading(true); // 데이터 로딩 시 로딩 상태를 true로 설정

    if (accessToken !== null && accessToken.length > 0) {
      fetch("http://127.0.0.1:8000/main", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const { userId } = data;

          const userData = {
            userId: userId,
          };
          const postData = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrftoken, // CSRF 토큰을 요청 헤더에 포함
            },
            body: JSON.stringify(userData),
          };

          fetch("http://127.0.0.1:8000/playlist", postData)
            .then((response) => {
              if (response.ok) {
                // 요청이 성공한 경우
                return response.json(); // JSON 형식으로 변환된 응답 반환
              } else {
                // 요청이 실패한 경우
                setShowAlert(true);
                setTitle("네트워크 에러");
                setMessage(
                  "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요."
                );
              }
            })
            .then((data) => {
              // 서버에서 반환한 데이터 처리
              setPlaylists(data.playlists);
            })
            .catch((error) => {
              setShowAlert(true);
              setTitle("네트워크 에러");
              setMessage(
                "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요."
              );
            })
            .finally(() => {
              setIsLoading(false); // 데이터 로딩 완료 시 로딩 상태를 false로 설정
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
          const userId = data.id || ""; // API 응답에서 사용자의 아이디 가져오기

          const userData = {
            userId: userId,
          };
          const postData = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrftoken, // CSRF 토큰을 요청 헤더에 포함
            },
            body: JSON.stringify(userData),
          };

          fetch("http://127.0.0.1:8000/playlist", postData)
            .then((response) => {
              if (response.ok) {
                // 요청이 성공한 경우
                return response.json(); // JSON 형식으로 변환된 응답 반환
              } else {
                // 요청이 실패한 경우
                setShowAlert(true);
                setTitle("네트워크 에러");
                setMessage(
                  "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요."
                );
              }
            })
            .then((data) => {
              // 서버에서 반환한 데이터 처리
              setPlaylists(data.playlists);
            })
            .catch((error) => {
              setShowAlert(true);
              setTitle("네트워크 에러");
              setMessage(
                "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요."
              );
            })
            .finally(() => {
              setIsLoading(false); // 데이터 로딩 완료 시 로딩 상태를 false로 설정
            });
        });
    }
  }, []);

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
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="playlist">
          {showCreatePlaylistModal && (
            <Createplaylist
              handleShowCreatePlaylistModal={handleShowCreatePlaylistModal}
            />
          )}

          {showGetPlaylistModal && (
            <Getplaylist
              handleShowGetPlaylistModal={handleShowGetPlaylistModal}
            />
          )}

          <h1>Playlists</h1>
          {playlists.length === 0 ? (
            <div className="noplaylist">
              <div>앗, 플레이리스트가 비었네요!</div>
              <div
                className="createplaylist"
                onClick={() => setShowCreatePlaylistModal(true)}
              >
                플레이리스트 만들기
              </div>
              <br />
              <div
                className="getplaylist"
                onClick={() => setShowGetPlaylistModal(true)}
              >
                Spotify에서 가져오기
              </div>
            </div>
          ) : (
            // playlists 배열에 플레이리스트가 있는 경우 플레이리스트를 출력합니다.
            <div>
              <div className="createplaylist_box">
                <div
                  className="getplaylist"
                  onClick={() => setShowGetPlaylistModal(true)}
                >
                  Spotify에서 가져오기
                </div>
                <img
                  onClick={() => setShowCreatePlaylistModal(true)}
                  src={Createplaylistbutton}
                  alt="Createplaylistbutton"
                />
              </div>
              <br />
              <div className="playlist_container">
                {playlists.map((playlist) => (
                  <div className="playlist_box" key={playlist.playlistId}>
                    {playlist.imageURL ? (
                      <img src={playlist.imageURL} alt="Playlist Image" />
                    ) : (
                      <img src={Noimg} alt="No Image" />
                    )}
                    <div className="playlistname">{playlist.playlistname}</div>
                    <div className="playlistcomment">
                      {playlist.playlistcomment}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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

export default Playlist;
