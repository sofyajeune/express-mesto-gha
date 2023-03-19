/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
// Импортируем модули
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate, Joi } = require('celebrate');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();

const { JWT_SECRET = 'JWT_SECRET' } = process.env;

// Создаем приложение
const app = express();

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

// Подключаемся к монго по адресу (mestodb — имя базы данных, которая будет создана.)
mongoose.connect('mongodb://localhost:27017/mestodb ');
// Роуты для логина и регистрации
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), login);

// Марштуризация
app.use('/', auth, usersRoutes);
app.use('/', auth, cardsRoutes);
app.use(
  (req, res) => {
    res.status(404).send({ message: 'Страница не найдена' });
  },
);

module.exports = {
  JWT_SECRET,
};

app.listen(PORT);
