import React, { useState, useRef, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import SpinLoaderNoBg from "../Loader/SpinLoaderNoBg";

const ImageModal = ({ isOpen, onRequestClose, images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const hideTimeout = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      switch (e.key) {
        case "ArrowRight":
          nextSlide();
          break;
        case "ArrowLeft":
          prevSlide();
          break;
        case "Escape":
          onRequestClose();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    setLoading(true);
    const img = new Image();
    img.src = images[currentIndex];
    img.onload = () => setLoading(false);
    img.onerror = () => setLoading(false);
  }, [currentIndex, images]);

  const nextSlide = () =>
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  const prevSlide = () =>
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );

  const handleSwipe = () => {
    if (touchStartX.current - touchEndX.current > 50) nextSlide();
    if (touchStartX.current - touchEndX.current < -50) prevSlide();
  };

  const handleTouchStart = (e) =>
    (touchStartX.current = e.targetTouches[0].clientX);
  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    handleSwipe();
  };

  const resetHideTimeout = () => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    setIsVisible(true);
    hideTimeout.current = setTimeout(() => setIsVisible(false), 2000);
  };

  useEffect(() => {
    const handleMouseMove = () => resetHideTimeout();
    const handleTouchStart = () => resetHideTimeout();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchstart", handleTouchStart);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleTouchStart);
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black bg-opacity-90"
        onClick={onRequestClose}
      >
        <button
          className={`absolute right-2 top-2 p-2 text-white transition-opacity ${isVisible ? "opacity-100" : "opacity-0"}`}
          onClick={onRequestClose}
        >
          <AiOutlineClose size={30} />
        </button>
      </div>
      <div
        className="relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseMove={resetHideTimeout}
      >
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
            <SpinLoaderNoBg />
          </div>
        ) : null}
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex}`}
          className={`relative max-h-screen max-w-full rounded-2xl ${loading ? "opacity-0" : "opacity-100"} transition-opacity`}
        />
      </div>
      <button
        onClick={prevSlide}
        className={`absolute left-3 top-1/2 -translate-y-1/2 transform rounded-full bg-black bg-opacity-50 px-4 py-2 text-white transition-opacity md:px-6 md:py-4 ${isVisible ? "opacity-100" : "opacity-0"}`}
      >
        ❮
      </button>
      <button
        onClick={nextSlide}
        className={`absolute right-3 top-1/2 -translate-y-1/2 transform rounded-full bg-black bg-opacity-50 px-4 py-2 text-white transition-opacity md:px-6 md:py-4 ${isVisible ? "opacity-100" : "opacity-0"}`}
      >
        ❯
      </button>
      <div
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 transform rounded bg-black bg-opacity-50 px-3 py-1 text-white transition-opacity ${isVisible ? "opacity-100" : "opacity-0"}`}
      >
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};

export default ImageModal;
