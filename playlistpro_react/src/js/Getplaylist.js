import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import LoadingSpinner from "./LoadingSpinner";
import Alert from "./Alert";
import "../css/Getplaylist.css";

function Getplaylist({
  handleShowGetPlaylistModal,
  handleGetPlaylistSynchronization,
}) {
  // 스포티파이에서 가져온 플레이리스트
  const [playlists, setPlaylists] = useState([]);
  // 스포티파이 사용자 ID
  const [userId, setUserId] = useState("");

  // 스포티파이 인증, 재생목록의 유무에 따라 보여줄 텍스트
  const [comment, setComment] = useState(
    "스포피파이에 생성된 재생목록이 없습니다."
  );

  // 스포티파이 인증 토큰
  const accessToken2 = localStorage.getItem("access_token2");
  const csrftoken = getCookie("csrftoken"); // csrftoken은 Django에서 제공하는 쿠키 이름입니다.

  // useSelector를 사용하여 Redux 스토어의 상태값(IP 주소)을 가져옵니다.
  const ipAddress = useSelector((state) => state.ipAddress);

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

  // 로딩 상태를 나타내는 변수
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true); // 데이터 로딩 완료 시 로딩 상태를 true로 설정

    // 액세스 토큰을 사용하여 사용자 정보를 가져오는 API 요청
    fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken2}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // API 응답에서 사용자의 아이디 가져오기
        setUserId(data.id || "");
      })
      .catch((error) => {
        setShowAlert(true);
        setTitle("네트워크 에러");
        setMessage("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
      });

    fetch("https://api.spotify.com/v1/me/playlists", {
      headers: {
        Authorization: `Bearer ${accessToken2}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          setComment("스포티파이에 가입된 아이디가 아닙니다.");
        }
      })
      .then((data) => {
        // API 응답에서 사용자의 플레이리스트 목록 가져오기
        const playlists = data.items || [];
        setPlaylists(playlists);
      })
      .catch((error) => {
        return;
      })
      .finally(() => {
        setIsLoading(false); // 데이터 로딩 완료 시 로딩 상태를 false로 설정
      });
  }, []);

  // 플레이리스트 클릭 시 제출하는 함수
  const handleGetPlaylistClick = (
    spotifyPlaylistId,
    playlistName,
    playlistComment
  ) => {
    const userData = {
      userId: userId,
      playlistname: playlistName,
      playlistcomment: playlistComment,
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
          setTitle("네트워크 에러");
          setMessage("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
        }
      })
      .then((data) => {
        if (data.success) {
          // 플레이 리스트 생성이 성공하면 플레이리스트에 담겨있는 노래를 스포티파이에서 불러옴
          fetch(
            `https://api.spotify.com/v1/playlists/${spotifyPlaylistId}/tracks`,
            {
              headers: {
                Authorization: `Bearer ${accessToken2}`,
              },
            }
          )
            .then((response) => response.json())
            .then((tracksData) => {
              const tracks = tracksData.items || [];

              const userData = {
                playlistId: data.playlistId,
                tracks: tracks,
              };
              const postData = {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "X-CSRFToken": csrftoken, // CSRF 토큰을 요청 헤더에 포함
                },
                body: JSON.stringify(userData),
              };

              // 스포티파이에서 불러온 노래 데이터를 생성한 플레이리스트에 저장
              fetch(`http://${ipAddress}:8000/addspotifymusic`, postData)
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
                  if (data.success) {
                    handleGetPlaylistSynchronization();
                    handleShowGetPlaylistModal();
                  } else {
                    setShowAlert(true);
                    setTitle("노래 추가 실패");
                    setMessage(
                      "플레이리스트를 가져왔으나 노래를 가져오는데 실패했습니다."
                    );
                  }
                })
                .catch((error) => {
                  setShowAlert(true);
                  setTitle("네트워크 에러");
                  setMessage(
                    "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요."
                  );
                });
            });
        } else {
          setShowAlert(true);
          setTitle("플레이리스트 가져오기 실패");
          setMessage("플레이리스트를 가져오는데 실패했습니다.");
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
                  <p>{comment}</p>
                </div>
              ) : (
                <div>
                  {playlists.map((playlist) => (
                    <div
                      key={playlist.id}
                      onClick={() =>
                        handleGetPlaylistClick(
                          playlist.id,
                          playlist.name,
                          playlist.description
                        )
                      }
                    >
                      <div className="playlist_title">
                        {playlist.name}{" "}
                        {playlist.description && ` (${playlist.description})`}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="button_container2">
              <button onClick={handleShowGetPlaylistModal}>닫기</button>
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

export default Getplaylist;
