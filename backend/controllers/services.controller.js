import mongoose from "mongoose";
import Services from "../models/services.model.js";
import multer from "multer";
import ProjectIDCounter from "../models/projectIDCounter.model.js";
import { upload_JobQuotation_File_Single } from "../utils/helpers.js";

export const File_Storage = multer.memoryStorage();
export const AddService = async (req,res)=>{
    const service = req.body;
    const buffer = req.file.buffer;
    try{
        let checkServiceName = await Services.findOne({serviceName: service.serviceName});
        if(checkServiceName) return res.status(400).json({message:
            'This service name is already existed. Please try again'
        })

        let counter = await ProjectIDCounter.findOne();
        if(!counter) {
            counter = new ProjectIDCounter({lastServiceID:0});
            await counter.save();
        }

        const newServiceID = String(counter.lastServiceID + 1);
        await ProjectIDCounter.updateOne({},{$inc:{lastServiceID: 1}});
        service.serviceID = newServiceID;

        const data =  await upload_JobQuotation_File_Single(buffer);
        service.serviceImageURL = data.url;
        service.serviceImagePublic_ID = data.public_id

        const newService = new Services(service);
        await newService.save();
        res.status(201).json({ success: true, data: newService });

    }
    catch(error){
        console.error("Error saving service:", error.message);
        res.status(500).json({ success: false, message: "Server Error: Failed to save service" });
    }
}

export const getServices = async (req,res)=>{
    try{
        const services = await Services.find({});
        res.status(200).json({ success: true, data: services });
    }
    catch(error){
        console.error("Error fetching services:", error.message);
        res.status(500).json({ success: false, message: "Server Error: Failed to fetch services" });
    }
}

export const removeService = async(req,res)=>{
    const {id} = req.params;
    try{
        const serviceID = await Services.findOne({_id:id});
        if(!serviceID) return res.status(404).json({success: false, message: 'Project ID is invalid'})
        await serviceID.deleteOne({
            _id:id
        })
        res.status(200).json({success: true, data: serviceID})
    }
    catch(error){
        res.status(500).json({ success: false, message: "Server Error: Failed to delete project" });
    }
}
//update only text variables
export const editService = async(req,res)=>{
    const {id} = req.params;
    const service = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Service not found" });
    }
    try{
       const updateService = await Services.findByIdAndUpdate(
        id,
        service,
        { new: true }
       )
       
       if (!updateService) {
        return res.status(404).json({ success: false, message: "Service not found" });
    }

    res.status(200).json({ success: true, data: updateService });
    }
    catch(error){
        console.error("Error updating job order:", error.message);
        res.status(500).json({ success: false, message: "Server Error: Failed to update Service" });
    }
}
///update the serviceImage
export const editServicewImage = async(req,res)=>{
    const {id} = req.params;
    const service = req.body;
    const buffer = req.file.buffer;
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //     return res.status(404).json({ success: false, message: "Service not found" });
    // }
    const serviceIDfind = await Services.find({_id:id});
    if(!serviceIDfind) return res.status(404).json({ success: false, message: "Service not found" });
    const data = await upload_JobQuotation_File_Single(buffer);
    if(serviceIDfind.serviceImagePublic_ID){

    }
    const updateServiceData ={
        ...service,
        serviceImageURL: data.url,
        serviceImagePublic_ID: data.public_id
    }
    try{
       const updateService = await Services.findByIdAndUpdate(
        id,
        updateServiceData,
        { new: true }
       )
       
       if (!updateService) {
        return res.status(404).json({ success: false, message: "Service not found" });
    }

    res.status(200).json({ success: true, data: updateService });
    }
    catch(error){
        console.error("Error updating job order:", error.message);
        res.status(500).json({ success: false, message: "Server Error: Failed to update Service" });
    }
}
