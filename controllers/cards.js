const Cards = require('../models/card');
// const {
//   OK,
//   BAD_REQUEST,
//   NOT_FOUND,
//   INTERNAL_SERVER_ERROR,
// } = require('../utils/resMessage');
const BadRequestError = require('../errors/BadRequestError');
const InternalServerError = require('../errors/InternalServerError');
const NotFoundError = require('../errors/NotFoundError');
const OwnerError = require('../errors/OwnerError');

// Запрос для получения карточек
exports.getCards = (req, res, next) => {
  Cards.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      if (!cards) {
        throw new NotFoundError('Фотография не найдена');
      }
      return res.send(cards);
    })
    //
    .catch((err) => {
      if (err.name === 'InternalServerError') {
        next(new InternalServerError('Ошибка на сервере'));
      } else {
        next(err);
      }
    });
};

// Запрос создания карт
exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Cards.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      } else if (err.name === 'InternalServerError') {
        next(new InternalServerError('Ошибка на сервере'));
      } else {
        next(err);
      }
    });
};

// Запрос удаления
exports.deleteCard = (req, res, next) => {
  const owner = req.user._id;
  Cards.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Фотография не найдена');
      } if (card.owner.valueOf() !== owner) {
        throw new OwnerError('Фотография не найдена');
      }
      return card.remove()
        .then(() => res.send({ data: card }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Фотография не найдена'));
      } else {
        next(err);
      }
    });
};

exports.likeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Фотография не найдена');
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для постановки лайка.'));
      } else if (err.name === 'InternalServerError') {
        next(new InternalServerError('Ошибка на сервере'));
      } else {
        next(err);
      }
    });
};

exports.dislikeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Фотография не найдена');
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для постановки лайка.'));
      } else if (err.name === 'InternalServerError') {
        next(new InternalServerError('Ошибка на сервере'));
      } else {
        next(err);
      }
    });
};

// controllers/cards.js

// module.exports.createCard = (req, res) => Card.create({
//   name: req.body.name,
//   link: req.body.link,
//   owner: req.user._id // используем req.user
// });
