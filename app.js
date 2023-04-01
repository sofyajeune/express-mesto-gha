// Импортируем модули
const express = require('express');
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const cors = require('cors');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit'); // Защита от DDOS, лимиты
const helmet = require('helmet');// Защита от XSS attack
const { errors } = require('celebrate');
const handleErrors = require('./middlewares/error');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
// Создаем приложение
const app = express();

app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 100, // можно совершить максимум 100 запросов с одного IP
});

app.use(limiter); // Активация
app.use(helmet());

// Подключаемся к монго по адресу (mestodb — имя базы данных, которая будет создана.)
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(errorLogger);
app.use(router);
app.use(errors());
app.use(handleErrors);

app.listen(PORT);
