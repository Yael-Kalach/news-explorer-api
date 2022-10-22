const Article = require('../models/article');

const getArticles = (req, res, next) => {
  Article.find({})
    .orFail()
    .then((articles) => res.send({ data: articles }))
    .catch((err) => next(err));
};

const createArticle = (req, res, next) => {
  console.log('in create article')
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  console.log(`req.user._id:`, req.user._id)
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
      console.log('error saving article:', err)
      console.log(err.stack);
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
