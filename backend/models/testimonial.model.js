import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
    testimonialID:{
        type:String,
        required: true,
        unique: true
    },
    clientFirstName:{
        type: String,
        required: true
    },
    clientLastName:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true
    },
    feedbackMessage:{
        type: String,
        required: true
    },
    //FOR THE COMPLETED PROJECT
    jobID:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "JobOrder", 
        required: true 
    }
});
const Testimonials = mongoose.model("testimonials", testimonialSchema);
export default Testimonials;