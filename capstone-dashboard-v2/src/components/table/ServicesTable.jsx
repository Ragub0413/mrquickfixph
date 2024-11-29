import React, { useState,useCallback, useEffect } from "react";
import { Title } from "../props/Title";
import NoData from "../../assets/undraw_No_data_re_kwbl.png";
import {
  TbChevronLeft,
  TbChevronRight,
  TbEdit,
  TbPlus,
  TbTrash,
  TbX,
} from "react-icons/tb";
import {
  Button,
  Input,
  Option,
  Select,
  Textarea,
  Tooltip,
} from "@material-tailwind/react";
import Swal from "sweetalert2";
import { useServicesData } from "../../data/ServiceData";

const ServicesTable = () => {
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [viewImageModal, setViewImageModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [editService, setEditService] = useState(null);
  const [imageService, setImageService] = useState(null);
  const [serviceName, setServiceName] = useState("");
  const [jobType, setJobType] = useState("");
  const [description, setDescription] = useState("");
  const [updateSelectedService,setUpdateSelectedService] = useState({})
  const [newUp,setUp] = useState(null)
 const {fetchServiceData} = useServicesData()
  // useEffect(() => {
  //   setLoading(true);

  //   // const sampleServices = [
  //   //   {
  //   //     serviceName: "Fits-outs (Painting, Carpentry, Masonry)",
  //   //     jobType: "Repairs",
  //   //     image: "https://via.placeholder.com/500",
  //   //     description:
  //   //       "We have been offering professional services such as painting, carpentry and masonry. Our team of experts will handle every aspect of your fits-out project, from start to finish.",
  //   //   },
  //   //];

  //   // Simulate loading (remove this if using a real API)
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 500);

  //   setServices(sampleServices);
  // }, []);
  const throttledFetchProjects = useCallback(throttle(fetchServiceData, 60000), [
    fetchServiceData,
  ]);
    useEffect(()=>{
     const initializeData = async ()=>{
      setLoading(true)
      try{
       const data =  await fetchServiceData();
        setServices(data);

      }
      catch(error){
        console.error("Error fetching projects:", error);
      }
      finally {
        setLoading(false);
      }
     }
     initializeData();
    //  const intervalId = setInterval(throttledFetchProjects, 10000);
    //  return () => clearInterval(intervalId);
    },[fetchServiceData]);

    function throttle(func, limit) {
      let lastFunc;
      let lastRan;
  
      return function (...args) {
        const context = this;
        if (!lastRan) {
          func.apply(context, args);
          lastRan = Date.now();
        } else {
          clearTimeout(lastFunc);
          lastFunc = setTimeout(
            () => {
              if (Date.now() - lastRan >= limit) {
                func.apply(context, args);
                lastRan = Date.now();
              }
            },
            limit - (Date.now() - lastRan),
          );
        }
      };
    }
  useEffect(() => {
    setTotalPages(Math.ceil(services.length / rowsPerPage));
  }, [services, rowsPerPage]);

  const paginatedServices = services.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const openImageModal = (image) => {
    setSelectedImages([image]);
    setCurrentImageIndex(0);
    setViewImageModal(true);
  };

  const closeImageModal = () => {
    setSelectedImages([]);
    setViewImageModal(false);
  };

  const {removeServiceData,updateTextService,updateImageService} = useServicesData();

  const handleDeleteService = (id) => {
    Swal.fire({
      title: "You want to delete this service?",
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
              await removeServiceData(id);
              setServices((prev) =>
              prev.filter((service)=> service._id !== id));
              Swal.fire(
                "Deleted!",
                "Service has been deleted.",
                "success",
              );
            } catch (error) {
              console.error("Failed to delete service:", error);
              Swal.fire("Error", "Failed to delete service.", "error");
            }
          }
        });
      }
    });
  };
  const handleEditService = (service) => {
    setEditService(service);
    setServiceName(service.serviceName);
    setJobType(service.typeofJob);
    setDescription(service.serviceDescription);
    setImageService(service.serviceImageURL);
  };
 
  const handleCloseEditService = () => {
    setEditService(null);
    setServiceName("");
    setImageService(null);
  };
 
  const handleUpdateService = async (service) => {
    if (!serviceName || !jobType || !description || !imageService) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "All fields are required",
        confirmButtonText: "OK",
      });
      return;
    }
    const isValidURL =(url)=>{
      try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}
    const updatedData = {
      serviceName,
      typeofJob: jobType,
      serviceDescription: description,
      serviceImageURL: imageService,
    };
 
    Swal.fire({
      title: "Are you sure you want to update this service?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
 
          const textResponse = await updateTextService(
            editService._id,
            updatedData,
          );
          // const imageFile = new FormData();
          // imageFile.append("serviceImage",imageService)

          // if (imageService instanceof File) {
          //   const updateData ={
          //     ...updateSelectedService,
          //     serviceImage: newUp
          //   }
          //   console.log(updateData)
          //   await updateImageService(editService._id, updateData);
          // }
           if(!isValidURL(newUp)){
            const imageFile = new FormData();
            imageFile.append("serviceImage",newUp);
            imageFile.append("serviceName",serviceName)
            imageFile.append("typeofJob",jobType)
            imageFile.append("serviceDescription",description)
            for(let value of imageFile.values()){
              console.log(value)
            }
             await updateImageService(editService._id, imageFile);
           }

 
          setServices((prevState) =>
            prevState.map((service) =>
              service._id === editService._id
                ? { ...service, ...updatedData }
                : service,
            ),
          );
 
          setServices((prevState) =>
            prevState.map((service) =>
              service._id === editService._id
                ? { ...service, serviceImageURL: imageService }
                : service,
            ),
          );  
 
          setEditService(null);
          setServiceName("");
          setImageService(null);
 
          Swal.fire({
            title: "Updated!",
            text: textResponse.message,
            confirmButtonText: "OK",
            icon: "success",
          });
        } catch (error) {
          console.error("Update failed:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to update service",
            confirmButtonText: "OK",
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };
  return (
    <>
      <div className="border border-secondary-200">
        <div className="border-b border-secondary-200 bg-secondary-100 px-4 py-2">
          <Title variant="secondarySemibold" size="lg">
            Service List
          </Title>
        </div>
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="table bg-white text-base">
              <thead>
                <tr className="border-b-2 border-secondary-200 text-base text-primary-500">
                  <th className="w-10">No</th>
                  <th className="min-w-[300px]">Service Name</th>
                  <th className="min-w-[120px]">Image</th>
                  <th className="w-full">Description</th>
                  <th className="min-w-[150px]">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="h-[400px] text-center">
                      <span className="loading loading-bars loading-lg"></span>
                    </td>
                  </tr>
                ) : services.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center capitalize">
                      <img
                        src={NoData}
                        alt="No data"
                        className="mx-auto h-[250px]"
                      />
                      No service data
                    </td>
                  </tr>
                ) : (
                  paginatedServices.map((service, index) => (
                    <tr
                      key={index}
                      className="text-sm capitalize hover:bg-secondary-50"
                    >
                      <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                      <td>{service.serviceName}</td>
                      <td>
                        <img
                          src={service.serviceImageURL}
                          alt="Service"
                          className="h-[50px] w-[50px] cursor-pointer"
                          onClick={() => openImageModal(service.serviceImageURL)}
                        />
                      </td>
                      <td>
                        <p className="line-clamp-6">{service.serviceDescription}</p>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <Tooltip
                            content="Edit Service"
                            className="!bg-opacity-60"
                            placement="left"
                            animate={{
                              mount: { scale: 1, y: 0 },
                              unmount: { scale: 0, y: 25 },
                            }}
                          >
                            <Button
                              className="!bg-blue-500 !p-1"
                              onClick={() =>{
                                setUpdateSelectedService(service)
                                 handleEditService(service)}}
                            >
                              <TbEdit className="text-[20px]" />
                            </Button>
                          </Tooltip>
                          <Tooltip
                            content="Delete Service"
                            className="!bg-opacity-60"
                            placement="left"
                            animate={{
                              mount: { scale: 1, y: 0 },
                              unmount: { scale: 0, y: 25 },
                            }}
                          >
                            <Button
                              className="!bg-red-500 !p-1"
                              onClick={()=>handleDeleteService(service._id)}
                            >
                              <TbTrash className="text-[20px]" />
                            </Button>
                          </Tooltip>
                        </div>
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

      {/* Edit Service Modal */}
      {editService && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center rounded-md bg-black/20">
          <div className="animate-fade-down animate-duration-[400ms] animate-ease-out">
            <div className="flex items-center justify-between rounded-t-md border border-b-0 border-secondary-300 bg-secondary-100 px-4 py-2">
              <Title>Edit Service</Title>
              <div
                className="flex cursor-pointer items-center rounded-full p-2 text-secondary-900 hover:bg-secondary-200 active:bg-secondary-200/50 active:text-secondary-500"
                onClick={handleCloseEditService}
              >
                <button>
                  <TbX />
                </button>
              </div>
            </div>
            <div className="flex min-w-[300px] flex-col gap-4 rounded-b-lg border border-secondary-300 bg-white p-4 md:min-w-[500px]">
              <Input
                label="Service Name"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
              />
              {/* Choose Job Type to add the service */}
              <Select
                label="Choose Job Type"
                value={jobType}
                onChange={setJobType}
              >
               <Option value="Repairs">Repairs</Option>
                <Option value="Renovation">Renovation</Option>
                <Option value="Preventive Maintenance Service (PMS)">
                  Preventive Maintenance Service (PMS)
                </Option>
                <Option value="Cleaning Services">Cleaning Services</Option>
              </Select>
              <label className="text-sm">Upload Image:</label>
              <div className="flex items-center gap-4">
                {imageService ? (
                  <div className="relative h-24 w-24 overflow-hidden rounded-lg border">
                    <img
                      src={imageService}
                      alt="Service"
                      className="h-full w-full object-cover"
                    />
                    <button
                      className="absolute right-0 top-0 m-1 rounded-full bg-black/20 p-1 text-red-500 hover:bg-red-500 hover:text-white"
                      onClick={() => setImageService(null)}
                    >
                      <TbX />
                    </button>
                  </div>
                ) : (
                  <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed text-gray-500 hover:border-gray-800">
                    <TbPlus size={24} />
                    <span className="text-xs">Add Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setImageService(URL.createObjectURL(file));
                          setUp(file)
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <Textarea
                label="Service Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Button
                className="bg-secondary-950"
                onClick={handleUpdateService}
              >
                Update Service
              </Button>
            </div>
          </div>
        </div>
      )}

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
            <div className="flex items-center gap-4">
              <img
                src={selectedImages[currentImageIndex]}
                alt="Selected"
                className="h-[300px] rounded-sm md:h-[400px]"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ServicesTable;