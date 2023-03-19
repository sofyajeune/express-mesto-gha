/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
// Импортируем модули
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// eslint-disable-next-line import/no-unresolved
const rateLimit = require('express-rate-limit'); // Защита от DDOS, лимиты
// eslint-disable-next-line import/no-extraneous-dependencies
const helmet = require('helmet');// Защита от XSS attack
// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate, Joi } = require('celebrate');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const { avatarValidation } = require('./utils/validation');
const auth = require('./middlewares/auth');
// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();

const { JWT_SECRET = 'JWT_SECRET' } = process.env;

// Создаем приложение
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 100, // можно совершить максимум 100 запросов с одного IP
});

app.use(limiter); // Активация
app.use(helmet());

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
    avatar: Joi.string().pattern(avatarValidation),
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

// здесь обрабатываем все ошибки
app.use((err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
  next();
});

module.exports = {
  JWT_SECRET,
};

app.listen(PORT);
