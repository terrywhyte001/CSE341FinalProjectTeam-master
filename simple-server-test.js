// simple-server-test.js - Basic test without OAuth
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');

const app = express();

// Basic middleware
app.use(express.json());
app.use(cors());

// Test route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Server is working!',
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});

// API status route
app.get('/status', (req, res) => {
    res.json({
        server: 'running',
        environment: process.env.NODE_ENV || 'development',
        mongodb: process.env.MONGODB_URI ? 'configured' : 'not configured',
        oauth: {
            google: process.env.GOOGLE_CLIENT_ID ? 'configured' : 'not configured'
        }
    });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`✅ Simple test server running on port ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}`);
    console.log(`Status: http://localhost:${PORT}/status`);
});

module.exports = app;