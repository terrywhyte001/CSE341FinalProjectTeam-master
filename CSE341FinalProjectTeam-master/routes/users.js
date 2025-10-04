// routes/users.js
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const { isAuthenticated, validateObjectId } = require('../middleware/authenticate');

// Authentication routes (no middleware needed)
router.post('/register', usersController.register);
router.post('/login', usersController.login);
router.get('/logout', usersController.logout);

// CRUD routes (require authentication and validation)
router.get('/', isAuthenticated, usersController.getAllUsers);
router.get('/:id', isAuthenticated, validateObjectId('id'), usersController.getSingleUser);
router.put('/:id', isAuthenticated, validateObjectId('id'), usersController.updateUser);
router.delete('/:id', isAuthenticated, validateObjectId('id'), usersController.deleteUser);

module.exports = router;