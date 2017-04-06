const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const path = require('path');

const configFile = require(path.join(__dirname, '/../../../config/authconfig.json'));
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  secretOrKey: configFile.key,
};
const strategy = new JwtStrategy(jwtOptions, (jwtPayload, next) => {
  console.log('payload received', jwtPayload);
  next(null, { id: jwtPayload.id });
});
passport.use(strategy);

function generateJWT(userId, willNotExpire) {
  const payload = { id: userId };
  const options = {};
  if (!willNotExpire) { // token expires in 7 days.
    options.expiresIn = 60 * 60 * 24 * 7;
  }
  return jwt.sign(payload, jwtOptions.secretOrKey, options);
}

module.exports = {
  passport,
  generateJWT,
  secret: jwtOptions.secretOrKey,
};
