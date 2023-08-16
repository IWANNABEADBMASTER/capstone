import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import Login from "./js/Login";
import Signup from "./js/Signup";
import Update from "./js/Update";
import Main from "./js/Main";
import Store from "./js/Store";

const App = () => {
  return (
    <Provider store={Store}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/Update" element={<Update />} />
          <Route path="/" element={<Main />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
