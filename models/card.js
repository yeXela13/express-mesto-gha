const mongoose = require('mongoose');
const { urlRegExp } = require('../utils/regex');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Заполните это поле'],
    minlength: [2, 'Поле должно содержать более 2 символов'],
    maxlength: [30, 'Поле должно содержать более 2 символов'],
  },
  link: {
    type: String,
    required: [true, 'Заполните это поле'],
    validate: {
      validator: (link) => urlRegExp.test(link),
      message: 'Некоректная адрес изображения',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
