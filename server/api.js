const express = require('express');
const passport = require('passport');
const userRouter = require('./users/users');

const router = express.Router();

router.use('/', passport.authenticate(
  'jwt', { session: false }
), (req, res, next) => {
  console.log(`Authenticated user id: ${req.user.id}`);
  next();
});

router.use('/user', userRouter);
router.get('/whosyourdaddy', (req, res) => {
  res.send('Jay');
});

module.exports = router;
