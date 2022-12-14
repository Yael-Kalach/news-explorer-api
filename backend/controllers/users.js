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
  User.findById(req.user._id)
    .orFail(() => {
      throw new ErrorHandler(404, `User not found`);
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

const signIn = (req, res, next) => {
  const { email, password } = req.body;
  debugger
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
  signIn,
};
