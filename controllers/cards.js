const cardSchema = require('../models/card');
const { handleError } = require('../handles/handleError');

const getCards = (req, res) => {
  cardSchema.find()
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.send({ cards });
    })
    .catch((err) => handleError(err, res));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  cardSchema.create({ name, link, owner })
    .then((card) => {
      card.populate('owner');
    })
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((err) => handleError(err, res));
};

const deleteCard = (req, res) => {
  cardSchema.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => handleError(err, res));
};

const setLike = (req, res) => {
  cardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail()
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => handleError(err, res));
};

const deleteLike = (req, res) => {
  cardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail()
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => handleError(err, res));
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  setLike,
  deleteLike,
};
