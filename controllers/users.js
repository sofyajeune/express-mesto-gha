const Users = require('../models/user');
// const bcrypt = require('bcryptjs'); // импортируем bcrypt

exports.getUsers = (req, res) => {
  Users.find({})
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка!' }));
};

exports.getUserById = (req, res) => {
  Users.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.status(200).send({ data: user });
      } else {
        res.status(404).send({ message: 'Пользователь с указанными данными не найден!' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные пользователя!' });
      }
      return res.status(500).send({ message: 'Произошла ошибка!' });
    });
};

exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  Users.create({ name, about, avatar })
    // bcrypt.hash(req.body.password, 10)
    // .then(hash => User.create({
    //  email: req.body.email,
    //  password: hash, // записываем хеш в базу
    // }))
    // email: req.body.email,
    // password: req.body.password,
    // user - ответ сервера
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  Users.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные профиля!' });
      }
      return res.status(500).send({ message: 'Произошла ошибка!' });
    });
};

exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  Users.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные аватара!' });
      }
      return res.status(500).send({ message: 'Произошла ошибка!' });
    });
  // eslint-disable-next-line eol-last
};