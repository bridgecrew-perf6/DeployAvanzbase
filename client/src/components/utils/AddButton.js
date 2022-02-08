import React from "react";
import "../../css/AddButton.css";

const AddButton = ({ text, type, onClick, buttonSize }) => {
  return (
    <button onClick={onClick} type={type} className={`add-btn`}>
      {text}
    </button>
  );
};

export default AddButton;
