// Подключение роутов
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { validationUrl, validationId } = require('../utils/validation');

// Импорт запросов API
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

// Маршрут получения карт
router.get('/cards', getCards);

// Маршрут создания
router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().pattern(validationUrl),
  }),
}), createCard);

// Маршрут удаления
router.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().pattern(validationId),
  }),
}), deleteCard);

// Маршрут лайка
router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().pattern(validationId),
  }),
}), likeCard);

// Маршрут дизлайка
router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().pattern(validationId),
  }),
}), dislikeCard);

module.exports = router;
