// models/user.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long'],
        maxlength: [30, 'Username cannot exceed 30 characters'],
        validate: {
            validator: function(username) {
                // Username can only contain letters, numbers, and underscores
                return /^[a-zA-Z0-9_]+$/.test(username);
            },
            message: 'Username can only contain letters, numbers, and underscores'
        }
    },
    password: { // Password HASHED! (optional for OAuth users)
        type: String,
        required: function() {
            // Password required only for local authentication
            return !this.googleId && !this.githubId;
        },
        minlength: [6, 'Password must be at least 6 characters long']
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(email) {
                if (!email) return true;
                return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
            },
            message: 'Please enter a valid email address'
        }
    },
    // OAuth fields
    googleId: {
        type: String,
        sparse: true,
        unique: true
    },
    githubId: {
        type: String,
        sparse: true,
        unique: true
    },
    provider: {
        type: String,
        enum: ['local', 'google', 'github'],
        default: 'local'
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Note: Username index is automatically created by the 'unique: true' option above
// No need for manual index definition

module.exports = mongoose.model('User', userSchema);