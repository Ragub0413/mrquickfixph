import React, { lazy, Suspense } from "react";
import MainContainer from "../Container/MainContainer";
import Title from "../Title/Title";
import SubTitle from "../Title/SubTitle";
import useTestimonials from "../hooks/useTestimonials";
import NoTestimonialAvailable from "../Loader/NoTestimonialAvailable";
import SpinLoaderNoBg from "../Loader/SpinLoaderNoBg";
import ErrorTestimonial from "../Loader/ErrorTestimonial";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import { Pagination, Autoplay, A11y } from "swiper/modules";

// Lazy load
const TestimonialCard = lazy(() => import("./TestimonialCard"));

const Testimonials = () => {
  const { data, error, loading } = useTestimonials();

  return (
    <div id="testimonial" className="bg-secondary-100 py-24">
      <MainContainer>
        <header className="flex flex-col items-center justify-center text-center">
          <Title>What our clients say</Title>
          <SubTitle>Hear Directly from Those We've Served</SubTitle>
        </header>
        <section className="flex justify-center">
          <Suspense
            fallback={
              <div className="flex justify-center">
                <SpinLoaderNoBg />
              </div>
            }
          >
            {error ? (
              <ErrorTestimonial message={error} />
            ) : data.length > 0 ? (
              <Swiper
                modules={[Pagination, Autoplay, A11y]}
                spaceBetween={50}
                autoplay={{ delay: 5000 }}
                breakpoints={{
                  640: {
                    slidesPerView: 1,
                  },
                  1024: {
                    slidesPerView: 2,
                  },
                }}
                className="mx-auto w-full py-6"
              >
                {data.map((testimonial) => (
                  <SwiperSlide key={testimonial.id}>
                    <TestimonialCard
                      testimonialdata={testimonial}
                      loading={loading}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <NoTestimonialAvailable />
            )}
          </Suspense>
        </section>
      </MainContainer>
    </div>
  );
};

export default Testimonials;
