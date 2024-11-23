import React, { useEffect } from "react";
import Hero from "../components/Hero/Hero";
import About from "../components/about";
import Services from "../components/Services/Services";
import DividerContact from "../components/Contact/DividerContact";
import Project from "../components/Project/Project";
import Testimonials from "../components/Testimonials/Testimonials";
import Contact from "../components/Contact/Contact";

const HomePage = () => {
  useEffect(() => {
    document.title =
      "Mr. Quick Fix | Specializing in Home Repair and Improvements";
  });
  return (
    <>
      <Hero />
      <section className="relative bg-white">
        <About />
        <Services />
        <DividerContact />
        <Project />
        <Testimonials />
        <Contact />
      </section>
    </>
  );
};

export default HomePage;
