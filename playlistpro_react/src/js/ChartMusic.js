import React, { useState, useEffect } from "react";
import Selectplaylist from "./Selectplaylist";
import Alert from "./Alert";
import LoadingSpinner from "./LoadingSpinner";
import "../css/ChartMusic.css";
import Arrowleft from "../favicon/Arrowleft.png";
import Noimg from "../favicon/Noimg.png";
import Add from "../favicon/Add.png";

function ChartMusic({
  handleChartMusicClick,
  selectedGenre,
  selectedGenreKey,
}) {
  // 인기차트 해당하는 노래 데이터 리스트
  const [music, setMusic] = useState([]);

  // 노래 선택 시 백그라운드 스타일 지정할 변수
  const [selectedRow, setSelectedRow] = useState(null);
  const handleRowClick = (index) => {
    if (index === selectedRow) {
      setSelectedRow(null);
    } else {
      setSelectedRow(index);
    }
  };

  // 플레이리스트를 선택하는 모달 창을 보여줄 변수
  const [showSelectPlaylistModal, setShowSelectPlaylistModal] = useState(false);
  // 플레이리스트를 선택하는 모달창을 열고 닫는 함수
  const handleShowSelectPlaylistModal = () => {
    setShowSelectPlaylistModal(!showSelectPlaylistModal);
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

  // 노래의 고유 값을 나타내는 변수
  const [trackId, setTrackId] = useState([]);
  // 선택된 노래의 정보를 담을 상태(State) 설정
  const [selectedMusicData, setSelectedMusicData] = useState({
    music_title: "",
    artist: "",
    album_image: "",
    time: "",
  });

  const csrftoken = getCookie("csrftoken"); // csrftoken은 Django에서 제공하는 쿠키 이름입니다.

  // 노래 추가버튼 클릭 시 제출하는 함수
  const handleAddMusicClick = (
    trackId,
    music_title,
    artist,
    album_image,
    time
  ) => {
    setSelectedMusicData({
      trackId: trackId,
      music_title: music_title,
      artist: artist,
      album_image: album_image,
      time: time,
    });
    setShowSelectPlaylistModal(true);
  };

  useEffect(() => {
    const userData = {
      selectedGenreKey: selectedGenreKey,
    };
    const postData = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken, // CSRF 토큰을 요청 헤더에 포함
      },
      body: JSON.stringify(userData),
    };

    setIsLoading(true); // 데이터 로딩 시작 시 로딩 상태를 true로 설정
    // 스포티파이로 부터 선택된 장르의 인기차트 목록을 받아옴
    fetch("http://127.0.0.1:8000/chartmusic", postData)
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
        setMusic(data.results);
        setTrackId(data.track_ids);
      })
      .catch((error) => {
        setShowAlert(true);
        setTitle("네트워크 에러");
        setMessage("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
      })
      .finally(() => {
        setIsLoading(false); // 데이터 로딩 완료 시 로딩 상태를 false로 설정
      });
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

  function formatDuration(duration) {
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  }

  return (
    <div>
      {showSelectPlaylistModal && (
        <Selectplaylist
          handleShowSelectPlaylistModal={handleShowSelectPlaylistModal}
          selectedMusicData={selectedMusicData}
        />
      )}

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="chartmusic">
          <div className="chartmusic_header">
            <img
              src={Arrowleft}
              onClick={() => handleChartMusicClick()}
              className="arrow_img"
              alt="뒤로가기"
            />
            <div className="selectedgenre">{selectedGenre} 인기차트</div>
          </div>

          <div className="chart_img">
            <img src={Noimg} alt="차트 이미지" />
          </div>

          <div>
            <div className="column">
              <div># Title</div>
              <div>Time</div>
              <div>Playlist</div>
            </div>

            <div className="container">
              {music.map((item, index) => (
                <div
                  key={index}
                  className={
                    selectedRow === index ? "selected_music_data" : "music_data"
                  }
                  onClick={() => handleRowClick(index)}
                >
                  <div className="index">{index + 1}</div>
                  <div className="album">
                    <img
                      src={item.album.images[0]?.url}
                      className="album_image"
                      alt="앨범 이미지"
                    />
                  </div>
                  <div className="title">
                    {item.album.name}
                    <div className="artist">{item.artists[0].name}</div>
                  </div>
                  <div className="duration">
                    {formatDuration(item.duration_ms)}
                  </div>
                  <div
                    className="add"
                    onClick={(event) => {
                      event.stopPropagation(); // 이벤트 버블링을 막음
                      setSelectedRow(index);
                      handleAddMusicClick(
                        trackId[index],
                        item.album.name,
                        item.artists[0].name,
                        item.album.images[0].url,
                        formatDuration(item.duration_ms)
                      );
                    }}
                  >
                    <img src={Add} alt="추가 이미지" />
                  </div>
                </div>
              ))}
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

export default ChartMusic;
