import React, { useState } from "react";
import { BsPinMap, BsPinMapFill } from "react-icons/bs";

const LocationCard = () => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className="relative m-4 w-[800px] rounded-3xl border border-primary-500 bg-white p-4 text-sm shadow-md md:text-base"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute -left-5 -top-5 rounded-full border border-primary-500 bg-white p-4 text-[25px]">
        {isHovered ? (
          <BsPinMapFill className="text-red-500" />
        ) : (
          <BsPinMap className="text-primary-500" />
        )}
      </div>
      <div className="flex h-full items-center justify-center text-primary-500">
        <div className="py-10 text-center">
          <a
            target="_blank"
            href="https://www.google.com/maps?ll=14.581424,121.06399&z=16&t=m&hl=en&gl=PH&mapclient=embed&cid=3075302866630795290"
            className="hover:underline"
          >
            Meralco Industrial Engineering Services Corporation 5th Floor,
            Renaissance Tower 1000 Meralco Avenue, Ortigas Center Pasig City,
            Philippines 1605
          </a>
          <div className="my-8">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.3095543908985!2d121.0614150758966!3d14.581428777544206!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c813bb21467f%3A0x2aadaba9de44e01a!2sMeralco%20Industrial%20Engineering%20Services%20Corporation!5e0!3m2!1sen!2sph!4v1724694942406!5m2!1sen!2sph"
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;
