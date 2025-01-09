import React from "react";
import spinner from "../assets/spinners/Loading.svg";

const LoadingSpinner = ({ size = 50 }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", 
        width: "100vw", 
        position: "fixed",
        top: 0, 
        left: 0,
      }}
    >
      <img
        src={spinner}
        alt="Loading..."
        style={{ width: size, height: size }}
      />
    </div>
  );
};

export default LoadingSpinner;
