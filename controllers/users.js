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
  const { name, about, avatar } = req.body;

  Users.create({ name, about, avatar })
    // user - ответ сервера
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
