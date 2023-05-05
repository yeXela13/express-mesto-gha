const cardRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);
const {
  getCards, deleteCard, createCard, setLike, deleteLike,
} = require('../controllers/cards');

cardRouter.get('/cards/', getCards);

cardRouter.post('/cards/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
    owner: Joi.objectId().required(),
  }),
}), createCard);

cardRouter.delete('/cards/:cardId', celebrate({
  headers: Joi.object().keys({
  }).unknown(true),
}), deleteCard);

cardRouter.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.objectId().required(),
  }),
}), setLike);

cardRouter.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.objectId().required(),
  }),
}), deleteLike);

module.exports = cardRouter;
