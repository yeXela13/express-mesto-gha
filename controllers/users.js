const userSchema = require('../models/user');
const { handleError } = require('../handles/handleError');

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
  // const { id } = req.params;
  userSchema.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      handleError(err, res);
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  userSchema.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send({ data: user });
    }).catch((err) => {
      handleError(err, res);
    });
};

const updateUser = (req, res) => {
  const { id } = req.params;
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
  const { id } = req.params;
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
