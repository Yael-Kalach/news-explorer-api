const mongoose = require('mongoose');
const { ErrorHandler } = require('../utils/error');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/gim.test(v);
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/gim.test(v);
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Owner ID is required'],
    ref: "user",
  },
});

articleSchema.statics.authorizeAndDelete = function ({ articleId, reqUserId, ownerId }) {
  if (reqUserId === ownerId.toString()) {
    return this.deleteOne({ _id: articleId }).orFail(() => {
      throw new ErrorHandler(404, `No article found with ${articleId}`);
    });
  }
  return Promise.reject(new ErrorHandler(403, 'Access denied'));
};

module.exports = mongoose.model('article', articleSchema);
