const resMessage = {
  OK: { // 200
    RESPONSE: { message: 'Запрос успешно выполнен' },
    DELETE_CARD_RESPONSE: { message: 'Фотография удалена' },
    LIKE_CARD_RESPONSE: { message: 'Лайк добавлен' },
    DISLIKE_CARD_RESPONSE: { message: 'Лайк удален' },
  },
  BAD_REQUEST: { // 400
    RESPONSE: { message: 'Переданы некорретные данные' },
  },
  NOT_FOUND: { // 404
    USER_RESPONSE: { message: 'Пользователь с таким именем не существует' },
    CARD_RESPONSE: { message: 'Фотография не найдена' },
  },
  INTERNAL_SERVER_ERROR: { // 500
    RESPONSE: { message: 'Произошла ошибка' },
  },
};

module.exports = resMessage;
