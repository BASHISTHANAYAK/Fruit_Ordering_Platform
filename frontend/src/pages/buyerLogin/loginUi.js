import React, { useState } from "react";
import { enterDetails, submitForm } from "./loginFunction";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { setUser } from "../../ReduxPersist/actions";

const BuyerLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [UserDetails, setUserdetails] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEnterDetails = (e) => enterDetails(e, setUserdetails);

  const handleSubmitForm = async (event) => {
    event.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      const result = await submitForm(UserDetails);
      if (result && (result.status === 200 || result.status === 201)) {
        const token = result.data.jwttoken;
        sessionStorage.setItem("jwttoken", token);
        localStorage.setItem("jwttoken", token);

        dispatch(
          setUser({
            name: result.data.detail?.name || "Customer",
            role: result.data.detail?.role || "Buyer",
            _id: result.data.detail?._id,
          })
        );

        toast.success(`Welcome back, ${result.data.detail?.name || "Customer"}! 🛒`, {
          position: "top-right",
          autoClose: 1200,
          hideProgressBar: true,
          theme: "colored",
        });

        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        const errorMsg =
          result?.data?.message ||
          result?.response?.data?.message ||
          "Invalid email or password. Please check your credentials.";
        toast.error(errorMsg, {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
        setIsLoading(false);
      }
    } catch (error) {
      toast.error(error.message || "Failed to sign in", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="auth-container">
        {/* Left Side: Form Container */}
        <div className="auth-form-panel">
          <div className="auth-form-card">
            {/* Back link */}
            <button
              onClick={() => navigate("/selectAccountType")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "#64748b",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: 600,
                padding: "0.375rem 0",
                marginBottom: "2rem",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#16a34a")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
            >
              ← Back to account selection
            </button>

            {/* Brand & Badge */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  background: "linear-gradient(135deg, #16a34a, #15803d)",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.3rem",
                  boxShadow: "0 4px 12px rgba(22, 163, 74, 0.25)",
                }}
              >
                🌿
              </div>
              <div>
                <span style={{ fontSize: "1.3rem", fontWeight: 800, color: "#14532d" }}>
                  Vegefoods
                </span>
                <span
                  style={{
                    marginLeft: "0.5rem",
                    padding: "0.2rem 0.55rem",
                    background: "#dcfce7",
                    color: "#15803d",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    borderRadius: "6px",
                    letterSpacing: "0.05em",
                  }}
                >
                  CUSTOMER
                </span>
              </div>
            </div>

            <h1
              style={{
                fontSize: "2rem",
                fontWeight: 800,
                color: "#0f172a",
                letterSpacing: "-0.025em",
                marginBottom: "0.5rem",
              }}
            >
              Welcome Back!
            </h1>
            <p style={{ color: "#64748b", fontSize: "0.95rem", marginBottom: "2rem" }}>
              Sign in to order farm-fresh fruits &amp; vegetables.
            </p>

            <form onSubmit={handleSubmitForm} style={{ display: "flex", flexDirection: "column", gap: "1.25rem", width: "100%" }}>
              <div style={{ width: "100%" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#334155",
                    marginBottom: "0.5rem",
                  }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="user11@gmail.com"
                  onChange={handleEnterDetails}
                  value={UserDetails.email}
                  style={{
                    width: "100%",
                    boxSizing: "border-box", // Explicit border-box guarantees exact equal width
                    padding: "0.85rem 1rem",
                    border: "1.5px solid #cbd5e1",
                    borderRadius: "10px",
                    fontSize: "0.95rem",
                    color: "#0f172a",
                    background: "#f8fafc",
                    outline: "none",
                    transition: "all 0.2s",
                    fontFamily: "inherit",
                    display: "block",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#16a34a";
                    e.target.style.background = "#ffffff";
                    e.target.style.boxShadow = "0 0 0 3px rgba(22, 163, 74, 0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#cbd5e1";
                    e.target.style.background = "#f8fafc";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <div style={{ width: "100%" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#334155",
                    marginBottom: "0.5rem",
                  }}
                >
                  Password
                </label>
                <div style={{ position: "relative", width: "100%", boxSizing: "border-box" }}>
                  <input
                    type={showPass ? "text" : "password"}
                    name="password"
                    required
                    placeholder="Enter your password"
                    onChange={handleEnterDetails}
                    value={UserDetails.password}
                    style={{
                      width: "100%",
                      boxSizing: "border-box", // Explicit border-box ensures same width as email
                      padding: "0.85rem 3rem 0.85rem 1rem",
                      border: "1.5px solid #cbd5e1",
                      borderRadius: "10px",
                      fontSize: "0.95rem",
                      color: "#0f172a",
                      background: "#f8fafc",
                      outline: "none",
                      transition: "all 0.2s",
                      fontFamily: "inherit",
                      display: "block",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#16a34a";
                      e.target.style.background = "#ffffff";
                      e.target.style.boxShadow = "0 0 0 3px rgba(22, 163, 74, 0.15)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#cbd5e1";
                      e.target.style.background = "#f8fafc";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((p) => !p)}
                    style={{
                      position: "absolute",
                      right: "0.85rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "1.1rem",
                      color: "#94a3b8",
                      padding: "0.25rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    title={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "0.95rem",
                  background: isLoading
                    ? "#94a3b8"
                    : "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: 700,
                  fontSize: "1rem",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  boxShadow: isLoading
                    ? "none"
                    : "0 6px 20px rgba(22, 163, 74, 0.35)",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.6rem",
                  marginTop: "0.5rem",
                }}
              >
                {isLoading ? (
                  <>
                    <div
                      style={{
                        width: "18px",
                        height: "18px",
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTopColor: "#ffffff",
                        borderRadius: "50%",
                        animation: "spin 0.7s linear infinite",
                      }}
                    />
                    Signing in...
                  </>
                ) : (
                  "Sign In & Start Shopping →"
                )}
              </button>
            </form>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                margin: "2rem 0 1.5rem",
                color: "#94a3b8",
                fontSize: "0.85rem",
              }}
            >
              <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
              <span style={{ padding: "0 0.75rem" }}>New to Vegefoods?</span>
              <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
            </div>

            <Link
              to="/buyerSignup"
              style={{
                display: "block",
                textAlign: "center",
                padding: "0.85rem",
                background: "#f8fafc",
                border: "1.5px solid #cbd5e1",
                borderRadius: "10px",
                fontWeight: 600,
                fontSize: "0.95rem",
                color: "#334155",
                textDecoration: "none",
                transition: "all 0.2s",
                boxSizing: "border-box",
                width: "100%",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#16a34a";
                e.currentTarget.style.color = "#16a34a";
                e.currentTarget.style.background = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#cbd5e1";
                e.currentTarget.style.color = "#334155";
                e.currentTarget.style.background = "#f8fafc";
              }}
            >
              Create Customer Account
            </Link>
          </div>
        </div>

        {/* Right Side: Hero Branding Panel (collapses on mobile) */}
        <div
          className="auth-hero-panel"
          style={{
            background: "linear-gradient(135deg, #052e16 0%, #14532d 45%, #16a34a 100%)",
          }}
        >
          <div style={{ maxWidth: "420px", textAlign: "left", position: "relative", zIndex: 1 }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                background: "rgba(255, 255, 255, 0.15)",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                marginBottom: "2rem",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              🛍️
            </div>

            <h2
              style={{
                fontSize: "2.25rem",
                fontWeight: 900,
                lineHeight: 1.2,
                marginBottom: "1rem",
                letterSpacing: "-0.025em",
              }}
            >
              Farm-Fresh Goodness Straight to Your Door
            </h2>
            <p
              style={{
                fontSize: "1.05rem",
                color: "rgba(255, 255, 255, 0.8)",
                lineHeight: 1.6,
                marginBottom: "2.5rem",
              }}
            >
              Hand-picked seasonal fruits and crispy organic vegetables sourced directly from ethical local farms.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {[
                { title: "100% Organic & Certified", desc: "No harmful chemical pesticides or artificial ripening" },
                { title: "Lightning Fast Delivery", desc: "Same-day doorstep delivery to preserve maximum freshness" },
                { title: "Easy Cart & Order Tracking", desc: "Track every step from harvest to your kitchen counter" },
              ].map((feat, idx) => (
                <div key={idx} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      background: "rgba(255, 255, 255, 0.2)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: "#ffffff",
                      flexShrink: 0,
                      marginTop: "2px",
                    }}
                  >
                    ✓
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#ffffff" }}>{feat.title}</div>
                    <div style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.7)" }}>{feat.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BuyerLogin;
