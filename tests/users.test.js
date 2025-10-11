// tests/users.test.js
describe('Users GET Endpoints - Unit Tests', () => {
    // Test 1: Verify GET /user endpoint exists (without server)
    test('GET /user endpoint should be defined in routes', () => {
        const fs = require('fs');
        const userRoutes = fs.readFileSync('./routes/users.js', 'utf8');
        
        expect(userRoutes).toContain("router.get('/'");
        expect(userRoutes).toContain('getAllUsers');
    });

    // Test 2: Verify GET /user/:id endpoint exists
    test('GET /user/:id endpoint should be defined in routes', () => {
        const fs = require('fs');
        const userRoutes = fs.readFileSync('./routes/users.js', 'utf8');
        
        expect(userRoutes).toContain("router.get('/:id'");
        expect(userRoutes).toContain('getSingleUser');
    });

    // Test 3: Verify authentication middleware is applied
    test('GET routes should have authentication middleware', () => {
        const fs = require('fs');
        const userRoutes = fs.readFileSync('./routes/users.js', 'utf8');
        
        expect(userRoutes).toContain('isAuthenticated');
    });

    // Test 4: Verify users controller exists
    test('Users controller should exist and export functions', () => {
        const usersController = require('../controllers/users');
        
        expect(usersController).toHaveProperty('getAllUsers');
        expect(usersController).toHaveProperty('getSingleUser');
        expect(typeof usersController.getAllUsers).toBe('function');
        expect(typeof usersController.getSingleUser).toBe('function');
    });
});