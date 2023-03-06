const Cards = require('../models/card');

// Запрос для получения карточек
exports.getCards = (req, res) => {
  Cards.find({})
    .then((card) => {
      if (card) {
        res.status(200).send({ data: card });
      } else {
        res.status(400).send({ message: 'Карта не найдена!' });
      }
    })
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка!' });
    })
    .finally(() => {
      console.log(`req.body = ${req.body}, result = ${res}`);
    });
};

// Запрос создания карт
exports.createCard = (req, res) => {
  // Достаем свойства из запроса
  const owner = req.user_id;
  const { name, link } = req.body;

  Cards.create({ name, link, owner })
    .then((card) => {
      Cards.find({}).populate(['owner', 'likes']);
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err) {
        res.status(400).send(err.message);
      } else {
        res.status(500).send('Произошла ошибка!');
      }
    });
};

// Запрос удаления
exports.deleteCard = (req, res) => {
  Cards.delete({})
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err) {
        res.status(404).send({ message: 'Карта с указанным ID не найдена!' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка!' });
      }
    });
};

exports.likeCard = (res, req) => {
  // eslint-disable-next-line no-underscore-dangle
  const owner = req.user._id;

  Cards.findByIdAndUpdate(
    req.params.cardId,
    owner,
    // eslint-disable-next-line no-underscore-dangle
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет

    { new: true },
  )
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err) {
        res.status(404).send({ message: 'Переданы некорректные данные для лайка.' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

exports.dislikeCard = (res, req) => {
  // eslint-disable-next-line no-underscore-dangle
  const owner = req.user._id;

  Cards.findByIdAndUpdate(
    req.params.cardId,
    owner,
    // eslint-disable-next-line no-underscore-dangle
    { $pull: { likes: req.user._id } }, // убрать _id из массива

    { new: true },
  )
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err) {
        res.status(404).send({ message: 'Переданы некорректные данные для лайка.' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};
