import { DataTypes } from 'sequelize';
import sequelize from 'db.js';

const IdentificationItem = sequelize.define('IdentificationItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  imei: {
    type: DataTypes.STRING
  },
  uccId: {
    type: DataTypes.STRING
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'identification_items'
});

export default IdentificationItem;
