const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const auth = require('./middlewares/auth');
const { handleError } = require('./handles/handleError');
const {
  signinRout, signupRout, userRouter, cardRouter,
} = require('./routes');
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

app.use(errorLogger);

app.use(errors);
app.use(handleError);

const { PORT = 3000 } = process.env;

app.listen((PORT), () => {
  console.log(`Server started on port ${PORT}`);
});
