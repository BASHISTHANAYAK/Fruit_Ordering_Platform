import React from "react";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #052e16 0%, #14532d 60%, #16a34a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
        padding: "2rem",
        color: "white",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "400px", height: "400px", background: "rgba(255,255,255,0.04)", borderRadius: "50%" }} />
      <div style={{ position: "absolute", bottom: "-80px", left: "-80px", width: "300px", height: "300px", background: "rgba(255,255,255,0.03)", borderRadius: "50%" }} />

      <div style={{ position: "relative", zIndex: 1, animation: "fadeInUp 0.5s ease" }}>
        <div style={{ fontSize: "8rem", marginBottom: "1rem", animation: "fadeIn 0.5s ease" }}>🍃</div>
        <div
          style={{
            fontSize: "7rem",
            fontWeight: 900,
            lineHeight: 1,
            marginBottom: "0.5rem",
            background: "linear-gradient(135deg, #fff 0%, #86efac 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          404
        </div>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "1rem", color: "white" }}>
          Page Not Found
        </h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1rem", maxWidth: "400px", margin: "0 auto 2rem", lineHeight: 1.6 }}>
          Oops! The page you're looking for seems to have gone out of stock. Let's get you back on track.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "0.875rem 2rem",
              background: "white",
              color: "#14532d",
              border: "none",
              borderRadius: "999px",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.3)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)"; }}
          >
            🏠 Go Home
          </button>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: "0.875rem 2rem",
              background: "rgba(255,255,255,0.15)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "999px",
              fontWeight: 600,
              fontSize: "1rem",
              cursor: "pointer",
              fontFamily: "inherit",
              backdropFilter: "blur(8px)",
              transition: "all 0.2s",
            }}
          >
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
