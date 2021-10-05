const Card = require('../models/cards');

const ERROR_UNCORECT_DATA = 400;
const ERROR_CARD_NOT_FOUND = 404;
const ERROR_DEFAULT = 500;

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(ERROR_UNCORECT_DATA).send({ message: 'Данные для создания карточки места введены с ошибкой, пожалуйста, проверьте поля и значения' });
      return res.status(ERROR_DEFAULT).send({ message: 'Что-то пошло не так :( Попробуйте еще раз' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new Error('NotValidId'))
    .then(() => res.send({ message: 'Карточка удалена' }))
    .catch((err) => {
      if (err.message === 'NotValidId') return res.status(ERROR_CARD_NOT_FOUND).send({ message: 'Такой карточки нет в базе' });
      if (err.name === 'CastError') return res.status(ERROR_UNCORECT_DATA).send({ message: 'Вы пытаетесь удалить несуществующую карточку' });
      return res.status(ERROR_DEFAULT).send({ message: 'Что-то пошло не так :( Попробуйте еще раз' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'NotValidId') return res.status(ERROR_CARD_NOT_FOUND).send({ message: 'Такой карточки нет в базе' });
      if (err.name === 'ValidationError') return res.status(ERROR_UNCORECT_DATA).send({ message: 'Данные для проставления лайка некорректные, пожалуйста, проверьте запрос и попробуйте снова' });
      if (err.name === 'CastError') return res.status(ERROR_UNCORECT_DATA).send({ message: 'Такой карточки не существет' });
      return res.status(ERROR_DEFAULT).send({ message: 'Что-то пошло не так :( Попробуйте еще раз' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'NotValidId') return res.status(ERROR_CARD_NOT_FOUND).send({ message: 'Такой карточки нет в базе' });
      if (err.name === 'ValidationError') return res.status(ERROR_UNCORECT_DATA).send({ message: 'Данные для удаления лайка некорректные, пожалуйста, проверьте запрос и попробуйте снова' });
      if (err.name === 'CastError') return res.status(ERROR_UNCORECT_DATA).send({ message: 'Такой карточки не существет' });
      return res.status(ERROR_DEFAULT).send({ message: 'Что-то пошло не так :( Попробуйте еще раз' });
    });
};
