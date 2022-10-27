const router = require('express').Router();
// const { celebrate } = require('celebrate');
const {
  getUsers,
  getUserById,
} = require('../controllers/users');
const {auth} = require('../middlewares/auth')
// const {
//   getCurrentUserSchema,
// } = require('../utils/validators');

router.get('/', getUsers);
router.get('/me', auth, getUserById);
// router.get('/:userId', celebrate(getCurrentUserSchema), getUserById);

module.exports = router;
