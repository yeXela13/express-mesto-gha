const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const validationErrors = require('celebrate').errors;
const bodyParser = require('body-parser');
const auth = require('./middlewares/auth');
const {
  signinRout, signupRout, userRouter, cardRouter,
} = require('./routes');
const NotFoundError = require('./handles/NotFoundError');
const { handleError } = require('./handles/handleError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

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
app.use(bodyParser.json());

app.use(requestLogger);

app.use('/signin', signinRout);
app.use('/signup', signupRout);
app.use(auth, userRouter);
app.use(auth, cardRouter);
app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});
app.use(errorLogger);

app.use(validationErrors());
app.use(errors);
app.use(handleError);

const { PORT = 3000 } = process.env;

app.listen((PORT), () => {
  console.log(`Server started on port ${PORT}`);
});
