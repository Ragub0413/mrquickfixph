import React from "react";
import { TbError404 } from "react-icons/tb";

const NotFound = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-secondary-100">
      <TbError404 className="text-[250px] text-secondary-900 md:text-[300px]" />
      <p className="text-xl md:text-3xl">Page Not Found</p>
      <p className="md:text-lg">The page you are looking for does not exist.</p>
      <div className="m-5">
        <a
          href="/"
          className="bg-primary-500 px-6 py-3 text-white hover:bg-primary-600"
        >
          Go Back
        </a>
      </div>
    </div>
  );
};

export default NotFound;
