// tests/records.test.js
describe('Records GET Endpoints - Unit Tests', () => {
    // Test 1: Verify GET /record endpoint exists in routes
    test('GET /record endpoint should be defined in routes', () => {
        const fs = require('fs');
        const recordRoutes = fs.readFileSync('./routes/records.js', 'utf8');
        
        expect(recordRoutes).toContain("router.get('/'");
        expect(recordRoutes).toContain('getAllRecords');
    });

    // Test 2: Verify GET /record/:id endpoint exists
    test('GET /record/:id endpoint should be defined in routes', () => {
        const fs = require('fs');
        const recordRoutes = fs.readFileSync('./routes/records.js', 'utf8');
        
        expect(recordRoutes).toContain("router.get('/:id'");
        expect(recordRoutes).toContain('getSingleRecord');
    });

    // Test 3: Verify authentication middleware is applied
    test('GET routes should have authentication middleware', () => {
        const fs = require('fs');
        const recordRoutes = fs.readFileSync('./routes/records.js', 'utf8');
        
        expect(recordRoutes).toContain('isAuthenticated');
    });

    // Test 4: Verify records controller exists
    test('Records controller should exist and export functions', () => {
        const recordsController = require('../controllers/records');
        
        expect(recordsController).toHaveProperty('getAllRecords');
        expect(recordsController).toHaveProperty('getSingleRecord');
        expect(typeof recordsController.getAllRecords).toBe('function');
        expect(typeof recordsController.getSingleRecord).toBe('function');
    });
});