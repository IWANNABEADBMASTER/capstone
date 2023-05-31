import React, { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // 여기서 로그인 처리 로직을 구현하면 됩니다.
    // 예를 들어, 서버로 사용자 정보를 전송하거나 상태를 업데이트할 수 있습니다.
    console.log("Username:", username);
    console.log("Password:", password);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" value={username} onChange={handleUsernameChange} />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </label>
        <br />
        <button type="submit">로그인</button>
      </form>
      <Link to="/signup">
        <button>회원가입</button>
      </Link>
    </div>
  );
}

export default Login;
