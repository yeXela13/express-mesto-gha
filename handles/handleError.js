const { DocumentNotFoundError, CastError, ValidationError } = require('mongoose').Error;

const handleError = (err, res) => {
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
