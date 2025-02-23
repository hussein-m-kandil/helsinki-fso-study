const blogRouter = require('express').Router();
const Blog = require('../models/blog.js');

const validateBlog = (req, res, next) => {
  const blog = req.body;
  if (!blog.title) res.status(400).json({ error: 'missing a title' });
  else if (!blog.url) res.status(400).json({ error: 'missing a url' });
  else {
    if (!blog.likes) blog.likes = 0;
    next();
  }
};

blogRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs);
});

blogRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (blog) res.json(blog);
  else res.status(404).end();
});

blogRouter.post('/', validateBlog, async (req, res) => {
  const result = await new Blog(req.body).save();
  res.status(201).json(result);
});

blogRouter.put('/:id', validateBlog, async (req, res) => {
  const blog = req.body;
  const id = req.params.id;
  const options = { new: true };
  const updatedBlog = await Blog.findByIdAndUpdate(id, blog, options);
  if (updatedBlog) res.json(updatedBlog);
  else res.status(404).end();
});

blogRouter.delete('/:id', async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

module.exports = blogRouter;
