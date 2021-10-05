const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const InternalServerError = require('../errors/InternalServerError');
const BadRequest = require('../errors/BadRequest');
const Forbidden = require('../errors/Forbidden');

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .orFail(new NotFoundError('Карточки не найдены'))
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => {
      if (err) next(err);
      else next(new InternalServerError('Ошибка сервера'));
    });
};
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') next(new BadRequest(`${err.message}`));
      else next(new InternalServerError('Ошибка сервера'));
    });
};
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params._id)
    .orFail(new NotFoundError('Карточка с указанным id не найдена'))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        next(new Forbidden('Нельзя удалять чужие карточки'));
      } else {
        Card.findByIdAndDelete(req.params._id)
          .then(() => {
            res.status(200).send(card);
          });
      }
    })
    .catch((err) => {
      if (err) next(err);
      else next(new InternalServerError('Ошибка сервера'));
    });
};
module.exports.putLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('Карточка с указанным _id не найдена'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') next(new BadRequest('Переданы некоректные данные'));
      else if (err.name === 'NotFoundError') next(new NotFoundError(err.message));
      else next(new InternalServerError('Ошибка сервера'));
    });
};
module.exports.deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('Карточка с указанным _id не найдена'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') next(new BadRequest('Переданы некоректные данные'));
      else if (err.name === 'NotFoundError') next(new NotFoundError(err.message));
      else next(new InternalServerError('Ошибка сервера'));
    });
};
