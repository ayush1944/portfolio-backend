import express from 'express';
import { logEvent, getSummary } from '../controllers/analytics.controller.js';

const router = express.Router();
router.post('/', logEvent);
router.get('/summary', getSummary);
export default router;
