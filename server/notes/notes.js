const express = require('express');
const _ = require('lodash');
const models = require('../../models');
const db = require('../../models/index');
const rb = require('../utils/responseBuilder');
const queryBuilder = require('../utils/queryBuilder');

const router = express.Router();

router.get('/', (req, res) => {
  let responseNotes;
  db.sequelize.transaction((t) => {
    const query = { where: { userId: req.user.id } };
    queryBuilder.page(query, req.query.rowPerPage, req.query.pageNumber);
    queryBuilder.orderByCreatedAt(query);
    query.transaction = t;
    return models.notes.findAll(query).then((noteObjects) => {
      const noteIds = _.map(noteObjects, 'id');
      responseNotes = _.map(noteObjects, 'dataValues');
      return models.sharing.findAll({
        attributes: ['noteId', 'userId'],
        where: { noteId: noteIds },
        transaction: t,
      });
    }).then((sharingObjects) => {
      const noteIdToSharings = _.groupBy(sharingObjects, 'noteId');
      _.forEach(responseNotes, (n) => {
        n.sharing = noteIdToSharings[n.noteId];
      });
    });
  }).then(() => { // committed
    res.json(rb.success(responseNotes));
  }).catch((error) => {
    res.status(400).json(rb.failure(error.message, rb.ERROR.TRANSACTION_ERR));
  });
});

router.post('/', (req, res) => {
  const content = req.body.content;
  let responseNote;
  db.sequelize.transaction((t) => {
    if (content == undefined || content == null) {
      throw new Error('Invalid note content');
    }
    return models.notes.create({
      userId: req.user.id,
      content,
    }, { transaction: t }).then((newNoteObject) => {
      responseNote = newNoteObject;
    });
  }).then(() => { // committed
    res.json(rb.success(responseNote));
  }).catch((error) => {
    res.status(400).json(rb.failure(error.message, rb.ERROR.TRANSACTION_ERR));
  });
});

router.put('/:noteId', (req, res) => {
  const noteId = req.params.noteId;
  const content = req.body.content;
  let responseNote;
  db.sequelize.transaction((t) => {
    if (content == undefined || content == null) {
      throw new Error('Invalid note content');
    }
    return models.notes.findOne({
      where: { id: noteId },
      transaction: t,
    }).then((noteObjectFound) => {
      if (!noteObjectFound || noteObjectFound.userId != req.user.id) {
        throw new Error(`No note with ${req.params.id} is found`);
      }
      noteObjectFound.content = content;
      responseNote = noteObjectFound;
      return noteObjectFound.save({ transaction: t });
    });
  }).then(() => { // committed
    res.json(rb.success(responseNote));
  }).catch((error) => {
    res.status(400).json(rb.failure(error.message, rb.ERROR.TRANSACTION_ERR));
  });
});

router.delete('/:noteId', (req, res) => {
  const noteId = req.params.noteId;
  db.sequelize.transaction((t) => {
    return models.notes.findOne({
      where: { id: noteId },
      transaction: t,
    }).then((noteObjectFound) => {
      if (!noteObjectFound || noteObjectFound.userId != req.user.id) {
        throw new Error(`No note with ${req.params.id} is found`);
      }
      return noteObjectFound.destroy({ transaction: t });
    });
  }).then(() => { // committed
    res.json(rb.success());
  }).catch((error) => {
    res.status(400).json(rb.failure(error.message, rb.ERROR.TRANSACTION_ERR));
  });
})

module.exports = router;
