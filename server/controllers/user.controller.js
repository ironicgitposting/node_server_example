const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');

exports.createUser = async (req, res, next) => {
  const {
    email,
    password,
  } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = new User({
    email,
    password: hash,
  });
  try {
    const result = await user.save();
    return res.status(201).json({
      message: 'User Created',
      result,
    });
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
};

exports.loginUser = async (req, res, next) => {
  let fetchedUser;
  User.findOne({
    email: req.body.email,
  }).then((user) => {
    if (!user) {
      return res.status(401).json({
        message: 'Auth Failure.',
      });
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, fetchedUser.password);
  }).then((result) => {
    if (!result) {
      return res.status(401).json({
        message: 'Auth Failure.',
      });
    }
    const token = jwt.sign({
      email: fetchedUser.email,
      userId: fetchedUser._id,
    }, 'my_secret_password', {
      expiresIn: '1h',
    });
    return res.status(200).json({
      token,
      expiresIn: 3600,
    });
  }).catch((err) => res.status(401).json({
    message: 'Auth Failure.',
    error: err,
  }));
};
