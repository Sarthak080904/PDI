import React, { useState } from 'react';
import { FaTimes, FaPlus, FaTrash } from 'react-icons/fa';

const ColumnConfigEditor = ({ column, onSave, onClose }) => {
  const [config, setConfig] = useState({ ...column });
  const [newOption, setNewOption] = useState('');

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setConfig({
      ...config,
      type: newType,
      options: newType === 'dropdown' ? [...config.options] : []
    });
  };

  const addOption = () => {
    if (newOption.trim() && !config.options.includes(newOption.trim())) {
      setConfig({
        ...config,
        options: [...config.options, newOption.trim()]
      });
      setNewOption('');
    }
  };

  const removeOption = (option) => {
    setConfig({
      ...config,
      options: config.options.filter(opt => opt !== option)
    });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Column Configuration</h3>
          <button onClick={onClose}><FaTimes /></button>
        </div>
        
        <div className="modal-body">
          <div className="mb-4">
            <label>Column Label</label>
            <input
              type="text"
              value={config.label}
              onChange={(e) => setConfig({...config, label: e.target.value})}
            />
          </div>
          
          <div className="mb-4">
            <label>Input Type</label>
            <select value={config.type} onChange={handleTypeChange}>
              <option value="text">Text (Single Line)</option>
              <option value="multiline">Text (Multi-line)</option>
              <option value="checkbox">Checkbox</option>
              <option value="dropdown">Dropdown</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
            </select>
          </div>
          
          {config.type === 'dropdown' && (
            <div className="mb-4">
              <label>Dropdown Options</label>
              <div className="flex mb-2">
                <input
                  type="text"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  placeholder="Add new option"
                />
                <button onClick={addOption} className="btn-primary">
                  <FaPlus />
                </button>
              </div>
              
              <div className="options-list">
                {config.options.map(option => (
                  <div key={option} className="option-item">
                    {option}
                    <button 
                      onClick={() => removeOption(option)}
                      className="btn-danger"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button 
            onClick={() => onSave(config)} 
            className="btn-primary"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColumnConfigEditor;
