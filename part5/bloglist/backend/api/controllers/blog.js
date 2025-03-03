const { validateAuthorization } = require('../utils/middleware.js');
const blogRouter = require('express').Router();
const Blog = require('../models/blog.js');
const User = require('../models/user.js');

const validateBlog = (req, res, next) => {
  const { author, likes, title, url } = req.body;
  if (!title) res.status(400).json({ error: 'missing a title' });
  else if (!url) res.status(400).json({ error: 'missing a url' });
  else {
    req.blog = { likes: likes || 0, author, title, url };
    next();
  }
};

blogRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { name: 1, username: 1 });
  res.json(blogs);
});

blogRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('user', {
    name: 1,
    username: 1,
  });
  if (blog) res.json(blog);
  else res.status(404).end();
});

blogRouter.post('/', validateAuthorization, validateBlog, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(401).end();
  req.blog.user = user._id;
  const savedBlog = await new Blog(req.blog).save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  const populatedBlog = await Blog.findById(savedBlog._id).populate('user', {
    name: 1,
    username: 1,
  });
  res.status(201).json(populatedBlog);
});

blogRouter.put(
  '/:id',
  validateAuthorization,
  validateBlog,
  async (req, res) => {
    const id = req.params.id;
    const { blog } = req;
    const dbBlog = await Blog.findById(id);
    if (dbBlog) {
      const ownerUpdate = String(dbBlog.user) === req.user.id;
      const update = ownerUpdate ? blog : { likes: blog.likes };
      const options = { new: true };
      const savedBlog = await Blog.findByIdAndUpdate(
        id,
        update,
        options,
      ).populate('user', { name: 1, username: 1 });
      res.json(savedBlog);
    } else res.status(404).end();
  },
);

blogRouter.delete('/:id', validateAuthorization, async (req, res) => {
  const dbBlog = await Blog.findById(req.params.id);
  if (dbBlog) {
    if (String(dbBlog.user) !== req.user.id) return res.status(401).end();
    await Blog.findByIdAndDelete(dbBlog._id);
  }
  res.status(204).end();
});

module.exports = blogRouter;
