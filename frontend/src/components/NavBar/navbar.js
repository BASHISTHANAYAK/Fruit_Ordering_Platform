import React, { useState } from "react";
import navBarcss from "./navbar.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../ReduxPersist/actions";

const NavWithoutLogin = () => {
  const [openMobileNav, setOpenMobileNav] = useState(false);
  const red = useSelector((state) => state);
  const Login = !red.isLoggedIn;
  const Signup = !red.isLoggedIn;
  const Logout = red.isLoggedIn;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <>
      <section
        className={`${navBarcss.navInfo} ${
          openMobileNav && navBarcss.openNavClass
        }`}
      >
        <div className={navBarcss.Vegefoods_logo} onClick={() => navigate("/")}>
          Vegefoods
        </div>
        <div className={navBarcss.offAndShopNow}>
          {" "}
          👤:
          <strong> &nbsp; {red.name}</strong>
        </div>
        <div className={navBarcss.log_sign_cart_dashDIV}>
          <span>
            {Login && (
              <Link
                className={navBarcss.login_SignButton}
                to="/selectAccountType"
              >
                Login
              </Link>
            )}
          </span>
          <span>
            {Signup && (
              <>
                <span className={navBarcss.divider}> | </span>
                <Link
                  className={navBarcss.login_SignButton}
                  to="/selectAccountType"
                >
                  Signup
                </Link>
              </>
            )}
          </span>
          <span>
            {Logout && (
              <>
                {red.role === "Buyer" ? (
                  <Link className={navBarcss.login_SignButton} to="/cart">
                    Cart
                  </Link>
                ) : (
                  <Link
                    className={navBarcss.login_SignButton}
                    to="/adminDashboard"
                  >
                    Dashboard
                  </Link>
                )}
                &nbsp; | &nbsp;
                <Link
                  className={navBarcss.login_SignButton}
                  to="/selectAccountType"
                  onClick={() => dispatch(logoutUser())}
                >
                  Logout
                </Link>
              </>
            )}
          </span>
        </div>
      </section>
      <div
        className={navBarcss.openNavBtn}
        onClick={() => setOpenMobileNav((pre) => !pre)}
      >
        {!openMobileNav ? (
          <i className="fa-duotone fa-light fa-bars"></i>
        ) : (
          <i class="fa-sharp fa-solid fa-xmark" style={{ color: "white" }}></i>
          
        )}
      </div>
    </>
  );
};

export default NavWithoutLogin;
