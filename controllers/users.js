const http2 = require('http2').constants;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = require('../models/user');
// const { handleError } = require('../handles/handleError');

const getUsers = (req, res, next) => {
  userSchema.find()
    .then((user) => {
      res.status(http2.HTTP_STATUS_OK).send({ user });
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  userSchema.findById(req.params.userId)
    .orFail()
    .then((user) => res.status(http2.HTTP_STATUS_OK).send(user))
    .catch(next);
};

const getUserMyInfo = (req, res, next) => {
  userSchema.findById(req.params.userId)
    .orFail()
    .then((user) => res.status(http2.HTTP_STATUS_OK).send(user))
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  const hash = bcrypt.hash(password, 10);
  userSchema.create({
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
  // if (err.name === 'ValidationError') {
  //   const message = Object.values(err.errors).map((error) => error.message).join(';');
  //   res.status(http2.HTTP_STATUS_BAD_REQUEST).send({ message });
  // } else {
  //   res.status(http2.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Что-то пошло не так' });
  // }
  // });
};

const updateUser = (req, res, next) => {
  const id = req.user._id;
  userSchema.findByIdAndUpdate(
    id,
    { name: req.name, about: req.about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.status(http2.HTTP_STATUS_OK).send({ data: user });
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const id = req.user._id;
  userSchema.findByIdAndUpdate(
    id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.status(http2.HTTP_STATUS_OK).send({ data: user });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return userSchema.findUserByCredentials(email, password)
  // userSchema.findOne({ email }).select('+password')
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-secret-key', { expiresIn: '7d' });
      res.send({ token });
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password);
    })
    // eslint-disable-next-line consistent-return
    .then((matched) => {
      if (!matched) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      res.send({ message: 'Всё верно!' });
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
