import React, { useState } from "react";
import MainContainer from "../Container/MainContainer";
import Title from "../Title/Title";
import SubTitle from "../Title/SubTitle";
import useProjects from "../hooks/useProjects";
import ProjectCardList from "./ProjectCardList";
import ErrorProject from "../Loader/ErrorProject";
import SpinLoader from "../Loader/SpinLoader";

const AllProject = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Latest");
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 15;

  const { data, totalProjects, error, loading } = useProjects({
    selectedCategory,
    projectsPerPage,
    currentPage,
  });

  const categories = [
    "Latest",
    "Fits-out",
    "Electrical Works",
    "Kitchen and Bath Renovation",
    "Aircon Services",
    "Door and Window Repairs",
    "Outdoor and Landscaping",
    "Household Cleaning Services",
  ];

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.ceil(totalProjects / projectsPerPage);

  const getPaginationGroup = () => {
    let startPage, endPage;
    if (totalPages <= 3) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage === 1) {
        startPage = 1;
        endPage = 3;
      } else if (currentPage === totalPages) {
        startPage = totalPages - 2;
        endPage = totalPages;
      } else {
        startPage = currentPage - 1;
        endPage = currentPage + 1;
      }
    }
    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i,
    );
  };

  return (
    <div>
      <MainContainer>
        <header className="flex flex-col items-center justify-center pb-12 pt-24 text-center">
          <Title>Recent Projects</Title>
          <SubTitle>A showcase of our excellence in every project.</SubTitle>
        </header>

        <div className="relative inline-block pb-8 text-left">
          <button
            type="button"
            onClick={toggleDropdown}
            className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 font-roboto text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
          >
            Filter: {selectedCategory}
            <svg
              className="-mr-1 ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 10 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.98l3.71-3.75a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute left-0 z-[5] mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 ${
                      selectedCategory === category ? "bg-gray-100" : ""
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

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

        {/* Pagination */}
        <div className="mb-24 mt-14 flex justify-center border-b border-t py-2 md:text-sm">
          {currentPage > 1 && (
            <>
              <button
                className="mx-[3px] px-[5px] md:mx-1 md:px-3 md:py-1"
                onClick={() => handleClick(1)}
              >
                First
              </button>
              <button
                className="mx-[3px] px-[5px] md:mx-1 md:px-3 md:py-1"
                onClick={() => handleClick(currentPage - 1)}
              >
                Prev
              </button>
            </>
          )}

          {getPaginationGroup().map((pageNumber) => (
            <button
              key={pageNumber}
              className={`mx-[3px] rounded px-[5px] md:mx-1 md:px-3 md:py-1 ${
                currentPage === pageNumber ? "bg-secondary-200" : ""
              }`}
              onClick={() => handleClick(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}

          {currentPage < totalPages && (
            <>
              <button
                className="mx-[3px] px-[5px] md:mx-1 md:px-3 md:py-1"
                onClick={() => handleClick(currentPage + 1)}
              >
                Next
              </button>
              <button
                className="mx-[3px] px-[5px] md:mx-1 md:px-3 md:py-1"
                onClick={() => handleClick(totalPages)}
              >
                Last
              </button>
            </>
          )}
        </div>
      </MainContainer>
    </div>
  );
};

export default AllProject;