const { validateAuthorization } = require('../utils/middleware.js');
const blogRouter = require('express').Router();
const Comment = require('../models/comment.js');
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

const populateBlogQuery = (query) => {
  return query
    .populate({ path: 'comments', select: ['comment'] })
    .populate({ path: 'user', select: ['name', 'username'] });
};

blogRouter.get('/', async (req, res) => {
  const blogs = await populateBlogQuery(Blog.find({}));
  res.json(blogs);
});

blogRouter.get('/:id', async (req, res) => {
  const blog = await populateBlogQuery(Blog.findById(req.params.id));
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
  const populatedBlog = await populateBlogQuery(Blog.findById(savedBlog._id));
  res.status(201).json(populatedBlog);
});

blogRouter.post('/:id/comments', validateAuthorization, async (req, res) => {
  const comment = req.body.comment;
  if (!comment) return res.status(400).json({ error: 'comment is required' });
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(400).json({ error: 'blog not found' });
  const savedComment = await new Comment({ blog: blog._id, comment }).save();
  blog.comments = blog.comments.concat(savedComment._id);
  await blog.save();
  const updatedBlog = await populateBlogQuery(Blog.findById(req.params.id));
  res.status(201).json(updatedBlog);
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
      const savedBlog = await populateBlogQuery(
        Blog.findByIdAndUpdate(id, update, options),
      );
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
