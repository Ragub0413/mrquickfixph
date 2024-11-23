import React, { useState } from "react";
import { BsEnvelope, BsFillEnvelopeFill } from "react-icons/bs";

const EmailCard = () => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className="relative m-4 h-[140px] w-[340px] rounded-3xl border border-primary-500 bg-white p-4 shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute -left-5 -top-5 rounded-full border border-primary-500 bg-white p-4 text-[25px]">
        {isHovered ? (
          <BsFillEnvelopeFill className="text-amber-500" />
        ) : (
          <BsEnvelope className="text-primary-500" />
        )}
      </div>
      <div className="flex h-full items-center justify-center text-sm text-primary-500 md:text-base">
        <div className="py-2">
          <a
            href="mailto:mrquickfix@miescor.ph"
            className="underline-offset-4 hover:underline"
          >
            mrquickfix@miescor.ph
          </a>
        </div>
      </div>
    </div>
  );
};

export default EmailCard;
