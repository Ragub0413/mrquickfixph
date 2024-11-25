import axios from "axios";
import { create } from "zustand";
export const useProjectData = create((set) => ({
    projects: [] || '',
    setProjects: (projects) => set({ projects }),

    // Add job order with file quotation 
    UploadProject: async (newJob) => {
        // const userID = localStorage.getItem("userID");
        // if (!userID) {
        //     console.error("User ID not found in localStorage. Please ensure the user is logged in.");
        //     return { success: false, message: "User is not authenticated" };
        // }
        // for (let [name, value] of newJob) {
            // if (name === "serviceDescription" ||
            //     name === "typeofJob") {
            //     if (value === "" || value === null) {
                
            //         return {
            //             success: false,
            //             message: "Please fill in all required fields"
            //         };
            //     }
            //     for(let value of newJob.values()){
            //         console.log(value)
            //     }
                try {
                    const res = await axios.post("/api/projects/save", newJob, {
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
            //}
        //}
    },
    fetchProjectData: async () => {
        try {
            const res = await axios.get("/api/projects/");
            const fetchedProjects = res.data.data || [];
            set({ projects: fetchedProjects });
            return fetchedProjects;
        } catch (error) {
            console.error("Failed to fetch projects:", error);
          throw new Error(
            error.response?.data?.message || "An error occurred while fetching projects."
          );
        }
    },
    removeProjectData: async(id)=>{
        try{
             await axios.delete(`/api/projects/remove/${id}`);
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
    }
}));