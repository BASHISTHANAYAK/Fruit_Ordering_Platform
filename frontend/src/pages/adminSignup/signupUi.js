import React, { useState } from "react";
import { enterDetails, submitForm } from "./signupFunction";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { setUser } from "../../ReduxPersist/actions";

const AdminSignup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [UserDetails, setUserdetails] = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEnterDetails = (e) => enterDetails(e, setUserdetails);

  const handleSubmitForm = async (event) => {
    event.preventDefault();
    if (isLoading) return;

    if (!UserDetails.name || !UserDetails.email || !UserDetails.password) {
      toast.error("Please enter all details");
      return;
    }

    setIsLoading(true);
    try {
      const result = await submitForm(UserDetails);
      if (result && (result.status === 200 || result.status === 201)) {
        const token = result.data.jwttoken;
        sessionStorage.setItem("jwttoken", token);
        localStorage.setItem("jwttoken", token);

        dispatch(
          setUser({
            name: result.data.detail?.name || UserDetails.name,
            role: result.data.detail?.role || "Admin",
            _id: result.data.detail?._id,
          })
        );

        toast.success("Admin account created successfully! 🎉", {
          position: "top-right",
          autoClose: 1200,
          hideProgressBar: true,
          theme: "colored",
        });

        setTimeout(() => {
          navigate("/adminDashboard");
        }, 1000);
      } else {
        const errorMsg =
          result?.data?.message ||
          result?.response?.data?.message ||
          "Failed to create admin account. Please try again.";
        toast.error(errorMsg, {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
        setIsLoading(false);
      }
    } catch (error) {
      toast.error(error.message || "Failed to create account", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      setIsLoading(false);
    }
  };

  const passwordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: "", color: "transparent" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    const labels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
    const colors = ["transparent", "#ef4444", "#f97316", "#eab308", "#22c55e", "#16a34a"];
    return { score, label: labels[score], color: colors[score] };
  };

  const strength = passwordStrength(UserDetails.password);

  return (
    <>
      <ToastContainer />
      <div className="auth-container">
        {/* Left Side: Form Container */}
        <div className="auth-form-panel">
          <div className="auth-form-card">
            <button
              onClick={() => navigate("/adminLogin")}
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
              onMouseEnter={(e) => (e.currentTarget.style.color = "#4338ca")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
            >
              ← Back to sign in
            </button>

            {/* Brand & Badge */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  background: "linear-gradient(135deg, #4338ca, #312e81)",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.3rem",
                  boxShadow: "0 4px 12px rgba(67, 56, 202, 0.25)",
                }}
              >
                🔐
              </div>
              <div>
                <span style={{ fontSize: "1.3rem", fontWeight: 800, color: "#1e1b4b" }}>
                  Vegefoods
                </span>
                <span
                  style={{
                    marginLeft: "0.5rem",
                    padding: "0.2rem 0.55rem",
                    background: "#ede9fe",
                    color: "#4338ca",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    borderRadius: "6px",
                    letterSpacing: "0.05em",
                  }}
                >
                  ADMIN REGISTRATION
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
              Create Admin Account
            </h1>
            <p style={{ color: "#64748b", fontSize: "0.95rem", marginBottom: "2rem" }}>
              Register to start managing your produce catalog.
            </p>

            <form onSubmit={handleSubmitForm} style={{ display: "flex", flexDirection: "column", gap: "1.15rem", width: "100%" }}>
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
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. John Doe"
                  onChange={handleEnterDetails}
                  value={UserDetails.name}
                  style={{
                    width: "100%",
                    boxSizing: "border-box", // Exact same width
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
                    e.target.style.borderColor = "#4338ca";
                    e.target.style.background = "#ffffff";
                    e.target.style.boxShadow = "0 0 0 3px rgba(67, 56, 202, 0.15)";
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
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="admin@vegefoods.com"
                  onChange={handleEnterDetails}
                  value={UserDetails.email}
                  style={{
                    width: "100%",
                    boxSizing: "border-box", // Exact same width
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
                    e.target.style.borderColor = "#4338ca";
                    e.target.style.background = "#ffffff";
                    e.target.style.boxShadow = "0 0 0 3px rgba(67, 56, 202, 0.15)";
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
                    placeholder="Min. 8 chars, 1 uppercase, 1 lowercase"
                    onChange={handleEnterDetails}
                    value={UserDetails.password}
                    style={{
                      width: "100%",
                      boxSizing: "border-box", // Exact same width as other inputs
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
                      e.target.style.borderColor = "#4338ca";
                      e.target.style.background = "#ffffff";
                      e.target.style.boxShadow = "0 0 0 3px rgba(67, 56, 202, 0.15)";
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
                  >
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>

                {/* Password strength bar */}
                {UserDetails.password && (
                  <div style={{ marginTop: "0.5rem" }}>
                    <div style={{ display: "flex", gap: "0.25rem", marginBottom: "0.25rem" }}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <div
                          key={n}
                          style={{
                            flex: 1,
                            height: "4px",
                            borderRadius: "999px",
                            background: n <= strength.score ? strength.color : "#e2e8f0",
                            transition: "background 0.3s",
                          }}
                        />
                      ))}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: strength.color, fontWeight: 600 }}>
                      Strength: {strength.label}
                    </div>
                  </div>
                )}
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
                    : "linear-gradient(135deg, #4338ca 0%, #3730a3 100%)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: 700,
                  fontSize: "1rem",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  boxShadow: isLoading
                    ? "none"
                    : "0 6px 20px rgba(67, 56, 202, 0.35)",
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
                    Creating Account...
                  </>
                ) : (
                  "Create Admin Account →"
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
              <span style={{ padding: "0 0.75rem" }}>Already have an account?</span>
              <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
            </div>

            <Link
              to="/adminLogin"
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
                e.currentTarget.style.borderColor = "#4338ca";
                e.currentTarget.style.color = "#4338ca";
                e.currentTarget.style.background = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#cbd5e1";
                e.currentTarget.style.color = "#334155";
                e.currentTarget.style.background = "#f8fafc";
              }}
            >
              Sign In Instead
            </Link>
          </div>
        </div>

        {/* Right Side: Hero Branding Panel (collapses on mobile) */}
        <div
          className="auth-hero-panel"
          style={{
            background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)",
          }}
        >
          <div style={{ maxWidth: "420px", textAlign: "left", position: "relative", zIndex: 1 }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                background: "rgba(255, 255, 255, 0.12)",
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
              🚀
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
              Start Selling Farm Fresh Produce
            </h2>
            <p
              style={{
                fontSize: "1.05rem",
                color: "rgba(255, 255, 255, 0.75)",
                lineHeight: 1.6,
                marginBottom: "2.5rem",
              }}
            >
              Join the Vegefoods admin network. List your harvest, set custom pricing, and fulfill direct-to-consumer orders seamlessly.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSignup;
