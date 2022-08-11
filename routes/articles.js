const router = require('express').Router();
const { celebrate } = require('celebrate');
const {
  getArticles,
  createArticle,
  deleteArticle,
} = require('../controllers/articles');
const {
  getCreateArticlesSchema,
  getDeleteArticlesSchema,
} = require('../utils/validators');

router.get('/', getArticles);
router.post('/', celebrate(getCreateArticlesSchema), createArticle);
router.delete('/:articleId', celebrate(getDeleteArticlesSchema), deleteArticle);

module.exports = router;
