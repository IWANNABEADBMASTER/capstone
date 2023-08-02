import React, { useState, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";
import "../css/Getplaylist.css";

function Getplaylist({ handleShowGetPlaylistModal }) {
  // 스포티파이에서 가져온 플레이리스트
  const [playlists, setPlaylists] = useState([]);

  // 로딩 상태를 나타내는 변수
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true); // 데이터 로딩 완료 시 로딩 상태를 true로 설정

    // 스포티파이 인증 토큰
    const accessToken2 = localStorage.getItem("access_token2");

    fetch("https://api.spotify.com/v1/me/playlists", {
      headers: {
        Authorization: `Bearer ${accessToken2}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // API 응답에서 사용자의 플레이리스트 목록 가져오기
        const playlists = data.items || [];

        setPlaylists(playlists);
      })
      .catch((error) => {
        console.error("Error fetching playlists:", error);
      })
      .finally(() => {
        setIsLoading(false); // 데이터 로딩 완료 시 로딩 상태를 false로 설정
      });
  }, []);
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
                  <p>스포피파이에 생성된 재생목록이 없습니다.</p>
                </div>
              ) : (
                <div>
                  {playlists.map((playlist) => (
                    <div key={playlist.id}>
                      <div className="playlist_title">{playlist.name}</div>
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
    </div>
  );
}

export default Getplaylist;
