const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

const auth = async (req, res, next) => {
  console.log(req);
  try {
    const token = req.cookies.token;
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findOne({
      _id: decoded.id,
      email: decoded.email,
    });
    if (!user) {
      return res.status(401).json({
        message: 'Token is expired',
      });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

module.exports = auth;
