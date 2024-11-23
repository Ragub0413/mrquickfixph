import React from "react";
import MainContainer from "../Container/MainContainer";
import Title from "../Title/Title";
import SubTitle from "../Title/SubTitle";
import Button from "../button";
import { PiArrowRightLight } from "react-icons/pi";
import { NavLink } from "react-router-dom";
import useProjects from "../hooks/useProjects";
import ProjectCardList from "./ProjectCardList";
import ErrorProject from "../Loader/ErrorProject";
import SpinLoader from "../Loader/SpinLoader";

const Project = () => {
  const { data, error, loading } = useProjects({ limit: 6 });

  return (
    <div id="project" className="py-24">
      <MainContainer>
        <header className="flex flex-col items-center justify-center text-center">
          <Title>Our Recent Projects</Title>
          <SubTitle>Explore Our Latest Work and Achievements</SubTitle>
        </header>

        {/* Handling loading and error states */}
        {loading ? (
          <div className="flex justify-center py-10">
            <SpinLoader />
          </div>
        ) : error ? (
          <ErrorProject message={error} />
        ) : (
          <ProjectCardList data={data} loading={loading} />
        )}

        <div className="mx-auto flex w-full justify-center py-10">
          <NavLink
            to="/Project"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <Button variant="flex">
              View more projects <PiArrowRightLight className="ml-2 text-xl" />
            </Button>
          </NavLink>
        </div>
      </MainContainer>
    </div>
  );
};

export default Project;
