import axios from 'axios';
import { create } from 'zustand';

export const useJobOrder = create((set) => ({
  projects: [],
  setProjects: (projects) => set({ projects }),

  createClientInquiry: async (newJob) => {
    // Validate if any required field is empty
    if (
      !newJob.clientFirstName ||
      !newJob.clientLastName ||
      !newJob.clientEmail ||
      !newJob.clientPhone ||
      !newJob.clientMessage
    ) {
      return { success: false, message: "Please fill in all required fields" };
    }

    try {
      const res = await axios.post('http://localhost:5000/api/job-orders/savenofile', { ...newJob, createdBy: 'Client' }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      set((state) => ({ projects: [...state.projects, res.data.data] }));
      return { success: true, message: 'Job order created successfully' };
    } catch (error) {
      console.error('Error creating job order:', error);
      return {
        success: false,
        message: error.response ? error.response.data.message : 'An unexpected error occurred.',
      };
    }
  },
}));
