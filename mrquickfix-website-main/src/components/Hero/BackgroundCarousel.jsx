import React, { useState, useEffect, useRef } from "react";
import useBackgrounds from "../hooks/useBGCarousel";
import SpinLoaderNoBg from "../Loader/SpinLoaderNoBg";

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { backgrounds, error } = useBackgrounds();
  const intervalRef = useRef(null);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === backgrounds.length - 1 ? 0 : prevIndex + 1,
    );
    resetAutoSlide();
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? backgrounds.length - 1 : prevIndex - 1,
    );
    resetAutoSlide();
  };

  const resetAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(nextSlide, 5000);
  };

  useEffect(() => {
    intervalRef.current = setInterval(nextSlide, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [backgrounds]);

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-red-100">
        <p className="text-red-600">Error loading backgrounds: {error}</p>
      </div>
    );
  }

  if (backgrounds.length === 0) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <SpinLoaderNoBg />
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden">
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{ backgroundImage: `url(${backgrounds[currentIndex]})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      <button
        onClick={prevSlide}
        className="fixed left-5 top-1/2 hidden -translate-y-1/2 transform rounded bg-secondary-900/50 p-2 px-4 py-5 text-xl text-white hover:bg-secondary-900 lg:block"
      >
        ❮
      </button>
      <button
        onClick={nextSlide}
        className="fixed right-5 top-1/2 hidden -translate-y-1/2 transform rounded bg-gray-800/50 p-2 px-4 py-5 text-xl text-white hover:bg-secondary-900 lg:block"
      >
        ❯
      </button>
    </div>
  );
};

export default Carousel;
