const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const { avatarValidation } = require('../middlewares/validation');
const {
  getAllUsers,
  getUserByID,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/me', getCurrentUser);
router.get('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex().required().length(24),
  }),
}), getUserByID);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2),
  }),
}), updateUser);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(avatarValidation),
  }),
}), updateAvatar);

module.exports = router;
