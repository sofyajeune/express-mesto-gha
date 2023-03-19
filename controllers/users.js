const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// eslint-disable-next-line import/no-unresolved, import/extensions
const { JWT_SECRET } = require('../app');
const Users = require('../models/user');
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require('../utils/resMessage');

exports.getUsers = (req, res) => {
  Users.find({})
    .then((user) => res.send(user))
    .catch(() => res.status(500).send(INTERNAL_SERVER_ERROR.RESPONSE));
};

exports.getUserById = (req, res) => {
  Users.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.status(200).send({ data: user });
      } else {
        res.status(404).send(NOT_FOUND.USER_RESPONSE);
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

exports.createUser = (req, res) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => Users.create({
      email, password: hash, name, about, avatar,
    }))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send(BAD_REQUEST.RESPONSE);
      } else {
        res.status(500).send(INTERNAL_SERVER_ERROR.RESPONSE);
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return Users.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.status(200).send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};
// При неправильных почте и пароле контроллер должен вернуть ошибку 401

exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  Users.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send(BAD_REQUEST.RESPONSE);
      } else {
        res.status(500).send(INTERNAL_SERVER_ERROR.RESPONSE);
      }
    });
};

exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  Users.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true, upsert: true },
  )
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send(BAD_REQUEST.RESPONSE);
      } else {
        res.status(500).send(INTERNAL_SERVER_ERROR.RESPONSE);
      }
    });
};
