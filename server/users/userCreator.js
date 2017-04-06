const models = require('../../models');
const bcrypt = require('bcryptjs');
const rb = require('../utils/responseBuilder');
const db = require('../../models/index');
const auth = require('./authentication');

/**
 * @param  {Object} userObject
 *  {username, displayName, password, email, netId, isNetIdUser}
 * @param  {Object} config {creatorId, res, signInAfterCreated}
 * where creatorId is an optional id indicating the creator (for log purpose),
 *   res is the res object provided by Express,
 *   signInAfterCreated is a boolean indicating whether sign in after creation
 */
function createNewUser(userObject, config) {
  const res = config.res;
  const signInAfterCreated = config.signInAfterCreated;
  if (
    (userObject.password == null && userObject.isNetIdUser == 0)
    || (userObject.password != null && userObject.isNetIdUser != 0)
  ) { // password should be null iff it's a netIdUser
    res.json(rb.failure('Fail to create new user'));
  } else if (userObject.email == null) {
    res.json(rb.failure('Must provide an email'));
  } else { // Ready to Create
    let password = null;
    if (userObject.password != null) {
      password = bcrypt.hashSync(userObject.password, 8);
    }
    let newlyCreatedUser;
    console.log(userObject.isNetIdUser);
    db.sequelize.transaction((t) => {
      return models.users.create({
        username: userObject.username,
        displayName: userObject.displayName,
        password,
        email: userObject.email,
        netId: userObject.netId || null,
        isNetIdUser: userObject.isNetIdUser,
      }, { transaction: t }).then((newUser) => {
        newlyCreatedUser = newUser.dataValues;
        newlyCreatedUser.password = undefined; // remove the password field.
        if (signInAfterCreated) {
          newlyCreatedUser.token = auth.generateJWT(newlyCreatedUser.id);
        }
      });
    }).then(() => { // committed
      res.json(rb.success(newlyCreatedUser));
    }).catch((error) => {
      res.status(400).json(rb.failure(error, rb.ERROR.TRANSACTION_ERR));
    });
  }
}

module.exports = { createNewUser };
