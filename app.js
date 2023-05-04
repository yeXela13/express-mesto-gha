const express = require('express');
const http2 = require('http2').constants;
const mongoose = require('mongoose');
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

const { PORT = 3000 } = process.env;

app.listen((PORT), () => {
  console.log(`Server started on port ${PORT}`);
});
