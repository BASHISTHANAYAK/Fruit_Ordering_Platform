import React, { useState } from "react";
import createProductCss from "./createProduct.module.css";
import { toast, ToastContainer } from "react-toastify";
import VegefoodsLogo from "../../components/Vegefoods_Logo/VegefoodsLogo";
import { submitForm } from "./productFunction.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreateProduct = () => {
  const { _id } = useSelector((state) => state);
  const navigate = useNavigate();
  const [productDetails, setproductDetails] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    category: "",
  });

  const handleEnterDetails = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setproductDetails((pre) => {
      return { ...pre, [name]: value };
    });
  };

  const handleSubmitForm = async (event) => {
    event.preventDefault();
    try {
      const result = await submitForm(productDetails, _id);
      console.log("result from function to ui:- ", result);
      if (result.status === 201) {
        console.log("result in if block:- ", result);
        toast.success("Admin has been created", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        // sessionStorage.setItem(
        //   "jwttoken",
        //   JSON.stringify(result.data.jwttoken)
        // );
        setTimeout(() => {
          navigate("/adminDashboard");
        }, 2000);
      } else {
        console.log("else error->", result.data.message);
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
      console.log("catch error->", error);
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

      <center>
        <VegefoodsLogo />
      </center>
      <center>
        <h3>ADMIN</h3>
      </center>

      <h2 className="signup--welcome--mobile">welcome</h2>
      <form className="singup--form" onSubmit={handleSubmitForm}>
        <div className="singup--container">
          <h3 className="Create--Account">Create Product</h3>

          <label>Product name </label>
          <input
            type="text"
            name="name"
            required
            onChange={handleEnterDetails}
            value={productDetails.name}
          />

          <label>price </label>
          <input
            type="number"
            name="price"
            required
            onChange={handleEnterDetails}
            value={productDetails.price}
          />
          <label>description </label>
          <input
            type="text"
            name="description"
            required
            onChange={handleEnterDetails}
            value={productDetails.description}
          />
          <label>Image Link </label>
          <input
            type="text"
            name="image"
            required
            onChange={handleEnterDetails}
            value={productDetails.image}
          />
          <label>category </label>
          <select
            name="category"
            onChange={handleEnterDetails}
            value={productDetails.category}
          >
            <option value="">---Select---</option>
            <option value="Vegetable">Vegetable</option>
            <option value="Fruit">Fruit</option>
          </select>

          <button type="submit" className="signup--button">
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
