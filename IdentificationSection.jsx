import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useReportContext } from 'ReportContext.jsx';
import { FaTrash, FaPlus } from 'react-icons/fa';

const IdentificationSection = () => {
  const { report, updateIdentifications } = useReportContext();
  
  // Safely access identifications with default empty array
  const identifications = report?.identifications || [];

  const handleChange = (id, field, value) => {
    const updated = identifications.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    updateIdentifications(updated);
  };

  const addItem = () => {
    updateIdentifications([
      ...identifications,
      { 
        id: uuidv4(), 
        imei: "", 
        uccId: "", 
        canResistance: "" 
      }
    ]);
  };

  const removeItem = (id) => {
    if (identifications.length <= 1) return;
    updateIdentifications(identifications.filter(item => item.id !== id));
  };

  return (
    <div className="identification-section section">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Identification Numbers</h2>
        <button 
          onClick={addItem}
          className="btn-primary flex items-center gap-1"
        >
          <FaPlus /> Add Row
        </button>
      </div>
      
      {identifications.map((item) => (
        <div key={item.id} className="grid grid-cols-4 gap-4 mb-3">
          <div className="form-group">
            <label className="block text-sm font-medium mb-1">IMEI No</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={item.imei || ''}
              onChange={(e) => handleChange(item.id, 'imei', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label className="block text-sm font-medium mb-1">UCC ID</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={item.uccId || ''}
              onChange={(e) => handleChange(item.id, 'uccId', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label className="block text-sm font-medium mb-1">CAN Resistance</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={item.canResistance || ''}
              onChange={(e) => handleChange(item.id, 'canResistance', e.target.value)}
              placeholder="e.g., 120 ohms"
            />
          </div>
          
          <div className="flex items-end">
            <button 
              onClick={() => removeItem(item.id)}
              className="btn-danger flex items-center gap-1"
              disabled={identifications.length <= 1}
            >
              <FaTrash />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default IdentificationSection;
