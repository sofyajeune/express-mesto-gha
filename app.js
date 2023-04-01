// Импортируем модули
const express = require('express');
const mongoose = require('mongoose');
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

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 100, // можно совершить максимум 100 запросов с одного IP
});

app.use(limiter); // Активация
app.use(helmet());

// Подключаемся к монго по адресу (mestodb — имя базы данных, которая будет создана.)
mongoose.set('strictQuery', true);
mongoose
  .connect('mongodb://0.0.0.0:27017/mestodb')
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Database connected.');
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
  });

app.use(cors());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(errorLogger);
app.use(router);
app.use(errors());
app.use(handleErrors);

app.listen(PORT);
