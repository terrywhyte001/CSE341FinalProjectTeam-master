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
    password: { // Password HASHED!
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Note: Username index is automatically created by the 'unique: true' option above
// No need for manual index definition

module.exports = mongoose.model('User', userSchema);