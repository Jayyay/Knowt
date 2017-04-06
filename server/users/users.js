const express = require('express');
const bcrypt = require('bcryptjs');
const models = require('../../models');
const db = require('../../models/index');
const rb = require('../utils/responseBuilder');

const router = express.Router();

router.get('/', (req, res) => {
  const query = {
    id: req.user.id,
    attributes: { exclude: ['password'] },
  };
  models.users.findOne(query).then((user) => {
    res.json(rb.success(user));
  });
});

/* PUT update an existing user*/
router.put('/', (req, res) => {
  let responseUser;
  db.sequelize.transaction((t) => {
    return models.users.findOne({
      where: { id: req.user.id },
      transaction: t,
    }).then((user) => {
      if (req.body.email) {
        user.email = req.body.email;
      }
      if (req.body.displayName) {
        user.displayName = req.body.displayName;
      }
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
      return user.save({ transaction: t }).then(() => {
        responseUser = user.dataValues;
        responseUser.password = undefined;
      });
    });
  }).then(() => { // committed
    res.json(rb.success(responseUser));
  }).catch((error) => {
    res.status(400).json(rb.failure(error, rb.ERROR.TRANSACTION_ERR));
  });
});

module.exports = router;
