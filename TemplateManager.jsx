import React, { useEffect, useState } from 'react';
import { useReportContext } from '../contexts/ReportContext';
import { FaSave, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import { defaultTemplate } from '../templates/defaultTemplate';

const TemplateManager = () => {
  const {
    templates,
    saveTemplate,
    loadTemplate,
    deleteTemplate,
    fetchTemplates,
    isLoading,
    error: contextError,
    setTemplates
  } = useReportContext();

  const [showModal, setShowModal] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [error, setError] = useState(null);

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setTemplateName(template.name);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!templateName.trim()) {
      setError('Template name is required');
      return;
    }

    try {
      setError(null);
      await saveTemplate(templateName.trim());
      setTemplateName(null);
      setShowModal(false);
      
      // Refresh templates list after saving
      const updatedTemplates = await fetchTemplates();
      setTemplates(updatedTemplates);
    } catch (err) {
      setError(err.message || 'Failed to save template');
    }
  };

  // TemplateManager.jsx
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await deleteTemplate(id);
        // Refresh templates list after deletion
        const updatedTemplates = await fetchTemplates();
        setTemplates(updatedTemplates);
        setError(null);
      } catch (err) {
        setError('Failed to delete template');
        console.error(err);
      }
    }
  };


  return (
    <div className="template-manager">
      <button
        onClick={() => {
          setEditingTemplate(null);
          setTemplateName('');
          setShowModal(true);
        }}
        className="btn-primary"
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Manage Templates'}
      </button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingTemplate ? 'Edit Template' : 'Save New Template'}</h3>
              <button
                onClick={() => setShowModal(false)}
                disabled={isLoading}
              >
                <FaTimes />
              </button>
            </div>

            <div className="modal-body">
              {(error || contextError) && (
                <div className="error-message">
                  {error || contextError}
                </div>
              )}

              <div className="form-group">
                <label>Template Name</label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Enter template name"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => setShowModal(false)}
                className="btn-secondary"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="btn-primary"
                disabled={isLoading}
              >
                <FaSave /> {editingTemplate ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {templates.length > 0 && (
        <div className="templates-list">
          <h4>Available Templates</h4>
          <ul>
            {templates
              .filter(template => template.name && template.id) // Filter out invalid entries
              .map(template => (
                <li key={template.id}> {/* Ensure unique key */}
                  <div className="template-item">
                    <span
                      onClick={() => !isLoading && loadTemplate(template.id)}
                      className="template-name"
                    >
                      {template.name || 'Unnamed Template'}
                    </span>
                    <div className="template-actions">
                      <button onClick={() => handleEdit(template)}>
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(template.id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </li>
              ))
            }
          </ul>
        </div>
      )}
    </div>
  );
};

export default TemplateManager;