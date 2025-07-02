import Report from 'Report.js';

export const createReport = async (req, res) => {
  try {
    const report = await Report.create(req.body);
    res.status(201).json(report);
  } catch (error) {
    console.error('Error saving report:', error);
    res.status(500).json({ 
      error: 'Failed to save report',
      details: error.message 
    });
  }
};
