import React, { useState } from "react";
import { enterDetails, submitForm } from "./loginFunction";
// import MusicLogo from "../../assets/images/musicCartLogo.png";
// import footerWEB from "../../assets/images/footerWEB.png";
// import mobilenav from "../../assets/images/mobileLoginNav.png";
// import MusicLogoMobile from "../../assets/images/musicLogoMobile.png";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "./login.css";
import VegefoodsLogo from "../../components/Vegefoods_Logo/VegefoodsLogo";
import { useDispatch } from "react-redux";
import { setUser } from "../../ReduxPersist/actions";

const AdminLogin = () => {
  // clearing session storage
  sessionStorage.removeItem("jwttoken");
  sessionStorage.removeItem("directBuy");

  const dispatch = useDispatch();

  const Navigate = useNavigate();
  const [UserDetails, setUserdetails] = useState({
    email: "",
    password: "",
  });

  const handleEnterDetails = (e) => enterDetails(e, setUserdetails);

  const handleSubmitForm = async (event) => {
    event.preventDefault();

    try {
      const result = await submitForm(UserDetails);
      console.log("result from function to ui:- ", result);
      if (result.status === 200) {
        toast.success(result.data?.message, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        // saving jwt token in session storage
        sessionStorage.setItem(
          "jwttoken",
          JSON.stringify(result.data.jwttoken)
        );

        dispatch(
          setUser({
            name: result.data.detail.name,
            role: result.data.detail.role,
          })
        );

        setTimeout(() => {
          Navigate("/adminDashboard");
        }, 2000);
      } else {
        toast.error(
          result?.response?.data?.message
            ? result?.response?.data.message
            : result.message,
          {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }
        );
      }
    } catch (error) {
      console.log("error", error);
      toast.error(error.message, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <div>
      <ToastContainer />
      <center>
        <VegefoodsLogo />
      </center>
      <center>
        <h3>ADMIN</h3>
      </center>

      <h2 className="login--welcome--mobile">welcome</h2>
      <form action="" id="login--form" onSubmit={handleSubmitForm}>
        <div className="login--container">
          <h3 className="SignIn">
            SignIn <span>Already a customer?</span>
          </h3>
          <label>Enter your email </label>
          <input
            type="text"
            name="email"
            required
            onChange={handleEnterDetails}
            value={UserDetails.mobile}
          />
          <label>Password </label>
          <input
            type="password"
            name="password"
            required
            onChange={handleEnterDetails}
            value={UserDetails.password}
          />
          <button type="submit" className="login--button">
            Continue
          </button>
          <p className="login--privacy--notice">
            By continuing, you agree to Musicart privacy notice and conditions
            of use.
          </p>
        </div>
      </form>

      <div className="login--new--to--cart">
        <p className="line1"></p>
        <p>New to Vegefoods?</p>
        <p className="line2"></p>
      </div>
      <div className="login--create--your--account--button">
        <Link to="/adminSignup" id="LinkTag">
          Create your account
        </Link>
      </div>
      {/* <div className="footerWEB">
        <img src={footerWEB} alt="footerWEB" />
      </div> */}
    </div>
  );
};

export default AdminLogin;
