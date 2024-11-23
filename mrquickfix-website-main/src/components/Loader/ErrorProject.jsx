import React from "react";
import { CgUnavailable } from "react-icons/cg";
import MainContainer from "../Container/MainContainer";

const ErrorProject = ({ message }) => {
  return (
    <>
      <MainContainer>
        <div className="flex flex-wrap items-center justify-center">
          <div className="m-2 flex h-[250px] w-[350px] items-center justify-center bg-secondary-100">
            <div className="flex flex-col items-center justify-center">
              <CgUnavailable className="mb-5 h-16 w-16 text-primary-500" />
              <p>{message}</p>
            </div>
          </div>
          <div className="m-2 flex h-[250px] w-[350px] items-center justify-center bg-secondary-100">
            <div className="flex flex-col items-center justify-center">
              <CgUnavailable className="mb-5 h-16 w-16 text-primary-500" />
              <p>{message}</p>
            </div>
          </div>
          <div className="m-2 flex h-[250px] w-[350px] items-center justify-center bg-secondary-100">
            <div className="flex flex-col items-center justify-center">
              <CgUnavailable className="mb-5 h-16 w-16 text-primary-500" />
              <p>{message}</p>
            </div>
          </div>
          <div className="m-2 flex h-[250px] w-[350px] items-center justify-center bg-secondary-100">
            <div className="flex flex-col items-center justify-center">
              <CgUnavailable className="mb-5 h-16 w-16 text-primary-500" />
              <p>{message}</p>
            </div>
          </div>
          <div className="m-2 flex h-[250px] w-[350px] items-center justify-center bg-secondary-100">
            <div className="flex flex-col items-center justify-center">
              <CgUnavailable className="mb-5 h-16 w-16 text-primary-500" />
              <p>{message}</p>
            </div>
          </div>
          <div className="m-2 flex h-[250px] w-[350px] items-center justify-center bg-secondary-100">
            <div className="flex flex-col items-center justify-center">
              <CgUnavailable className="mb-5 h-16 w-16 text-primary-500" />
              <p>{message}</p>
            </div>
          </div>
        </div>
      </MainContainer>
    </>
  );
};

export default ErrorProject;
