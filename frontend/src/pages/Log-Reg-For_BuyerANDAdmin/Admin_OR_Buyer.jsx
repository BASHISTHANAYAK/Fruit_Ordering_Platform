import React from "react";
import adminORbuyerCSS from "./adminORbuyer.module.css";
import { useNavigate } from "react-router-dom";
import VegefoodsLogo from "../../components/Vegefoods_Logo/VegefoodsLogo";

const AdminORBuyer = () => {
  const navigate = useNavigate();

  return (
    <section className={adminORbuyerCSS.container}>
      <VegefoodsLogo />
      <div>
        <center>Select your account type.</center>
        <button onClick={() => navigate("/adminLogin")}>ADMIN</button>
        <button onClick={() => navigate("/buyerLogin")}>USER</button>
      </div>
    </section>
  );
};

export default AdminORBuyer;
