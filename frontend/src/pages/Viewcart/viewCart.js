import React, { useState, useEffect } from "react";
import NavBar from "../../components/NavBar/navbar";
import BannerAndCart from "../../components/LogoAndcart/LogoAndCart.js";
import BackToProductBUTTON from "../../assets/baackToProducts  Button/backToProduct.js";
import MyCartImage from "../../assets/images/MyCartIMAGE.png";
import serverUrl from "../../config.js";
import axios from "axios";
import SearchNav from "../../components/Search In Navbar/searchNav.js";
import CircleArrow from "../../assets/circle BackArrow/circleArrow.js";
import { useNavigate } from "react-router-dom";
import FooterMobile from "../../components/footerForMobile/footerMobile.js";
import FooterBigScreen from "../../components/footer For BigScreen/footerBigScreen.js";

import "./viewCart.css";

const ViewCart = () => {
  sessionStorage.removeItem("directBuy");

  const Navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [Usercart, setUsercart] = useState([]);
  const [UserID, setUserID] = useState(null);
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

        // console.log("isTokenValid:- ", isTokenValid);
        isTokenValid && setIsLoggedIn(true);

        isTokenValid && setUserID(isTokenValid.data.userInfo._id);
      } catch (error) {
        console.error("Error checking token validity:", error);
        setIsLoggedIn(false);
        Navigate("/login");
      }
    }

    loginAuth();
  }, [jwttoken, setIsLoggedIn, Navigate]);

  // getting usercart  by user _id +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ///productID/:_id
  useEffect(() => {
    const fetchDATA = async () => {
      try {
        const res = await axios.get(`${serverUrl}/UserDetails/${UserID}`);
        const UserCart = await res.data.User.mycart;
        console.log("fetchDATA res:-", UserCart);
        setUsercart(UserCart);
      } catch (error) {
        console.log("error in fetchDATA:- ", error);
      }
    };
    UserID && fetchDATA();
  }, [UserID]);

  // changing product quantity ++++++++++++++++++++++++++++++++++++++++++++++++++++++

  const handleQuantityChange = async (productId, newQuantity) => {
    // console.log("newQuantity- ", newQuantity);
    try {
      const res = await axios.patch(`${serverUrl}/UpdateQuantity/${UserID}`, {
        productId,
        newQuantity,
      });
      console.log("handleQuantityChange:- ", res);
      const userCart = await res.data.mycart;
      setUsercart(userCart);
    } catch (error) {
      console.log("handleQuantityChange Error: ", error);
    }
  };

  //============================================== FUNCTION END ===========================================
  return isLoggedIn ? (
    <>
      <div className="viewcart--NavBar">
        <NavBar Logout={"Logout"} />
      </div>

      <div className="viewCart--SearchNav">
        <SearchNav />
      </div>

      <div className="viewcart--BannerAndCart">
        <BannerAndCart ViewCart={"/View Cart"} isLoggedIn={"true"} />
      </div>

      <div className="viewcart--BackToProductBUTTON">
        <BackToProductBUTTON />
      </div>

      {/*circle--arrow for smaller screen */}
      <div className="circle--arrow--div">
        {" "}
        <CircleArrow />
      </div>

      <div className="MyCartIMAGE--div">
        <img src={MyCartImage} alt="MyCartIMAGE" />
      </div>

      {Usercart.length > 0 && (
        <div className="cart--details--container">
          <div className="products--full--detail--div">
            <div id="NumberOF--Product">
              {/* ********************************* */}
              {Usercart.map((obj, i) => (
                <div className="each--product--div" key={obj.productID}>
                  <div className="product--image--div">
                    <img src={obj.ProdectImage} alt="productIMAGE" />
                  </div>
                  <div className="product--modelColor--div">
                    <h5>
                      {obj.ProductCompany} {obj.ProductModel}
                    </h5>
                    <p className="color">Colour :{obj.ProductColor}</p>
                    <p>{obj.ProductAvailable}</p>
                  </div>
                  <div className="product--price--div">
                    <h5>Price</h5>
                    <p>₹ {obj.Productprice}</p>
                  </div>
                  <div className="product--quantity--div">
                    <h5>Quantity</h5>
                    <select
                      name=""
                      id=""
                      value={obj.quantity}
                      onChange={(e) =>
                        handleQuantityChange(obj.productID, e.target.value)
                      }
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                    </select>
                  </div>
                  <div className="product--total--div">
                    <h5>Total</h5>
                    <p>₹ {obj.Productprice * obj.quantity}</p>
                  </div>
                </div>
              ))}
              {/* ********************************* */}
            </div>

            <div id="middelbar"></div>

            <div className="ProductDetails">
              <h4>PRICE DETAILS</h4>
              <div>
                <p>Total MRP</p>
                <p>
                  ₹{" "}
                  {Usercart.map(
                    (item) => item.quantity * item.Productprice
                  ).reduce((sum, price) => sum + price, 0)}
                </p>
              </div>
              <div>
                <p>Discount on MRP</p>
                <p>₹0</p>
              </div>
              <div>
                <p>Convenience Fee</p>
                <p>₹ 45</p>
              </div>
            </div>
          </div>

          <div className="Number--of--item--total">
            <div className="item--price">
              <span>{Usercart.length} item</span>
              <p>
                ₹
                {Usercart.map(
                  (item) => item.quantity * item.Productprice
                ).reduce((sum, price) => sum + price, 0)}
              </p>
            </div>
            <div className="total--amount">
              <p>Total Amount</p>
              <p>
                ₹{" "}
                {Usercart.map(
                  (item) => item.quantity * item.Productprice
                ).reduce((sum, price) => sum + price, 0) + 45}
              </p>
            </div>
          </div>
        </div>
      )}

      {Usercart.length > 0 && (
        <div className="Place--order">
          <button onClick={() => Navigate("/checkOutPage")}>
            {" "}
            Place Order{" "}
          </button>
        </div>
      )}

      {/* product details container for mobile START */}
      <div className="productDetails--Container">
        {Usercart.map((obj, i) => (
          <div key={i}>
            <div className="mobileSize--image">
              <img src={obj.ProdectImage} alt="ProdectImage" />
            </div>
            <div className="mobileSize--Details">
              <p className="mobileSize--ProductNameModel">
                {" "}
                {obj.ProductCompany} {obj.ProductModel}
              </p>
              <h5 className="mobileSize--ProductPrice">
                ₹ {obj.Productprice * obj.quantity}
              </h5>
              <p className="mobileSize--ProductQuantity">
                Quantity: {obj.quantity}{" "}
              </p>
              <p className="mobileSize--ProductColour">
                Colour: {obj.ProductColor}{" "}
              </p>
              <p className="mobileSize--ProductStock">{obj.ProductAvailable}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="Total--InBrown--page">
        <div>
          <div>
            <p>Convenience Fee:</p>
            <p>₹ 45</p>
          </div>
          <div>
            <p>Total: </p>
            <h6>
              ₹{" "}
              {Usercart.map((item) => item.quantity * item.Productprice).reduce(
                (sum, price) => sum + price,
                0
              ) + 45}
            </h6>
          </div>
        </div>
      </div>
      <hr className="viewcart--hr" />
      <span className="mobile--TotalAmount--span">
        Total Amount ₹
        <span className="mobile--TotalAmount">
          {" "}
          {Usercart.map((item) => item.quantity * item.Productprice).reduce(
            (sum, price) => sum + price,
            0
          ) + 45}
        </span>
      </span>

      {Usercart.length > 0 && (
        <button
          className="mobile--PLACEORDER"
          onClick={() => Navigate("/checkOutPage")}
        >
          PLACE ORDER
        </button>
      )}

      {/*footer for BigScreen */}
      <div className="viewCart--footerWEB--IMAGE">
        <FooterBigScreen />
      </div>

      <div className="viewCart--FooterMobile">
        <FooterMobile
          isLoggedIn={isLoggedIn ? true : false}
          IsCartPageOpen={true}
          IsHomePageOpen={false}
        />
      </div>
    </>
  ) : null;
};

export default ViewCart;