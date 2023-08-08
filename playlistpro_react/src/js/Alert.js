import React from "react";
import "../css/Alert.css";
import Exclamation from "../favicon/Exclamation.png";

function Alert({ title, message, handleAlertButtonClick }) {
  const handleButtonClick = (event) => {
    event.preventDefault();
    handleAlertButtonClick();
  };

  return (
    <div className="alert_container">
      <form onSubmit={handleButtonClick}>
        <div className="alert_content">
          <div className="alert_title">
            <img src={Exclamation} alt="예외" />
            {title}
          </div>
          <div className="alert_message">{message}</div>
          <div className="alert_bottom">
            <button type="submit" className="alert_close">
              확인
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Alert;
