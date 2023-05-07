const express = require('express');
const http2 = require('http2').constants;
const mongoose = require('mongoose');
const { errors, celebrate, Joi } = require('celebrate');
const { RegExp } = require('./utils/regex');
const { handleError } = require('./handles/handleError');
const { userRouter, cardRouter } = require('./routes');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

const mongooseUrl = 'mongodb://localhost:27017/mestodb';
mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log(`Connected to ${mongooseUrl}`);
  })
  .catch(() => {
    console.log('Connection error');
  });
const app = express();

app.use(express.json());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email,
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(RegExp),
    email: Joi.string().required().email,
    password: Joi.string().required(),
  }),
}), createUser);
app.use(auth, userRouter);
app.use(auth, cardRouter);

app.use('*', (req, res) => {
  res.status(http2.HTTP_STATUS_NOT_FOUND).send({ message: 'страница не найдена' });
});

// здесь обрабатываем все ошибки
app.use(errors);
app.use(handleError);
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
});

const { PORT = 3000 } = process.env;

app.listen((PORT), () => {
  console.log(`Server started on port ${PORT}`);
});
