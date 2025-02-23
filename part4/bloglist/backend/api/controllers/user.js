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

userRouter.get('/', async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

userRouter.post('/', validateUserData, async (req, res) => {
  const { name, username, password } = req.body;
  const passHash = await bcrypt.hash(password, 10);
  const savedUser = await new User({ name, username, passHash }).save();
  res.status(201).json(savedUser);
});

module.exports = userRouter;
