const http2 = require('http2').constants;
const cardSchema = require('../models/card');
const ForbiddenError = require('../handles/ForbiddenError');

const getCards = (req, res, next) => {
  cardSchema.find()
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.status(http2.HTTP_STATUS_OK).send({ cards });
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  cardSchema.create({ name, link, owner })
    .then((card) => {
      card.populate('owner');
    })
    .then((card) => {
      res.status(http2.HTTP_STATUS_CREATED).send({ data: card });
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  cardSchema.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      cardSchema.deleteOne({ _id: card._id, owner: req.user._id })
        .then((result) => {
          if (result.deletedCount === 0) {
            throw new ForbiddenError('невозможно удалить не свою карточку');
          } else {
            res.status(http2.HTTP_STATUS_OK).send({ data: card });
          }
        })
        .catch(next);
    });
};

const setLike = (req, res, next) => {
  cardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail()
    .then((card) => {
      res.status(http2.HTTP_STATUS_OK).send({ data: card });
    })
    .catch(next);
};

const deleteLike = (req, res, next) => {
  cardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail()
    .then((card) => {
      res.status(http2.HTTP_STATUS_OK).send({ data: card });
    })
    .catch(next);
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  setLike,
  deleteLike,
};
