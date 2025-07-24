import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { UserController } from '../controllers/userController';

const router = Router();
const userController = new UserController();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get user stats
router.get('/stats', userController.getUserStats);

// Get user profile
router.get('/profile', userController.getProfile);

// Update user profile
router.put('/profile', userController.updateProfile);

// Upload profile picture
router.post('/profile/picture', userController.uploadProfilePicture);

export default router;
