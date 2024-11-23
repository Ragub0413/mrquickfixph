import React from "react";
import TopNav from "../components/navigation/TopNav";
import MainNav from "../components/navigation/MainNav";
import TopLine from "../components/navigation/TopLine";
import Footer from "../components/Footer/Footer";
import { TbPhoneCheck } from "react-icons/tb";
import ContactModal from "../components/Contact/ContactCard/ContactModal";

export const MainLayout = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <TopLine />
      <TopNav />
      <MainNav />
      <div>
        <div className="fixed bottom-0 right-0 z-50 p-2 md:p-8">
          <div
            className="group cursor-pointer rounded-full bg-primary-500 p-2 shadow-lg active:bg-primary-700 md:p-4"
            onClick={openModal}
          >
            <TbPhoneCheck className="text-2xl text-white md:text-3xl" />
            <span className="absolute -left-16 top-5 hidden whitespace-nowrap rounded-full bg-secondary-950/90 px-4 py-2 text-xs uppercase text-white md:group-hover:block">
              Contact Us
            </span>
          </div>
        </div>
        <ContactModal isOpen={isModalOpen} onClose={closeModal} />
        {children}
      </div>
      <Footer />
    </>
  );
};

export default MainLayout;
