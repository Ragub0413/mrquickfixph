import React, { Suspense } from "react";
import MainContainer from "../Container/MainContainer";
import Title from "../Title/Title";
import Subtitle from "../Title/SubTitle";
import SpinLoader from "../Loader/SpinLoader";
import NoServiceAvailable from "../Loader/NoServiceAvailable";
import ErrorProject from "../Loader/ErrorProject";
import useServicesData from "../hooks/useServices";

// Lazy load
const ServiceCard = React.lazy(() => import("./ServiceCard"));

const Services = () => {
  const { data, error, loading } = useServicesData();

  return (
    <div id="service" className="py-24">
      <MainContainer>
        <header className="flex flex-col items-center">
          <Title>We Offer High-Quality Services</Title>
          <Subtitle>Services You Can Count On Fast and Reliable</Subtitle>
        </header>
        <section className="flex flex-wrap items-center justify-center">
          <Suspense
            fallback={
              <div className="flex justify-center">
                <SpinLoader />
              </div>
            }
          >
            {/* Check error and loading state inside Suspense */}
            {loading ? (
              <div className="flex justify-center">
                <SpinLoader />
              </div>
            ) : error ? (
              <ErrorProject message={error} />
            ) : data.length > 0 ? (
              data.map((service) => (
                <ServiceCard key={service.id} servicedata={service} />
              ))
            ) : (
              <NoServiceAvailable />
            )}
          </Suspense>
        </section>
      </MainContainer>
    </div>
  );
};

export default Services;
