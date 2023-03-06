const usersRoutes = require('express').Router();

const {
  getUsers, getUserById, createUser, updateAvatar, updateProfile,
} = require('../controllers/users');

// Маршрут получения юзеров
usersRoutes.get('/users', getUsers);

// Маршрут получения юзера
usersRoutes.get('/users/:userId', getUserById);

// Маршрут создания юзера
usersRoutes.post('/users', createUser);

// Маршрут обновления инфы о себе
usersRoutes.patch('/users/me', updateProfile);

// Маршрут обновления своего аватара
usersRoutes.patch('/users/me/avatar', updateAvatar);

module.exports = usersRoutes;
