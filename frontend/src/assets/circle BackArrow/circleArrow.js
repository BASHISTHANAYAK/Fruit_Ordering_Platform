import React from "react";
import { useNavigate } from "react-router-dom";
import "./circleArrow.css";
const CircleArrow = () => {
  const Navigate = useNavigate();
  return (
    <div className="circle--arrow" onClick={() => Navigate("/")}>
      <i className="fa-solid fa-arrow-left"></i>
    </div>
  );
};

export default CircleArrow;
