const { describe, it, before, after, afterEach } = require('node:test');
const User = require('../models/user.js');
const Blog = require('../models/blog.js');
const supertest = require('supertest');
const assert = require('node:assert');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const app = require('../app.js');

const api = supertest.agent(app);

const userMock = {
  name: 'Superman',
  username: 'superman',
  password: 'Ss@12312',
};

const fakeToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ8.' +
  'eyJ1c2VybmFtZSI6InN1cGVybWFuIiwibmFtZSI6IlN1cGVybWFuIiwiaWQiOiI' +
  '2N2MxZjQwODM5MTkwY2EwMGY3OThiYjAiLCJpYXQiOjE3NDA3NjQxNjl8' +
  '.kTaQB-DMNs0bZQOYPvHqRYyM8jJ0xXdzzcWvFoMBBaQ';

const blogsMock = [
  { title: 'Kryptons', author: 'Superman', url: 'universe.com', likes: 7 },
  { title: 'Darks', author: 'Batman', url: 'gotham.com', likes: 3 },
];

const readAllBlogsFromDB = async () => {
  return (await Blog.find({}).populate('user', { name: 1, username: 1 })).map(
    (blog) => blog.toJSON({ flattenObjectIds: true }),
  );
};

const populateDBWithBlogs = async () => {
  await Blog.deleteMany({});
  const { _id: userId } = (await User.find({}))[0];
  for (const blog of blogsMock) {
    await new Blog({ ...blog, user: userId }).save();
  }
};

before(async () => {
  const { name, username, password } = userMock;
  const passHash = await bcrypt.hash(password, 10);
  await new User({ name, username, passHash }).save();
  const loginRes = await api.post('/api/login').send({ username, password });
  api.set('Authorization', `Bearer ${loginRes.body.token}`);
});

afterEach(async () => await Blog.deleteMany({}));

after(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
});

describe('GET /api/blogs', () => {
  it('should respond with JSON data', async () => {
    await populateDBWithBlogs();
    await api.get('/api/blogs').expect(200).expect('Content-Type', /json/);
  });

  it('should return all blogs', async () => {
    await populateDBWithBlogs();
    const res = await api.get('/api/blogs');
    assert(Array.isArray(res.body));
    assert.strictEqual(res.body.length, blogsMock.length);
    assert.deepStrictEqual(
      res.body.map(({ author, title, likes, url }) => {
        return { author, title, likes, url };
      }),
      blogsMock,
    );
  });

  it('should all blogs not have an "_id" nor "__v" and have "id"', async () => {
    await populateDBWithBlogs();
    const res = await api.get('/api/blogs');
    for (const { id, _id, __v } of res.body) {
      assert(id);
      assert(!__v);
      assert(!_id);
    }
  });

  it('should all blogs has the user data with ONLY the id, name, and username', async () => {
    await populateDBWithBlogs();
    const res = await api.get('/api/blogs');
    for (const { user } of res.body) {
      assert(user.id);
      assert.strictEqual(Object.keys(user).length, 3);
      assert.strictEqual(user.name, userMock.name);
      assert.strictEqual(user.username, userMock.username);
    }
  });
});

describe('GET /api/blogs/:id', () => {
  it('should respond with 200 and the requested blog', async () => {
    await populateDBWithBlogs();
    const expectedBlog = (await readAllBlogsFromDB())[0];
    const res = await api.get(`/api/blogs/${expectedBlog.id}`);
    const actualBlog = res.body;
    assert.match(res.type, /json/);
    assert.strictEqual(res.statusCode, 200);
    assert.deepStrictEqual(actualBlog, expectedBlog);
  });

  it('should respond with 404 if the id is not exist', async () => {
    const notExistBlogId = (await new Blog().save()).id;
    await Blog.findByIdAndDelete(notExistBlogId);
    await api.get(`/api/blogs/${notExistBlogId}`).expect(404);
  });
});

describe('POST /api/blogs', () => {
  it('should respond with 401 on a request without a valid access token', async () => {
    const blog = { title: 'Spies', author: 'Spy', url: 'spy.com', likes: 0 };
    const unauthorizedApi = supertest(app);
    await unauthorizedApi.post('/api/blogs').send(blog).expect(401);
    await unauthorizedApi
      .post('/api/blogs')
      .set('Authorization', `Bearer ${fakeToken}`)
      .send(blog)
      .expect(401);
  });

  it('should the new blog saved in the blog list', async () => {
    const dbBlogsBefore = await readAllBlogsFromDB();
    const blog = { title: 'Spies', author: 'Spy', url: 'spy.com', likes: 0 };
    await api
      .post('/api/blogs')
      .send(blog)
      .expect(201)
      .expect('Content-Type', /json/);
    const dbBlogsAfter = await readAllBlogsFromDB();
    const newBlog = dbBlogsAfter.at(-1);
    assert.strictEqual(dbBlogsAfter.length, dbBlogsBefore.length + 1);
    for (const prop of Object.keys(blog)) {
      assert.strictEqual(newBlog[prop], blog[prop]);
    }
  });

  it('should default to 0 likes if not given', async () => {
    const dbBlogsBefore = await readAllBlogsFromDB();
    const newBlog = { title: 'Threads', author: 'Spider', url: 'threads.com' };
    await api.post('/api/blogs').send(newBlog);
    const dbBlogsAfter = await readAllBlogsFromDB();
    assert.strictEqual(dbBlogsAfter.length, dbBlogsBefore.length + 1);
    assert.strictEqual(dbBlogsAfter.at(-1).url, newBlog.url);
    assert.strictEqual(dbBlogsAfter.at(-1).likes, 0);
  });

  it('should respond with 400 if missing "title" or "url"', async () => {
    const blogs = [
      { author: 'Spider', title: 'threads', likes: 3 },
      { author: 'Spider', url: 'spi.com', likes: 3 },
    ];
    for (const blog of blogs) {
      await api
        .post('/api/blogs')
        .send(blog)
        .expect(400)
        .expect('Content-Type', /json/);
    }
  });

  it('should add user id to the blog & add blog id to the user', async () => {
    const blog = { title: 'Spies', author: 'Spy', url: 'spy.com', likes: 0 };
    await api.post('/api/blogs').send(blog);
    const { id: blogId, user } = (await readAllBlogsFromDB()).at(-1);
    assert(user.id);
    const dbUser = await User.findById(user.id);
    assert.strictEqual(String(dbUser.blogs.at(-1)), String(blogId));
  });
});

describe('PUT /api/blogs/:id', () => {
  it('should respond with 401 on a request without a valid access token', async () => {
    const LIKES = 17;
    await populateDBWithBlogs();
    const dbBlogsBefore = await readAllBlogsFromDB();
    const updatedBlog = { ...dbBlogsBefore[0] };
    updatedBlog.likes = LIKES;
    const unauthorizedApi = supertest(app);
    await unauthorizedApi
      .put(`/api/blogs/${updatedBlog.id}`)
      .send(updatedBlog)
      .expect(401);
    await unauthorizedApi
      .put(`/api/blogs/${updatedBlog.id}`)
      .send(updatedBlog)
      .set('Authorization', `Bearer ${fakeToken}`)
      .expect(401);
    const dbBlogsAfter = await readAllBlogsFromDB();
    assert.strictEqual(dbBlogsAfter.length, dbBlogsBefore.length);
    assert.deepStrictEqual(dbBlogsAfter[0], dbBlogsBefore[0]);
  });

  it('should respond with 401 if the token for a user other than the blog user', async () => {
    const LIKES = 17;
    await populateDBWithBlogs();
    const dbBlogsBefore = await readAllBlogsFromDB();
    const updatedBlog = { ...dbBlogsBefore[0] };
    updatedBlog.likes = LIKES;
    const [name, username, password] = ['Update', 'update', 'Uu@12312'];
    const passHash = await bcrypt.hash(password, 10);
    await new User({ name, username, passHash }).save();
    const loginRes = await api.post('/api/login').send({ username, password });
    const secondUserApi = supertest(app);
    await secondUserApi
      .put(`/api/blogs/${updatedBlog.id}`)
      .set('Authorization', `Bearer ${loginRes.body.token}`)
      .send(updatedBlog)
      .expect(401);
    const dbBlogsAfter = await readAllBlogsFromDB();
    assert.strictEqual(dbBlogsAfter.length, dbBlogsBefore.length);
    assert.deepStrictEqual(dbBlogsAfter[0], dbBlogsBefore[0]);
  });

  it('should update the blog', async () => {
    await populateDBWithBlogs();
    const dbBlogsBefore = await readAllBlogsFromDB();
    const LIKES = 17;
    const updatedBlog = { ...dbBlogsBefore[0] };
    updatedBlog.likes = LIKES;
    await api
      .put(`/api/blogs/${updatedBlog.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /json/);
    const dbBlogsAfter = await readAllBlogsFromDB();
    assert.strictEqual(dbBlogsAfter.length, dbBlogsBefore.length);
    assert.deepStrictEqual(dbBlogsAfter[0], updatedBlog);
  });

  it('should default to 0 likes if not given', async () => {
    await populateDBWithBlogs();
    const dbBlogsBefore = await readAllBlogsFromDB();
    const updatedBlog = { ...dbBlogsBefore[0] };
    delete updatedBlog.likes;
    await api.put(`/api/blogs/${updatedBlog.id}`).send(updatedBlog);
    const dbBlogsAfter = await readAllBlogsFromDB();
    assert.strictEqual(dbBlogsAfter.length, dbBlogsBefore.length);
    updatedBlog.likes = 0;
    assert.deepStrictEqual(dbBlogsAfter[0], updatedBlog);
  });

  it('should respond with 400 if missing "title" or "url"', async () => {
    await populateDBWithBlogs();
    const blog = await readAllBlogsFromDB();
    const propsToDelete = ['title', 'url'];
    for (const prop of propsToDelete) {
      const updatedBlog = { ...blog };
      delete updatedBlog[prop];
      await api
        .put(`/api/blogs/${updatedBlog.id}`)
        .send(updatedBlog)
        .expect(400)
        .expect('Content-Type', /json/);
    }
  });

  it('should respond with 404 if the id is not exist', async () => {
    const notExistBlogId = (await new Blog().save()).id;
    await Blog.findByIdAndDelete(notExistBlogId);
    await api
      .put(`/api/blogs/${notExistBlogId}`)
      .send(blogsMock[0])
      .expect(404);
  });
});

describe('DELETE /api/blogs/:id', () => {
  it('should respond with 401 on a request without a valid access token', async () => {
    await populateDBWithBlogs();
    const dbBlogsBefore = await readAllBlogsFromDB();
    const unauthorizedApi = supertest(app);
    await unauthorizedApi
      .delete(`/api/blogs/${dbBlogsBefore[0].id}`)
      .expect(401);
    await unauthorizedApi
      .delete(`/api/blogs/${dbBlogsBefore[0].id}`)
      .set('Authorization', `Bearer ${fakeToken}`)
      .expect(401);
    const dbBlogsAfter = await readAllBlogsFromDB();
    assert(dbBlogsAfter.length === dbBlogsBefore.length);
  });

  it('should respond with 401 if the token for a user other than the blog user', async () => {
    await populateDBWithBlogs();
    const dbBlogsBefore = await readAllBlogsFromDB();
    const [name, username, password] = ['Delete', 'delete', 'Dd@12312'];
    const passHash = await bcrypt.hash(password, 10);
    const savedUser = await new User({ name, username, passHash }).save();
    const loginRes = await api.post('/api/login').send({ username, password });
    const secondUserApi = supertest(app);
    await secondUserApi
      .delete(`/api/blogs/${dbBlogsBefore[0].id}`)
      .set('Authorization', `Bearer ${loginRes.body.token}`)
      .expect(401);
    await User.findByIdAndDelete(savedUser._id);
    const dbBlogsAfter = await readAllBlogsFromDB();
    assert(dbBlogsAfter.length === dbBlogsBefore.length);
  });

  it('should delete a blog and respond with 204', async () => {
    await populateDBWithBlogs();
    const dbBlogsBefore = await readAllBlogsFromDB();
    await api.delete(`/api/blogs/${dbBlogsBefore[0].id}`).expect(204);
    const dbBlogsAfter = await readAllBlogsFromDB();
    assert.strictEqual(dbBlogsAfter.length, dbBlogsBefore.length - 1);
    assert(dbBlogsAfter.every((b) => b.id !== dbBlogsBefore[0].id));
  });

  it('should not delete anything and respond with 204 if the id not exist', async () => {
    const dbBlogsBefore = await readAllBlogsFromDB();
    const notExistBlogId = (await new Blog().save()).id;
    await Blog.findByIdAndDelete(notExistBlogId);
    await api.delete(`/api/blogs/${notExistBlogId}`).expect(204);
    const dbBlogsAfter = await readAllBlogsFromDB();
    assert(dbBlogsAfter.length === dbBlogsBefore.length);
  });
});
