const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { validationUrl, validationId } = require('../utils/validation');

const {
  getUsers, getUserById, updateAvatar, updateProfile, getUser,
} = require('../controllers/users');

// Маршрут получения юзеров
router.get('/users', getUsers);
router.get('/users/me', getUser);

// Маршрут получения юзера
router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().pattern(validationId),
  }),
}), getUserById);

// Маршрут создания юзера
// router.post('/users', createUser);

// Маршрут обновления инфы о себе
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateProfile);

// Маршрут обновления своего аватара
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(validationUrl),
  }),
}), updateAvatar);

module.exports = router;
