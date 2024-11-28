import React, { useEffect, useRef, useState } from "react";
import NavBar from "../../components/NavBar/navbar.js";
import serverUrl from "../../config.js";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

// import Banner from "../../assets/images/homePageBanner.png";
import "./home.css";
import api from "../../Axios_Interceptor/api.js";
import { useDispatch, useSelector } from "react-redux";
import { addtocart, logoutUser } from "../../ReduxPersist/actions.js";
// import { useSelector } from "react-redux";

const Home = () => {
  const [gridBLACK, setGridImage] = useState(true);
  const [lineWHITE, setLineImage] = useState(true);
  const [AllData, setAllData] = useState([]);
  const [user_id, setUser_id] = useState(null);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const reduxData = useSelector((state) => state);
  const dispatch = useDispatch();
  // const isLoggedIn = reduxData.isLoggedIn;

  console.log("home  ,redux->", reduxData);

  const Navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      console.log("handleResize");
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Create a ref for the input element +++++++++++++++++++++++
  // const inputRef = useRef();

  // function triggers when we click on a product ++++++++++++++++++++++++++++++++++++++++++++++++
  function clickAproduct(_id) {
    Navigate(`/productDetail/${_id}`);
  }

  // ------------------------- get all  products---------------
  useEffect(() => {
    async function getAllProduct() {
      try {
        const res = await api.get(`${serverUrl}/getAllProducts`);
        console.log("getAllProducts res-", res);
        setAllData(res.data);
      } catch (error) {
        console.log("getAllProduct error-", error);
      }
    }
    getAllProduct();
  }, []);

  //log_to_addIn_cart
  function log_to_addIn_cart() {
    dispatch(logoutUser());

    setTimeout(() => {
      Navigate("/selectAccountType");
    }, 500);
  }

  //addtocartFun
  async function addtocartFun(buyerId, productId) {
    try {
      let result = await api.post(`/addToCart/${buyerId}`, {
        productId,
        quantity: 1,
      });
      //{ productId, quantity }

      console.log("addtocartFun--", result);
      if (result.status === 200) {
        toast.success(result?.data?.message, {
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
      console.log(error);
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
  }
  // =========================================== END ==================================================>

  return (
    <>
      <ToastContainer />

      {/* nav for small screen */}
      {/* <div className="homePage--BlankBlueNav"></div> */}

      <div className="home--Page--NavBar">
        {" "}
        <NavBar />
      </div>

      <div className="banner">
        <section>
          {" "}
          <p> Home Products </p>
          <h1>Products</h1>
        </section>
      </div>

      <section>
        <h1>HI , {reduxData.name}</h1>
      </section>

      {/*filtersANDSortings div End  */}

      {AllData.length > 0 ? (
        <div className="allProduct--container">
          <div
            className={
              gridBLACK || screenWidth <= 480
                ? "allProduct--container--Child"
                : "LineView--Activate"
            }
          >
            {AllData.map((obj, i) => (
              <div
                className="Asingle--Product--div"
                key={obj._id}
                storekey={obj._id}
              >
                <div className="blueColor" key={obj._id}>
                  <img src={obj.image} alt="productImg" />
                </div>
                <div className="productDetails" key={i}>
                  <p className="productName--model">
                    <span className="productName">{obj.name}</span>
                  </p>
                  <p className="price">
                    Price- ₹<span> {obj.price}</span>
                  </p>
                  <p className="color--and--type"></p>
                  <p>description: {obj.description}</p>
                  <button className="Details">Details</button>

                  {reduxData.isLoggedIn && reduxData.role === "Buyer" ? (
                    <section
                      className="Add_to_cart"
                      onClick={() => addtocartFun(reduxData._id, obj._id)}
                    >
                      Add To Cart
                    </section>
                  ) : (
                    <section
                      className="Add_to_cart please_log"
                      onClick={log_to_addIn_cart}
                    >
                      {reduxData.role === "Admin"
                        ? "login as a user"
                        : "Log in"}
                    </section>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : AllData.message ? (
        <center>{AllData.message}</center>
      ) : (
        <center className="loadingImg">
          <img
            src="https://www.pcb.com/contentstore/images/pcb_corporate/supportingimages/loader.gif"
            alt=""
          />{" "}
        </center>
      )}

      {/* big screen footer
      <div className="home--footerWEB--IMAGE ">
        <FooterBigScreen />
      </div>

      <div className="FooterMobile">
        {" "}
        <FooterMobile
          isLoggedIn={isLoggedIn ? true : false}
          IsHomePageOpen={true}
          IsCartPageOpen={false}
        />
      </div> */}
    </>
  );
};

export default Home;
