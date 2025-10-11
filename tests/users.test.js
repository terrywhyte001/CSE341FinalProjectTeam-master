// tests/users.test.js
const request = require('supertest');
const app = require('../server'); // You'll need to export app from server.js
const User = require('../models/user');

describe('Users GET Endpoints', () => {
    let testUser;
    let authCookie;

    beforeAll(async () => {
        // Create a test user for authentication
        testUser = new User({
            username: 'testuser123',
            password: 'hashedpassword', // In real tests, hash this
            provider: 'local'
        });
        await testUser.save();
    });

    afterAll(async () => {
        // Clean up test data
        await User.findByIdAndDelete(testUser._id);
    });

    // Test 1: GET /user - Get all users (authenticated)
    test('GET /user should return all users when authenticated', async () => {
        // First login to get session
        const loginResponse = await request(app)
            .post('/user/login')
            .send({
                username: 'testuser123',
                password: 'testpassword'
            });

        const response = await request(app)
            .get('/user')
            .set('Cookie', loginResponse.headers['set-cookie'])
            .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    // Test 2: GET /user/:id - Get single user
    test('GET /user/:id should return a specific user when authenticated', async () => {
        const loginResponse = await request(app)
            .post('/user/login')
            .send({
                username: 'testuser123',
                password: 'testpassword'
            });

        const response = await request(app)
            .get(`/user/${testUser._id}`)
            .set('Cookie', loginResponse.headers['set-cookie'])
            .expect(200);

        expect(response.body.username).toBe('testuser123');
        expect(response.body.password).toBeUndefined(); // Password should be excluded
    });

    // Test 3: GET /user without authentication should return 401
    test('GET /user should return 401 when not authenticated', async () => {
        const response = await request(app)
            .get('/user')
            .expect(401);

        expect(response.body.message).toContain('Access denied');
    });

    // Test 4: GET /user/:id with invalid ID should return 400
    test('GET /user/:id should return 400 for invalid ID format', async () => {
        const loginResponse = await request(app)
            .post('/user/login')
            .send({
                username: 'testuser123',
                password: 'testpassword'
            });

        const response = await request(app)
            .get('/user/invalid-id')
            .set('Cookie', loginResponse.headers['set-cookie'])
            .expect(400);

        expect(response.body.message).toContain('Invalid');
    });
});