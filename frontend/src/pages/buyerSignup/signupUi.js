import React, { useState } from "react";
import "./signup.css";
import { enterDetails, submitForm } from "./signupFunction";
import mobilenav from "../../assets/images/mobileLoginNav.png";
import MusicLogoMobile from "../../assets/images/musicLogoMobile.png";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import VegefoodsLogo from "../../components/Vegefoods_Logo/VegefoodsLogo";
import { useDispatch } from "react-redux";
import { setUser } from "../../ReduxPersist/actions";

const BuyerSignup = () => {
  // sessionStorage.removeItem("directBuy");
  const dispatch = useDispatch();

  const Navigate = useNavigate();
  const [UserDetails, setUserdetails] = useState({
    name: "",
    // mobile: "",
    email: "",
    password: "",
  });

  const handleEnterDetails = (e) => enterDetails(e, setUserdetails);

  const handleSubmitForm = async (event) => {
    event.preventDefault();
    console.log("UserDetails-", UserDetails);
    try {
      const result = await submitForm(UserDetails);
      console.log("result from function to ui:- ", result);
      if (result.status === 200) {
        await toast.success("successfully registered", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        await sessionStorage.setItem(
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
          Navigate("/");
        }, 2000);
      } else {
        toast.error(result.data.message, {
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
    } catch (error) {
      console.log("error", error);
      if (error.message) {
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
      } else if (error.data.message) {
        toast.error(error.data.message, {
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
    }
  };

  return (
    <div className="signUp_Container">
      <ToastContainer />
      <img src={mobilenav} alt="mobilenav" className="mobilenav" />
      <img
        src={MusicLogoMobile}
        alt="MusicLogoMobile"
        className="music--Logo--ForMobile"
      />

      <center>
        <VegefoodsLogo />
      </center>
      <center>
        <h3>USER</h3>
      </center>

      <h2 className="signup--welcome--mobile">welcome</h2>
      <form className="singup--form" onSubmit={handleSubmitForm}>
        <div className="singup--container">
          <h3 className="Create--Account">
            Create Account <span>Don’t have an account?</span>
          </h3>

          <label>Your name </label>
          <input
            type="text"
            name="name"
            required
            onChange={handleEnterDetails}
            value={UserDetails.name}
          />

          <label>Email id </label>
          <input
            type="email"
            name="email"
            required
            onChange={handleEnterDetails}
            value={UserDetails.email}
          />
          <label>Password </label>
          <input
            type="password"
            name="password"
            required
            onChange={handleEnterDetails}
            value={UserDetails.password}
          />

          <p className="enrolling--message">
            By enrolling your mobile phone number, you consent to receive
            automated security notifications via text message from Vegefoods.
          </p>

          <button type="submit" className="signup--button">
            Continue
          </button>
          <p className="privacy--notice">
            By continuing, you agree to Vegefoods privacy notice and conditions.
          </p>
        </div>
      </form>

      <center className="Already--have--an--account--div">
        <h4>
          Already have an account? <Link to="/buyerLogin">Sign in</Link>{" "}
        </h4>
      </center>
    </div>
  );
};

export default BuyerSignup;
