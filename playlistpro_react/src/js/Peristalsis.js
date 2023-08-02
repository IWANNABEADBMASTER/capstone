import React from "react";

function Peristalsis() {
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

  // 스포티파이 인증 토큰
  const accessToken2 = localStorage.getItem("access_token2");
  const csrftoken = getCookie("csrftoken"); // csrftoken은 Django에서 제공하는 쿠키 이름입니다.

  // 스포티파이 계정과 플레이리스트프로 계정을 연동
  const peristalsis = () => {
    // 액세스 토큰을 사용하여 사용자 정보를 가져오는 API 요청
    fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken2}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // API 응답에서 사용자의 디스플레이 이름 가져오기
        const displayName = data.display_name || "";
        // API 응답에서 사용자의 아이디 가져오기
        const userId = data.id || "";

        // 계정 연동------------------------------------------------------------------------------
        const userData = {
          userId: userId,
          password: "",
          username: displayName,
          email: "",
        };

        const csrftoken = getCookie("csrftoken"); // csrftoken은 Django에서 제공하는 쿠키 이름입니다.

        // 서버로 전송할 데이터 객체(아이디, 비밀번호, 이름, 이메일)
        const postData = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken, // CSRF 토큰을 요청 헤더에 포함
          },
          body: JSON.stringify(userData),
        };

        fetch("http://127.0.0.1:8000/signup", postData)
          .then((response) => {
            if (response.ok) {
              // 요청이 성공한 경우
              return response.json(); // JSON 형식으로 변환된 응답 반환
            } else {
              // 요청이 실패한 경우
              setShowAlert(true);
              setTitle("계정 연동 에러");
              setMessage("계정 연동이 실패했습니다.");
            }
          })
          .then((data) => {
            // 서버에서 반환한 데이터 처리
            if (data.success) {
              setShowAlert(true);
              setTitle("계정 연동 성공");
              setMessage("플레이리스트를 생성할 수 있습니다.");
            } else {
              setShowAlert(true);
              setTitle("계정 연동 에러");
              setMessage("이미 연동된 계정입니다."); // 이미 연동된 계정입니다.
            }
          })
          .catch((error) => {
            setShowAlert(true);
            setTitle("계정 연동 에러");
            setMessage("계정 연동 중 오류가 발생했습니다.");
          });
        // 계정 연동------------------------------------------------------------------------------
      })
      .catch((error) => {
        setShowAlert(true);
        setTitle("네트워크 에러");
        setMessage("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
      });
  };

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

  return (
    <div className="peristalsis">
      <button className="peristalsis" onClick={peristalsis}>
        계정 연동
      </button>
    </div>
  );
}

export default Peristalsis;
