import React from "react";

const MainContainer = ({ children, className = "" }) => {
  return (
    <div className={`mx-auto max-w-[1240px] px-4 ${className}`}>{children}</div>
  );
};

export default MainContainer;
