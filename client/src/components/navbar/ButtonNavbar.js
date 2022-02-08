import React from "react";
import "./ButtonNavbar.css";
import { Link } from "react-router-dom";

export function ButtonNavbar({ text, buttonClass, path }) {
  return (
    <Link to={`${path}`}>
      <button className={`btn-navbar ${buttonClass}`}>{text}</button>
    </Link>
  );
}
