const { SECRET } = require('../utils/config.js');
const loginRouter = require('express').Router();
const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

loginRouter.post('/', async (req, res) => {
  const handleInvalidLogin = () => {
    return res.status(401).json({ error: 'invalid username or password' });
  };

  const { username, password } = req.body;

  if (!username || !password) return handleInvalidLogin();

  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.passHash))) {
    return handleInvalidLogin();
  }

  const loginPayload = { username: user.username, name: user.name };
  const tokenPayload = { ...loginPayload, id: user.id };
  loginPayload.token = jwt.sign(tokenPayload, SECRET, { expiresIn: 60 * 60 });

  res.json(loginPayload);
});

module.exports = loginRouter;
