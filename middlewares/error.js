// здесь обрабатываем все ошибки
const handleErrors = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const internalMessage = 'Произошла ошибка';

  let message;
  if (statusCode === 500) {
    message = internalMessage;
  } else {
    message = err.message;
  }

  res.status(statusCode).send({ message });

  next();
};

module.exports = handleErrors;
