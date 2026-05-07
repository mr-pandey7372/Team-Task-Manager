import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(authorize('Admin'), createTask)
  .get(getTasks);

router
  .route('/:id')
  .get(getTaskById)
  .put(updateTask) // Controller handles Admin vs Member logic
  .delete(authorize('Admin'), deleteTask);

export default router;
