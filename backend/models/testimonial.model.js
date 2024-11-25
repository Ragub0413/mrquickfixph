import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({

    status:{
        type: String,
        required: false,
    },
    feedbackMessage:{
        type: String,
        required: true,
    },
    //FOR THE COMPLETED PROJECT
    jobID:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "JobOrder", 
        required: false 
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});
const Testimonials = mongoose.model("testimonials", testimonialSchema);
export default Testimonials;