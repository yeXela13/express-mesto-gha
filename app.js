const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const validationErrors = require('celebrate').errors;
const bodyParser = require('body-parser');
const router = require('./routes/index');
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

app.use(router);

app.use(errorLogger);

app.use(validationErrors());
app.use(errors);
app.use(handleError);

const { PORT = 3000 } = process.env;

app.listen((PORT), () => {
  console.log(`Server started on port ${PORT}`);
});
