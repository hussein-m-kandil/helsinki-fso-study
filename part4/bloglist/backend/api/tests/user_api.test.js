const { describe, it, beforeEach, after } = require('node:test');
const api = require('supertest')(require('../app.js'));
const User = require('../models/user.js');
const Blog = require('../models/blog.js');
const assert = require('node:assert');
const mongoose = require('mongoose');

const readAllUsersFromDB = async () => {
  return (await User.find({})).map((u) => u.toJSON());
};

beforeEach(async () => await User.deleteMany({}));

after(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
});

describe('GET /api/users', () => {
  it('should respond with a list of all users in the database', async () => {
    const usersData = [
      { name: 'Superman', username: 'superman', passHash: '$seco$seco' },
      { name: 'Batman', username: 'batman', passHash: '$salto$seco' },
    ];
    for (const ud of usersData) await new User(ud).save();
    const res = await api.get('/api/users');
    assert.match(res.type, /json/);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(Array.isArray(res.body), true);
    assert.strictEqual(res.body.length, usersData.length);
    for (let i = 0; i < res.body.length; i++) {
      const { username, blogs, name } = res.body[i];
      assert(Array.isArray(blogs));
      assert.strictEqual(blogs.length, 0);
      assert.strictEqual(name, usersData[i].name);
      assert.strictEqual(username, usersData[i].username);
    }
  });

  it('should return blogs data as part of the user data', async () => {
    const testUsers = [
      { name: 'Superman', username: 'superman', passHash: '$seco$seco' },
      { name: 'Batman', username: 'batman', passHash: '$salto$seco' },
    ];
    const testBlogs = [
      { title: 'Kryptons', author: 'Superman', url: 'universe.com', likes: 7 },
      { title: 'Darks', author: 'Batman', url: 'gotham.com', likes: 3 },
    ];
    for (const tu of testUsers) {
      const savedUser = await new User(tu).save();
      for (const tb of testBlogs) {
        const savedBlog = await new Blog({ ...tb, user: savedUser._id }).save();
        savedUser.blogs = [...savedUser.blogs, savedBlog._id];
        await savedUser.save();
      }
    }
    const users = (await api.get('/api/users')).body;
    for (const { blogs } of users) {
      assert(Array.isArray(blogs));
      assert.strictEqual(blogs.length, testBlogs.length);
      for (let i = 0; i < blogs.length; i++) {
        const userBlog = blogs[i];
        delete userBlog.id;
        assert.deepStrictEqual(userBlog, testBlogs[i]);
      }
    }
  });
});

describe('GET /api/users/:id', () => {
  it('should respond with a list of all users in the database', async () => {
    const savedUser = await new User({
      name: 'Superman',
      username: 'superman',
      passHash: '$seco$seco',
    }).save();
    const res = await api.get(`/api/users/${savedUser._id}`);
    assert.match(res.type, /json/);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.blogs.length, 0);
    assert.strictEqual(res.body.name, savedUser.name);
    assert.strictEqual(res.body.username, savedUser.username);
  });

  it('should respond with 404 if the given id is not exist', async () => {
    const { _id: id } = await new User({
      name: 'Superman',
      username: 'superman',
      passHash: '$seco$seco',
    }).save();
    await User.findByIdAndDelete(id);
    await api.get(`/api/users/${id}`).expect(404);
  });

  it('should respond with 400 if the given id is invalid', async () => {
    const res = await api.get('/api/users/1');
    assert.match(res.type, /json/);
    assert.strictEqual(res.statusCode, 400);
    assert.match(res.body.error, /malformed.+id/);
  });

  it('should return blogs data as part of the user data', async () => {
    const testBlogs = [
      { title: 'Kryptons', author: 'Superman', url: 'universe.com', likes: 7 },
      { title: 'Darks', author: 'Batman', url: 'gotham.com', likes: 3 },
    ];
    const savedUser = await new User({
      name: 'Superman',
      username: 'superman',
      passHash: '$seco$seco',
    }).save();
    for (const tb of testBlogs) {
      const savedBlog = await new Blog({ ...tb, user: savedUser._id }).save();
      savedUser.blogs = [...savedUser.blogs, savedBlog._id];
      await savedUser.save();
    }
    const { blogs } = (await api.get(`/api/users/${savedUser._id}`)).body;
    for (let i = 0; i < blogs.length; i++) {
      delete blogs[i].id;
      assert.deepStrictEqual(blogs[i], testBlogs[i]);
    }
  });
});

describe('POST /api/users', () => {
  it('should create users with distinct usernames and respond with {id, name, username, blogs}', async () => {
    const usersData = [
      { name: 'Superman', username: 'superman', password: 'Ss@12312' },
      { name: 'Batman', username: 'batman', password: 'Bb@12312' },
    ];
    for (const newUserData of usersData) {
      const dbUsersBefore = await readAllUsersFromDB();
      const res = await api.post('/api/users').send(newUserData);
      const dbUsersAfter = await readAllUsersFromDB();
      const { id, blogs } = res.body;
      delete newUserData.password;
      delete res.body.blogs;
      delete res.body.id;
      assert(Array.isArray(blogs));
      assert(typeof id === 'string');
      assert.match(res.type, /json/);
      assert.strictEqual(res.statusCode, 201);
      assert.deepStrictEqual(res.body, newUserData);
      assert.strictEqual(dbUsersAfter.length, dbUsersBefore.length + 1);
      assert.strictEqual(dbUsersAfter.at(-1).username, newUserData.username);
    }
  });

  it('should not create a user if `username` already exist', async () => {
    const userData = {
      name: 'Superman',
      username: 'superman',
      password: 'Ss@12312',
    };
    const dbUsersBefore = await readAllUsersFromDB();
    await api
      .post('/api/users')
      .send(userData)
      .expect(201)
      .expect('Content-Type', /json/);
    const dbUsersAfterFirst = await readAllUsersFromDB();
    assert.strictEqual(dbUsersAfterFirst.length, dbUsersBefore.length + 1);
    assert.strictEqual(dbUsersAfterFirst.at(-1).username, userData.username);
    const res = await api.post('/api/users').send(userData);
    const dbUsersAfterSecond = await readAllUsersFromDB();
    assert.match(res.type, /json/);
    assert.strictEqual(res.statusCode, 400);
    assert.match(res.body.error, /username.+exist/);
    assert.strictEqual(dbUsersAfterSecond.length, dbUsersAfterFirst.length);
  });

  it('should not create a user if not given a `username`, `password` or `name`', async () => {
    const fieldsData = [
      ['username', { name: 'Superman', username: '', password: 'Ss@12312' }],
      ['password', { name: 'Superman', username: 'superman', password: '' }],
      ['name', { name: '', username: 'superman', password: 'Ss@12312' }],
    ];
    for (const [field, data] of fieldsData) {
      const dbUsersBefore = await readAllUsersFromDB();
      const res = await api.post('/api/users').send(data);
      const dbUsersAfterSecond = await readAllUsersFromDB();
      assert.match(res.type, /json/);
      assert.strictEqual(res.statusCode, 400);
      assert.match(res.body.error, new RegExp(`${field}.+required`, 'i'));
      assert.strictEqual(dbUsersAfterSecond.length, dbUsersBefore.length);
    }
  });

  it('should not create a user if `username`, `password` or `name` less than 3 character', async () => {
    const fieldsData = [
      ['username', { name: 'Superman', username: 'su', password: 'Ss@12312' }],
      ['password', { name: 'Superman', username: 'superman', password: 'Ss' }],
      ['name', { name: 'Su', username: 'superman', password: 'Ss@12312' }],
    ];
    for (const [field, data] of fieldsData) {
      const dbUsersBefore = await readAllUsersFromDB();
      const res = await api.post('/api/users').send(data);
      const dbUsersAfterSecond = await readAllUsersFromDB();
      assert.match(res.type, /json/);
      assert.strictEqual(res.statusCode, 400);
      assert.match(res.body.error, new RegExp(`${field}.+short`, 'i'));
      assert.strictEqual(dbUsersAfterSecond.length, dbUsersBefore.length);
    }
  });
});
