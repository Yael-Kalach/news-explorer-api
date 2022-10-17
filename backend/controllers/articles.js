const Article = require('../models/article');

const getArticles = (req, res, next) => {
  Article.find({})
    .orFail()
    .then((articles) => res.send({ data: articles }))
    .catch((err) => next(err));
};

const createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;

  Article.create({
    keyword, title, text, date, source, link, image, owner: req.user._id,
  })
    .then((articles) => res.send({
      keyword: articles.keyword,
      title: articles.title,
      text: articles.text,
      date: articles.date,
      source: articles.source,
      link: articles.link,
      image: articles.image,
    }))
    .catch((err) => {
      next(err);
    });
};

const deleteArticle = (req, res, next) => {
  const { articleId } = req.params;
  const { owner } = req.body;

  Article.authorizeAndDelete({ articleId, reqUserId: req.user._id, ownerId: owner })
    .then((user) => res.send(user))
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getArticles,
  createArticle,
  deleteArticle,
};
