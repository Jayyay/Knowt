/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ""
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ""
    },
    netId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isNetIdUser: {
      type: DataTypes.INTEGER(1),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ""
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ""
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'users'
  });
};
