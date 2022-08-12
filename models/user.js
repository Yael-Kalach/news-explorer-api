const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { ErrorHandler } = require('../utils/error');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: [true, 'This email is already used'],
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 8,
  },
  name: {
    type: String,
    required: true,
    default: 'Susie',
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new ErrorHandler(401, 'Incorrect password or email'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new ErrorHandler(401, 'Incorrect password or email'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
