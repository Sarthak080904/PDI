import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const InspectionSection = sequelize.define('InspectionSection', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  rowName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'inspection_sections'
});

export default InspectionSection;
