// controllers/users.js
const User = require('../models/user');
const Record = require('../models/record');
const bcrypt = require('bcryptjs'); // For Password Hashing

// POST /user/register
exports.register = async (req, res) => {
    // #swagger.tags = ['Users']
    /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'User registration credentials.',
        required: true,
        schema: { $ref: "#/definitions/UserRegistration" } // Uses the schema defined in swagger.js
    } */
    /* #swagger.responses[201] = {
        description: 'User successfully registered and logged in. A session cookie is returned.',
        schema: { message: 'User registered and logged in successfully!', userId: '60a7d5b1234567890abcdef' }
    } */
    /* #swagger.responses[400] = { description: 'Username and password are required.' } */
    /* #swagger.responses[409] = { description: 'User already exists.' } */
    /* #swagger.responses[500] = { description: 'Internal error while registering user.' } */
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists.' });
        }

        // Password Hashing (Security!)
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        
        // Automatic Login
        req.session.userId = newUser._id; 
        
        res.status(201).json({ message: 'User registered and logged in successfully!', userId: newUser._id });

    } catch (error) {
        res.status(500).json({ message: 'Error registering user.', error: error.message });
    }
};

// POST /user/login
exports.login = async (req, res) => {
    // #swagger.tags = ['Users']
    /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'User login credentials.',
        required: true,
        schema: { $ref: "#/definitions/UserRegistration" } // Uses the schema defined in swagger.js
    } */
    /* #swagger.responses[200] = {
        description: 'User successfully logged in. A session cookie is returned.',
        schema: { message: 'Logged in successfully!', userId: '60a7d5b1234567890abcdef' }
    } */
    /* #swagger.responses[400] = { description: 'Username and password are required.' } */
    /* #swagger.responses[401] = { description: 'Invalid credentials.' } */
    /* #swagger.responses[500] = { description: 'Internal error while logging in.' } */
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' }); 
        }

        // Hashed Password Comparison
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Session Creation (Cookie Configuration)
        req.session.userId = user._id; 
        
        // The API responds 200 OK and the cookie is set by express-session
        res.status(200).json({ message: 'Logged in successfully!', userId: user._id });

    } catch (error) {
        res.status(500).json({ message: 'Error logging in.', error: error.message });
    }
};

// GET /user/logout
exports.logout = (req, res) => {
    // #swagger.tags = ['Users']
    // #swagger.security = [{ "SessionCookie": [] }] // Indicates this route requires authentication (to destroy the current session)
    /* #swagger.responses[200] = { description: 'Session successfully ended.' } */
    /* #swagger.responses[500] = { description: 'Internal error while logging out.' } */
    // Destroys the session and removes the cookie
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Error logging out.' });
        }
        res.clearCookie('connect.sid'); 
        res.status(200).json({ message: 'Logged out successfully.' });
    });
};

// GET /user - READ: Returns all users (Admin functionality)
exports.getAllUsers = async (req, res) => {
    // #swagger.tags = ['Users']
    // #swagger.security = [{ "SessionCookie": [] }]
    /* #swagger.responses[200] = {
        description: 'Successfully retrieved list of users.',
        schema: [ { $ref: "#/definitions/UserResponse" } ]
    } */
    /* #swagger.responses[401] = { description: 'Access denied. Please log in.' } */
    /* #swagger.responses[500] = { description: 'Internal Server Error' } */
    try {
        // Exclude password field for security
        const users = await User.find({}, '-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving users.', error: error.message });
    }
};

// GET /user/{id} - READ: Returns a single user by ID
exports.getSingleUser = async (req, res) => {
    // #swagger.tags = ['Users']
    // #swagger.security = [{ "SessionCookie": [] }]
    /* #swagger.responses[200] = {
        description: 'Successfully retrieved the user.',
        schema: { $ref: "#/definitions/UserResponse" }
    } */
    /* #swagger.responses[401] = { description: 'Access denied. Please log in.' } */
    /* #swagger.responses[404] = { description: 'User not found.' } */
    /* #swagger.responses[500] = { description: 'Internal Server Error' } */
    try {
        const userId = req.params.id;
        
        // Validate ObjectId format
        if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid user ID format.' });
        }
        
        const user = await User.findById(userId, '-password'); // Exclude password
        
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user.', error: error.message });
    }
};

// PUT /user/{id} - UPDATE: Updates a user (only own profile or admin)
exports.updateUser = async (req, res) => {
    // #swagger.tags = ['Users']
    // #swagger.security = [{ "SessionCookie": [] }]
    /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Updated user data.',
        required: true,
        schema: { $ref: "#/definitions/UserUpdate" }
    } */
    /* #swagger.responses[200] = {
        description: 'User successfully updated.',
        schema: { $ref: "#/definitions/UserResponse" }
    } */
    /* #swagger.responses[400] = { description: 'Invalid user ID format or validation error.' } */
    /* #swagger.responses[401] = { description: 'Access denied. Please log in.' } */
    /* #swagger.responses[403] = { description: 'Access denied. You can only update your own profile.' } */
    /* #swagger.responses[404] = { description: 'User not found.' } */
    /* #swagger.responses[409] = { description: 'Username already exists.' } */
    /* #swagger.responses[500] = { description: 'Internal Server Error' } */
    try {
        const userId = req.params.id;
        const currentUserId = req.session.userId;
        
        // Validate ObjectId format
        if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid user ID format.' });
        }
        
        // Authorization: Users can only update their own profile
        if (userId !== currentUserId.toString()) {
            return res.status(403).json({ message: 'Access denied. You can only update your own profile.' });
        }
        
        const { username, password } = req.body;
        const updateData = {};
        
        // Only update provided fields
        if (username) {
            // Check if username already exists (excluding current user)
            const existingUser = await User.findOne({ 
                username, 
                _id: { $ne: userId } 
            });
            
            if (existingUser) {
                return res.status(409).json({ message: 'Username already exists.' });
            }
            
            updateData.username = username;
        }
        
        if (password) {
            // Hash new password
            updateData.password = await bcrypt.hash(password, 10);
        }
        
        // Return error if no valid fields to update
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: 'No valid fields provided for update.' });
        }
        
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password'); // Exclude password from response
        
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }
        
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user.', error: error.message });
    }
};

// DELETE /user/{id} - DELETE: Deletes a user account (only own account)
exports.deleteUser = async (req, res) => {
    // #swagger.tags = ['Users']
    // #swagger.security = [{ "SessionCookie": [] }]
    /* #swagger.responses[204] = { description: 'User successfully deleted (No Content).' } */
    /* #swagger.responses[400] = { description: 'Invalid user ID format.' } */
    /* #swagger.responses[401] = { description: 'Access denied. Please log in.' } */
    /* #swagger.responses[403] = { description: 'Access denied. You can only delete your own profile.' } */
    /* #swagger.responses[404] = { description: 'User not found.' } */
    /* #swagger.responses[500] = { description: 'Internal Server Error' } */
    try {
        const userId = req.params.id;
        const currentUserId = req.session.userId;
        
        // Validate ObjectId format
        if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid user ID format.' });
        }
        
        // Authorization: Users can only delete their own account
        if (userId !== currentUserId.toString()) {
            return res.status(403).json({ message: 'Access denied. You can only delete your own profile.' });
        }
        
        const deletedUser = await User.findByIdAndDelete(userId);
        
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }
        
        // Also delete all records belonging to this user
        await Record.deleteMany({ ownerId: userId });
        
        // Destroy the session since user is deleted
        req.session.destroy(err => {
            if (err) {
                console.error('Error destroying session:', err);
            }
            res.clearCookie('connect.sid');
            res.status(204).send();
        });
        
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user.', error: error.message });
    }
};