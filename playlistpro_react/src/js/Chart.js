import React, { useState } from "react";
import ChartMusic from "./ChartMusic";
import "../css/Chart.css";
import Noimg from "../favicon/Noimg.png";

function Chart() {
  // 선택 할 수 있는 장르
  const genres = [
    "top", //   전체 TOP,
    "k-rap", //   랩,
    "Korean-indie", //   인디뮤직,
    "korean underground rap", //   힙합,
    "k-po", //   K-POP,
    "r&b", //   R&B,
    "korean rock", //   ROCK,
    "pop", //   팝송,
  ];

  // 선택한 장르
  const [selectedGenre, setSelectedGenre] = useState("");

  // 장르 클릭 시 장르 모달 창을 보여줄 변수
  const [showChartMusic, setShowChartMusic] = useState(false);
  // 노래 모달 창을 열고 닫을 함수
  const handleChartMusicClick = () => {
    setShowChartMusic(!showChartMusic);
  };

  // 장르 선택 시 실행되는 함수
  const handleGenreClick = (genre) => {
    // 선택한 장르로 변경
    setSelectedGenre(genre);

    // 선택한 장르 컴포넌트를 보여줌
    setTimeout(() => {
      setShowChartMusic(true);
    }, 100);
  };

  return (
    <div>
      {showChartMusic ? (
        <ChartMusic
          handleChartMusicClick={handleChartMusicClick}
          selectedGenre={selectedGenre}
        />
      ) : (
        <div className="chart">
          <h1>Popular-Charts</h1>
          <div className="chart_container">
            {genres.map((genre, index) => (
              <div
                key={index}
                className={`chart_box ${
                  selectedGenre === genre ? "click_chart_box" : ""
                }`}
                onClick={() => handleGenreClick(genre)}
              >
                <img src={Noimg} alt="노래가 없는 플레이리스트 이미지" />
                <div className="genre">{genre}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Chart;
