import React, { useRef } from 'react';
import { useReportContext } from 'ReportContext.jsx';
import SignatureCanvas from 'react-signature-canvas';

const FooterSection = () => {
  const { report, updateFooter } = useReportContext();
  const { footer } = report;
  const sigCanvasTested = useRef(null);
  const sigCanvasVerified = useRef(null);

  const handleNameChange = (field, value) => {
    updateFooter({
      ...footer,
      [field]: { ...footer[field], name: value }
    });
  };

  const saveSignature = (field, canvasRef) => {
    if (!canvasRef.current.isEmpty()) {
      const signature = canvasRef.current.getTrimmedCanvas().toDataURL('image/png');
      updateFooter({
        ...footer,
        [field]: { ...footer[field], signature }
      });
    }
  };

  const clearSignature = (field, canvasRef) => {
    canvasRef.current.clear();
    updateFooter({
      ...footer,
      [field]: { ...footer[field], signature: null }
    });
  };

  return (
    <div className="footer-section grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Tested By Section */}
      <div className="signature-box">
        <h3>Tested By</h3>
        
        <div className="mb-4">
          <label>Name</label>
          <input
            type="text"
            value={footer?.testedBy.name}
            onChange={(e) => handleNameChange('testedBy', e.target.value)}
          />
        </div>
        
        <div className="signature-pad">
          <SignatureCanvas 
            ref={sigCanvasTested}
            penColor="black"
            canvasProps={{ 
              width: 400, 
              height: 150, 
              className: 'signature-canvas' 
            }} 
          />
          
          <div className="signature-actions">
            <button 
              onClick={() => saveSignature('testedBy', sigCanvasTested)}
              className="btn-primary"
            >
              Save Signature
            </button>
            <button 
              onClick={() => clearSignature('testedBy', sigCanvasTested)}
              className="btn-secondary"
            >
              Clear
            </button>
          </div>
          
          {footer?.testedBy.signature && (
            <div className="signature-preview">
              <img 
                src={footer.testedBy.signature} 
                alt="Tested By Signature" 
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Verified By Section (similar structure) */}
    </div>
  );
};

export default FooterSection; 
