import React from "react";
import MainContainer from "./Container/MainContainer";
import Title from "./Title/Title";
import { FaHouseCrack, FaHammer, FaHouseCircleCheck } from "react-icons/fa6";

const About = () => {
  return (
    <section id="about" className="pt-24">
      <MainContainer>
        <header className="flex flex-col items-center justify-center text-center">
          <Title>About Mr. Quick Fix</Title>
          <div className="flex flex-col sm:flex-row md:pt-10">
            <div className="my-3 h-auto w-full px-2 py-4">
              <FaHouseCrack className="mx-auto mb-4 rounded-2xl border border-none bg-primary-100 p-3 text-5xl text-primary-500 sm:text-6xl" />
              <h3 className="pt-3 font-roboto font-semibold text-secondary-700 md:mx-0 md:my-0 md:py-2 md:text-lg">
                Specializing in Home Repair and Improvements.
              </h3>
            </div>
            <div className="h-auto w-full px-2 py-4 xs:my-3">
              <FaHammer className="mx-auto mb-4 rounded-2xl border border-none bg-primary-100 p-3 text-5xl text-primary-500 sm:text-6xl" />
              <h3 className="pt-3 font-roboto font-semibold text-secondary-700 md:mx-0 md:my-0 md:py-2 md:text-lg">
                Committed to Excellence and Quality Craftsmanship in Every
                Project.
              </h3>
            </div>
            <div className="h-auto w-full px-2 py-4 xs:my-3">
              <FaHouseCircleCheck className="mx-auto mb-4 rounded-2xl border border-none bg-primary-100 p-3 text-5xl text-primary-500 sm:text-6xl" />
              <h3 className="pt-3 font-roboto font-semibold text-secondary-700 md:mx-0 md:my-0 md:py-2 md:text-lg">
                Your Trusted Partner for All Home Maintenance and Renovation
                Needs.
              </h3>
            </div>
          </div>
        </header>
        <div className="mx-auto mb-12 mt-6 h-1 max-w-[300px] bg-secondary-200"></div>
        <section className="text-center font-roboto text-sm font-light text-secondary-600 md:text-lg">
          <p className="my-4">
            At Mr. Quick Fix, we understand the importance of a well-maintained
            home. Our team of skilled professionals is dedicated to providing
            fast, efficient, and reliable repair services to ensure your home is
            safe, comfortable, and looking its best.
          </p>
          <p className="my-4">
            With years of experience in the industry, we pride ourselves on our
            ability to tackle any repair or renovation project, big or small.
            Whether it's a leaky faucet, a complete kitchen makeover, or regular
            maintenance tasks, we have the expertise to get the job done right.
          </p>
          <p className="my-4">
            We believe in transparency and communication, ensuring that our
            clients are informed and involved every step of the way. Our
            commitment to customer satisfaction drives us to go above and beyond
            to meet your needs and exceed your expectations.
          </p>
        </section>
      </MainContainer>
    </section>
  );
};

export default About;
