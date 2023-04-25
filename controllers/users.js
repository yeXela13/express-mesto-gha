const userSchema = require('../models/user');
const handleError = require('../handles/handleError');

const getUsers = (req, res) => {
  userSchema.find()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      handleError(err, res);
    });
};

const getUser = (req, res) => {
  userSchema.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      handleError(err, res);
    });
};

// eslint-disable-next-line consistent-return
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  if (!name) {
    return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
  }
  userSchema.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send({ data: user });
    }).catch((err) => {
      handleError(err, res);
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
      res.status(200).send({ data: user });
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
    .orFail(() => {
      throw new Error('не найдено');
    })
    .then((user) => {
      res.status(200).send({ data: user });
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
