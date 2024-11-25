import React, { useState, useEffect } from "react";
import { Title } from "../props/Title";
import NoData from "../../assets/undraw_No_data_re_kwbl.png";
import {
  TbChevronLeft,
  TbChevronRight,
  TbEdit,
  TbTrash,
  TbX,
} from "react-icons/tb";
import { Button, Tooltip } from "@material-tailwind/react";
import Swal from "sweetalert2";
import { useProjectData } from "../../data/ProjectData";

const ProjectTable = () => {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [projects, setProjects] = useState([]);
  const rowsPerPage = 10;
  const [viewImageModal, setViewImageModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const {fetchProjectData} = useProjectData()
  // useEffect(() => {
  //   setLoading(true);
  //   const sampleProjects = [
  //     {
  //       projectName: "Project Sample",
  //       jobServices: "Fits-outs (Painting, Carpentry, Masonry)",
  //       thumbnail: "https://via.placeholder.com/500",
  //       images: [
  //         "https://via.placeholder.com/150/",
  //         "https://via.placeholder.com/200/",
  //         "https://via.placeholder.com/500/",
  //       ],
  //     },
  //   ];

  //   // Simulate loading (remove this if using a real API)
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 500);

  //   setProjects(sampleProjects);
  // }, []);
  useEffect(()=>{
    const initializeData = async () =>{
      setLoading(true);
      try{
        const data = await fetchProjectData();
        setProjects(data)
      }
      catch(error){
        console.error("Error fetching projects:", error);
      }
      finally {
        setLoading(false);
      }
    }
    initializeData();
  },[fetchProjectData])
  // Delete project function
 

  useEffect(() => {
    const totalPagesCalculated = Math.ceil(projects.length / rowsPerPage);
    setTotalPages(totalPagesCalculated);
  }, [projects, rowsPerPage]);

  const openImageModal = (images) => {
    setSelectedImages(images);
    setCurrentImageIndex(0);
    setViewImageModal(true);
  };
  const {removeProjectData} = useProjectData();
  const handleDeleteProject = (id) => {
    console.log(id)
    Swal.fire({
      title: "You want to delete this project?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Are you sure?",
          text: "This action cannot be undone!",
          showCancelButton: true,
          confirmButtonText: "OK",
          confirmButtonText: "Yes, delete it!",
          icon: "warning",
        }).then(async (finalResult) => {
          if(finalResult.isConfirmed){
            try{
              await removeProjectData(id);
              setProjects((prev) =>
              prev.filter((project)=> project._id !== id));
              Swal.fire(
                "Deleted!",
                "project has been deleted.",
                "success",
              );
            } catch (error) {
              console.error("Failed to delete admin:", error);
              Swal.fire("Error", "Failed to delete admin account.", "error");
            }
          }
        });
      }
    });
  };

  const closeImageModal = () => {
    setSelectedImages([]);
    setViewImageModal(false);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev < selectedImages.length - 1 ? prev + 1 : 0,
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev > 0 ? prev - 1 : selectedImages.length - 1,
    );
  };

  return (
    <>
      <div className="border border-secondary-200">
        <div className="border-b border-secondary-200 bg-secondary-100 px-4 py-2">
          <Title variant="secondarySemibold" size="lg">
            Project List
          </Title>
        </div>
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="table border-b bg-white text-base">
              <thead>
                <tr className="border-b-2 border-secondary-200 text-base text-primary-500">
                  <th className="w-10">No</th>
                  <th className="min-w-[200px]">Project Name</th>
                  <th className="min-w-[250px]">Services</th>
                  <th className="min-w-[150px]">Thumbnail</th>
                  <th className="w-full">Images</th>
                  <th className="min-w-[150px]">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="h-[400px] text-center">
                      <span className="loading loading-bars loading-lg"></span>
                    </td>
                  </tr>
                ) : projects.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center capitalize">
                      <img
                        src={NoData}
                        alt="No data"
                        className="mx-auto h-[250px]"
                      />
                      No project data
                    </td>
                  </tr>
                ) : (
                  projects
                    .slice(
                      (currentPage - 1) * rowsPerPage,
                      (currentPage - 1) * rowsPerPage + rowsPerPage,
                    )
                    .map((project, index) => (
                      <tr
                        key={index}
                        className="text-sm capitalize hover:bg-secondary-50"
                      >
                        <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                        <td>{project.projectName}</td>
                        <td>{project.projectServices}</td>
                        <td>
                          <img
                            src={project.projectThumbnail}
                            alt="Thumbnail"
                            className="h-[50px] w-[50px] cursor-pointer"
                            onClick={() => openImageModal([project.projectThumbnail])}
                          />
                        </td>
                        <td className="flex w-[200px] gap-2 overflow-auto">
                          {project.projectImagesUrl.map((image, idx) => (
                            <img
                              key={idx}
                              src={image}
                              alt="Project Image"
                              className="h-[50px] w-[50px] cursor-pointer"
                              onClick={() => openImageModal(project.projectImagesUrl)}
                            />
                          ))}
                        </td>
                        <td>
                          <Tooltip
                            content="Delete Project"
                            className="!bg-opacity-60"
                            placement="left"
                            animate={{
                              mount: { scale: 1, y: 0 },
                              unmount: { scale: 0, y: 25 },
                            }}
                          >
                            <Button
                              className="!bg-red-500 !p-1"
                              onClick={() => handleDeleteProject(project._id)}
                            >
                              <TbTrash className="text-[20px]" />
                            </Button>
                          </Tooltip>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          <div className="mt-4 flex justify-center gap-8">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="cursor-pointer"
            >
              <TbChevronLeft className="text-secondary-500 hover:text-secondary-800" />
            </button>
            <span className="text-sm text-secondary-500">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="cursor-pointer"
            >
              <TbChevronRight className="text-secondary-500 hover:text-secondary-800" />
            </button>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {viewImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="absolute inset-0" onClick={closeImageModal}></div>
          <div className="relative rounded-sm bg-white shadow-md">
            <button
              className="absolute right-2 top-2 rounded-full p-1 text-secondary-600 hover:bg-secondary-200 hover:text-secondary-800"
              onClick={closeImageModal}
            >
              <TbX className="text-[20px]" />
            </button>
            <div className="absolute bottom-2 right-2 rounded-full bg-black/70 px-2 text-xs text-white md:text-sm">
              {currentImageIndex + 1} | {selectedImages.length}
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handlePrevImage}
                className="p-2 hover:bg-secondary-200"
              >
                <TbChevronLeft className="text-[20px] text-secondary-700 hover:text-secondary-900 md:text-[30px]" />
              </button>
              <img
                src={selectedImages[currentImageIndex]}
                alt={`Selected ${currentImageIndex}`}
                className="h-[200px] md:h-[400px]"
              />
              <button
                onClick={handleNextImage}
                className="p-2 hover:bg-secondary-200"
              >
                <TbChevronRight className="text-[20px] text-secondary-700 hover:text-secondary-900 md:text-[30px]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectTable;