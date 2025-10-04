// models/record.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recordSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
        type: String,
        trim: true,
        maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(email) {
                // Basic email validation (allow empty)
                if (!email) return true;
                return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
            },
            message: 'Please enter a valid email address'
        }
    },
    phone: {
        type: String,
        trim: true,
        validate: {
            validator: function(phone) {
                // Allow empty or valid phone patterns
                if (!phone) return true;
                return /^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-\(\)]/g, ''));
            },
            message: 'Please enter a valid phone number'
        }
    },
    birthday: {
        type: Date,
        validate: {
            validator: function(date) {
                // Allow empty or past dates only
                if (!date) return true;
                return date < new Date();
            },
            message: 'Birthday must be a date in the past'
        }
    },
    address: {
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        zipCode: { type: String, trim: true },
        country: { type: String, trim: true }
    },
    notes: {
        type: String,
        maxlength: [500, 'Notes cannot exceed 500 characters']
    },
    // ownerId: Links the record to the authenticated user (Authorization)
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Index for better query performance
recordSchema.index({ ownerId: 1, firstName: 1, lastName: 1 });

module.exports = mongoose.model('Record', recordSchema);