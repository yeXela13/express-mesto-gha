const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { handleError } = require('./handles/handleError');
const {
  userRouter, cardRouter, signinRout, signupRout,
} = require('./routes');
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

app.post('/signin', signinRout);
app.post('/signup', signupRout);
app.use(auth, userRouter);
app.use(auth, cardRouter);

app.use(handleError);
app.use(errors);

const { PORT = 3000 } = process.env;

app.listen((PORT), () => {
  console.log(`Server started on port ${PORT}`);
});
