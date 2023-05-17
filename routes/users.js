const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);
const {
  getUsers, getUser, updateUser, updateAvatar, getUserMyInfo,
} = require('../controllers/users');
const { urlRegExp } = require('../utils/regex');

userRouter.get('/', getUsers);

userRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.objectId().required(),
  }),
}), getUser);

userRouter.get('/me', getUserMyInfo);

userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(urlRegExp),
  }),
}), updateAvatar);

module.exports = userRouter;
