import express from 'express';

import { AddProject, File_Storage, getProjects, removeProject } from '../controllers/project.controller.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({storage:File_Storage})

router.post('/save', upload.array("projectImage",10), AddProject);
router.get('/',getProjects);
router.delete('/remove/:id',removeProject);
export default router
