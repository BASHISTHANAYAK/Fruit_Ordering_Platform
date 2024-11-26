import React from "react";
import Logo from "../../assets/images/musicCartLogo.png";
import "./LogoAndCart.css";
import Viewcart from "../../assets/images/viewCartImage.png";
import { Link, useNavigate } from "react-router-dom";

const BannerLogo = (props) => {
  const Navigate = useNavigate();
  // function when we click view cart image ++++++++++++++++++++++
  function viewCart() {
    Navigate("/viewCart");
  }
  return (
    <div className="logo--and--banner">
      <div className="logo--div">
        <div>
          {/* <img
            src={Logo}
            alt="Logo"
            className="logo"
            onClick={() => Navigate("/")}
          /> */}
          <p className="space"></p>
          {props.showHome && (
            <Link to="/" className="Link">
              Home
            </Link>
          )}
          {/* IF these details provied then show on page */}
          {props.ProductName && props.ProductModel && (
            <p>
              / {props.ProductName} {props.ProductModel}
            </p>
          )}
          {props.ViewCart && <p> {props.ViewCart}</p>}
          {props.Checkout && <p> {props.Checkout}</p>}
        </div>
        {props.isLoggedIn === "true" && (
          <div className="viewcart">
            <img src={Viewcart} alt="Viewcart" onClick={viewCart} />
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerLogo;
