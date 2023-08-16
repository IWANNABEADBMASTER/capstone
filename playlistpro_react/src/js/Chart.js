import React, { useState } from "react";
import { Provider } from "react-redux";
import ChartMusic from "./ChartMusic";
import Store from "./Store";
import "../css/Chart.css";

function Chart() {
  // 선택 할 수 있는 장르
  const genreKey = [
    "top", //   전체 TOP
    "k-rap", //   랩
    "Korean-indie", //   인디뮤직
    "korean underground rap", //   힙합
    "k-po", //   K-POP
    "r&b", //   R&B
    "korean rock", //   ROCK
    "pop", //   팝송
  ];

  const genres = [
    "TOP",
    "RAP",
    "INDIE",
    "HIP-HOP",
    "K-POP",
    "R&B",
    "ROCK",
    "POP SONG",
  ];

  // 임시 인기차트 커버 이미지
  const imgUrl = [
    "https://i.scdn.co/image/ab67616d0000b273bf5cce5a0e1ed03a626bdd74", // 전체 TOP
    "https://i.scdn.co/image/ab67616d0000b273fa9247b68471b82d2125651e", // 랩
    "https://i.scdn.co/image/ab67616d0000b2733f8adef16f0ae1c05f7c51be", // 인디뮤직
    "https://i.scdn.co/image/ab67616d0000b273725bfc7864a82dcca831e175", // 힙합
    "https://i.scdn.co/image/ab67616d0000b273d814e7bfbbfd8fcfe4c1a08b", // K-POP
    "https://i.scdn.co/image/ab67616d0000b2734d6cf0d0d5e32ca4fa3a59e1", // R&B
    "https://i.scdn.co/image/ab67616d0000b27310b3ebc65d2f65964cf461d8", // ROCK
    "https://i.scdn.co/image/ab67616d0000b273e787cffec20aa2a396a61647", // 팝송
  ];

  // 선택한 장르
  const [selectedGenre, setSelectedGenre] = useState("");
  // 선택한 장르 KEY 값
  const [selectedGenreKey, setSelectedGenreKey] = useState("");
  // 선택한 장르 커버이미지
  const [selectedGenreImg, setSelectedGenreImg] = useState("");

  // 장르 클릭 시 장르 모달 창을 보여줄 변수
  const [showChartMusic, setShowChartMusic] = useState(false);
  // 노래 모달 창을 열고 닫을 함수
  const handleChartMusicClick = () => {
    setShowChartMusic(!showChartMusic);
  };

  // 장르 선택 시 실행되는 함수
  const handleGenreClick = (genre, genreKey, coverImg) => {
    // 선택한 장르로 변경
    setSelectedGenre(genre);
    // 선택한 장르로 key값 변경
    setSelectedGenreKey(genreKey);
    // 선택한 장르로 커버 이미지 변경
    setSelectedGenreImg(coverImg);

    // 선택한 장르 컴포넌트를 보여줌
    setTimeout(() => {
      setShowChartMusic(true);
    }, 100);
  };

  return (
    <div>
      {showChartMusic ? (
        <Provider store={Store}>
          <ChartMusic
            handleChartMusicClick={handleChartMusicClick}
            selectedGenre={selectedGenre}
            selectedGenreKey={selectedGenreKey}
            selectedGenreImg={selectedGenreImg}
          />
        </Provider>
      ) : (
        <div className="chart">
          <h1>Popular-Charts</h1>
          <div className="chart_container">
            {genreKey.map((key, index) => (
              <div
                key={index}
                className={`chart_box ${
                  selectedGenreKey === key ? "click_chart_box" : ""
                }`}
                onClick={() =>
                  handleGenreClick(genres[index], key, imgUrl[index])
                }
              >
                <img src={imgUrl[index]} alt="인기차트 커버 이미지" />
                <div className="genre">{genres[index]}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Chart;
