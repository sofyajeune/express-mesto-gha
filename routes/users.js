const usersRoutes = require('express').Router();
// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate, Joi } = require('celebrate');
const { avatarValidation } = require('../utils/validation');

const {
  getUsers, getUserById, updateAvatar, updateProfile, getUser,
} = require('../controllers/users');

// Маршрут получения юзеров
usersRoutes.get('/users', getUsers);
usersRoutes.get('/users/me', getUser);

// Маршрут получения юзера
usersRoutes.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
}), getUserById);

// Маршрут создания юзера
// usersRoutes.post('/users', createUser);

// Маршрут обновления инфы о себе
usersRoutes.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateProfile);

// Маршрут обновления своего аватара
usersRoutes.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(avatarValidation),
  }),
}), updateAvatar);

module.exports = usersRoutes;

// сначала вызовется auth, а затем,
// если авторизация успешна, createCard

// app.post('/cards', auth, createCard);
