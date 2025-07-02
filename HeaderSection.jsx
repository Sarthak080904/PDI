import React from 'react';
import { useReportContext } from '../contexts/ReportContext';

const HeaderSection = () => {
  const { report, updateHeader } = useReportContext();
  const { header } = report || {};

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateHeader({ [name]: value });
  };

  if (!header) return <div>Loading header data...</div>;

  return (
    <div className="header-section section">
      <h2 className="section-title">Company & Report Header</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Company Information */}
        <div className="company-info">
          <h3 className="subsection-title">Company Details</h3>
          <div className="form-group">
            <label>Company Name</label>
            <input
              type="text"
              name="companyName"
              value={header.companyName || ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>Company CIN</label>
            <input
              type="text"
              name="companyCIN"
              value={header.companyCIN || ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="companyAddress"
              value={header.companyAddress || ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>Contact</label>
            <input
              type="text"
              name="companyContact"
              value={header.companyContact || ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="companyEmail"
              value={header.companyEmail || ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        {/* Report Information */}
        <div className="report-info">
          <h3 className="subsection-title">Report Details</h3>
          <div className="form-group">
            <label>Report Title</label>
            <input
              type="text"
              name="reportTitle"
              value={header.reportTitle || ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>Report Number</label>
            <input
              type="text"
              name="reportNumber"
              value={header.reportNumber || ''}
              readOnly
              className="form-input readonly"
            />
          </div>
          
          <div className="form-group">
            <label>Report Date</label>
            <input
              type="date"
              name="reportDate"
              value={header.reportDate || ''}
              readOnly
              className="form-input readonly"
            />
          </div>
          
          <div className="form-group">
            <label>Client Name</label>
            <input
              type="text"
              name="clientName"
              value={header.clientName || ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              name="quantity"
              value={header.quantity || 0}
              onChange={handleChange}
              min="0"
              className="form-input"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderSection;