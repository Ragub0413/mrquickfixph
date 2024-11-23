import React, { useState } from "react";
import { BsTelephone, BsTelephoneFill } from "react-icons/bs";

const PhoneNumberCard = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative m-4 h-[140px] w-[340px] rounded-3xl border border-primary-500 bg-white p-4 shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute -left-5 -top-5 rounded-full border border-primary-500 bg-white p-4 text-[25px]">
        {isHovered ? (
          <BsTelephoneFill className="text-green-500" />
        ) : (
          <BsTelephone className="text-primary-500" />
        )}
      </div>
      <div className="flex flex-col text-sm md:text-base items-center justify-center text-primary-500">
        <div className="py-2">
          <a
            href="tel:+63286328381"
            className="underline-offset-4 hover:underline"
          >
            (02) 8632-8381
          </a>
        </div>
        <div className="py-2">
          <a
            href="tel:+639988481846"
            className="underline-offset-4 hover:underline"
          >
            0998-848-1846
          </a>
        </div>
        <div className="py-2">
          <a
            href="tel:+639988443164"
            className="underline-offset-4 hover:underline"
          >
            0998-844-3164
          </a>
        </div>
      </div>
    </div>
  );
};

export default PhoneNumberCard;
