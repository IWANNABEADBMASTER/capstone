import React, { useState, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";
import Alert from "./Alert";
import "../css/Getplaylist.css";

function Selectplaylist({ handleShowSelectPlaylistModal, selectedMusicData }) {
  // 스포티파이에서 가져온 플레이리스트
  const [playlists, setPlaylists] = useState([]);

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
    handleShowSelectPlaylistModal();
  };

  const csrftoken = getCookie("csrftoken"); // csrftoken은 Django에서 제공하는 쿠키 이름입니다.

  // 플레이리스트 클릭 시 제출하는 함수
  const handlePlaylistClick = (playlistId) => {
    const userData = {
      playlistId: playlistId,
      trackId: selectedMusicData.trackId,
      mugic_title: selectedMusicData.mugic_title,
      artist: selectedMusicData.artist,
      album_image: selectedMusicData.album_image,
      time: selectedMusicData.time,
    };
    const postData = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken, // CSRF 토큰을 요청 헤더에 포함
      },
      body: JSON.stringify(userData),
    };

    fetch("http://127.0.0.1:8000/addmugic", postData)
      .then((response) => {
        if (response.ok) {
          // 요청이 성공한 경우
          return response.json(); // JSON 형식으로 변환된 응답 반환
        } else {
          // 요청이 실패한 경우
          setShowAlert(true);
          setTitle("네트워크 에러");
          setMessage("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
        }
      })
      .then((data) => {
        if (data.success) {
          setShowAlert(true);
          setTitle("노래 추가 성공");
          setMessage("노래를 플레이리스트에 추가했습니다.");
        } else {
          setShowAlert(true);
          setTitle("노래 추가 실패");
          setMessage(data.message);
        }
      })
      .catch((error) => {
        setShowAlert(true);
        setTitle("네트워크 에러");
        setMessage("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
      });
  };

  useEffect(() => {
    setIsLoading(true); // 데이터 로딩 완료 시 로딩 상태를 true로 설정

    // 로컬 스토리지에서 토큰을 가져옵니다.
    const accessToken = localStorage.getItem("access_token");
    // 로컬 스토리지에서 스포티파이 토큰을 가져옵니다.
    const accessToken2 = localStorage.getItem("access_token2");
    const csrftoken = getCookie("csrftoken"); // csrftoken은 Django에서 제공하는 쿠키 이름입니다.

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
        <div className="getplaylist_container">
          <div className="getplaylist_content">
            <p>플레이리스트 선택</p>
            <div className="playlist_list">
              {playlists.length === 0 ? (
                <div>
                  <p>재생목록이 없습니다.</p>
                </div>
              ) : (
                <div>
                  {playlists.map((playlist) => (
                    <div
                      key={playlist.playlistId}
                      onClick={() => handlePlaylistClick(playlist.playlistId)}
                      className="playlist_title"
                    >
                      {playlist.playlistname}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="button_container2">
              <button onClick={handleShowSelectPlaylistModal}>닫기</button>
            </div>
          </div>
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

export default Selectplaylist;
