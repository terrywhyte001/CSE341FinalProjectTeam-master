// routes/index.js
const express = require('express');
const router = express.Router();

// Root route - Redirect to API documentation
router.get('/', (req, res) => {
    res.redirect('/api-docs');
});

// Routes for /user (Registration, Login, Logout)
router.use('/user', require('./users'));

// Routes for /record (CRUD)
router.use('/record', require('./records'));

module.exports = router;