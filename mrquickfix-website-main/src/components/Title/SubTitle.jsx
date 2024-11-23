import React from "react";

const SubTitle = ({ children, className = "" }) => {
  return (
    <div
      className={`mb-8 mt-2 font-roboto text-secondary-500 md:text-xl ${className}`}
    >
      {children}
    </div>
  );
};

export default SubTitle;
