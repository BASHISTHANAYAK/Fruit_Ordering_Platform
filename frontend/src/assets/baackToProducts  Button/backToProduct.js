import React from "react";
import "./backToProduct.css";
import { useNavigate } from "react-router-dom";

const BackToProduct = () => {
  const Navigate = useNavigate();
  return (
    <>
      <button className="Back--to--products" onClick={() => Navigate("/")}>
        Back to products
      </button>
    </>
  );
};

export default BackToProduct;
