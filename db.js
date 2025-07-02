import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const db = new Sequelize(
  process.env.DB_NAME || 'inspection_reports',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'root123',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432,
    logging: false
  }
);

// Setup relationships
Report.hasMany(IdentificationEntry, { foreignKey: 'report_id' });
IdentificationEntry.belongsTo(Report, { foreignKey: 'report_id' });

IdentificationEntry.hasMany(IdentificationItem, { foreignKey: 'entry_id' });
IdentificationItem.belongsTo(IdentificationEntry, { foreignKey: 'entry_id' });

Report.hasMany(InspectionSection, { foreignKey: 'report_id' });
InspectionSection.belongsTo(Report, { foreignKey: 'report_id' });

InspectionSection.hasMany(InspectionColumn, { foreignKey: 'section_id' });
InspectionColumn.belongsTo(InspectionSection, { foreignKey: 'section_id' });

InspectionColumn.hasMany(ColumnOption, { foreignKey: 'column_id' });
ColumnOption.belongsTo(InspectionColumn, { foreignKey: 'column_id' });

Report.hasMany(Signature, { foreignKey: 'report_id' });
Signature.belongsTo(Report, { foreignKey: 'report_id' });

export default db;