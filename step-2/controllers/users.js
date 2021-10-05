const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const InternalServerError = require('../errors/InternalServerError');
const BadRequest = require('../errors/BadRequest');
const ConflictError = require('../errors/ConflictError');

const { JWT_SECRET = 'secret-key' } = process.env;

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .orFail(new NotFoundError('Пользователи не найдены'))
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => {
      if (err) next(err);
      else next(new InternalServerError('Ошибка сервера'));
    });
};
module.exports.getUserByID = (req, res, next) => {
  User.findById(req.params._id)
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new BadRequest('Переданы некоректные данные'));
      else if (err.name === 'NotFoundError') next(err);
      else next(new InternalServerError('Ошибка сервера'));
    });
};
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
      .then((user) => res.status(200).send({
        data: {
          _id: user._id,
          email: user.email,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
        },
      }))
      .catch((err) => {
        if (err.name === 'ValidationError') next(new BadRequest('Переданы некорректные данные'));
        else if (err.name === 'MongoError') next(new ConflictError('Пользователь с таким email уже зарегестрирован'));
        else next(new InternalServerError('Ошибка сервера'));
      }));
};
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') next(new BadRequest('Переданы некорректные данные'));
      else next(new InternalServerError('Ошибка сервера'));
    });
};
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') next(new BadRequest('Переданы некорректные данные'));
      else next(new InternalServerError('Ошибка сервера'));
    });
};
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUsersEmailAndPass(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' }),
      });
    })
    .catch((err) => {
      if (err) next(err);
      else next(new InternalServerError('Ошибка сервера'));
    });
};
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') next(new BadRequest('Переданы некоректные данные'));
      else if (err.name === 'NotFoundError') next(err);
      else next(new InternalServerError('Ошибка сервера'));
    });
};
