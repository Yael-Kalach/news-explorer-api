const Article = require('../models/article');
const { ErrorHandler } = require('../utils/error');

const getArticles = (req, res, next) => {
  const owner = req.user._id;
  Article.find({ owner })
    .orFail()
    .then((articles) => res.send({ data: articles }))
    .catch((err) => next(err));
};

const createArticle = (req, res, next) => {
  console.log('in create article')
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
      _id: articles._id
    }))
    .catch((err) => {
      console.log('error saving article:', err)
      console.log(err.stack);
      next(err);
    });
};

const deleteArticle = (req, res, next) => {
  Article.findById(req.params.articleId).select('+owner')
    .then((article) => {
      if (!article) {
        throw new ErrorHandler(404, "Article not found");
      }
      if (article.owner.toString() !== req.user._id) {
        throw new ErrorHandler(403, "Forbidden");
      }
      return Article.findOneAndDelete({ _id: req.params.articleId });
    })
    .then((deleteArticle) => {
      res.send({ data: deleteArticle });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

module.exports = {
  getArticles,
  createArticle,
  deleteArticle,
};
