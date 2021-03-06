/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sharing', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    noteId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    permission: {
      type: DataTypes.ENUM('VIEW','EDIT'),
      allowNull: false,
      defaultValue: "VIEW"
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
    tableName: 'sharing'
  });
};
