const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
  try{
    const token = req.header('Authorization');
    const user = jwt.verify(token, process.env.TOKEN);
    User.findByPk(user.userId).then(user => {
      req.user = user;
      next();
    })
  }
  catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}