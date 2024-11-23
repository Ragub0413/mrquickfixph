import React from "react";
import clsx from "clsx";

const Button = ({ variant = "primary", size = "md", children, ...props }) => {
  const variantStyle = {
    primary:
      "bg-primary-500 select-none text-sm md:text-base text-white hover:bg-primary-600",
    outline:
      "bg-primary-500 select-none text-sm md:text-base text-white hover:bg-primary-600 border border-white",
    flex: "bg-primary-500 select-none text-sm md:text-base text-white hover:bg-primary-600 flex items-center justify-center",
  };

  const sizeStyle = {
    sm: "px-4 py-2 text-xs md:text-base",
    md: "px-4 py-3 md:px-6 md:py-4 text-xs md:text-base",
  };

  const baseStyle = "transition-all";

  return (
    <button
      className={clsx(variantStyle[variant], sizeStyle[size], baseStyle)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
