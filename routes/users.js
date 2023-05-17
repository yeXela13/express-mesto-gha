const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);
const {
  getUsers, getUser, updateUser, updateAvatar, getUserMyInfo,
} = require('../controllers/users');
const { urlRegExp } = require('../utils/regex');

userRouter.get('/users/', getUsers);

userRouter.get('/users/me', getUserMyInfo);

userRouter.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.objectId().required(),
  }),
}), getUser);

userRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

userRouter.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(urlRegExp),
  }),
}), updateAvatar);

module.exports = userRouter;
