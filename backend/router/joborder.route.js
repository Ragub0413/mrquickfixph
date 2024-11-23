import express from 'express';

import { addJobOrder, getJobOrders, updateJobOrder, deleteJobOrder, archiveJobOrder,File_Storage } from "../controllers/joborder.controller.js";
import multer from 'multer';

const router = express.Router();
const upload = multer({storage:File_Storage})
// Add job order
router.post("/",upload.single("jobQuotation"),addJobOrder);

// Get all job orders
router.get("/", getJobOrders);

// Update job order
router.patch("/:id", updateJobOrder);


// Delete job order
router.delete("/:id", deleteJobOrder);

// Archive job order
router.patch("/:id", archiveJobOrder);


export default router;