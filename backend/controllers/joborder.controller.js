import mongoose from "mongoose";
import JobOrder from "../models/joborder.mode.js";
import ProjectIDCounter from "../models/projectIDCounter.model.js";
import multer from 'multer';
import {sendEmail, upload_JobQuotation_File_Single } from '../utils/helpers.js';
import { v2 as cloudinary } from 'cloudinary';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const File_Storage = multer.memoryStorage();

// Add job order
export const addJobOrder = async (req, res) => {
    const job = req.body;
    const buffer = req.file.buffer;
    try {
      
        let counter = await ProjectIDCounter.findOne();
  
        if (!counter) {
            counter = new ProjectIDCounter({ lastProjectID: 0 });
            await counter.save();
        }
  
        const newProjectID = `P${String(counter.lastProjectID + 1).padStart(7, '0')}`;
  
        await ProjectIDCounter.updateOne({}, { $inc: { lastProjectID: 1 } });
  
        job.projectID = newProjectID;

        if (job.createdBy && job.createdBy === "Client") {
            job.createdBy = null;
            const mailSent = await sendEmail(
                job.clientEmail,
                "Mr. Quick Fix Inquiry",
                InquiryTemplate
            )
        } else if (job.createdBy && !mongoose.Types.ObjectId.isValid(job.createdBy)) {
            return res.status(400).json({ success: false, message: "Invalid createdBy ID" });
        }
        const data = await upload_JobQuotation_File_Single(buffer);
        job.jobQuotation = data.url;
        job.jobQuotationPublicKey = data.public_id

        const newJob = new JobOrder(job);


        const mailSent = await sendEmail(
            job.clientEmail,
            "Mr. Quick Fix Project",
            `<!DOCTYPE html>
                <html lang="en" >
                <head>
                    <meta charset="UTF-8">
                    <title>Mr. Quick Fix PH Project</title>


                </head>
                <body>
                <!-- partial:index.partial.html -->
                <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                    <div style="margin:50px auto;width:70%;padding:20px 0">
                    <div style="border-bottom:1px solid #eee">
                        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Mr Quick Fix  </a>
                    </div>
                    <p style="font-size:1.1em">Hi Mr./Ms. ${job.clientLastName},</p>
                   <p>I hope this email finds you well, <br/>
                   This email is to inform you that we received your inquiry, please be advice that one of our staff will contact you for other details and information regarding your inquiry.
                        The information you submitted with us will remain secure and use to contact you as the project is still ongoing. <br/>
                        We already attached the Quotation File for the project. This file will serves as your copy of the Quotation File
                   </p>
                   <p>
                   Thank you for trusting Mr. Quick Fix! <br/>
	                We hope that you will enjoy working with us and a good outcome.   
                   </p>
                    <p style="font-size:0.9em;">Warm Regards,<br />Mr. Quick Fix</p>
                    <hr style="border:none;border-top:1px solid #eee" />
                    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                        <p>Mr Quick Fix PH</p>
                        <p>Philippines</p>
                    </div>
                    </div>
                </div>
                <!-- partial -->

                </body>
                </html>`,
            {
                filename: `Quotation.pdf`,
                path: data.url
            }
        )
        await newJob.save();
        console.log(newJob);
        res.status(201).json({ success: true, data: newJob });
    } catch (error) {
        console.error("Error saving job order:", error.message);
        res.status(500).json({ success: false, message: "Server Error: Failed to save job order" });
    }
};

export const addJobOrderNoFileUpload = async (req, res) => {
    const job = req.body;
   
    try {
        let counter = await ProjectIDCounter.findOne();
  
        if (!counter) {
            counter = new ProjectIDCounter({ lastProjectID: 0 });
            await counter.save();
        }
  
        const newProjectID = `P${String(counter.lastProjectID + 1).padStart(7, '0')}`;
  
        await ProjectIDCounter.updateOne({}, { $inc: { lastProjectID: 1 } });
  
        job.projectID = newProjectID;

        if (job.createdBy && job.createdBy === "Client") {
            job.createdBy = null;
        } else if (job.createdBy && !mongoose.Types.ObjectId.isValid(job.createdBy)) {
            return res.status(400).json({ success: false, message: "Invalid createdBy ID" });
        }

        const newJob = new JobOrder(job);
        await newJob.save();
      
  
        res.status(201).json({ success: true, data: newJob });
    } catch (error) {
        console.error("Error saving job order:", error.message);
        res.status(500).json({ success: false, message: "Server Error: Failed to save job order" });
    }
};


// Get all job orders
export const getJobOrders = async (req, res) => {
    try {
        const jobs = await JobOrder.find({}).populate("createdBy updatedBy", "firstName lastName");
        res.status(200).json({ success: true, data: jobs });
    } catch (error) {
        console.error("Error fetching job orders:", error.message);
        res.status(500).json({ success: false, message: "Server Error: Failed to fetch job orders" });
    }
};

// Update job order
export const updateJobOrder = async (req, res) => {
    const { id } = req.params;
    const job = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Job order not found" });
    }

    const userID = job.userID;

    if (!userID) {
        return res.status(400).json({ success: false, message: "User ID is required" });
    }
    
    try {
        const updateFields = {
            ...job,
            updatedBy: userID,
            updatedAt: new Date(),
            jobNotificationRead: true,
        };

        if (job.jobStatus === "cancelled") {
            updateFields.jobCancelledDate = new Date();
            const mailSent = await sendEmail(
                job.clientEmail,
                "Mr. Quick Fix Project",
                `<!DOCTYPE html>
                    <html lang="en" >
                    <head>
                        <meta charset="UTF-8">
                        <title>Mr. Quick Fix PH Project</title>
    
    
                    </head>
                    <body>
                    <!-- partial:index.partial.html -->
                    <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                        <div style="margin:50px auto;width:70%;padding:20px 0">
                        <div style="border-bottom:1px solid #eee">
                            <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Mr Quick Fix  </a>
                        </div>
                        <p style="font-size:1.1em">Hi Mr./Ms. ${job.clientLastName},</p>
                       <p>We are writing to inform you that your transaction with us has been cancelled.
                       </p>
                       <p><b>Reason for Cancellation:</b> ${job.jobCancellationReason}</p>
                       <p>
                       If you believe this cancellation was made in error, please contact our customer service at [Business Phone] or message us on our Facebook page: [Facebook Page].
                       </p>
                       <p>We sincerely apologize for any inconvenience this may have caused and appreciate your understanding.
                        </p
                        <p style="font-size:0.9em;">Warm Regards,<br />Mr. Quick Fix</p>
                        <hr style="border:none;border-top:1px solid #eee" />
                        <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                            <p>Mr Quick Fix PH</p>
                            <p>Philippines</p>
                        </div>
                        </div>
                    </div>
                    <!-- partial -->
    
                    </body>
                    </html>`,
                // {
                //     filename: `Quotation.pdf`,
                //     path: data.url
                // }
            )

        }

        if (job.jobStatus === "completed") {
            updateFields.jobCompletedDate = new Date();


        }

        if (updateFields.updatedBy === "Client") {
            updateFields.updatedBy = null;
        } else if (updateFields.updatedBy && !mongoose.Types.ObjectId.isValid(updateFields.updatedBy)) {
            return res.status(400).json({ success: false, message: "Invalid updatedBy ID" });
        }

        const updatedJob = await JobOrder.findByIdAndUpdate(
            id,
            updateFields,
            { new: true }
        ).populate("createdBy updatedBy", "firstName lastName");

        if (!updatedJob) {
            return res.status(404).json({ success: false, message: "Job order not found" });
        }

        res.status(200).json({ success: true, data: updatedJob });
    } catch (error) {
        console.error("Error updating job order:", error.message);
        res.status(500).json({ success: false, message: "Server Error: Failed to update job order" });
    }
};


export const updateJobOrderAddQuotationOnly = async (req, res) => {
    const { id } = req.params;
    const job = req.body;
    const buffer = req.file.buffer;

    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //     return res.status(404).json({ success: false, message: "Job order not found" });
    // }
    const datad  = await JobOrder.findOne({_id:id});
    if(!datad) return res.status(404).json({ success: false, message: "Job order not found" });
    const userID = job.userID;
    const public_id = datad.public_id;
    console.log(public_id)
    if (!userID) {
        return res.status(400).json({ success: false, message: "User ID is required" });
    }
    if(public_id) {  
        await cloudinary.uploader.destroy(public_id)
    }
    const data = await upload_JobQuotation_File_Single(buffer);
    try {
        const updateFields = {
            ...job,
            updatedBy: userID,
            jobQuotation: data.url,
            jobQuotationPublicKey: data.public_id,
            updatedAt: new Date(),
            jobNotificationRead: true,
        };

        if (job.jobStatus === "cancelled") {
            updateFields.jobCancelledDate = new Date();
        }

        if (job.jobStatus === "completed") {
            updateFields.jobCompletedDate = new Date();
        }

        if (updateFields.updatedBy === "Client") {
            updateFields.updatedBy = null;
        } else if (updateFields.updatedBy && !mongoose.Types.ObjectId.isValid(updateFields.updatedBy)) {
            return res.status(400).json({ success: false, message: "Invalid updatedBy ID" });
        }

        const updatedJob = await JobOrder.findByIdAndUpdate(
            id,
            updateFields,
            { new: true }
        ).populate("createdBy updatedBy", "firstName lastName");

        if (!updatedJob) {
            return res.status(404).json({ success: false, message: "Job order not found" });
        }

        res.status(200).json({ success: true, data: updatedJob });
    } catch (error) {
        console.error("Error updating job order:", error.message);
        res.status(500).json({ success: false, message: "Server Error: Failed to update job order" });
    }
};
// Delete job order
export const deleteJobOrder = async (req, res) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ success: false, message: "Job order not found" });
        }
        
        await JobOrder.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Job order deleted successfully" });
    } catch (error) {
        console.error("Error deleting job order:", error.message);
        res.status(500).json({ success: false, message: "Server Error: Failed to delete job order" });
    }
};

// Archive job order
export const archiveJobOrder = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Job order not found" });
    }

    try {
        const jobOrder = await JobOrder.findById(id);
        if (!jobOrder) {
            return res.status(404).json({ success: false, message: "Job order not found" });
        }

        if (jobOrder.jobStatus === "completed" || jobOrder.jobStatus === "cancelled") {
            jobOrder.isArchived = true;
            jobOrder.archivedAt = new Date();
            await jobOrder.save();

            return res.status(200).json({ success: true, data: jobOrder });
        } else {
            return res.status(400).json({ success: false, message: "Only completed or cancelled jobs can be archived" });
        }
    } catch (error) {
        console.error("Error archiving job order:", error.message);
        res.status(500).json({ success: false, message: "Server Error: Failed to archive job order" });
    }
};
