import { ReportProvider } from 'ReportContext.jsx';
import HeaderSection from 'HeaderSection.jsx';
import IdentificationSection from 'IdentificationSection.js';
import InspectionTable from 'InspectionTable.jsx';
import FooterSection from 'FooterSection.jsx';
import TemplateManager from 'TemplateManager.jsx';
import ReportExporter from 'ReportExporter.jsx';
import SaveButton from 'SaveButton.jsx'; // New component
import 'App.css';

function App() {
  return (
    <ReportProvider>
      <div className="app-container">
        <header className="app-header">
          <div className="logo-container">
            <img src="https://cdn.thingsup.io/wp-content/uploads/2020/05/Transparent.png.webp" alt="Company Logo" className="logo" />
          </div>
          <h1>Pre-Dispatch Inspection Report</h1>
          <div className="header-actions">
          </div>
        </header>
        <nav className="app-nav">
          <TemplateManager /> {/* Template management component */}
        </nav>
        
        <main className="app-content">
          <HeaderSection />
          <IdentificationSection />
          <InspectionTable />
          <FooterSection />
        </main>
        
        <footer className="app-footer">
          <SaveButton /> {/* Added save button */}
          <ReportExporter />
        </footer>
      </div>
    </ReportProvider>
  );
}

export default App;
