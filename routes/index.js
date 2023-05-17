const router = require('express').Router();
const auth = require('../middlewares/auth');
const userRouter = require('./users');
const cardRouter = require('./cards');
const signinRout = require('./signinRout');
const signupRout = require('./signupRout');
const NotFoundError = require('../handles/NotFoundError');

router.use('/signin', signinRout);
router.use('/signup', signupRout);
router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
