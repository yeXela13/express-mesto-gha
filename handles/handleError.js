const http2 = require('http2').constants;
const { DocumentNotFoundError, CastError, ValidationError } = require('mongoose').Error;

const handleError = (err, res) => {
  if (err instanceof ValidationError) {
    const message = Object.values(err.errors).map((error) => error.message).join(';');
    return res.status(http2.HTTP_STATUS_BAD_REQUEST).send({
      message: `Переданы некорректные данные при создании ${message}`,
    });
  }
  if (err instanceof DocumentNotFoundError) {
    return res.status(http2.HTTP_STATUS_NOT_FOUND).send({
      message: 'Объект с указанным _id не найден ',
    });
  }
  if (err instanceof CastError) {
    return res.status(http2.HTTP_STATUS_BAD_REQUEST).send({
      message: `Передан несуществующий _id: ${err.value}`,
    });
  }
  return res.status(http2.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
    message: `Что-то пошло не так ${err.name}: ${err.message}`,
  });
};

module.exports = {
  handleError,
};
