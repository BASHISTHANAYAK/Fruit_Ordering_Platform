import React from "react";
import HomeIcon from "../../assets/images/HomeIcon.png";
import CartIcon from "../../assets/images/CartIcon.png";
import LogOutIcon from "../../assets/images/LogoutIcon.png";
import "./footerForMobile.css";
import { useNavigate } from "react-router-dom";

const FooterMobile = (props) => {
  const Navigate = useNavigate();

  //   function triggers when we click any div ************
  function clickDIV(event) {
    const clickedName = event.currentTarget.dataset.name;
    console.log("event.currentTarget dataset:", clickedName);
    clickedName === "Cart" && Navigate("/viewCart");
    (clickedName === "Logout" || clickedName === "Login") && Navigate("/Login");
    clickedName === "Home" && Navigate("/");

  }
  return (
    <div className="footer--forMobile">
      <div
        onClick={clickDIV}
        data-name="Home"
        className={( props.IsHomePageOpen) ? "selected" : ""}
      >
        <img src={HomeIcon} alt="HomeIcon" />
        <p>Home</p>
      </div>
      <div
        onClick={clickDIV}
        data-name="Cart"
        className={(props.IsCartPageOpen) ? "selected" : ""}
      >
        <img src={CartIcon} alt="CartIcon" />
        <p>Cart</p>
      </div>
      <div
        onClick={clickDIV}
        data-name={props.isLoggedIn ? "Logout" : "Login"}
      >
        {" "}
        <img src={LogOutIcon} alt="LogOutIcon" />{" "}
        {!props.isLoggedIn && <span>!</span>}
        <p className="login--or--logout">
          {" "}
          {props.isLoggedIn ? "Logout" : "Login"}
        </p>
      </div>
    </div>
  );
};

export default FooterMobile;
