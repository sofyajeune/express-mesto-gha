// Импортируем модули
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit'); // Защита от DDOS, лимиты
const helmet = require('helmet');// Защита от XSS attack
const { errors } = require('celebrate');
const handleErrors = require('./middlewares/error');
const router = require('./routes/index');
const NotFoundError = require('./errors/NotFoundError');
const auth = require('./middlewares/auth');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
// Создаем приложение
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 100, // можно совершить максимум 100 запросов с одного IP
});

app.use(limiter); // Активация
app.use(helmet());

// Подключаемся к монго по адресу (mestodb — имя базы данных, которая будет создана.)
mongoose.connect('mongodb://localhost:27017/mestodb ');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

app.all('*', auth, (req, res, next) => {
  next(new NotFoundError('Ошибка 404. Страница не найдена!'));
});
app.use(router, auth);
app.use(errors());
app.use(handleErrors);

app.listen(PORT);
