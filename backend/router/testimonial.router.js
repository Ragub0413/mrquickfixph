import express from 'express';

import { AddFeedback, getFeedback } from '../controllers/testimonial.controller.js';
const router = express.Router();

router.post('/save/:id',AddFeedback);
router.get('/',getFeedback);
export default router;