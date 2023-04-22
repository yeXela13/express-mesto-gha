const userSchema = require('../models/user');

const getUsers = (req, res) => {
    userSchema.find().then(user => {
        res.send({ data: user });
    })
        .catch((e) => {
            res.status(500).send({ message: 'что-то пошло не так' });
        })
};

const getUser = (req, res) => {
    const { id } = req.params;
    userSchema.findById(id)
        .orFail(() => {
            throw new Error('не найдено');
        })
        .then(user => {
            res.send({ data: user });
        })
        .catch((e) => {
            if (e.message === 'не найдено') {
                res.status(404).send({ error: 'Запрашиваемый пользователь не найден' });
            } else {
                res.status(500).send({ message: 'что-то пошло не так' });
            }
        })
};

const createUser = (req, res) => {
    const { name, about, avatar } = req.body;
    userSchema.create({ name, about, avatar })
        .then(user => {
            res.status(201).send({ data: user });
        }).catch(e => {
            if (e.name === 'ValidationError') {
                const message = Object.values(e.errors).map(error => error.message).join(';');
                res.status(400).send({ message });
            } else {
                res.status(500).send({ message });
            }
        })
};

const updateUser = (req, res) => {
    const { id } = req.params;
    userSchema.findByIdAndUpdate(id, { name: req.name, about: req.about },
        { new: true, upsert: true })
        .then((user) => {
            res.send({ data: user });
        })
        .catch((e) => {
            if (e.message === 'не найдено') {
                res.status(404).send({ error: 'Запрашиваемый пользователь не найден' });
            }
            else if (e) {
                res.status(400).send({ error: 'Переданы некорректные данные при обновлении профиля' });
            }
            else {
                res.status(500).send({ message: 'что-то пошло не так' });
            }
        })
};

const updateAvatar = (req, res) => {
    const { id } = req.params;
    userSchema.findByIdAndUpdate(id, { avatar: req.body.avatar },
        { new: true, upsert: true })
        .orFail(() => {
            throw new Error('не найдено');
        })
        .then(user => {
            res.send({ data: user });
        })
        .catch((e) => {
            if (e.message === 'не найдено') {
                res.status(404).send({ error: 'Запрашиваемый пользователь не найден' });
            }
            else if (e) {
                res.status(400).send({ error: 'Переданы некорректные данные при обновлении профиля' });
            }
            else {
                res.status(500).send({ message: 'что-то пошло не так' });
            }
        })
}

module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    updateAvatar
}