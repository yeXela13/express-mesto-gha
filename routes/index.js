const userRouter = require('./users');
const cardRouter = require('./cards');
const signinRout = require('./signinRout');
const signupRout = require('./signupRout');

module.exports = {
  signinRout,
  signupRout,
  userRouter,
  cardRouter,
};
