import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

function Main() {
  return (
    <div>
      <h1>메인 페이지</h1>
      <Link to="/login">로그인</Link>
      <Link to="/signup">회원가입</Link>
    </div>
  );
}

export default Main;
