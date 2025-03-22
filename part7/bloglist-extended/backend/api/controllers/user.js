const userRouter = require('express').Router();
const User = require('../models/user.js');
const bcrypt = require('bcryptjs');

const validateUserData = (req, res, next) => {
  const nameFields = [
    ['username', req.body.username],
    ['password', req.body.password],
    ['name', req.body.name],
  ];
  for (const [field, value] of nameFields) {
    if (!value) return res.status(400).json({ error: `${field} is required` });
    if (value.length < 3) {
      return res.status(400).json({ error: `${field} is too short` });
    }
  }
  next();
};

const populateUserQuery = (query) => {
  return query.populate({
    path: 'blogs',
    select: ['author', 'title', 'likes', 'url'],
  });
};

userRouter.get('/', async (req, res) => {
  const users = await populateUserQuery(User.find({}));
  res.json(users);
});

userRouter.get('/:id', async (req, res) => {
  const user = await populateUserQuery(User.findById(req.params.id));
  if (!user) res.status(404).end();
  else res.json(user);
});

userRouter.post('/', validateUserData, async (req, res) => {
  const { name, username, password } = req.body;
  const passHash = await bcrypt.hash(password, 10);
  const savedUser = await new User({ name, username, passHash }).save();
  res.status(201).json(savedUser);
});

module.exports = userRouter;
