// Подключаем базу данных
const mongoose = require('mongoose');
const validator = require('validator'); // Валидатор
const bcrypt = require('bcrypt');
const { validationUrl } = require('../utils/validation'); // Рег выражение для валидации аватара
const AuthorizedError = require('../errors/AuthorizedError');

// Схема для пользователя
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: validationUrl,
      message: 'Необходимо ввести корректный URL',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Необходимо ввести корректный email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false, // Защита пароля
  },
});

// Но в случае аутентификации хеш пароля нужен. Чтобы это реализовать,
// после вызова метода модели, нужно добавить вызов метода select,
// передав ему строку +password
// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthorizedError('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthorizedError('Неправильные почта или пароль'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
