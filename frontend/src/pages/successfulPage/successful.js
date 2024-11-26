import React, { useEffect, useState } from "react";
import LogoAndCart from "../../components/LogoAndcart/LogoAndCart.js";
import Successfulimage from "../../assets/images/successfulIMAGE.png";
import FooterMobile from "../../components/footerForMobile/footerMobile.js";
import serverUrl from "../../config.js";
import mobilenav from "../../assets/images/mobileLoginNav.png";
import MusicLogoMobile from "../../assets/images/musicLogoMobile.png";
import "./successfull.css";
import { Link, useNavigate } from "react-router-dom";
import FooterBigScreen from "../../components/footer For BigScreen/footerBigScreen.js";

import axios from "axios";

const Successful = () => {
  sessionStorage.removeItem("directBuy");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const Navigate = useNavigate();

  // checking if user logged or not  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  const jwttoken = sessionStorage.getItem("jwttoken");
  useEffect(() => {
    async function loginAuth() {
      if (!jwttoken) {
        Navigate("/login");
      }

      try {
        const isTokenValid = await axios.post(
          `${serverUrl}/isAuthenticated`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${jwttoken}`,
            },
          }
        );

        console.log(
          "isTokenValid and cart:- ",
          isTokenValid.data.userInfo.mycart
        );
        isTokenValid && setIsLoggedIn(true);
      } catch (error) {
        console.error("Error checking token validity:", error);
        setIsLoggedIn(false);
        Navigate("/login");
      }
    }

    loginAuth();
  }, [jwttoken, setIsLoggedIn, Navigate]);

  return isLoggedIn ? (
    <div>
      <div className="successful--mobileNav">
        {/* blank purple nav and logo for small screen */}
        <img src={mobilenav} alt="mobilenav" className="login--mobilenav" />

        {/* logo   */}
        <img
          src={MusicLogoMobile}
          alt="MusicLogoMobile"
          className="login--music--Logo--ForMobile"
          onClick={() => Navigate("/")}
        />
      </div>

      <div className="successfulPAGE--logo--div">
        {" "}
        <LogoAndCart showHome={false} />
      </div>

      <div className="successful--div">
        <img src={Successfulimage} alt="Successfulimage" />
        <div>
          <h2>Order is placed successfully!</h2>
          <p>You will be receiving a confirmation email with order details</p>
        </div>
        <Link className="Link" to="/">
          Go back to Home page
        </Link>{" "}
      </div>
      
  {/*footer for BigScreen */}
  <div className="successful--footerWEB--IMAGE">
        <FooterBigScreen />
      </div>

      {/* for mobile */}
      <div className="successful--FooterMobile">
        {" "}
        <FooterMobile
          isLoggedIn={isLoggedIn ? true : false}
          IsHomePageOpen={false}
          IsCartPageOpen={false}
        />
      </div>
    </div>
  ) : null;
};

export default Successful;