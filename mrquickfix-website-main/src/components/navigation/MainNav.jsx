import React from "react";
import MainContainer from "../Container/MainContainer";
import MainLogo from "../../assets/Mr.QuickFixLogo.png";
import MobileNav from "./MobileNav";
import useScrollToPage from "../hooks/useScrollToPage";

const MainNav = () => {
  const scrollToPage = useScrollToPage();

  return (
    <nav className="sticky top-1 z-10 bg-white shadow-sm">
      <MainContainer className="flex flex-col lg:flex-row lg:items-center">
        <header className="py-4 lg:py-0">
          <img
            src={MainLogo}
            alt="Mr. QuickFix Logo"
            className="flex w-[180px] cursor-pointer lg:w-[250px]"
            onClick={() => scrollToPage("home")}
          />
        </header>
        <ul className="hidden w-full flex-wrap justify-center font-roboto text-lg text-secondary-600 md:flex lg:justify-end">
          <li
            onClick={() => scrollToPage("home")}
            className="cursor-pointer px-4 py-6 hover:text-secondary-950"
          >
            Home
          </li>
          <li
            onClick={() => scrollToPage("about")}
            className="cursor-pointer px-4 py-6 hover:text-secondary-950"
          >
            About Us
          </li>
          <li
            onClick={() => scrollToPage("service")}
            className="cursor-pointer px-4 py-6 hover:text-secondary-950"
          >
            Services
          </li>
          <li
            onClick={() => scrollToPage("project")}
            className="cursor-pointer px-4 py-6 hover:text-secondary-950"
          >
            Projects
          </li>
          <li
            onClick={() => scrollToPage("testimonial")}
            className="cursor-pointer px-4 py-6 hover:text-secondary-950"
          >
            Testimonials
          </li>
          <li
            onClick={() => scrollToPage("contact")}
            className="cursor-pointer px-4 py-6 hover:text-secondary-950"
          >
            Contact Us
          </li>
        </ul>
        <div className="absolute right-1 top-2 md:hidden">
          <MobileNav />
        </div>
      </MainContainer>
    </nav>
  );
};

export default MainNav;
