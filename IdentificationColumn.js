import { DataTypes } from 'sequelize';
import sequelize from 'db.js';

const InspectionColumn = sequelize.define('InspectionColumn', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  label: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fieldType: {
    type: DataTypes.ENUM('text', 'dropdown', 'checkbox', 'number', 'date'),
    allowNull: false
  },
  value: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'inspection_columns'
});

export default InspectionColumn;
