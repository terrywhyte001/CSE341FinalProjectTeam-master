// tests/records.test.js
const request = require('supertest');
const app = require('../server');
const User = require('../models/user');
const Record = require('../models/record');

describe('Records GET Endpoints', () => {
    let testUser;
    let testRecord;
    let authCookie;

    beforeAll(async () => {
        // Create test user
        testUser = new User({
            username: 'recordtestuser',
            password: 'hashedpassword',
            provider: 'local'
        });
        await testUser.save();

        // Create test record
        testRecord = new Record({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@test.com',
            ownerId: testUser._id
        });
        await testRecord.save();
    });

    afterAll(async () => {
        // Clean up test data
        await Record.findByIdAndDelete(testRecord._id);
        await User.findByIdAndDelete(testUser._id);
    });

    // Test 1: GET /record - Get all records for authenticated user
    test('GET /record should return user records when authenticated', async () => {
        const loginResponse = await request(app)
            .post('/user/login')
            .send({
                username: 'recordtestuser',
                password: 'testpassword'
            });

        const response = await request(app)
            .get('/record')
            .set('Cookie', loginResponse.headers['set-cookie'])
            .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThanOrEqual(1);
        expect(response.body[0].ownerId).toBe(testUser._id.toString());
    });

    // Test 2: GET /record/:id - Get specific record
    test('GET /record/:id should return specific record when authenticated', async () => {
        const loginResponse = await request(app)
            .post('/user/login')
            .send({
                username: 'recordtestuser',
                password: 'testpassword'
            });

        const response = await request(app)
            .get(`/record/${testRecord._id}`)
            .set('Cookie', loginResponse.headers['set-cookie'])
            .expect(200);

        expect(response.body.firstName).toBe('John');
        expect(response.body.lastName).toBe('Doe');
        expect(response.body.ownerId).toBe(testUser._id.toString());
    });

    // Test 3: GET /record with search query
    test('GET /record with search should filter results', async () => {
        const loginResponse = await request(app)
            .post('/user/login')
            .send({
                username: 'recordtestuser',
                password: 'testpassword'
            });

        const response = await request(app)
            .get('/record?search=John')
            .set('Cookie', loginResponse.headers['set-cookie'])
            .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        if (response.body.length > 0) {
            expect(response.body[0].firstName.toLowerCase()).toContain('john');
        }
    });

    // Test 4: GET /record without authentication should return 401
    test('GET /record should return 401 when not authenticated', async () => {
        const response = await request(app)
            .get('/record')
            .expect(401);

        expect(response.body.message).toContain('Access denied');
    });
});