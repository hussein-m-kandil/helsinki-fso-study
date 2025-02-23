const { describe, it, before, after } = require('node:test');
const api = require('supertest')(require('../app.js'));
const User = require('../models/user.js');
const assert = require('node:assert');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userMock = {
  name: 'Superman',
  username: 'superman',
  password: 'Ss@12312',
};

before(async () => {
  const { name, username, password } = userMock;
  const passHash = await bcrypt.hash(password, 10);
  await new User({ name, username, passHash }).save();
});

after(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
});

describe('POST /api/login', () => {
  it('should respond with 200 and return token on valid login data', async () => {
    const { username, password } = userMock;
    const res = await api.post('/api/login').send({ username, password });

    assert.strictEqual(res.statusCode, 200);
    assert.match(res.type, /json/);
    assert(res.body.name);
    assert(res.body.token);
    assert(res.body.username);
  });

  it('should respond with 401 on invalid login data', async () => {
    const username = 'not_a_user';
    const password = 'Xyz@293847';
    const invalidData = [
      {},
      null,
      { username },
      { password },
      { username, password },
    ];
    for (const loginData of invalidData) {
      const res = loginData
        ? await api.post('/api/login').send(loginData)
        : await api.post('/api/login');
      assert.strictEqual(res.statusCode, 401);
      assert.match(res.type, /json/);
      assert(res.body.error);
      assert(!res.body.name);
      assert(!res.body.token);
      assert(!res.body.username);
    }
  });
});
