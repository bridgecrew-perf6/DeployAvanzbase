import React from "react";
import "../../css/Button.css";

const STYLES = ["btn--primary", "btn--time"];

const SIZES = ["btn--medium", "btn--small"];

const Button = ({
  children,
  type,
  onClick,
  buttonStyle,
  buttonSize,
  timePeriod,
}) => {
  const checkButtonStyle = STYLES.includes(buttonStyle)
    ? buttonStyle
    : STYLES[0];

  const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];

  return (
    <button
      onClick={onClick}
      type={type}
      className={`btn ${checkButtonStyle} ${checkButtonSize}`}
      style={{
        backgroundColor: timePeriod === children ? "#b8b8ff70" : "#d3d3d331",
      }}
    >
      {children}
    </button>
  );
};

export default Button;
