import React from "react";
import { useNavigate } from "react-router-dom";
import logoCss from "./logo.module.css";

const VegefoodsLogo = () => {
  const Navigate = useNavigate();
  return (
    <div onClick={() => Navigate("/")} className={logoCss.logo}>
      <h1>Vegefoods</h1>
    </div>
  );
};

export default VegefoodsLogo;
