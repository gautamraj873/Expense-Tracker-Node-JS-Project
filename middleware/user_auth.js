const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Middleware to authenticate the token
exports.authenticateToken = (req, res, next) => {
  try{
    const token = req.header('Authorization');
    const user = jwt.verify(token, 'qsdcvbyjkl53ij rdszefghDFGYUJK758563');
    User.findByPk(user.userId).then(user => {
      req.user = user;
      next();
    })
  }
  catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}