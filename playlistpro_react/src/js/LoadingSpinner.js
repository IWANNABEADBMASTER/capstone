import React from "react";
import "../css/LoadingSpinner.css";
import Loading from "../favicon/Loading.png";

function LoadingSpinner() {
  return (
    <div className="loading">
      <img src={Loading} />
    </div>
  );
}

export default LoadingSpinner;
