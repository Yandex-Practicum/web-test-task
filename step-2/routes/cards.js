const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const { urlValidation } = require('../middlewares/validation');
const {
  createCard,
  deleteCard,
  getAllCards,
  putLike,
  deleteLike,
} = require('../controllers/cards');

router.get('/', getAllCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(urlValidation),
  }),
}), createCard);
router.delete('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex().required().length(24),
  }),
}), deleteCard);
router.put('/:_id/likes', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().hex().length(24),
  }),
}), putLike);
router.delete('/:_id/likes', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().hex().length(24),
  }),
}), deleteLike);

module.exports = router;
