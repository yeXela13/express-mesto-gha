const userSchema = require('../models/user');
const handleError = require('../handles/handleError');

const getUsers = (req, res) => {
  userSchema.find()
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      handleError(err, res);
    });
};

const getUser = (req, res) => {
  const { Id } = req.params;
  userSchema.findById(Id)
    .orFail()
    .then((user) => {
      if (user) {
        res.send({ user });
      } else {
        res.status(404).send({ message: 'пользователь не найден' });
      }
    })
    .catch((err) => {
      // handleError(err, res);
      console.log('err =>', err);
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  userSchema.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send({ data: user });
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
