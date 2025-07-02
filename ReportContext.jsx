import React, { createContext, useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { fetchTemplates, saveReport, saveTemplate as apiSaveTemplate, deleteTemplate as apiDeleteTemplate } from '../api';
import defaultTemplate from '../templates/defaultTemplate';

const ReportContext = createContext();

export const useReportContext = () => useContext(ReportContext);

export const ReportProvider = ({ children }) => {
  const [report, setReport] = useState(() => ({
    ...defaultTemplate(),
    header: {
      ...defaultTemplate().header,
      reportNumber: `VTS_${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      reportDate: new Date().toISOString().split('T')[0]
    }
  }));

  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateHeader = (header) => {
    setReport(prev => ({ ...prev, header: { ...prev.header, ...header } }));
  };

  const updateIdentifications = (identifications) => {
    setReport(prev => ({ ...prev, identifications }));
  };

  const updateInspectionTable = (inspectionTable) => {
    setReport(prev => ({ ...prev, inspectionTable }));
  };

  const updateFooter = (footer) => {
    setReport(prev => ({ ...prev, footer }));
  };

  const saveReportToDatabase = async (reportData) => {
    setIsLoading(true);
    try {
      const response = await saveReport(reportData); // Using imported saveReport
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  //Template
  useEffect(() => {
    const verifyTemplates = async () => {
      try {
        const actualTemplates = await fetchTemplates();
        console.log('Actual DB templates:', actualTemplates);
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };
    verifyTemplates();
  }, []);

  useEffect(() => {
    console.log('Loading all templates on mount');
    loadAllTemplates();
    fetchTemplates2()
  }, []);

  const loadAllTemplates = async () => {
    setIsLoading(true);
    try {
      const fetchedTemplates = await fetchTemplates();
      console.log('Fetched templates:', fetchedTemplates);
      setTemplates(fetchedTemplates);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTemplate = async (templateName) => {
    if (!templateName?.trim()) {
      throw new Error('Template name is required');
    }

    setIsLoading(true);
    try {
      const template = {
        name: templateName.trim(),
        config: { ...report } // Create new object to avoid reference issues
      };

      const savedTemplate = await apiSaveTemplate(template);

      // Update state by replacing the array completely
      setTemplates(prev => [
        savedTemplate,
        ...prev.filter(t => t.id !== savedTemplate.id) // Remove any duplicates
      ]);

      return savedTemplate;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTemplate = async (templateId) => {
    setIsLoading(true);
    try {
      await apiDeleteTemplate(templateId);
      setTemplates(prev => prev.filter(t => t.id !== templateId));
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTemplates2 = async () => {
    setIsLoading(true);
    try {
      const data = await fetchTemplates(); // Make sure this is imported
      return data;
    } catch (error) {
      setError(error.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const loadTemplate = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setReport(template.config);
    }
  };

  // ReportContext.jsx
  useEffect(() => {
    let isMounted = true;

    const loadTemplates = async () => {
      try {
        const data = await fetchTemplates();
        if (isMounted) {
          setTemplates(data);
        }
      } catch (error) {
        if (isMounted) {
          setError(error.message);
        }
      }
    };

    loadTemplates();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <ReportContext.Provider value={{
      report,
      templates,
      isLoading,
      error,
      updateHeader,
      updateIdentifications,
      updateInspectionTable,
      updateFooter,
      saveReportToDatabase,
      saveTemplate,
      loadTemplate,
      fetchTemplates,
      deleteTemplate,
      loadAllTemplates,
    }}>
      {children}
    </ReportContext.Provider>
  );
};