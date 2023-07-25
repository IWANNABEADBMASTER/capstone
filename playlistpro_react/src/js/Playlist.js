import React, { useState } from "react";
import "../css/Playlist.css";

function Playlist() {
  const [playlists, setPlaylists] = useState([]);

  // 스포티파이 인증 토큰
  const accessToken2 = localStorage.getItem("access_token2");

  const fetchPlaylists = () => {
    fetch("https://api.spotify.com/v1/me/playlists", {
      headers: {
        Authorization: `Bearer ${accessToken2}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // API 응답에서 사용자의 플레이리스트 목록 가져오기
        const playlists = data.items || [];

        // 각 플레이리스트의 이름과 ID 출력 예시
        playlists.forEach((playlist) => {
          const playlistName = playlist.name;
          const playlistId = playlist.id;
          console.log("Playlist Name:", playlistName);
          console.log("Playlist ID:", playlistId);
        });
        console.log("여기가 문제");
      })
      .catch((error) => {
        console.error("Error fetching playlists:", error);
      });
  };

  return (
    <div>
      <button className="pbtn" onClick={fetchPlaylists}>
        플레이리스트 가져오기
      </button>
      <div></div>
    </div>
  );
}

export default Playlist;
