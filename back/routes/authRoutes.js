// back/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/clients', authController.getAllClients);
router.get('/technicians', authController.getAllTechnicians); // This is the crucial new line for technicians

// Protected routes for technician profile
router.get('/technician/profile', authController.verifyToken, authController.getTechnicianProfile);
router.put('/technician/profile', authController.verifyToken, authController.updateTechnicianProfile);

module.exports = router;