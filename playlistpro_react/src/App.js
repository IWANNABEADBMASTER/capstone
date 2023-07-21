import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Login from "./js/Login";
import Signup from "./js/Signup";
import Update from "./js/Update";
import Main from "./js/Main";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Update" element={<Update />} />
        <Route path="/" element={<Main />} /> {/* 메인 페이지 라우트 추가 */}
      </Routes>
    </Router>
  );
};

export default App;
