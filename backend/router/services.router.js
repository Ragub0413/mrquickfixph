import express from 'express';

import { AddService, File_Storage, getServices, removeService } from '../controllers/services.controller.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({storage:File_Storage})

router.post('/save', upload.single("serviceImage"),AddService);
router.get('/',getServices);
router.delete('/removeservice/:id',removeService);

export default router;