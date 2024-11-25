import React, { Suspense, useEffect, useState } from "react";
import MainContainer from "../Container/MainContainer";
import Title from "../Title/Title";
import Subtitle from "../Title/SubTitle";
import SpinLoader from "../Loader/SpinLoader";
import NoServiceAvailable from "../Loader/NoServiceAvailable";
import ErrorProject from "../Loader/ErrorProject";
 
// Lazy load
const ServiceCard = React.lazy(() => import("./ServiceCard"));
 
const Services = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/services/");
        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
 
    fetchData();
  }, []);
 
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
            {loading ? (
              <div className="flex justify-center">
                <SpinLoader />
              </div>
            ) : error ? (
              <ErrorProject message={error} />
            ) : data.length > 0 ? (
              data.map((service) => (
                <ServiceCard key={service._id} service={service} />
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
 