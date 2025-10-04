// middleware/authenticate.js
const isAuthenticated = (req, res, next) => {
    // Checks if the user ID is in the session (active session)
    if (req.session.userId) {
        next(); // User is authenticated, proceed to the controller
    } else {
        // HTTP 401 Unauthorized - Return JSON response for better API consistency
        res.status(401).json({ 
            message: 'Access denied. Please log in.',
            error: 'Unauthorized'
        });
    }
};

// Middleware for validating ObjectId parameters
const validateObjectId = (paramName = 'id') => {
    return (req, res, next) => {
        const id = req.params[paramName];
        
        // Check if the ID is a valid MongoDB ObjectId format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                message: `Invalid ${paramName} format. Must be a valid MongoDB ObjectId.`,
                error: 'Bad Request'
            });
        }
        
        next();
    };
};

module.exports = { isAuthenticated, validateObjectId };