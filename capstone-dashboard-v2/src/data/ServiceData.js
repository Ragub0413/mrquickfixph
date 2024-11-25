import axios from "axios";
import { create } from "zustand";

export const useServicesData = create((set) => ({
    projects: [] || '',
    setProjects: (projects) => set({ projects }),

    // Add job order with file quotation 
    AddProject: async (newJob) => {
        // const userID = localStorage.getItem("userID");
        // if (!userID) {
        //     console.error("User ID not found in localStorage. Please ensure the user is logged in.");
        //     return { success: false, message: "User is not authenticated" };
        // }
        for (let [name, value] of newJob) {
            if (name === "serviceDescription" ||
                name === "typeofJob") {
                if (value === "" || value === null) {
                
                    return {
                        success: false,
                        message: "Please fill in all required fields"
                    };
                }
                for(let value of newJob.values()){
                    console.log(value)
                }
                try {
                    const res = await axios.post("/api/services/save", newJob, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    });
                    set((state) => ({ projects: [...state.projects, res.data.data] }));
                    return { success: true, message: "Project created successfully" };
                }

                catch (error) {
                    console.error("Error saving job order:", error.response?.data?.message || error.message);
                    return { success: false, message: error.response?.data?.message || "An error occurred" };
                }
            }
        }
    },
    fetchServiceData: async () => {
        try {
            const res = await axios.get("/api/services/");
            const fetchedProjects = res.data.data || [];
            set({ projects: fetchedProjects });
            return fetchedProjects;
        } catch (error) {
            console.error("Failed to fetch projects:", error);
          throw new Error(
            error.response?.data?.message || "An error occurred while fetching services."
          );
        }
    },
    removeServiceData: async(id)=>{
        try{
             await axios.delete(`/api/services/removeservice/${id}`);
             set((state)=>({
                projects: state.projects.filter((project) => project._id !== id),
                
             }))
        //     set((state)=>state.projects.filter((project) => project._id !== id),
        // );
        }
        catch(error){
            set({
                error: error.response?.data?.message || error.message,
                // loading: false,
              });
              throw new Error(
            error.response?.data?.message || "An error occurred while deleting projects.")
        }
    },
    updateTextService: async (serviceId, updatedData) => {
        try {
            const res = await axios.patch(`/api/services/update-text/${serviceId}`, updatedData);
            set((state) => ({
                projects: state.projects.map((service) =>
                    service.id === serviceId ? res.data.data : service
                ),
            }));
            return { success: true, message: "Service updated successfully" };
        } catch (error) {
            console.error("Error updating service text:", error.response?.data?.message || error.message);
            return { success: false, message: "Failed to update service" };
        }
    },
    updateImageService: async (serviceId, imageFile) => {
        const formData = new FormData();
        formData.append("serviceImage", imageFile);
 
        try {
            const res = await axios.patch(`/api/services/update-image/${serviceId}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            set((state) => ({
                projects: state.projects.map((service) =>
                    service.id === serviceId ? res.data.data : service
                ),
            }));
            return { success: true, message: "Service image updated successfully" };
        } catch (error) {
            console.error("Error updating service image:", error.response?.data?.message || error.message);
            return { success: false, message: "Failed to update service image" };
        }
    },
}));