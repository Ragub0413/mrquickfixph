import mongoose from "mongoose";
import Projects from "../models/project.model.js";
import multer from 'multer';
import ProjectIDCounter from "../models/projectIDCounter.model.js";
import { Upload_Multiple_File } from "../utils/helpers.js";


export const File_Storage = multer.memoryStorage();

export const AddProject  = async(req, res) =>{
    const projects = req.body;
    const buffer = req.files;

    try{
        // const data = await Upload_Multiple_File(buffer);
        // const result = await Projects.create({projectImagesUrl:data});
        // res.status(200).json({result})
        let counter = await ProjectIDCounter.findOne();
        if(!counter){
            counter = new ProjectIDCounter({lastProjectUploadID:0});
            await counter.save();
        }
        const newProjectsUploadID = String(counter.lastProjectUploadID +1);
        await ProjectIDCounter.updateOne({},{$inc:{lastProjectUploadID:1}});
        projects.projectID = newProjectsUploadID;

         const data = await Upload_Multiple_File(buffer);
         projects.projectImagesUrl = data;
         projects.createdAt = new Date();
         const newProject = new Projects(projects);
         await newProject.save();
         res.status(201).json({ success: true, data: newProject });

    }
    catch(error){
        console.error("Error saving projects:", error.message);
        res.status(500).json({ success: false, message: "Server Error: Failed to save projects" });
    
    }
}

export const getProjects = async (req,res)=>{
    try{
        const projects = await Projects.find({});
        res.status(200).json({ success: true, data: projects });
    }
    catch(error){
        console.error("Error fetching services:", error.message);
        res.status(500).json({ success: false, message: "Server Error: Failed to fetch services" });
    }
}

export const removeProject = async(req,res) =>{
    const {id} = req.params;
    try{
        const projectID = await Projects.findOne({_id:id});
        if(!projectID) return res.status(404).json({success: false, message: 'Project ID is invalid'})
        await projectID.deleteOne({
            _id:id
        })
        res.status(200).json({success: true, data: projectID})
    }
    catch(error){
        res.status(500).json({ success: false, message: "Server Error: Failed to delete project" });
    }
}

