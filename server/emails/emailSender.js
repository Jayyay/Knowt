const emailjs = require('emailjs');
const models = require('../../models');
const config = require('../../../config/authconfig.json');

const selfAddr = 'Knowt Support <support@knowt.pro>';

// initialize and cache connection to email server
const smtpServer = emailjs.server.connect({
  user: config.emailUser,
  password: config.emailKey,
  host: 'smtp.mailgun.org',
  tls: true,
});

/**
 * Construct an email with only text content, and send to the email address
 * of userId.
 * @param  {String} subject         email subject
 * @param  {String} content         email content
 * @param  {String} toAddr          user receipient email address
 */
function send(userId, subject, content) {
  try {
    models.users.findOne({
      attributes: ['email'],
      where: { id: userId },
    }).then((userObject) => {
      smtpServer.send({
        from: selfAddr,
        to: userObject.email,
        subject,
        text: content,
      }, (error, message) => {
        console.log('Error: ', error || 'NONE');
        console.log('message: ', message || 'NONE');
      });
    });
  } catch (e) {
    console.log(e);
  }
}

const emailSender = {
  receiveSharedNote(fromUserId, toUserId) {
    models.users.findOne({
      attributes: ['displayName'],
      where: { id: fromUserId },
    }).then((fromUserObject) => {
      const subject = 'Note Received';
      const content = `${fromUserObject.displayName} just shared a note with you!`;
      send(toUserId, subject, content);
    });
  },
};

module.exports = emailSender;
