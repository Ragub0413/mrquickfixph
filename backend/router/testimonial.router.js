import express from 'express';

import { AddFeedback, getFeedback, updateStatus } from '../controllers/testimonial.controller.js';
const router = express.Router();

router.post('/save/:id',AddFeedback);
router.get('/',getFeedback);
router.patch('/newStatus/:id',updateStatus)
export default router;