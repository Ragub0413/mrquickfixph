import React from "react";
import { BiSolidQuoteLeft } from "react-icons/bi";

const TestimonialCard = ({ testimonialdata }) => {
  const { image, name, date, feedback } = testimonialdata;

  return (
    <div className="relative">
      <BiSolidQuoteLeft className="absolute bottom-0 right-0 top-[-25%] m-4 scale-x-[-1] text-[100px] text-primary-500 md:top-[-30%] md:text-[130px]" />
      <BiSolidQuoteLeft className="absolute bottom-0 left-0 top-[75%] m-4 text-[100px] text-primary-500 md:top-[70%] md:text-[130px]" />
      <div className="my-24 min-h-[300px] cursor-default rounded-md bg-white/90 backdrop-blur-sm lg:max-w-[600px]">
        <div className="flex border-b">
          <img
            src={image}
            alt={name}
            className="m-4 max-w-[100px] border-4 border-primary-500"
          />
          <div className="py-4">
            <h1 className="font-outfit text-lg font-bold md:text-xl">{name}</h1>
            <h3 className="font-roboto text-xs font-light text-secondary-500 md:text-sm">
              {date}
            </h3>
          </div>
        </div>
        <div className="flex items-center justify-center p-4 text-center text-sm md:text-base">
          <p>{feedback}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
