const http2 = require('http2').constants;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = require('../models/user');
const NotFoundError = require('../handles/NotFoundError');

const getUsers = (req, res, next) => {
  userSchema.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUserMyInfo = (req, res, next) => {
  const id = req.user._id;
  userSchema.findById(id)
    .orFail(() => {
      throw new NotFoundError('Такого пользователя не существует');
    })
    .then((user) => res.status(http2.HTTP_STATUS_OK).send({ user }))
    .catch(next);
};

const getUser = (req, res, next) => {
  const id = req.params.userId;
  userSchema.findById(id)
    .orFail(() => {
      throw new NotFoundError('Такого пользователя не существует');
    })
    .then((user) => res.status(http2.HTTP_STATUS_OK).send({ user }))
    .catch(next);
};

const createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await userSchema.create({
    name,
    about,
    avatar,
    email,
    password: hash,
  })
    .then((user) => {
      res.status(http2.HTTP_STATUS_CREATED).send({
        name: user.name, about: user.about, avatar: user.avatar, email: user.email, _id: user._id,
      });
    })
    .catch(next);
};

const updateInfo = (req, res, updateData, next) => {
  const id = req.user._id;
  userSchema.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send({ user }))
    .catch(next);
};

const updateUser = (req, res, next) => {
  const userData = req.body;
  updateInfo(req, res, userData, next);
};

const updateAvatar = (req, res, next) => {
  const updatedAvatar = req.body;
  updateInfo(req, res, updatedAvatar, next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return userSchema.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .then((matched) => {
      if (!matched) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      res.send({ message: 'Всё верно!' });
      return next();
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUser,
  getUserMyInfo,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
