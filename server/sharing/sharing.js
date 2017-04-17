const express = require('express');
const models = require('../../models');
const db = require('../../models/index');
const rb = require('../utils/responseBuilder');
const queryBuilder = require('../utils/queryBuilder');

const router = express.Router();

router.get('/', (req, res) => {
  let responseNotes;
  db.sequelize.transaction((t) => {
    const query = { where: { userId: req.user.id }, transaction: t };
    return models.sharing.findAll(query).then((sharingObjects) => {
      const noteIds = _.map(sharingObjects, 'noteId');
      const query = { where: { noteId: noteIds }, transaction: t };
      queryBuilder.page(query, req.query.rowPerPage, req.query.pageNumber);
      queryBuilder.orderByCreatedAt(query);
      return models.notes.findAll(query);
    }).then((noteObjects) => {
      responseNotes = noteObjects;
    });
  }).then(() => { // committed
    res.json(rb.success(responseNotes));
  }).catch((error) => {
    res.status(400).json(rb.failure(error.message, rb.ERROR.TRANSACTION_ERR));
  });
});


module.exports = router;
