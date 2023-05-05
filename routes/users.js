const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);
const {
  getUsers, getUser, updateUser, updateAvatar, getUserMyInfo,
} = require('../controllers/users');

userRouter.get('/users/', getUsers);

userRouter.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userdId: Joi.objectId().required(),
  }),
}), getUser);

userRouter.get('/users/me', getUserMyInfo);

// userRouter.post('/users/', createUser);

userRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

userRouter.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
}), updateAvatar);

module.exports = userRouter;
