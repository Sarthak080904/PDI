import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const ColumnOption = sequelize.define('ColumnOption', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  optionValue: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'column_options'
});

export default ColumnOption;
