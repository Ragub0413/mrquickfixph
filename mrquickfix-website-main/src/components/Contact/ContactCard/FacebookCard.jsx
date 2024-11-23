import React, { useState } from "react";
import { RiFacebookBoxLine, RiFacebookBoxFill } from "react-icons/ri";

const FacebookCard = () => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className="relative m-4 h-[140px] w-[340px] rounded-3xl border border-primary-500 bg-white p-4 shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute -left-5 -top-5 rounded-full border border-primary-500 bg-white p-4 text-[25px]">
        {isHovered ? (
          <RiFacebookBoxFill className="text-blue-500" />
        ) : (
          <RiFacebookBoxLine className="text-primary-500" />
        )}
      </div>
      <div className="flex h-full items-center justify-center text-sm text-primary-500 md:text-base">
        <div className="py-2">
          <a
            target="_blank"
            href="https://facebook.com/MLIMrQuickFix"
            className="underline-offset-4 hover:underline"
          >
            facebook.com/MLIMrQuickFix
          </a>
        </div>
      </div>
    </div>
  );
};

export default FacebookCard;
