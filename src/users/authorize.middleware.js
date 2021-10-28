const jwt = require('jsonwebtoken');
const { Unauthorized } = require('http-errors');
const User = require('./users.model');

exports.authorize = async function authorize(req, res, next) {
  try {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
      throw new Unauthorized();
    }

    const token = authHeader.replace('Bearer ', '');

    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(userId);
    if (!user) {
      throw new Unauthorized();
    }

    if (user.token !== token) {
      await User.findByIdAndUpdate(userId, { token: null });
      throw new Unauthorized();
    }

    req.user = user;
    req.token = token;

    next();
  } catch (err) {
    next(new Unauthorized());
  }
};
