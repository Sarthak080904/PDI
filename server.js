import express from 'express';
import cors from 'cors';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Database connection
const sequelize = new Sequelize(
  process.env.DB_NAME || 'inspection_reports',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'yourpassword',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432,
    logging: false
  }
);

// Define Report model
const Report = sequelize.define('Report', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  report_number: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: `VTS_${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
  },
  report_date: {
    type: Sequelize.DATEONLY,
    allowNull: false,
    defaultValue: Sequelize.NOW
  },
  client_name: Sequelize.STRING,
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'reports',
  timestamps: true,
  underscored: true
});

// Define IdentificationEntry model
const IdentificationEntry = sequelize.define('IdentificationEntry', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  can_resistance: {
    type: Sequelize.STRING
  }
}, {
  tableName: 'identification_entries',
  timestamps: true,
  underscored: true
});

// Define IdentificationItem model
const IdentificationItem = sequelize.define('IdentificationItem', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  imei: {
    type: Sequelize.STRING
  },
  ucc_id: {
    type: Sequelize.STRING
  }
}, {
  tableName: 'identification_items',
  timestamps: true,
  underscored: true
});

// Define InspectionSection model
const InspectionSection = sequelize.define('InspectionSection', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  row_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  sort_order: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'inspection_sections',
  timestamps: true,
  underscored: true
});

// Define InspectionColumn model
const InspectionColumn = sequelize.define('InspectionColumn', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  label: {
    type: Sequelize.STRING,
    allowNull: false
  },
  field_type: {
    type: Sequelize.ENUM('text', 'dropdown', 'checkbox', 'number', 'date'),
    allowNull: false
  },
  value: {
    type: Sequelize.TEXT
  }
}, {
  tableName: 'inspection_columns',
  timestamps: true,
  underscored: true
});

// Define ColumnOption model
const ColumnOption = sequelize.define('ColumnOption', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  option_value: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  tableName: 'column_options',
  timestamps: true,
  underscored: true
});

// Define Signature model
const Signature = sequelize.define('Signature', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  role: {
    type: Sequelize.ENUM('tested_by', 'verified_by'),
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  signature_data: {
    type: Sequelize.TEXT
  }
}, {
  tableName: 'signatures',
  timestamps: true,
  underscored: true
});

// Define Template model (if not already defined)
const Template = sequelize.define('Template', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  config: {
    type: Sequelize.JSONB,
    allowNull: false
  }
}, {
  tableName: 'templates',
  timestamps: true
});


// Define model relationships
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

// In-memory database for templates (fallback)
let templates = [
  {
    id: 'default-1',
    name: "Default Template",
    config: {
      header: {
        companyName: "Iobot Technologies India pvt.ltd",
        companyCIN: "CNU 172000N2016FTG166992",
        companyAddress: "B102 Shreenanda Classic Rahatani Fune -411017",
        companyContact: "(+91)7447422228",
        companyEmail: "info@lobot.in",
        reportTitle: "Pre-Dispatch Inspection Report",
        reportNumber: `VTS_${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        reportDate: new Date().toISOString().split('T')[0],
        clientName: "",
        quantity: 0
      },
      identifications: [
        { id: uuidv4(), imei: "", uccId: "", canResistance: "" }
      ],
      inspectionTable: {
        columns: [
          { id: uuidv4(), label: "Test Case", type: "text" },
          { id: uuidv4(), label: "Status", type: "dropdown", options: ["OK", "NOT OK", "NA"] }
        ],
        rows: [
          {
            id: uuidv4(),
            label: "Voltage Test",
            cells: [
              { columnId: "col1", value: "Check input voltage" },
              { columnId: "col2", value: "OK" }
            ]
          }
        ]
      },
      footer: {
        testedBy: { name: "", signature: null },
        verifiedBy: { name: "", signature: null }
      }
    }
  }
];



// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Get all templates (from database if available, otherwise from memory)
app.get('/api/templates', async (req, res) => {
  try {
    const dbTemplates = await Report.findAll();
    if (dbTemplates && dbTemplates.length > 0) {
      return res.json(dbTemplates);
    }
    res.json(templates);
  } catch (error) {
    console.error("Error fetching templates:", error);
    res.json(templates); // Fallback to in-memory
  }
});

// Template creation endpoint
app.post('/api/templates', async (req, res) => {
  try {
    const { name, config } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: "Template name is required" });
    }

    const newTemplate = await Template.create({
      name,
      config
    });

    res.status(201).json(newTemplate);
  } catch (error) {
    console.error("Error creating template:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all template from database
// app.get('/api/templates', async (req, res) => {
//   try {
//     const templates = await Template.findAll({
//       order: [['createdAt', 'DESC']],
//       distinct: true // Ensure no duplicates
//     });
//     res.json(templates);
//   } catch (error) {
//     console.error("Error fetching templates:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// Update template
app.put('/api/templates/:id', async (req, res) => {
  try {
    const { name, config } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: "Template name is required" });
    }

    // Try database first
    try {
      const [updated] = await Report.update(
        { name, config: config || {} },
        { where: { id: req.params.id } }
      );
      if (updated) {
        const updatedTemplate = await Report.findByPk(req.params.id);
        return res.json(updatedTemplate);
      }
    } catch (dbError) {
      console.error("Database update failed:", dbError);
    }

    // Fallback to in-memory
    const index = templates.findIndex(t => t.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Template not found" });
    }

    templates[index] = {
      ...templates[index],
      name,
      config: config || templates[index].config
    };
    res.json(templates[index]);
  } catch (error) {
    console.error("Error updating template:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete template
app.delete('/api/templates/:id', async (req, res) => {
  try {
    // Validate the ID parameter
    if (!req.params.id) {
      return res.status(400).json({ error: "Template ID is required" });
    }

    // Try to delete from database
    const deletedCount = await Template.destroy({
      where: { id: req.params.id }
    });

    if (deletedCount === 0) {
      return res.status(404).json({ 
        error: "Template not found",
        details: `No template found with ID: ${req.params.id}`
      });
    }

    res.status(204).end(); // Successfully deleted
  } catch (error) {
    console.error("Delete template error:", error);
    res.status(500).json({ 
      error: "Failed to delete template",
      details: error.message 
    });
  }
});

// Save Report Endpoint
app.post('/api/reports', async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    // Validate request body structure
    if (!req.body?.header) {
      throw new Error('Report header is required');
    }
    
    // Set default values if not provided
    const header = {
      reportNumber: req.body.header.reportNumber || `VTS_${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      reportDate: req.body.header.reportDate || new Date().toISOString().split('T')[0],
      clientName: req.body.header.clientName || '',
      quantity: req.body.header.quantity || 0
    };

    // 1. Save main report
    const report = await Report.create({
      report_number: header.reportNumber,
      report_date: header.reportDate,
      client_name: header.clientName,
      quantity: header.quantity
    }, { transaction });

    // 2. Save identification data (with null checks)
    const identifications = req.body.identifications || [];
    for (const ident of identifications) {
      const entry = await IdentificationEntry.create({
        report_id: report.id,
        can_resistance: ident?.canResistance || ''
      }, { transaction });

      await IdentificationItem.create({
        entry_id: entry.id,
        imei: ident?.imei || '',
        ucc_id: ident?.uccId || ''
      }, { transaction });
    }

    // 3. Save inspection sections and columns (with null checks)
    const inspectionTable = req.body.inspectionTable || { rows: [], columns: [] };
    for (const [index, row] of inspectionTable.rows.entries()) {
      const section = await InspectionSection.create({
        report_id: report.id,
        row_name: row?.label || `Row ${index + 1}`,
        sort_order: index
      }, { transaction });

      for (const column of inspectionTable.columns) {
        const newColumn = await InspectionColumn.create({
          section_id: section.id,
          label: column?.label || '',
          field_type: column?.type || 'text',
          value: row?.cells?.find(c => c.columnId === column?.id)?.value || ''
        }, { transaction });

        if (column?.type === 'dropdown' && column?.options) {
          for (const option of column.options) {
            await ColumnOption.create({
              column_id: newColumn.id,
              option_value: option || ''
            }, { transaction });
          }
        }
      }
    }

    // 4. Save signatures (with null checks)
    const footer = req.body.footer || {};
    if (footer.testedBy) {
      await Signature.create({
        report_id: report.id,
        role: 'tested_by',
        name: footer.testedBy?.name || '',
        signature_data: footer.testedBy?.signature || null
      }, { transaction });
    }

    if (footer.verifiedBy) {
      await Signature.create({
        report_id: report.id,
        role: 'verified_by',
        name: footer.verifiedBy?.name || '',
        signature_data: footer.verifiedBy?.signature || null
      }, { transaction });
    }

    await transaction.commit();
    res.status(201).json(report);
  } catch (error) {
    await transaction.rollback();
    console.error('Error saving report:', error);
    res.status(500).json({ 
      error: 'Failed to save report',
      details: error.message 
    });
  }
});

// Initialize server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ 
  force: false,  // Don't use force: true as it drops tables automatically
  alter: true    // This allows table modifications
});
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();