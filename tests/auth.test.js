process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongo;
let app;

beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    // require app after DB env is ready
    app = require('../src/app');
}, 20000);

afterAll(async () => {
    await mongoose.disconnect();
    if (mongo) await mongo.stop();
});

afterEach(async () => {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName];
        await collection.deleteMany();
    }
});

test('register -> login -> getMe flow', async () => {
    const userData = {
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        age: 25,
        email: 'test@example.com',
        password: 'secret123',
    };

    const resReg = await request(app).post('/api/users').send(userData).expect(201);
    expect(resReg.body.success).toBe(true);
    expect(resReg.body.token).toBeTruthy();

    const resLogin = await request(app)
        .post('/api/auth/login')
        .send({ identifier: 'testuser', password: 'secret123' })
        .expect(200);

    expect(resLogin.body.token).toBeTruthy();

    const token = resLogin.body.token;

    const resMe = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

    expect(resMe.body.data.email).toBe('test@example.com');
});

test('invalid token returns 401', async () => {
    const res = await request(app)
        .get('/api/users/me')
        .set('Authorization', 'Bearer invalid.token')
        .expect(401);
    expect(res.body.success).toBe(false);
});
