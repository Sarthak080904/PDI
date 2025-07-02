import React from 'react';
import { useReportContext } from 'ReportContext.jsx';
import { FaSave } from 'react-icons/fa';

const SaveButton = () => {
  const { report, saveReportToDatabase, isLoading } = useReportContext();

  const handleSave = async () => {
  try {
    console.log('Report data before save:', JSON.stringify(report, null, 2));
    const result = await saveReportToDatabase(report);
      console.log('Report saved successfully:', result);
      alert(`Report saved successfully! ID: ${result.id}`);
    } catch (error) {
      console.error('Save error:', error);
      alert(`Failed to save report: ${error.message}`);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={isLoading}
      className="save-button"
    >
      <FaSave className="icon" />
      {isLoading ? 'Saving...' : 'Save Report'}
    </button>
  );
};

export default SaveButton;
