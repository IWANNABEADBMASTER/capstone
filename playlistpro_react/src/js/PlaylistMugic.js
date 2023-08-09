import React, { useState, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";
import Alert from "./Alert";
import "../css/PlaylistMugic.css";
import Arrowleft from "../favicon/Arrowleft.png";
import Delete from "../favicon/Delete.png";
import Noimg from "../favicon/Noimg.png";

function PlaylistMugic({
  selectedPlaylistId,
  handlePlaylistMugicClick,
  playlistTitle,
  playlistImg,
}) {
  const [mugic, setMugic] = useState([]);
  // 노래의 총 시간
  const [totalDuration, setTotalDuration] = useState(0);
  // 노래의 개수
  const [totalSongs, setTotalSongs] = useState(0);

  // 노래 선택 시 백그라운드 스타일 지정할 변수
  const [selectedRow, setSelectedRow] = useState(null);
  const handleRowClick = (index) => {
    if (index === selectedRow) {
      setSelectedRow(null);
    } else {
      setSelectedRow(index);
    }
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

  const csrftoken = getCookie("csrftoken"); // csrftoken은 Django에서 제공하는 쿠키 이름입니다.

  const handleDeleteSong = (trackId) => {
    const userData = {
      playlistId: selectedPlaylistId,
      trackId: trackId,
    };
    const postData = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken, // CSRF 토큰을 요청 헤더에 포함
      },
      body: JSON.stringify(userData),
    };

    fetch("http://127.0.0.1:8000/deletemugic", postData)
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
        setShowAlert(true);
        setTitle(data.messageTitle);
        setMessage(data.message);
      })
      .catch((error) => {
        setShowAlert(true);
        setTitle("네트워크 에러");
        setMessage("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
      });
  };

  useEffect(() => {
    setIsLoading(true); // 데이터 로딩 시 로딩 상태를 true로 설정

    const userData = {
      playlistId: selectedPlaylistId,
    };
    const postData = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken, // CSRF 토큰을 요청 헤더에 포함
      },
      body: JSON.stringify(userData),
    };

    fetch("http://127.0.0.1:8000/playlistmugic", postData)
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
        // 서버에서 반환한 데이터 처리
        setMugic(data.music_list);
      })
      .catch((error) => {
        setShowAlert(true);
        setTitle("네트워크 에러");
        setMessage("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
      })
      .finally(() => {
        setIsLoading(false); // 데이터 로딩 완료 시 로딩 상태를 false로 설정
      });
  }, [csrftoken]);

  // mugic 배열이 변경될 때마다 합계시간, 노래 개수를 업데이트
  useEffect(() => {
    let totalSeconds = 0;
    mugic.forEach((item) => {
      const timeParts = item.time.split(":");
      const minutes = parseInt(timeParts[0], 10);
      const seconds = parseInt(timeParts[1], 10);
      const songDuration = minutes * 60 + seconds;
      totalSeconds += songDuration;
    });

    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
    const remainingSeconds = totalSeconds % 60;

    let totalDuration = "";
    if (totalHours > 0) {
      totalDuration += `${totalHours}시간 `;
    }
    if (remainingMinutes > 0) {
      totalDuration += `${remainingMinutes}분 `;
    }
    totalDuration += `${remainingSeconds}초`;

    setTotalDuration(totalDuration);
    setTotalSongs(mugic.length);
  }, [mugic]);

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
        <div className="playlistmugic">
          <div className="playlist_header">
            <img
              src={Arrowleft}
              onClick={() => handlePlaylistMugicClick()}
              className="arrow_img"
              alt="뒤로가기"
            />
            <div className="playlist_mugic_title">{playlistTitle}</div>
          </div>

          <div className="playlist_content">
            <div className="playlist_img">
              {playlistImg ? (
                <img src={playlistImg} alt="플레이리스트 이미지" />
              ) : (
                <img src={Noimg} alt="노래가 없는 플레이리스트 이미지" />
              )}
            </div>
            <div className="songs_and_duration">
              <div>{totalSongs} songs</div>
              <div>{totalDuration}</div>
            </div>
          </div>

          {mugic.length === 0 ? (
            <div className="no_mugic">
              <div>재생목록에 노래가 없습니다.</div>
            </div>
          ) : (
            <div>
              <div className="column">
                <div># Title</div>
                <div>Time</div>
                <div>Delete</div>
              </div>

              <div className="container">
                {mugic.map((item, index) => (
                  <div
                    key={index}
                    className={
                      selectedRow === index
                        ? "selected_mugic_data"
                        : "mugic_data"
                    }
                    onClick={() => handleRowClick(index)}
                  >
                    <div className="index">{index + 1}</div>
                    <div className="album">
                      <img
                        src={item.album_img}
                        className="album_image"
                        alt="앨범 이미지"
                      />
                    </div>
                    <div className="title">
                      {item.title}
                      <div className="artist">{item.artist}</div>
                    </div>
                    <div className="duration">{item.time}</div>
                    <div
                      className="delete"
                      onClick={() => handleDeleteSong(item.trackId)}
                    >
                      <img src={Delete} alt="삭제 이미지" />
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

export default PlaylistMugic;
