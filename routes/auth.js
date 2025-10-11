// routes/auth.js
const express = require('express');
const router = express.Router();
const passport = require('../config/passport');

// OAuth status route
router.get('/status', (req, res) => {
    res.json({
        google: process.env.GOOGLE_CLIENT_ID ? 'configured' : 'not configured',
        github: process.env.GITHUB_CLIENT_ID ? 'configured' : 'not configured'
    });
});

// Google OAuth routes (only if configured)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    router.get('/google', 
        // #swagger.tags = ['Authentication']
        // #swagger.ignore = true
        passport.authenticate('google', { scope: ['profile', 'email'] })
    );

    router.get('/google/callback',
        // #swagger.tags = ['Authentication']  
        // #swagger.ignore = true
        passport.authenticate('google', { failureRedirect: '/api-docs?error=oauth_failed' }),
        (req, res) => {
            // Successful authentication, redirect to API docs
            res.redirect('/api-docs?oauth=success');
        }
    );
}

// GitHub OAuth routes (only if configured)
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    router.get('/github',
        // #swagger.tags = ['Authentication']
        // #swagger.ignore = true
        passport.authenticate('github', { scope: ['user:email'] })
    );

    router.get('/github/callback',
        // #swagger.tags = ['Authentication']
        // #swagger.ignore = true
        passport.authenticate('github', { failureRedirect: '/api-docs?error=oauth_failed' }),
        (req, res) => {
            // Successful authentication, redirect to API docs
            res.redirect('/api-docs?oauth=success');
        }
    );
}

// Default route if no OAuth is configured
if (!process.env.GOOGLE_CLIENT_ID && !process.env.GITHUB_CLIENT_ID) {
    router.get('*', (req, res) => {
        res.status(404).json({
            message: 'OAuth not configured',
            note: 'Please configure GOOGLE_CLIENT_ID/SECRET or GITHUB_CLIENT_ID/SECRET environment variables'
        });
    });
}

module.exports = router;