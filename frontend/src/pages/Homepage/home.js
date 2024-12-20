import React, { useEffect, useState } from "react";
import NavBar from "../../components/NavBar/navbar.js";
import serverUrl from "../../config.js";
import { ToastContainer, toast } from "react-toastify";

// import Banner from "../../assets/images/homePageBanner.png";
import homeCss from "./home.module.css";
import api from "../../Axios_Interceptor/api.js";
import { useSelector } from "react-redux";

// import { useSelector } from "react-redux";

const Home = () => {
  const [AllData, setAllData] = useState([]);
  const [aSingleProductQuantity, setASingleProductQuantity] = useState(1)
  const reduxData = useSelector((state) => state);
  // const isLoggedIn = reduxData.isLoggedIn;
  // console.log("home  ,redux->", reduxData);


  // ------------------------- get all  products---------------
  useEffect(() => {
    async function getAllProduct() {
      try {
        const res = await api.get(`${serverUrl}/getAllProducts`);
        // console.log("getAllProducts res-", res);
        setAllData(res.data);
      } catch (error) {
        console.log("getAllProduct error-", error);
      }
    }
    getAllProduct();
  }, []);

  //updateProductQuantity ---------------------------

  //addtocartFun ----------------------------
  async function addtocartFun(buyerId, productId) {

    try {
      let result = await api.post(`/addToCart/${buyerId}`, {
        productId,
        quantity: aSingleProductQuantity,
        areYouUpdatingQuantity: false
      });

      // console.log("addtocartFun--", result);
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
      toast.error(error?.response?.data?.message || error.message, {
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


  function addQuantity(e) {
    let quantity = Number(e.target.value) || 1
    // console.log("quantity-", quantity)
    setASingleProductQuantity(quantity)

  }
  // =========================================== END ==================================================>

  return (
    <>
      <ToastContainer />

      <div className={homeCss.home_Page_NavBar}>
        {" "}
        <NavBar />
      </div>

      <div className={homeCss.banner}>
        <section>
          <p> Home Products </p>
          <h1>Products</h1>
        </section>
      </div>

      {/*filtersANDSortings div End  */}

      {AllData.length > 0 ? (
        <div className={homeCss.allProduct_container}>
          {AllData.map((obj, i) => (
            <div
              className={homeCss.Asingle_Product_div}
              key={obj._id}
              storekey={obj._id}
            >
              <div className={homeCss.blueColorDIv} key={obj._id}>
                <img src={obj.image} alt="productImg" />
              </div>
              <div className={homeCss.productDetails} key={i}>
                <p className={homeCss.productName_model}>
                  <span className={homeCss.productName}>name: {obj.name}</span>
                </p>
                <p className={homeCss.price}>
                  Price- ₹<span> {obj.price}</span>
                </p>
                <p className={homeCss.color_and_type}></p>
                <p>description: {obj.description}</p>
              </div>
              {
                reduxData.isLoggedIn && reduxData.role === "Buyer" &&
                <select name="" id="" onChange={addQuantity} className={homeCss.selectQuantity}>
                  <option value="">--Select Qunatity--</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="4">5</option>
                </select>


              }


              {reduxData.isLoggedIn && reduxData.role === "Buyer" && (
                <section
                  className={homeCss.Add_to_cart}
                  onClick={() => addtocartFun(reduxData._id, obj._id)}
                >
                  Add To Cart
                </section>
              )}
            </div>
          ))}
        </div>
      ) : AllData.message ? (
        <center>{AllData.message}</center>
      ) : (
        <center className={homeCss.loadingImg}>
          <img
            src="https://cdn.pixabay.com/animation/2024/10/22/07/53/07-53-23-877_512.gif"
            alt="loader gif.."
          />
        </center>
      )}
    </>
  );
};

export default Home;
