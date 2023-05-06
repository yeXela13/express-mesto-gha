const express = require('express');
const http2 = require('http2').constants;
const mongoose = require('mongoose');
const { errors } = require('celebrate');
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

app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth, userRouter);
app.use(auth, cardRouter);

app.use('*', (req, res) => {
  res.status(http2.HTTP_STATUS_NOT_FOUND).send({ message: 'страница не найдена' });
});

// здесь обрабатываем все ошибки
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
});
app.use(errors());

const { PORT = 3000 } = process.env;

app.listen((PORT), () => {
  console.log(`Server started on port ${PORT}`);
});
