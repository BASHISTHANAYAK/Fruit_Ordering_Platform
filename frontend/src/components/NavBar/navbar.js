import React, { useState } from "react";
import navCss from "./navbar.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../ReduxPersist/actions";
import { persistor } from "../../ReduxPersist/store";

const NavWithoutLogin = () => {
  const [openMobileNav, setOpenMobileNav] = useState(false);
  const red = useSelector((state) => state);
  const isLoggedIn = red.isLoggedIn;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  const handleLogout = async () => {
    try {
      sessionStorage.clear();
      localStorage.clear();
      if (persistor && persistor.purge) {
        await persistor.purge();
      }
    } catch (e) {
      console.error("Storage clear error:", e);
    }
    dispatch(logoutUser());
    navigate("/selectAccountType");
  };

  return (
    <nav className={navCss.navbar}>
      <div className={navCss.navbar_inner}>
        {/* Logo */}
        <div className={navCss.logo} onClick={() => navigate("/")}>
          <div className={navCss.logo_icon}>🌿</div>
          <span className={navCss.logo_text}>Vegefoods</span>
        </div>

        {/* User greeting (center on desktop) */}
        {isLoggedIn && (
          <div className={navCss.user_greeting}>
            <div className={navCss.user_avatar}>{getInitials(red.name)}</div>
            <span>
              Hi, <span className={navCss.user_greeting_name}>{red.name}</span>
            </span>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                padding: "0.2rem 0.5rem",
                borderRadius: "6px",
                background: red.role === "Admin" ? "#ede9fe" : "#dcfce7",
                color: red.role === "Admin" ? "#4338ca" : "#15803d",
              }}
            >
              {red.role}
            </span>
          </div>
        )}

        {/* Desktop nav links */}
        <div className={navCss.nav_links}>
          {!isLoggedIn ? (
            <>
              <Link className={navCss.nav_link} to="/selectAccountType">
                Sign In
              </Link>
              <Link
                className={`${navCss.nav_link} ${navCss.nav_link_primary}`}
                to="/selectAccountType"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {red.role === "Buyer" ? (
                <Link className={navCss.cart_btn} to="/cart">
                  <span>🛒</span> My Cart
                </Link>
              ) : (
                <Link className={navCss.admin_btn} to="/adminDashboard">
                  <span>📊</span> Dashboard
                </Link>
              )}
              <button className={navCss.logout_btn} onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className={navCss.mobile_toggle}
          onClick={() => setOpenMobileNav((p) => !p)}
          aria-label="Toggle navigation"
        >
          <span
            style={{
              transform: openMobileNav ? "rotate(45deg) translate(5px, 5px)" : "none",
            }}
          />
          <span style={{ opacity: openMobileNav ? 0 : 1 }} />
          <span
            style={{
              transform: openMobileNav ? "rotate(-45deg) translate(5px, -5px)" : "none",
            }}
          />
        </button>
      </div>

      {/* Mobile nav */}
      <div className={`${navCss.mobile_nav} ${openMobileNav ? navCss.mobile_nav_open : ""}`}>
        {isLoggedIn && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.75rem 1rem",
              background: "#f0fdf4",
              borderRadius: "10px",
              marginBottom: "0.5rem",
            }}
          >
            <div className={navCss.user_avatar}>{getInitials(red.name)}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#1e293b" }}>{red.name}</div>
              <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Role: {red.role}</div>
            </div>
          </div>
        )}
        {!isLoggedIn ? (
          <>
            <Link
              className={navCss.mobile_nav_link}
              to="/selectAccountType"
              onClick={() => setOpenMobileNav(false)}
            >
              Sign In
            </Link>
            <Link
              className={navCss.mobile_nav_link}
              to="/selectAccountType"
              onClick={() => setOpenMobileNav(false)}
            >
              Register Account
            </Link>
          </>
        ) : (
          <>
            {red.role === "Buyer" ? (
              <Link
                className={navCss.mobile_nav_link}
                to="/cart"
                onClick={() => setOpenMobileNav(false)}
              >
                🛒 My Cart
              </Link>
            ) : (
              <Link
                className={navCss.mobile_nav_link}
                to="/adminDashboard"
                onClick={() => setOpenMobileNav(false)}
              >
                📊 Admin Dashboard
              </Link>
            )}
            <button
              className={navCss.mobile_nav_link}
              onClick={() => {
                handleLogout();
                setOpenMobileNav(false);
              }}
              style={{ color: "#ef4444" }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavWithoutLogin;
