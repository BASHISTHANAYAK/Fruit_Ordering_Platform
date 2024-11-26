import React from "react";
import searchicon from "../../assets/images/searchicon.png";
import "./searchnNav.css";
import { useNavigate } from "react-router-dom";

const SearchNav = (props) => {
  const Navigate = useNavigate();
  return (
    <>
      <div className="BlankBlueNav"></div>
      {/* search box and inputs */}
      <div className="search--div">
        <img src={searchicon} className="searchicon" alt="searchicon" />
        <form action="">
          <input
            type="search"
            name="search"
            placeholder="Search Product"
            onClick={() => Navigate("/")}
          />
        </form>
      </div>
    </>
  );
};

export default SearchNav;
