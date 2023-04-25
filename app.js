const express = require('express');
const http2 = require('http2').constants;
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

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
app.use((req, res, next) => {
  req.user = {
    _id: '64418e191df6bb1c8f8981fc',
  };
  next();
});
app.use(userRouter);
app.use(cardRouter);

app.use('*', (req, res) => {
  res.status(http2.HTTP_STATUS_NOT_FOUND).send({ message: 'страница не найдена' });
});

const { PORT = 3000 } = process.env;

app.listen((PORT), () => {
  console.log(`Server started on port${PORT}`);
});
