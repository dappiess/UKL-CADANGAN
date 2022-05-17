'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class outlet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  outlet.init(
    {
      id_outlet: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nama: DataTypes.STRING,
      alamat: DataTypes.STRING,
      tlp: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      sequelize,
      modelName: "outlet",
      tableName: "outlet"
    }
  );
  return outlet;
};