// routes/auth.js
const express = require('express');
const router = express.Router();
const passport = require('../config/passport');

// Google OAuth routes
router.get('/google', 
    // #swagger.tags = ['Authentication']
    // #swagger.ignore = true
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
    // #swagger.tags = ['Authentication']  
    // #swagger.ignore = true
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication, redirect to API docs
        res.redirect('/api-docs');
    }
);

// GitHub OAuth routes
router.get('/github',
    // #swagger.tags = ['Authentication']
    // #swagger.ignore = true
    passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback',
    // #swagger.tags = ['Authentication']
    // #swagger.ignore = true
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication, redirect to API docs
        res.redirect('/api-docs');
    }
);

module.exports = router;