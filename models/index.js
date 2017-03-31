const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');

const env = 'development'; // process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../config/config.json')[env];
const basename = path.basename(module.filename);
const db = {};

config.dialectOptions = { timeout: 60 };

const sequelize = new Sequelize(
  config.database, config.username, config.password, config
);

fs
  .readdirSync(__dirname)
  .filter(file =>
    (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  )
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
module.exports = db;
