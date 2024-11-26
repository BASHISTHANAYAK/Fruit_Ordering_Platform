import React from "react";
import footerWEB from "../../assets/images/footerWEB.png";
import "./footerBigScreen.css";
const footerBigScreen = () => {
  return (
    <>
      {/* large screen footer */}
      <img src={footerWEB} alt="footerWEB" className="footer-BigScreen" />
    </>
  );
};

export default footerBigScreen;
