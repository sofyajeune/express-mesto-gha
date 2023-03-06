// Подключаем базу данных
const mongoose = require('mongoose');

// Схема для пользователя
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Sofya',
  },
  about: {
    type: String,
    required: true,
    menlength: 2,
    maxlength: 30,
    default: 'WebDev Beginner',
  },
  avatar: {
    type: String,
    required: true,
    default: ' ',
  },
});

module.exports = mongoose.model('user', userSchema);
