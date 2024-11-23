import React from "react";
import MainLogo from "../../assets/Mr.QuickFixLogo.png";
import {
  FaPhone,
  FaFacebookF,
  FaEnvelope,
  FaLocationDot,
} from "react-icons/fa6";
import useScrollToPage from "../hooks/useScrollToPage";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const scrollToPage = useScrollToPage();

  return (
    <div className="relative bg-secondary-950 pt-24">
      <div className="mx-auto max-w-[1240px] px-4 pb-16">
        <nav className="grid gap-x-5 sm:grid-cols-2 md:gap-x-1 lg:grid-cols-3">
          <div className="md:px-4">
            <h1 className="pb-8 font-outfit uppercase text-white md:text-lg">
              About Us
            </h1>
            <img
              src={MainLogo}
              className="w-[200px] md:w-[230px]"
              alt="Company Logo"
            />
            <div>
              <p className="text-pretty py-8 font-roboto text-sm text-secondary-500 md:text-base">
                At Mr. Quick Fix, we understand the importance of a
                well-maintained home.
                <button
                  className="pl-1 font-medium text-secondary-500/50 duration-300 hover:text-secondary-400"
                  onClick={() => scrollToPage("about")}
                >
                  Read more.
                </button>
              </p>
            </div>
          </div>
          <div className="md:px-4">
            <h1 className="pb-8 font-outfit uppercase text-white md:text-lg">
              Navigation
            </h1>
            <ul className="grid grid-cols-2 font-roboto text-sm text-secondary-500 md:gap-y-4 md:text-base">
              <li
                onClick={() => scrollToPage("home")}
                className="cursor-pointer py-1 duration-300 hover:text-secondary-400"
              >
                Home
              </li>
              <li
                onClick={() => scrollToPage("about")}
                className="cursor-pointer py-1 duration-300 hover:text-secondary-400"
              >
                About us
              </li>
              <li
                onClick={() => scrollToPage("service")}
                className="cursor-pointer py-1 duration-300 hover:text-secondary-400"
              >
                Services
              </li>
              <li
                onClick={() => scrollToPage("project")}
                className="cursor-pointer py-1 duration-300 hover:text-secondary-400"
              >
                Projects
              </li>
              <li
                onClick={() => scrollToPage("testimonial")}
                className="cursor-pointer py-1 duration-300 hover:text-secondary-400"
              >
                Testimonials
              </li>
              <li
                onClick={() => scrollToPage("contact")}
                className="cursor-pointer py-1 duration-300 hover:text-secondary-400"
              >
                Contact us
              </li>
            </ul>
          </div>
          <div className="md:px-4">
            <h1 className="mt-8 pb-8 font-outfit uppercase text-white md:mt-0 md:text-lg">
              Contact Information
            </h1>
            <div className="flex items-center text-sm md:text-base">
              <FaPhone size={20} className="group mr-4 text-secondary-500" />
              <div className="flex flex-col text-secondary-500">
                <div className="py-2">
                  <a
                    href="tel:+63286328381"
                    className="underline-offset-4 duration-300 hover:text-secondary-400 hover:underline"
                  >
                    (02) 8632-8381
                  </a>
                </div>
                <div className="py-2">
                  <a
                    href="tel:+639988481846"
                    className="underline-offset-4 duration-300 hover:text-secondary-400 hover:underline"
                  >
                    0998-848-1846
                  </a>
                </div>
                <div className="py-2">
                  <a
                    href="tel:+639988443164"
                    className="underline-offset-4 duration-300 hover:text-secondary-400 hover:underline"
                  >
                    0998-844-3164
                  </a>
                </div>
              </div>
            </div>
            <div className="flex items-center py-2 font-roboto text-sm text-secondary-500 md:text-base">
              <FaEnvelope size={20} className="mr-4 text-secondary-500" />
              <a
                href="mailto:mrquickfix@miescor.ph"
                className="underline-offset-4 duration-300 hover:text-secondary-400 hover:underline"
              >
                mrquickfix@miescor.ph
              </a>
            </div>
            <div className="flex items-center py-2 font-roboto text-sm text-secondary-500 md:text-base">
              <FaFacebookF size={20} className="mr-4 text-secondary-500" />
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://facebook.com/MLIMrQuickFix"
                className="underline-offset-4 hover:text-secondary-400 hover:underline"
              >
                facebook.com/MLIMrQuickFix
              </a>
            </div>
            <div className="flex items-center text-pretty text-sm md:text-base">
              <FaLocationDot size={20} className="text-secondary-500" />
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.google.com/maps?ll=14.581424,121.06399&z=16&t=m&hl=en&gl=PH&mapclient=embed&cid=3075302866630795290"
                className="my-1 mt-2 pl-4 font-roboto text-secondary-500 duration-300 hover:text-secondary-400 hover:underline"
              >
                Meralco Industrial Engineering Services Corporation
                <br />
                5th Floor, Renaissance Tower 1000
                <br />
                Meralco Avenue, Ortigas Center Pasig City, Philippines 1600
              </a>
            </div>
          </div>
        </nav>
      </div>
      <div className="bg-secondary-900/50 py-4">
        <div className="mx-auto max-w-[1540px] px-4 text-center text-xs text-secondary-300 md:text-sm">
          Copyright &copy; {currentYear}. Meralco Industrial Engineering
          Services Corporation. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Footer;
