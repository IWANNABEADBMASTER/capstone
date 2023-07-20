import React from "react";
import { useState, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";
import Alert from "./Alert";
import Add from "../favicon/Add.png";
import Noresult from "../favicon/Noresult.png";
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

  useEffect(() => {
    setIsLoading(true); // 데이터 로딩 시작 시 로딩 상태를 true로 설정
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
          setShowAlert(true);
          setTitle("검색 에러");
          setMessage("검색 요청 에러");
        }
      })
      .then((data) => {
        setContent(data.results);
      })
      .catch((error) => {
        setShowAlert(true);
        setTitle("검색 에러");
        setMessage("검색 요청 에러");
        setIsLoading(false); // 데이터 로딩 완료 시 로딩 상태를 false로 설정
      })
      .finally(() => {
        setIsLoading(false); // 데이터 로딩 완료 시 로딩 상태를 false로 설정
      });
  }, []);

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
    setSelectedRow(null);

    setIsLoading(true); // 데이터 로딩 시작 시 로딩 상태를 true로 설정
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
          setShowAlert(true);
          setTitle("검색 에러");
          setMessage("검색 요청 에러");
        }
      })
      .then((data) => {
        setContent(data.results);
      })
      .catch((error) => {
        setShowAlert(true);
        setTitle("네트워크 에러");
        setMessage("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
        setIsLoading(false); // 데이터 로딩 완료 시 로딩 상태를 false로 설정
      })
      .finally(() => {
        setIsLoading(false); // 데이터 로딩 완료 시 로딩 상태를 false로 설정
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
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          {content === undefined || query.trim() === "" ? (
            <div className="exception">검색어를 입력하세요.</div>
          ) : content.length === 0 ? (
            <div className="exception">
              <img src={Noresult} alt="Noresult" />
              <div>No Results Found for "{query}"</div>
              <div>Try shortening or rephrasing your search</div>
            </div>
          ) : (
            <div>
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
                      selectedRow === index
                        ? "selected_mugic_data"
                        : "mugic_data"
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

export default Searchresult;