import React from "react";
import BlankNavbar from "../../assets/images/mobileLoginNav.png";
import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../ReduxPersist/actions";
const NavWithoutLogin = () => {
  const red = useSelector((state) => state);
  const Login = !red.isLoggedIn;
  const Signup = !red.isLoggedIn;
  const Logout = red.isLoggedIn;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Login={!isLoggedIn && "Login"}
  // Signup={!isLoggedIn && "Signup"}
  // Logout={isLoggedIn && "Logout"}
  // console.log("nav  ,redux->", red);

  return (
    <div>
      <nav className="homePage--Navbar">
        <img src={BlankNavbar} alt="navWithoutLogin" />
      </nav>
      <div className="navInfo">
        <div className="mobileNumber Vegefoods_logo">
          {/* <i className="fa-solid fa-phone-volume"> </i> */}
          <span onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
            {" "}
            Vegefoods
          </span>
        </div>
        <div className="offAndShopNow">
          Get 50% off on selected items | shop now
        </div>
        <div>
          <span>
            {Login && (
              <Link className="login--SignButton" to="/selectAccountType">
                Login
              </Link>
            )}
          </span>
          <span>
            {Signup && (
              <>
                <span> | </span>
                <Link className="login--SignButton" to="/selectAccountType">
                  Signup
                </Link>
              </>
            )}
          </span>
          <span>
            {Logout && (
              <>
                {red.role === "Buyer" ? (
                  <Link className="login--SignButton" to="/cart">
                    Cart
                  </Link>
                ) : (
                  <Link className="login--SignButton" to="/adminDashboard">
                    Dashboard
                  </Link>
                )}
                | &nbsp;
                <Link
                  className="login--SignButton"
                  to="/selectAccountType"
                  onClick={() => dispatch(logoutUser())}
                >
                  Logout
                </Link>
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NavWithoutLogin;
