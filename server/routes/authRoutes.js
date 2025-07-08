import express from 'express';
import {
    validateRegister,
    validateLogin,
    register,
    login,
    getCurrentUser,
    logout,
    getAllUsers
} from '../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Register user
router.post('/register', validateRegister, register);

// Login user
router.post('/login', validateLogin, login);

// Get current user
router.get('/me', auth, getCurrentUser);

// Logout user
router.post('/logout', auth, logout);

// Get all users (for assignment)
router.get('/users', auth, getAllUsers);

export default router;