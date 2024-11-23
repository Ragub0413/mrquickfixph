import React from "react";

const Title = ({ children, className = "" }) => {
  return (
    <h1
      className={`mt-5 border-l-8 border-primary-500 pl-4 text-left font-outfit text-3xl font-semibold uppercase text-secondary-950 md:mt-0 md:text-4xl ${className}`}
    >
      {children}
    </h1>
  );
};

export default Title;
