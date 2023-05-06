const http2 = require('http2').constants;
const {
  DocumentNotFoundError, CastError, ValidationError,
} = require('mongoose').Error;
const { ForbiddenError } = require('./ForbiddenError');
const { UnauthorizedError } = require('./UnauthorizedError');
const { NotFoundError } = require('./NotFoundError');

const handleError = (err, res) => {
  if (err.code === 11000) {
    return res
      .status(409).send({ message: 'Пользователь уже существует' });
  }
  if (err instanceof UnauthorizedError) {
    const message = err;
    return res.status(401).send({ message });
  }
  if (err instanceof ForbiddenError) {
    const message = err;
    return res.status(403).send({ message });
  }
  if (err instanceof NotFoundError) {
    const message = err;
    return res.status(404).send({ message });
  }
  if (err instanceof ValidationError) {
    const message = Object.values(err.errors).map((error) => error.message).join(';');
    return res.status(400).send({
      message: `Переданы некорректные данные при создании ${message}`,
    });
  }
  if (err instanceof DocumentNotFoundError) {
    return res.status(404).send({
      message: 'Объект с указанным _id не найден ',
    });
  }
  if (err instanceof CastError) {
    return res.status(400).send({
      message: `Передан несуществующий _id: ${err.value}`,
    });
  }
  return res.status(500).send({
    message: `Что-то пошло не так ${err.name}: ${err.message}`,
  });
};

module.exports = {
  handleError,
};
