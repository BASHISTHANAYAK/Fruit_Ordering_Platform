import React from "react";
import { useNavigate } from "react-router-dom";

const SelectAccountType = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box",
        margin: 0,
        background: "linear-gradient(135deg, #052e16 0%, #14532d 50%, #166534 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorations */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: "400px",
          height: "400px",
          background: "rgba(255,255,255,0.04)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-80px",
          left: "-80px",
          width: "300px",
          height: "300px",
          background: "rgba(255,255,255,0.03)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "10%",
          transform: "translateY(-50%)",
          fontSize: "8rem",
          opacity: 0.08,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        🌿
      </div>

      {/* Card */}
      <div
        style={{
          background: "rgba(255,255,255,0.97)",
          borderRadius: "24px",
          padding: "clamp(1.75rem, 5vw, 2.75rem)",
          maxWidth: "440px",
          width: "100%",
          boxSizing: "border-box",
          boxShadow: "0 32px 64px rgba(0,0,0,0.4)",
          animation: "scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              background: "linear-gradient(135deg, #16a34a, #15803d)",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              margin: "0 auto 1rem",
              boxShadow: "0 8px 24px rgba(22, 163, 74, 0.35)",
            }}
          >
            🌿
          </div>
          <h1
            style={{
              fontSize: "1.875rem",
              fontWeight: 900,
              color: "#052e16",
              letterSpacing: "-0.03em",
              marginBottom: "0.375rem",
            }}
          >
            Vegefoods
          </h1>
          <p style={{ color: "var(--neutral-500)", fontSize: "0.9rem" }}>
            Fresh produce at your fingertips
          </p>
        </div>

        <div
          style={{
            height: "1px",
            background: "var(--neutral-200)",
            margin: "1.5rem 0",
          }}
        />

        <h2
          style={{
            fontSize: "1.125rem",
            fontWeight: 700,
            color: "var(--neutral-800)",
            textAlign: "center",
            marginBottom: "1.5rem",
          }}
        >
          How are you joining us?
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Admin option */}
          <button
            onClick={() => navigate("/adminLogin")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "1.25rem 1.5rem",
              background: "white",
              border: "2px solid var(--neutral-200)",
              borderRadius: "16px",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s",
              textAlign: "left",
              width: "100%",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#16a34a";
              e.currentTarget.style.background = "var(--primary-50)";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(22,163,74,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--neutral-200)";
              e.currentTarget.style.background = "white";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.375rem",
                flexShrink: 0,
              }}
            >
              🔐
            </div>
            <div>
              <div
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "var(--neutral-900)",
                  marginBottom: "0.2rem",
                }}
              >
                Admin
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--neutral-500)" }}>
                Manage products &amp; orders
              </div>
            </div>
            <div
              style={{
                marginLeft: "auto",
                color: "var(--neutral-300)",
                fontSize: "1.25rem",
              }}
            >
              →
            </div>
          </button>

          {/* User option */}
          <button
            onClick={() => navigate("/buyerLogin")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "1.25rem 1.5rem",
              background: "white",
              border: "2px solid var(--neutral-200)",
              borderRadius: "16px",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s",
              textAlign: "left",
              width: "100%",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#16a34a";
              e.currentTarget.style.background = "var(--primary-50)";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(22,163,74,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--neutral-200)";
              e.currentTarget.style.background = "white";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                background: "linear-gradient(135deg, #16a34a, #15803d)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.375rem",
                flexShrink: 0,
              }}
            >
              🛍️
            </div>
            <div>
              <div
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "var(--neutral-900)",
                  marginBottom: "0.2rem",
                }}
              >
                Buyer / User
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--neutral-500)" }}>
                Shop fresh produce
              </div>
            </div>
            <div
              style={{
                marginLeft: "auto",
                color: "var(--neutral-300)",
                fontSize: "1.25rem",
              }}
            >
              →
            </div>
          </button>
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: "1.75rem",
            fontSize: "0.8rem",
            color: "var(--neutral-400)",
          }}
        >
          By continuing, you agree to our Terms &amp; Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default SelectAccountType;
