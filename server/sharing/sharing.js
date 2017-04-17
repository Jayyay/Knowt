const express = require('express');
const models = require('../../models');
const db = require('../../models/index');
const rb = require('../utils/responseBuilder');
const permEnum = require('./permissionEnum');
const queryBuilder = require('../utils/queryBuilder');
const transUtils = require('../utils/transactionUtilities');

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
    res.status(400).json(rb.failure(error.message));
  });
});

router.post('/', (req, res) => {
  const noteId = req.body.noteId;
  const userId = req.body.userId;
  const permission = req.body.permission;
  let responseSharing;
  db.sequelize.transaction((t) => {
    if (!noteId || !userId) {
      transUtils.abort('Must provide a valid noteId and userId');
    }
    if (!permission || (permission !== permEnum.VIEW && permission !== permEnum.EDIT)) {
      transUtils.abort('Must provide a valid permission: VIEW or EDIT');
    }
    return models.notes.findOne({
      attributes: ['id', 'userId'],
      where: { noteId },
      transaction: t,
    }).then((noteObject) => {
      if (!noteObject || noteObject.userId != req.user.id) {
        transUtils.abort('No valid note found');
      }
      return models.users.findOne({
        attributes: ['id'],
        where: { userId },
        transaction: t,
      }).then((userObject) => {
        if (!userObject) {
          transUtils.abort('No valid user found');
        }
        return models.sharing.findOne({
          where: { noteId, userId },
          transaction: t,
        });
      }).then((existingSharingObject) => {
        if (existingSharingObject) {
          transUtils.abort('Note is already shared with the user');
        }
        return models.sharing.create(
          { noteId, userId, permission },
          { transaction: t }
        );
      }).then((newSharingObject) => {
        responseSharing = newSharingObject;
      });
    });
  }).then(() => { // committed
    res.json(rb.success(responseSharing));
  }).catch((error) => {
    res.status(400).json(rb.failure(error.message));
  });
});

router.post('/:noteId/:userId', (req, res) => {
  const noteId = req.params.noteId;
  const userId = req.params.userId;
  db.sequelize.transaction((t) => {

  }).then(() => { // committed
    res.json(rb.success());
  }).catch((error) => {
    res.status(400).json(rb.failure(error.message);
  });
})

router.delete('/:noteId/:userId', (req, res) => {
  const noteId = req.params.noteId;
  const userId = req.params.userId;
  db.sequelize.transaction((t) => {

  }).then(() => { // committed
    res.json(rb.success());
  }).catch((error) => {
    res.status(400).json(rb.failure(error.message);
  });
})

module.exports = router;
