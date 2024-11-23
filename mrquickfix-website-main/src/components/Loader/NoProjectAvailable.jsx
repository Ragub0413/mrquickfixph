import React from "react";
import { TbFaceIdError } from "react-icons/tb";

const NoProjectAvailable = () => {
  return (
    <div className="flex h-[250px] w-full items-center justify-center bg-secondary-100">
      <div className="flex flex-col items-center justify-center">
        <TbFaceIdError className="mb-4 h-16 w-16 text-primary-500" />
        <p>No projects available.</p>
      </div>
    </div>
  );
};

export default NoProjectAvailable;
