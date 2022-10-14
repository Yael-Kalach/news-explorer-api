const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { ErrorHandler } = require('../utils/error');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUsers = (req, res, next) => {
  User.find({})
    .orFail((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'User not found' });
      } else {
        res.status(500).send({ message: 'An error has occurred on the server' });
      }
    })
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      next(err);
    });
};

const getUserById = (req, res, next) => {
  const userId = req.params.userId ? req.params.userId : req.user._id;
  User.findById(userId)
    .orFail(() => {
      throw new ErrorHandler(404, `No user found with ID ${userId}`);
    })
    .then((user) => res.send(user))
    .catch((err) => {
      next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((finalData) => {
      const dataCopyNoPass = finalData;
      dataCopyNoPass.password = '';
      res.send({ dataCopyNoPass });
    })
    .catch((err) => {
      if (err.name === 'MongoServerError') {
        res.status(409).send({ message: 'Email already in use!' });
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  login,
};
