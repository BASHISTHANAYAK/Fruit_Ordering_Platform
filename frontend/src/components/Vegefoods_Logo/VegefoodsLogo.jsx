import React from "react";
import { useNavigate } from "react-router-dom";

const VegefoodsLogo = () => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate("/")}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.6rem",
        cursor: "pointer",
        textDecoration: "none",
      }}
    >
      <div
        style={{
          width: "38px",
          height: "38px",
          background: "linear-gradient(135deg, #16a34a, #15803d)",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.2rem",
          boxShadow: "0 4px 12px rgba(22, 163, 74, 0.25)",
        }}
      >
        🌿
      </div>
      <span
        style={{
          fontSize: "1.4rem",
          fontWeight: 800,
          color: "#15803d",
          letterSpacing: "-0.025em",
        }}
      >
        Vegefoods
      </span>
    </div>
  );
};

export default VegefoodsLogo;
