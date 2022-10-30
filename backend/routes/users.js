const router = require('express').Router();
// const { celebrate } = require('celebrate');
const {
  getUserById,
} = require('../controllers/users');
// const {
//   getCurrentUserSchema,
// } = require('../utils/validators');

router.get('/me', getUserById);
// router.get('/', getUsers);
// router.get('/:userId', celebrate(getCurrentUserSchema), getUserById);

module.exports = router;
