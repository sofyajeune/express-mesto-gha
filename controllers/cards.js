const Cards = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const OwnerError = require('../errors/OwnerError');

// Запрос для получения карточек
exports.getCards = (req, res, next) => {
  Cards.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => next(err));
};

// Запрос создания карт
exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Cards.create({ name, link, owner })
    .then((card) => card.populate('owner'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

// Запрос удаления, попробовала с orfail
exports.deleteCard = (req, res, next) => {
  Cards.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('Фотография не найдена');
    })
    .then((card) => {
      const owner = card.owner.toString();
      if (req.user._id === owner) {
        Cards.deleteOne(card)
          .then(() => {
            res.send(card);
          })
          .catch(next);
      } else {
        throw new OwnerError('Вы не можете удалить чужую карточку');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Некорректный id'));
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
    .orFail(() => {
      throw new NotFoundError('Фотография не найдена');
    })
    .then((card) => card.populate('likes', 'owner'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для постановки лайка.'));
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
    .orFail(() => {
      throw new NotFoundError('Фотография не найдена');
    })
    .then((card) => card.populate('likes', 'owner'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для постановки лайка.'));
      } else {
        next(err);
      }
    });
};
