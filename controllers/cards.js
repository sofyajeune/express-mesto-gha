const Cards = require('../models/card');

// Запрос для получения карточек
exports.getCards = (req, res) => {
  Cards.find({})
    .then((card) => {
      res.status(200).send({ data: card });
      res.status(400).send({ message: 'Карта не найдена!' });
    })
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка!' });
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
        res.status(400).send({ message: 'Данные некорректны!' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка!' });
      }
    });
};

// Запрос удаления
exports.deleteCard = (req, res) => {
  Cards.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card) {
        res.status(200).send({ message: 'Карта удалена' });
      } else {
        res.status(404).send({ message: 'Карта не найдена' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Данные некорректны!' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка!' });
      }
    });
};

exports.likeCard = (res, req) => {
  const owner = req.user._id;
  Cards.findByIdAndUpdate(
    req.params.cardId,
    owner,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет

    { new: true },
  )
    .then((card) => {
      if (card) {
        res.status(200).send({ message: 'Лайк есть!' });
      } else {
        res.status(404).send({ message: 'Данные некорректны!' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Данные введены некорректно' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка!' });
      }
    });
};

exports.dislikeCard = (res, req) => {
  const owner = req.user._id;
  Cards.findByIdAndUpdate(
    req.params.cardId,
    owner,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.status(200).send({ message: 'Лайк удалён!' });
      } else {
        res.status(404).send({ message: 'Карта не найдена' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Данные введены некорректно' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка!' });
      }
    });
};
