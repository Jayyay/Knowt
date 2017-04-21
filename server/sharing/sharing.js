const express = require('express');
const _ = require('lodash');
const models = require('../../models');
const db = require('../../models/index');
const rb = require('../utils/responseBuilder');
const permEnum = require('./permissionEnum');
const queryBuilder = require('../utils/queryBuilder');
const transUtils = require('../utils/transactionUtilities');
const emailSender = require('../emails/emailSender');

const router = express.Router();

function sanityCheck(noteId, userId, permission) {
  if (!noteId || !userId) {
    transUtils.abort('Must provide a valid noteId and userId');
  }
  if (!permission || (permission !== permEnum.VIEW && permission !== permEnum.EDIT)) {
    transUtils.abort('Must provide a valid permission: VIEW or EDIT');
  }
}

router.get('/', (req, res) => {
  let responseNotes;
  db.sequelize.transaction((t) => {
    let noteIdToSharings;
    let userIdToUsers;
    return models.sharing.findAll({
      where: { userId: req.user.id },
      transaction: t,
    }).then((sharingObjects) => {
      const noteIds = _.chain(sharingObjects).map('noteId').uniq();
      noteIdToSharings = _.groupBy(sharingObjects, 'noteId');
      const query = { where: { id: noteIds }, transaction: t };
      queryBuilder.page(query, req.query.rowPerPage, req.query.pageNumber);
      queryBuilder.orderByCreatedAt(query);
      return models.notes.findAll(query);
    }).then((noteObjects) => {
      responseNotes = _.map(noteObjects, 'dataValues');
      const userIds = _.chain(noteObjects).map('userId').uniq();
      return models.users.findAll({
        attributes: ['id', 'username', 'displayName', 'email'],
        where: { id: userIds },
        transaction: t,
      });
    }).then((userObjects) => {
      userIdToUsers = _.keyBy(userObjects, 'id');
      _.forEach(responseNotes, (n) => {
        n.username = userIdToUsers[n.userId].username;
        n.displayName = userIdToUsers[n.userId].displayName;
        n.email = userIdToUsers[n.userId].email;
        if (noteIdToSharings[n.id]) {
          n.permission = noteIdToSharings[n.id][0].permission;
        } else {
          n.permission = permEnum.VIEW;
        }
      });
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
    sanityCheck(noteId, userId, permission);
    if (userId == req.user.id) {
      transUtils.abort('Cannot share with your own self');
    }
    return models.notes.findOne({
      attributes: ['id', 'userId'],
      where: { id: noteId },
      transaction: t,
    }).then((noteObject) => {
      if (!noteObject || noteObject.userId != req.user.id) {
        transUtils.abort('No valid note found');
      }
      return models.users.findOne({
        attributes: ['id'],
        where: { id: userId },
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
    emailSender.receiveSharedNote(req.user.id, userId);
    res.json(rb.success(responseSharing));
  }).catch((error) => {
    res.status(400).json(rb.failure(error.message));
  });
});

router.put('/:noteId/:userId', (req, res) => {
  const noteId = req.params.noteId;
  const userId = req.params.userId;
  const permission = req.body.permission;
  db.sequelize.transaction((t) => {
    sanityCheck(noteId, userId, permission);
    return models.sharing.findOne({
      where: { noteId, userId },
      transaction: t,
    }).then((existingSharingObject) => {
      if (!existingSharingObject) {
        transUtils.abort('No shared note is found');
      }
      return models.sharing.update(
        { permission },
        {
          where: { noteId, userId },
          transaction: t,
        }
      );
    });
  }).then(() => { // committed
    res.json(rb.success());
  }).catch((error) => {
    res.status(400).json(rb.failure(error.message));
  });
});

router.delete('/:noteId/:userId', (req, res) => {
  const noteId = req.params.noteId;
  const userId = req.params.userId;
  db.sequelize.transaction((t) => {
    if (!noteId || !userId) {
      transUtils.abort('Must provide a valid noteId and userId');
    }
    return models.notes.findOne({
      attributes: ['userId'],
      where: { id: noteId },
      transaction: t,
    }).then((noteObjectFound) => {
      if (noteObjectFound.userId != req.user.id && userId != req.user.id) {
        // only the sharedTo user or the note's author can stop the sharing
        transUtils.abort('No shared note is found');
      }
      return models.sharing.findOne({
        where: { noteId, userId },
        transaction: t,
      });
    }).then((existingSharingObject) => {
      if (!existingSharingObject) {
        transUtils.abort('No shared note is found');
      }
      return models.sharing.destroy({
        where: { noteId, userId },
        transaction: t,
      });
    });
  }).then(() => { // committed
    res.json(rb.success());
  }).catch((error) => {
    res.status(400).json(rb.failure(error.message));
  });
});

module.exports = router;
