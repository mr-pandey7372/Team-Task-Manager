import express from 'express';
import { registerUser, loginUser, getMe, getUsers } from '../controllers/authController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/users', protect, authorize('Admin'), getUsers);

export default router;
