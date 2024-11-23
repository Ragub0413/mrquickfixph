import React, { useEffect, useState } from "react";
import ImageModal from "./ImageModal";

//AOS
import AOS from "aos";
import "aos/dist/aos.css";

const ProjectCard = ({ projectdata }) => {
  const { thumbnail, name, images, category, date } = projectdata;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => { 
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className="group relative m-2 h-[250px] w-[350px] overflow-hidden">
      <img
        src={thumbnail}
        alt={name}
        className="h-full w-full cursor-pointer"
        onClick={openModal}
        data-aos="zoom-out"
        data-aos-delay="100"
      />

      <div
        className="absolute inset-x-0 bottom-0 transform cursor-pointer bg-black/30 p-4 text-white backdrop-blur-sm transition-transform duration-500 md:translate-y-full md:group-hover:translate-y-0"
        onClick={openModal}
      >
        <h3 className="font-outfit font-semibold md:text-lg">{name}</h3>
        <p className="font-roboto text-xs md:text-sm">
          Category: {category.join(", ")}
        </p>
        <p className="font-roboto text-xs md:text-sm">Date: {date}</p>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        images={images}
      />
    </div>
  );
};

export default ProjectCard;
