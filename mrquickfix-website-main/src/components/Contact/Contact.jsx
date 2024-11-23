import React from "react";
import MainContainer from "../Container/MainContainer";
import Title from "../Title/Title";
import SubTitle from "../Title/SubTitle";
import PhoneNumberCard from "./ContactCard/PhoneNumberCard";
import EmailCard from "./ContactCard/EmailCard";
import FacebookCard from "./ContactCard/FacebookCard";
import LocationCard from "./ContactCard/LocationCard";

const Contact = () => {
  return (
    <div id="contact" className="py-24">
      <MainContainer>
        <header className="flex flex-col items-center justify-center pb-24 text-center">
          <Title>Contact us</Title>
          <SubTitle>Get In Touch With Us</SubTitle>
        </header>
        <section className="flex flex-wrap items-center justify-center">
          <PhoneNumberCard />
          <EmailCard />
          <FacebookCard />
          <LocationCard />
        </section>
      </MainContainer>
    </div>
  );
};

export default Contact;
