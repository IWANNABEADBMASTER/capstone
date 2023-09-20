import React, { useState, useEffect } from "react";

function PlayMusic() {
  const [player, setPlayer] = useState(null);

  const accessToken = localStorage.getItem("access_token2");

  useEffect(() => {
    // 스포티파이 SDK 로딩 후 초기화
    if (window.Spotify) {
      const spotifyPlayer = new window.Spotify.Player({
        name: "Web Playback SDK Player",
        getOAuthToken: (cb) => {
          cb(accessToken);
        },
        volume: 0.5,
      });

      spotifyPlayer.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        setPlayer(spotifyPlayer);
      });

      spotifyPlayer.connect();
    }

    // 스포티파이 SDK 스크립트가 로딩되면 위의 콜백 함수가 호출됩니다.
    // 이제 스포티파이 SDK가 React 컴포넌트 내에서 사용 가능합니다.

    // Clean up when the component unmounts
    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [player]);

  const togglePlay = () => {
    if (player) {
      player.togglePlay();
    }
  };

  return (
    <div>
      <button onClick={togglePlay}>Toggle Play</button>
    </div>
  );
}

export default PlayMusic;
