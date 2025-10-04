// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');
const cors = require('cors'); 
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI;

// Your domain on Render (HTTPS protocol is implied for Render)
const DEPLOY_ORIGIN = 'https://cse341finalprojectteam.onrender.com';

// CORS Specific Configuration
const corsOptions = {
    // 1. Allow localhost for development and your deploy domain for production
    origin: ['http://localhost:8080', DEPLOY_ORIGIN], 
    
    // 2. ESSENTIAL: Allows session cookies (credentials) to be sent.
    credentials: true,
    
    // 3. Allow all HTTP methods
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};

// --- Middleware Configuration ---
app.use(cors(corsOptions));
app.use(express.json()); 

// Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        
        // Ensures 'secure' is true on Render (HTTPS)
        secure: process.env.NODE_ENV === 'production', 
        
        // ESSENTIAL for cross-origin cookie transmission over HTTPS.
        // 'none' is required with 'secure: true' for the Render deployment.
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    } 
}));

// --- MongoDB Connection ---
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB!'))
    .catch(err => console.error('Connection error to MongoDB:', err.message));

// --- Routes and Documentation ---
app.use('/', routes);

// Serve swagger.json file
app.get('/swagger.json', (req, res) => {
    res.sendFile(__dirname + '/swagger.json');
});

// Loads the generated swagger.json file
const swaggerDocument = require('./swagger.json');

// 🚀 MODIFICATION HERE: Forces the Swagger UI to use the HTTPS URL
// This helps prevent caching issues from forcing HTTP on the deployed documentation.
const swaggerOptions = {
    swaggerOptions: {
        // Tells Swagger UI to use the HTTPS URL defined in your swagger.json as the default
        url: DEPLOY_ORIGIN + '/swagger.json'
    }
};

// Use the new options in the setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions)); 

// --- Error Handling Middleware ---
// 404 handler for undefined routes
app.use('*', (req, res) => {
    res.status(404).json({ 
        message: 'Route not found', 
        availableRoutes: {
            documentation: '/api-docs',
            users: '/user',
            records: '/record'
        }
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Global error handler:', error);
    res.status(500).json({ 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'production' ? 'Something went wrong' : error.message 
    });
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API documentation at http://localhost:${PORT}/api-docs`);
});