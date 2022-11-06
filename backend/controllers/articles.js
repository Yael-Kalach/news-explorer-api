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
  Article.findOne({ _id: req.params.articleId })
    .then((article) => {
      if (!article) {
        throw new NotFoundError("Article not found");
      }
      if (!article.owner.equals(req.user._id)) {
        throw new ForbiddenError("Forbidden");
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
