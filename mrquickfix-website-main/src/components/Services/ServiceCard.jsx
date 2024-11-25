import React, { useEffect, useState } from "react";
import { FaAngleUp } from "react-icons/fa6";
 
// AOS
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
 
const ServiceCard = ({ service }) => {
  const { serviceImageURL, serviceName, serviceDescription } = service;
 
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
 
  const [isHovered, setIsHovered] = useState(false);
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
 
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
 
  return (
    <div
      className="group relative cursor-pointer p-2"
      onMouseLeave={() => {
        setIsDescriptionVisible(false);
        setIsHovered(false);
      }}
    >
      <div
        className="relative overflow-hidden"
        onClick={() => setIsDescriptionVisible(!isDescriptionVisible)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image */}
        <img
          src={serviceImageURL}
          alt={serviceName}
          className="h-[250px] w-[350px]"
          data-aos="zoom-out"
          data-aos-delay="100"
        />
 
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="text-center font-roboto text-xl font-medium text-white"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            {serviceName}
          </div>
        </div>
 
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-center bg-gradient-to-t from-black/60 to-transparent py-4 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
          <div className="px-5 text-center font-medium text-white">
            <FaAngleUp
              className={`mx-auto text-2xl transition-transform duration-300 ${
                isHovered ? "translate-y-0" : "translate-y-2"
              } ${isDescriptionVisible ? "rotate-180" : ""}`}
            />
          </div>
        </div>
 
        <div
          className={`absolute inset-0 border-2 border-primary-500 bg-secondary-950 p-4 text-white transition-transform duration-500 ease-in-out ${
            isDescriptionVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-full"
          }`}
        >
          <div className="flex h-full w-full items-center justify-center text-center font-roboto text-sm font-medium md:text-base">
            <p>{serviceDescription}</p>
          </div>
 
          <div className="absolute bottom-0 left-0 right-0 py-2 text-center text-xs font-light md:text-sm">
            <p>
              Want to see our projects?{" "}
              <Link to="/Project">
                <button className="pl-1 hover:underline" onClick={handleClick}>
                  View here
                </button>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default ServiceCard;