const swaggerAutogen = require('swagger-autogen')(); 

const doc = {
    info: {
        title: 'Personal Record Keeper API', // Title adjusted to reflect the project
        version: '1.0.0',
        description: 'A simple Express API for managing personal records with MongoDB.',
    },
    servers: [
        {
            // Deploy URL (Render) - Must be the API base URL, not the docs path
            url: 'https://cse341finalprojectteam.onrender.com',
            description: 'Production/Remote Server (Render)',
        },
        {
            // Local development URL
            url: 'http://localhost:8080', 
            description: 'Local Development Server',
        }
    ],
    
    // ✅ CORRECTION: Add HTTPS to schemes
    schemes: ['http', 'https'], 

    tags: [
        {
            name: 'Users',
            description: 'User registration and session management (Login/Logout)'
        },
        {
            name: 'Records',
            description: 'CRUD operations for Personal Records'
        }
    ],
    // Authentication Schemes
    securityDefinitions: {
        SessionCookie: {
            type: "apiKey",
            in: "cookie",
            name: "connect.sid", // Default cookie name used by express-session
            description: "Session cookie for authentication."
        }
    },
    // Model Definitions
    definitions: {
        UserRegistration: {
            username: "testuser",
            password: "password123"
        },
        UserUpdate: {
            username: "newusername",
            password: "newpassword123"
        },
        UserResponse: {
            _id: "60a7d5b1234567890abcdef",
            username: "testuser",
            createdAt: "2023-01-15T10:30:00Z",
            updatedAt: "2023-01-15T10:30:00Z"
        },
        // Complete definition of the Record Object (for GET responses)
        Record: {
            _id: "60a7d5b1234567890abcefd0",
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            phone: "555-123-4567",
            birthday: "1985-05-15",
            address: {
                street: "123 Main St",
                city: "Anytown", 
                state: "CA",
                zipCode: "12345",
                country: "USA"
            },
            notes: "Important client contact",
            ownerId: "60a7d5b1234567890abcdef",
            createdAt: "2023-01-15T10:30:00Z",
            updatedAt: "2023-01-15T10:30:00Z"
        },
        // Definition of the Object for Update/Creation (POST/PUT Request Body)
        RecordUpdate: {
            firstName: "Jane",
            lastName: "Smith",
            email: "jane.smith@example.com",
            phone: "555-987-6543",
            birthday: "1995-10-20",
            address: {
                street: "456 Oak Ave",
                city: "Somewhere",
                state: "NY", 
                zipCode: "67890",
                country: "USA"
            },
            notes: "Updated contact information"
        },
        Error: {
            message: "Error description"
        }
    }
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js']; 

// Generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);