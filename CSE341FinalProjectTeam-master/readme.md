# Personal Record Keeper API - CSE341 Final Project

A comprehensive Node.js Express API for managing personal records with user authentication, built with MongoDB and comprehensive API documentation.

## 🚀 Features

### Two Complete Collections with CRUD Operations
1. **Users Collection** - Complete user management with authentication
   - POST `/user/register` - User registration
   - POST `/user/login` - User login with session management  
   - GET `/user/logout` - User logout
   - GET `/user` - Get all users (authenticated)
   - GET `/user/{id}` - Get single user by ID
   - PUT `/user/{id}` - Update user profile (own profile only)
   - DELETE `/user/{id}` - Delete user account (own account only)

2. **Records Collection** - Personal records management
   - POST `/record` - Create new personal record
   - GET `/record` - Get all records (with search functionality)
   - GET `/record/{id}` - Get single record by ID
   - PUT `/record/{id}` - Update existing record
   - DELETE `/record/{id}` - Delete record

### 🔐 Security Features
- Password hashing with bcrypt
- Session-based authentication
- User authorization (users can only access their own data)
- Input validation and sanitization
- CORS configuration for production deployment

### 📚 API Documentation
- Complete Swagger/OpenAPI documentation
- Available at `/api-docs` route
- Interactive testing interface
- Comprehensive error response documentation

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database (local or cloud)

### Installation Steps

1. **Clone and navigate to the project:**
   ```bash
   cd CSE341FinalProjectTeam-master
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   - Copy `.env.example` to `.env`
   - Update the environment variables with your values:
     ```
     MONGODB_URI=your-mongodb-connection-string
     SESSION_SECRET=your-secret-key
     NODE_ENV=development
     PORT=8080
     ```

4. **Generate Swagger Documentation:**
   ```bash
   npm run swagger
   ```

5. **Start the server:**
   ```bash
   # Development (with auto-restart)
   npm run dev
   
   # Production
   npm start
   ```

## 📖 API Usage

### Authentication Flow
1. Register: `POST /user/register`
2. Login: `POST /user/login` 
3. Use authenticated endpoints with session cookie
4. Logout: `GET /user/logout`

### Testing the API
- **Swagger UI**: Visit `http://localhost:8080/api-docs` for interactive testing
- **Postman/Thunder Client**: Import the OpenAPI spec from `/swagger.json`

## 🌐 Deployment
- Configured for Render deployment
- Production URL: `https://cse341finalprojectteam.onrender.com`
- Documentation: `https://cse341finalprojectteam.onrender.com/api-docs`

## 🔧 Development Scripts

```bash
npm start        # Start production server
npm run dev      # Start development server with nodemon
npm run swagger  # Regenerate Swagger documentation
```

## 📋 Project Requirements Completed

✅ **Two collections with full CRUD operations**  
✅ **Comprehensive error handling and validation**  
✅ **Published Swagger API documentation at `/api-docs`**  
✅ **Deployed to Render with working documentation**  
✅ **Session-based authentication and authorization**  
✅ **Input validation and data sanitization**  
✅ **Professional API structure and best practices**