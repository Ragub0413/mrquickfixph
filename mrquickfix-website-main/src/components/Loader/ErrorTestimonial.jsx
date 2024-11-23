import React from "react";
import { CgUnavailable } from "react-icons/cg";

const ErrorTestimonial = ({ message }) => {
  return (
    <div className="flex h-[250px] w-full flex-col items-center justify-center">
      <CgUnavailable className="mb-5 h-16 w-16 text-primary-500" />
      <p>{message}</p>
    </div>
  );
};

export default ErrorTestimonial;
