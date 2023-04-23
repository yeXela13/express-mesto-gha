const cardSchema = require('../models/card');

const getCards = (req, res) => {
  cardSchema.find()
    .populate(['owner', 'likes'])
    .then((card) => {
      res.status({ card });
    })
    .catch((e) => {
      if (e.message === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так' });
      }
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  cardSchema.create({ name, link, owner })
    .then((card) => card.populate('owner'))
    .then((card) => {
      res.status(201).send({ card });
    }).catch((e) => {
      if (e.message === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так' });
      }
    });
};

const deleteCard = (req, res) => {
  cardSchema.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new Error('не найдено');
    })
    .then((card) => {
      res.status(200).send({ card });
    })
    .catch((e) => {
      if (e.name === 'не найдено') {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
      } else {
        res.status(500).send({ message: 'что-то пошло не так' });
      }
    });
};

const setLike = (req, res) => {
  cardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      throw new Error('не найдено');
    })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((e) => {
      if (e.message === 'не найдено') {
        res.status(404).send({ error: 'Передан несуществующий _id карточки' });
      } else {
        res.status(500).send({ message: 'что-то пошло не так' });
      }
    });
};

const deleteLike = (req, res) => {
  cardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => {
      throw new Error('не найдено');
    })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((e) => {
      if (e.message === 'не найдено') {
        res.status(404).send({ error: 'Передан несуществующий _id карточки' });
      } else {
        res.status(500).send({ message: 'что-то пошло не так' });
      }
    });
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  setLike,
  deleteLike,
};
