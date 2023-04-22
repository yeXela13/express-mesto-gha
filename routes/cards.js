const cardRouter = require('express').Router()
const { getCards, deleteCard, createCard, setLike, deleteLike } = require('../controllers/cards')

cardRouter.get('/cards/', getCards);

cardRouter.post('/cards/', createCard)

cardRouter.delete('/cards/:cardId', deleteCard);

cardRouter.put('/cards/:cardId/likes', setLike);

cardRouter.delete('/cards/:cardId/likes', deleteLike);


module.exports = cardRouter;