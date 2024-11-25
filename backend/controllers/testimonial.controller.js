import mongoose from "mongoose";
import Testimonials from "../models/testimonial.model.js";
import JobOrder from "../models/joborder.mode.js";


export const AddFeedback = async(req,res)=>{
    const {id} = req.params;
    const feedback = req.body;

    try{
        let checkJobOrder = await JobOrder.find({_id:id});
       
        if(!checkJobOrder) return res.status(400).json({message:
            'Invalid Job Order ID'
        })
     
        let checkTestimony = await Testimonials.findOne({jobID:id});
        if(checkTestimony) return res.status(400).json({message:
                'Already Submitted Feedback'
            })
      
        
        feedback.status = 'Draft';
        feedback.jobID = id;
        // console.log(feedback)
        const newFeedback = new Testimonials(feedback);
        await newFeedback.save();
        res.status(201).json({ success: true, message:newFeedback});
    }
    catch(error){
        console.error("Error saving service:", error.message);
        res.status(500).json({ success: false, message: "Server Error: Failed to save service" });
    }
}

export const getFeedback = async(req,res)=>{
    try {
        const jobs = await Testimonials.find({}).populate("jobID", "clientFirstName clientLastName");
        res.status(200).json({ success: true, data: jobs });
    } catch (error) {
        console.error("Error fetching job orders:", error.message);
        res.status(500).json({ success: false, message: "Server Error: Failed to fetch job orders" });
    }
}