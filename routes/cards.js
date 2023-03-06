// Подключение роутов
const cardRoutes = require('express').Router();

// Импорт запросов API
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
// eslint-disable-next-line import/no-unresolved
} = require('../controllers/cards');

// Маршрут получения карт
cardRoutes.get('/cards', getCards);

// Маршрут создания
cardRoutes.post('/cards', createCard);

// Маршрут удаления
cardRoutes.delete('/cards/:cardId', deleteCard);

// Маршрут лайка
cardRoutes.put('/cards/:cardId/likes', likeCard);

// Маршрут антилайка
cardRoutes.delete('/cards/:cardId/likes', dislikeCard);

module.exports = cardRoutes;
