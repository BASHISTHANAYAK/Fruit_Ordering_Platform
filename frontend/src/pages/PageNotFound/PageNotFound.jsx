import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const [count, setCount] = useState(4);
  const Navigate = useNavigate();
  useEffect(() => {
    let setIntervalId = setInterval(() => {
      setCount((count) => count - 1);
      console.log("setInterval is runningCOUNT-");
    }, 1000);

    let setTimeoutId = setTimeout(() => {
      console.log("setTimeout is running-");
      clearInterval(setIntervalId);
      Navigate("/");
    }, 4000);

    return () => {
      clearTimeout(setIntervalId);
      clearTimeout(setTimeoutId);
    };
  }, [Navigate]);

  return <center>Page Not Found Returning to HomePage.. {count}sec</center>;
};

export default PageNotFound;
