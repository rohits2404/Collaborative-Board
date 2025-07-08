import express from 'express';
import {
  validateCreateTask,
  validateUpdateTask,
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  smartAssignTask
} from '../controllers/taskController.js';

const router = express.Router();

// Create task
router.post('/', validateCreateTask, createTask);

// Fetch tasks
router.get('/', getTasks);

// Update task
router.put('/:id', validateUpdateTask, updateTask);

// Delete task
router.delete('/:id', deleteTask);

// Smart assign
router.post('/:id/smart-assign', smartAssignTask);

export default router;