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
  const id = req.user._id;
  const { name, link } = req.body;
  cardSchema.create({ name, link, owner: id })
    .then((card) => {
      res.status(http2.HTTP_STATUS_CREATED).send({ data: card });
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  cardSchema.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      const owner = card.owner.toString();
      if (req.user._id === owner) {
        card.deleteOne()
          .then(() => res.send({ message: 'Карточка удалена' }))
          .catch(next);
      } else {
        next(new ForbiddenError('Нельзя удалять карточки других пользователей'));
      }
    })
    .catch(next);
};

const setLike = (req, res, next) => {
  cardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => {
      res.status(http2.HTTP_STATUS_OK).send({ card });
    })
    .catch(next);
};

const deleteLike = (req, res, next) => {
  cardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => {
      res.status(http2.HTTP_STATUS_OK).send({ card });
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
