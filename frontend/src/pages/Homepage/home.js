import React, { useEffect, useRef, useState } from "react";
import NavBar from "../../components/NavBar/navbar.js";
import BannerAndCart from "../../components/LogoAndcart/LogoAndCart.js";
import serverUrl from "../../config.js";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import searchicon from "../../assets/images/searchicon.png";
import GridBLACK from "../../assets/images/gridBLACK.png";
import GridWHITE from "../../assets/images/gridWHITE.png";
import LineWHITE from "../../assets/images//lineWHITE.png";
import LineBLACK from "../../assets/images/lineBLACK.png";
// import Banner from "../../assets/images/homePageBanner.png";
import "./home.css";
import api from "../../Axios_Interceptor/api.js";
import { useSelector } from "react-redux";
// import { useSelector } from "react-redux";

const Home = () => {
  const red = useSelector((state) => state);
  console.log("home  ,redux->", red);

  const Navigate = useNavigate();
  // const { isLoggedin, isLoggedOut, name, role, test } = useSelector(
  //   (state) => state.loggedInDetails
  // );
  // console.log("info redux,home->", {
  //   isLoggedin,
  //   isLoggedOut,
  //   name,
  //   role,
  //   test,
  // });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [gridBLACK, setGridImage] = useState(true);
  const [lineWHITE, setLineImage] = useState(true);
  const [AllData, setAllData] = useState([]);
  const [user_id, setUser_id] = useState(null);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const [filteredData, setFilteredData] = useState({
    Select_Headphone_Type: "",
    Company: "",
    Colour: "",
    Price: "",
    Sort_by: "",
  });

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

  // checking if user logged or not  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
  // const jwttoken = sessionStorage.getItem("jwttoken");
  // useEffect(() => {
  //   console.log("checking if user logged or not ... ");
  //   async function test() {
  //     if (!jwttoken) {
  //       return;
  //     }
  //     try {
  //       const isTokenValid = await api.post(
  //         `${serverUrl}/isAuthenticated`,
  //         {},
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //             authorization: `Bearer ${jwttoken}`,
  //           },
  //         }
  //       );
  //       console.log("isTokenValid-", isTokenValid);
  //       isTokenValid && setUser_id(isTokenValid.data.userInfo._id);
  //       // console.log("isTokenValid:- ", isTokenValid);
  //       isTokenValid && setIsLoggedIn(true);
  //     } catch (error) {
  //       console.log("inside catch block");

  //       console.error("Error checking token validity:", error);
  //       setIsLoggedIn(false);
  //     }
  //   }

  //   test();
  // }, []);

  // +++++++++++++++++++++++++++++++++++++++++++++++++
  function clickGrid() {
    console.log("grid clicked");
    setGridImage((pre) => !pre);
    setLineImage((pre) => !pre);
  }
  function clickLine() {
    console.log("line clicked");
    setLineImage((pre) => !pre);
    setGridImage((pre) => !pre);
  }

  // Create a ref for the input element +++++++++++++++++++++++
  const inputRef = useRef();

  // Function for Search +++++++++++++++++++++++++++++
  const SearchPlaced = (event) => {
    // event.preventDefault();
    // let inputValue = inputRef.current.value;
    // // calling getData function
    // setFilteredData((prev) => {
    //   return { ...prev, Company: inputValue };
    // });
    // console.log("SearchPlaced", inputValue);
    // inputRef.current.value = "";
  };

  // Function to fetch data based on search/page-load.. +++++++++++++++++++++++++++++
  // useEffect(() => {
  //   const getData = async () => {
  //     try {
  //       const result = await api.get(`${serverUrl}/getProduct`, {
  //         params: { filteredData },
  //       });
  //       setAllData(result.data);
  //       console.log("getData-", result);
  //     } catch (error) {
  //       console.log("getData error:- ", error);
  //     }
  //   };
  //   getData();
  // }, [filteredData]);

  // Function triggers when filters are selected+++++++++++++++++++++++++++++
  const SelectFilters = async (event) => {
    // const name = event.target.name;
    // const value = event.target.value;
    // setFilteredData((prev) => {
    //   return { ...prev, [name]: value };
    // });
    // console.log(value);
  };

  // function triggers when we click on a product ++++++++++++++++++++++++++++++++++++++++++++++++
  function clickAproduct(_id) {
    Navigate(`/productDetail/${_id}`);
  }

  // click AddToCart +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  let count = 0;

  async function ClickAddToCart(event, Clickedobj) {
    event.stopPropagation();
    try {
      console.log("AddToCart clicked user_id:- ", user_id);
      count++;

      const obj = {
        productID: Clickedobj._id,
        quantity: count,
        ProductCompany: Clickedobj.Company,
        ProductModel: Clickedobj.Model,
        ProdectImage: Clickedobj.ProdectImage,
        Productprice: Clickedobj.Productprice,
        ProductColor: Clickedobj.ProductColor,
        ProductAvailable: Clickedobj.Available,
      };

      const idProductAdded = await api.post(
        `${serverUrl}/addToCART/${user_id}`,
        obj
      );

      // console.log("ClickAddToCart:- ", Clickedobj);
      idProductAdded &&
        toast.success("Product added to cart", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
    } catch (error) {
      console.log("ClickAddToCart error:- ", error);
    }
  }

  // ------------------------- get all admin products---------------
  // useEffect(() => {
  //   async function getAllProduct() {
  //     try {
  //       const res = await api.get(`${serverUrl}/getAllProducts`);
  //       console.log("getAllProducts res-", res);
  //       setAllData(res.data);
  //     } catch (error) {
  //       console.log("getAllProduct error-", error);
  //     }
  //   }
  //   getAllProduct();
  // }, []);

  // =========================================== END ==================================================>

  return (
    <>
      <ToastContainer />

      {/* nav for small screen */}
      <div className="homePage--BlankBlueNav"></div>

      <div className="home--Page--NavBar">
        {" "}
        <NavBar
          Login={!isLoggedIn && "Login"}
          Signup={!isLoggedIn && "Signup"}
          Logout={isLoggedIn && "Logout"}
        />
      </div>

      <div className="BannerAndCart">
        <BannerAndCart isLoggedIn={isLoggedIn ? "true" : "false"} />
      </div>

      <div className="banner">
        <section>
          {" "}
          <p> Home Products </p>
          <h1>Products</h1>
        </section>
      </div>

      <section>
        <h1>HI , User</h1>
        {/* <button onClick={() => Navigate("/createProduct")}>AddProducts</button> */}
      </section>

      {/* search box and inputs */}
      <div className="homePage--search--div">
        <img
          src={searchicon}
          className="homePage--searchicon"
          alt="searchicon"
        />
        <form action="" onSubmit={SearchPlaced}>
          {" "}
          <input
            type="search"
            name="search"
            placeholder="Search Product"
            ref={inputRef}
          />
        </form>
      </div>

      {/*filtersANDSortings div Start  */}
      <div className="filtersANDSortings">
        <div className="icon--and--filters--div">
          <div className="grid--line--icons">
            <img
              src={gridBLACK ? GridBLACK : GridWHITE}
              alt="GridBLACK"
              onClick={clickGrid}
            />
            <img
              src={lineWHITE ? LineWHITE : LineBLACK}
              alt="LineWHITE"
              onClick={clickLine}
            />
          </div>
          <div className="Four--filters--div">
            <select
              name="Select_Headphone_Type"
              value={filteredData.Select_Headphone_Type}
              onChange={SelectFilters}
            >
              <option value="">Select Headphone Type</option>
              <option value="In-ear headphone">In-ear headphone</option>
              <option value="On-ear headphone">On-ear headphone</option>
              <option value="Over-ear headphone">Over-ear headphone</option>
            </select>

            <select
              name="Company"
              value={filteredData.Company}
              onChange={SelectFilters}
            >
              <option value="">Company</option>
              <option value="JBL">JBL</option>
              <option value="Sony">Sony</option>
              <option value="Boat">Boat</option>
              <option value="Zebronics">Zebronics</option>
              <option value="Marshall">Marshall</option>
              <option value="Ptron">Ptron</option>
            </select>

            <select
              name="Colour"
              value={filteredData.Colour}
              onChange={SelectFilters}
            >
              <option value="">Colour</option>
              <option value="Blue">Blue</option>
              <option value="Black">Black</option>
              <option value="White">White</option>
              <option value="Brown">Brown</option>
            </select>

            <select
              name="Price"
              value={filteredData.Price}
              onChange={SelectFilters}
            >
              <option value="">Price</option>
              <option value="0-1000">₹0 - ₹1,000</option>
              <option value="1000-10000">₹1,000 - ₹10,000</option>
              <option value="10000-20000">₹10,000 - ₹20,000</option>
            </select>
          </div>
        </div>

        <div className="only-sorting--div">
          <select
            name="Sort_by"
            value={filteredData.Sort_by}
            onChange={SelectFilters}
          >
            <option value="">Sort by : Feature</option>
            <option value="Lowest">Price: Lowest</option>
            <option value="Highest">Price: Highest</option>
            <option value="A-Z">Name:(A-Z)</option>
            <option value="Z-A">Name:(Z-A)</option>
          </select>
        </div>
      </div>
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
                onClick={() => clickAproduct(obj._id)}
              >
                <div className="blueColor" key={obj._id}>
                  <img src={obj.image} alt="productImg" />
                  <div
                    className="cartDIV"
                    style={{ display: !isLoggedIn && "none" }}
                    onClick={(event) => ClickAddToCart(event, obj)}
                  >
                    <i className="fa-solid fa-cart-plus"></i>
                  </div>
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
