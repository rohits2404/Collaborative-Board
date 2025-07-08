import express from 'express';
import { getRecentActions, getTaskActions } from '../controllers/actionController.js';

const router = express.Router();

// GET /api/actions - Get latest 20 actions
router.get('/', getRecentActions);

// GET /api/actions/task/:taskId - Get actions for specific task
router.get('/task/:taskId', getTaskActions);

export default router;