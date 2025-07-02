import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const IdentificationEntry = sequelize.define('IdentificationEntry', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  canResistance: {
    type: DataTypes.STRING
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'identification_entries'
});

export default IdentificationEntry;
