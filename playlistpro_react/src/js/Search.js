import React from "react";
import { useState } from "react";
import "../css/Search.css";

function Search({ handleStateChange, handleQueryChange }) {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    if (inputValue.trim() === "") {
      alert("검색어를 입력하세요.");
      return;
    }
    handleStateChange("search");
    handleQueryChange(inputValue);
    e.preventDefault();
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
    </div>
  );
}

export default Search;
