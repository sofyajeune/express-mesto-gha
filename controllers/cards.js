const Cards = require('../models/card');
const {
  OK,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require('../utils/resMessage');

// Запрос для получения карточек
exports.getCards = (req, res) => {
  Cards.find({})
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch(() => {
      res.status(500).send(INTERNAL_SERVER_ERROR.RESPONSE);
    });
};

// Запрос создания карт
exports.createCard = (req, res) => {
  // Достаем свойства из запроса
  const { name, link } = req.body;
  const owner = req.user._id;

  Cards.create({ name, link, owner })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send(BAD_REQUEST.RESPONSE);
      } else {
        res.status(500).send(INTERNAL_SERVER_ERROR.RESPONSE);
      }
    });
};

// Запрос удаления
exports.deleteCard = (req, res) => {
  Cards.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card) {
        res.status(200).send(OK.DELETE_CARD_RESPONSE);
      } else {
        res.status(404).send(NOT_FOUND.CARD_RESPONSE);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send(BAD_REQUEST.RESPONSE);
      } else {
        res.status(500).send(INTERNAL_SERVER_ERROR.RESPONSE);
      }
    });
};

exports.likeCard = (req, res) => {
  const owner = req.user._id;
  Cards.findByIdAndUpdate(
    req.params.cardId,
    owner,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет

    { new: true },
  )
    .then((card) => {
      if (card) {
        res.status(200).send(OK.LIKE_CARD_RESPONSE);
      } else {
        res.status(404).send(NOT_FOUND.CARD_RESPONSE);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send(BAD_REQUEST.RESPONSE);
      } else {
        res.status(500).send(INTERNAL_SERVER_ERROR.RESPONSE);
      }
    });
};

exports.dislikeCard = (req, res) => {
  const owner = req.user._id;
  Cards.findByIdAndUpdate(
    req.params.cardId,
    owner,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.status(200).send(OK.DISLIKE_CARD_RESPONSE);
      } else {
        res.status(404).send(NOT_FOUND.CARD_RESPONSE);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send(BAD_REQUEST.RESPONSE);
      } else {
        res.status(500).send(INTERNAL_SERVER_ERROR.RESPONSE);
      }
    });
};
