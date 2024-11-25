import axios from "axios";
import { create } from "zustand";

export const useTestimonialData = create((set) => ({
    testimonials: [] || '',
    setTestimonial: (testimonials) => set({ testimonials }),

    // Add job order with file quotation 
    createTestimonial: async(id,newJob) => {
        // const userID = localStorage.getItem("userID");
        // if (!userID) {
        //     console.error("User ID not found in localStorage. Please ensure the user is logged in.");
        //     return { success: false, message: "User is not authenticated" };
        // }
     
                try {
                    const res = await axios.post(`/api/testimonial/save/${id}`, newJob, {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    set((state) => ({ testimonials: [...state.testimonials, res.data.data] }));
                    return { success: true, message: "Feedback created successfully" };
                }

                catch (error) {
                    console.error("Error saving feedback:", error.response?.data?.message || error.message);
                    return { success: false, message: error.response?.data?.message || "An error occurred" };
                }
            
        
    },
    fetchTestimonialData: async () => {
        try {
            const res = await axios.get("/api/testimonial/");
            const fetchTestimonial = res.data.data || [];
            set({ projects: fetchTestimonial });
            return fetchTestimonial;
        } catch (error) {
            console.error("Failed to fetch projects:", error);
          throw new Error(
            error.response?.data?.message || "An error occurred while fetching services."
          );
        }
    },
    

    
}));