import React from "react";
import { useState } from "react";
import Alert from "./Alert";
import "../css/Search.css";

function Search({ handleQueryChange }) {
  const [inputValue, setInputValue] = useState("");

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

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() === "") {
      setShowAlert(true);
      setTitle("검색 에러");
      setMessage("검색어를 입력하세요.");
      return;
    }
    handleQueryChange(inputValue);
  };

  return (
    <div className="search">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="Search"
          className="input"
        />
        <button type="submit" className="submit">
          Show Reasult
        </button>
      </form>
      <div className="comment">
        PlayListPro는 Spotify Api를 제공받아 검색한 음원 하나를Recommend 함수를
        통해 100곡을 추천받고 PlayListPro만의 자체 알고리즘으로 10곡을 추려
        보여줍니다.
      </div>
      <div className="university">Dankook University</div>
      <div className="class">Capstone design 1st classroom</div>

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

export default Search;
