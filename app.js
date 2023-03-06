// Импортируем модули
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');

// Создаем приложение
const app = express();

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

app.get('/', (req, res) => {
  res.send('Приложение работает!');
  // eslint-disable-next-line no-console
  console.log('Получен запрос get');
});

// Подключаемся к монго по адресу (mestodb — имя базы данных, которая будет создана.)
mongoose.connect('mongodb://localhost:27017/mestodb ');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

// // Добавляем в каждый запрос объект user с полем _id
// app.use((req, res, next) => {
//   req.user = {
//     _id: '64048c79c770c9c1ec4a4819',
//   };

//   next();
// });

// вставьте сюда _id созданного в предыдущем пункте пользователя

// Марштуризация
app.use('/', usersRoutes);
app.use('/', cardsRoutes);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
