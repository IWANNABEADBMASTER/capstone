import React from "react";
import { useState, useEffect } from "react";
import Add from "../favicon/Add.png";
import "../css/Searchresult.css";

function Searchresult({ handleQueryChange, query }) {
  // 검색 내용
  const [inputValue, setInputValue] = useState(query);
  // 검색 결과
  const [content, setContent] = useState([]);

  // 노래 선택 시 백그라운드 스타일 지정할 변수
  const [selectedRow, setSelectedRow] = useState(null);
  const handleRowClick = (index) => {
    if (index == selectedRow) {
      setSelectedRow(null);
    } else {
      setSelectedRow(index);
    }
  };

  useEffect(() => {
    fetch("http://127.0.0.1:8000/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: inputValue }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("검색 요청 에러");
        }
      })
      .then((data) => {
        setContent(data.results);
      })
      .catch((error) => {
        // 요청 실패 시에 대한 처리
        console.log("검색 요청 중 에러 발생", error);
      });
  }, []);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() === "") {
      alert("검색어를 입력하세요.");
      return;
    }
    handleQueryChange(inputValue);
    setSelectedRow(null);

    fetch("http://127.0.0.1:8000/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: inputValue }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("검색 요청 에러");
        }
      })
      .then((data) => {
        setContent(data.results);
      })
      .catch((error) => {
        // 요청 실패 시에 대한 처리
        console.log("검색 요청 중 에러 발생", error);
      });
  };

  function formatDuration(duration) {
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  }

  return (
    <div className="Searchresult">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          defaultValue={query}
          onChange={handleChange}
          className="input"
          placeholder="Search your favorite song!"
        />
        <button type="submit" className="submit">
          Show Reasult
        </button>
      </form>

      {content === undefined ? (
        <div className="exception">검색어를 입력하세요.</div>
      ) : content.length === 0 ? (
        <div className="exception">검색 결과가 없습니다.</div>
      ) : (
        <>
          <div className="column">
            <div># Title</div>
            <div>Time</div>
            <div>Playlist</div>
          </div>

          <div className="container">
            {content.map((item, index) => (
              <div
                key={index}
                className={
                  selectedRow === index ? "selected_mugic_data" : "mugic_data"
                }
                onClick={() => handleRowClick(index)}
              >
                <div className="index">{index + 1}</div>
                <div className="album">
                  <img
                    src={item.album.images[0].url}
                    alt="no image"
                    className="album_image"
                  />
                </div>
                <div className="title">
                  {item.album.name}
                  <div className="artist">{item.artists[0].name}</div>
                </div>
                <div className="duration">
                  {formatDuration(item.duration_ms)}
                </div>
                <div className="add">
                  <img src={Add} alt="Add" />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Searchresult;
