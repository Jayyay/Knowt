const express = require('express');
const bcrypt = require('bcryptjs');
const models = require('../../models');
const db = require('../../models/index');
const rb = require('../utils/responseBuilder');
const queryBuilder = require('../utils/queryBuilder');

const router = express.Router();

router.get('/', (req, res) => {
  const query = {
    id: req.user.id,
    attributes: { exclude: ['password'] },
  };
  models.users.findOne(query).then((userObject) => {
    res.json(rb.success(userObject));
  });
});

router.get('/all', (req, res) => {
  const query = {
    id: req.user.id,
    attributes: ['id', 'username', 'displayName', 'email'],
  };
  queryBuilder.page(query, req.query.rowPerPage, req.query.pageNumber);
  models.users.findAll(query).then((userObjects) => {
    res.json(rb.success(userObjects));
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
    res.status(400).json(rb.failure(error.message, rb.ERROR.TRANSACTION_ERR));
  });
});

module.exports = router;
