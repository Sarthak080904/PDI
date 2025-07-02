import { DataTypes } from 'sequelize';
import sequelize from 'db.js';

const Report = sequelize.define('Report', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  reportNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: `VTS_${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
  },
  reportDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  clientName: {
    type: DataTypes.STRING
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'reports'
});

export default Report;ch
