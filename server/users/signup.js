const express = require('express');
const models = require('../../models');
const rb = require('../utils/responseBuilder');
const userCreator = require('./userCreator');

const router = express.Router();

router.post('/', (req, res) => {
  if (
    !req.body.username
    || !req.body.displayName
    || !req.body.password
    || !req.body.email
  ) {
    res.status(400).json(rb.failure('Not enough information provided to sign up'));
    return;
  }
  models.users.findOne({ // check for existing users with the same name.
    attributes: ['id'],
    where: {
      username: req.body.username,
    },
  }).then((user) => {
    if (user) { // username already existed
      res.status(400).json(
        rb.failure('username already existed', rb.ERROR.DUPLICATE_ENTRY)
      );
    } else {
      const userObject = {
        username: req.body.username,
        displayName: req.body.displayName,
        password: req.body.password,
        email: req.body.email,
        netId: null,
        isNetIdUser: 0,
      };
      const createUserConfig = { res, signInAfterCreated: false };
      userCreator.createNewUser(userObject, createUserConfig);
    }
  });
});

module.exports = router;
