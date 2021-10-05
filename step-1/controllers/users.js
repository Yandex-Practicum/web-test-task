const User = require('../models/users');

const ERROR_UNCORECT_DATA = 400;
const ERROR_USER_NOT_FOUND = 404;
const ERROR_DEFAULT = 500;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(() => res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка' }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .orFail(new Error('NotValidId'))
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.message === 'NotValidId') return res.status(ERROR_USER_NOT_FOUND).send({ message: 'Такого пользователя нет в базе' });
      if (err.name === 'CastError') return res.status(ERROR_UNCORECT_DATA).send({ message: 'Такого пользователя несуществует, проверьте ID пользователя' });
      return res.status(ERROR_DEFAULT).send({ message: 'Что-то пошло не так :( Попробуйте еще раз' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  console.log(req.body);
  User.create({ name, about, avatar })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(ERROR_UNCORECT_DATA).send({ message: 'Данные для создания пользователя введены с ошибкой, пожалуйста, проверьте поля и значения' });
      return res.status(ERROR_DEFAULT).send({ message: 'Что-то пошло не так :( Попробуйте еще раз' });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  console.log(req.user._id);
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .orFail(new Error('NotValidId'))
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.message === 'NotValidId') return res.status(ERROR_USER_NOT_FOUND).send({ message: 'Такой карточки нет в базе' });
      if (err.name === 'ValidationError') return res.status(ERROR_UNCORECT_DATA).send({ message: 'Данные для обновления вашего профиля введены с ошибкой, пожалуйста, проверьте поля и значения' });
      if (err.name === 'CastError') return res.status(ERROR_UNCORECT_DATA).send({ message: 'Такого пользователя несуществует, проверьте ID пользователя' });
      return res.status(ERROR_DEFAULT).send({ message: 'Что-то пошло не так :( Попробуйте еще раз' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .orFail(new Error('NotValidId'))
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.message === 'NotValidId') return res.status(ERROR_USER_NOT_FOUND).send({ message: 'Такой карточки нет в базе' });
      if (err.name === 'ValidationError') return res.status(ERROR_UNCORECT_DATA).send({ message: 'Данные для обновления вашего аватара профиля введены с ошибкой, пожалуйста, проверьте поле и значение' });
      if (err.name === 'CastError') return res.status(ERROR_UNCORECT_DATA).send({ message: 'Такого пользователя несуществует, проверьте ID пользователя' });
      return res.status(ERROR_DEFAULT).send({ message: 'Что-то пошло не так :( Попробуйте еще раз' });
    });
};
