const http2 = require('http2').constants;
const userSchema = require('../models/user');
const handleError = require('../handles/handleError');

const getUsers = (req, res) => {
  userSchema.find()
    .then((user) => {
      res.status(http2.HTTP_STATUS_OK).send({ user });
    })
    .catch((err) => {
      handleError(err, res);
    });
};

const getUser = (req, res) => {
  userSchema.findById(req.params.userId)
    .orFail()
    .then((user) => res.status(http2.HTTP_STATUS_OK).send(user))
    .catch((err) => handleError(err, res));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  userSchema.create({ name, about, avatar })
    .then((user) => {
      res.status(http2.HTTP_STATUS_CREATED).send({ data: user });
    }).catch((err) => {
      if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((error) => error.message).join(';');
        res.status(400).send({ message });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так' });
      }
    });
};

const updateUser = (req, res) => {
  const id = req.user._id;
  userSchema.findByIdAndUpdate(
    id,
    { name: req.name, about: req.about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.status(http2.HTTP_STATUS_OK).send({ data: user });
    })
    .catch((err) => {
      handleError(err, res);
    });
};

const updateAvatar = (req, res) => {
  const id = req.user._id;
  userSchema.findByIdAndUpdate(
    id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.status(http2.HTTP_STATUS_OK).send({ data: user });
    })
    .catch((err) => {
      handleError(err, res);
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};
