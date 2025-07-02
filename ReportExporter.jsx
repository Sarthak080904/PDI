import React from 'react';
import { useReportContext } from '../contexts/ReportContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const ReportExporter = () => {
  const { report } = useReportContext();

  const exportPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(16);
    doc.text(report.header.reportTitle, 105, 15, null, null, 'center');
    doc.setFontSize(10);
    doc.text(`Report Number: ${report.header.reportNumber}`, 15, 25);
    doc.text(`Date: ${report.header.reportDate}`, 15, 30);
    doc.text(`Client: ${report.header.clientName}`, 15, 35);
    
    // Identification Section
    doc.setFontSize(12);
    doc.text('Identification Numbers:', 15, 45);
    const identData = report.identifications.map(id => [
      id.imei, 
      id.uccId, 
      id.canResistance
    ]);
    
    doc.autoTable({
      head: [['IMEI No', 'UCC ID', 'CAN Resistance']],
      body: identData,
      startY: 50
    });
    
    // Inspection Table
    doc.setFontSize(12);
    doc.text('Inspection Results:', 15, doc.lastAutoTable.finalY + 10);
    
    const tableHeaders = report.inspectionTable.columns.map(col => col.label);
    const tableData = report.inspectionTable.rows.map(row => {
      return report.inspectionTable.columns.map(col => {
        const cell = row.cells.find(c => c.columnId === col.id);
        return formatCellValue(cell?.value, col.type);
      });
    });
    
    doc.autoTable({
      head: [tableHeaders],
      body: tableData,
      startY: doc.lastAutoTable.finalY + 15
    });
    
    // Footer
    const finalY = doc.lastAutoTable.finalY + 20;
    
    // Tested By
    doc.text('Tested By:', 30, finalY);
    doc.text(report.footer.testedBy.name, 30, finalY + 10);
    if (report.footer.testedBy.signature) {
      doc.addImage(
        report.footer.testedBy.signature,
        'PNG',
        30,
        finalY + 15,
        40,
        15
      );
    }
    
    // Verified By
    doc.text('Verified By:', 150, finalY);
    doc.text(report.footer.verifiedBy.name, 150, finalY + 10);
    if (report.footer.verifiedBy.signature) {
      doc.addImage(
        report.footer.verifiedBy.signature,
        'PNG',
        150,
        finalY + 15,
        40,
        15
      );
    }
    
    doc.save(`inspection-report-${report.header.reportNumber}.pdf`);
  };

  const exportExcel = () => {
    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Header sheet
    const headerData = [
      ['Company Name', report.header.companyName],
      ['Report Title', report.header.reportTitle],
      // ... other header fields
    ];
    XLSX.utils.book_append_sheet(wb, 
      XLSX.utils.aoa_to_sheet(headerData), 
      "Header"
    );
    
    // Identification sheet
    const identData = [
      ['IMEI No', 'UCC ID', 'CAN Resistance'],
      ...report.identifications.map(id => [id.imei, id.uccId, id.canResistance])
    ];
    XLSX.utils.book_append_sheet(wb, 
      XLSX.utils.aoa_to_sheet(identData), 
      "Identification"
    );
    
    // Inspection sheet
    const tableHeaders = report.inspectionTable.columns.map(col => col.label);
    const tableData = report.inspectionTable.rows.map(row => {
      return report.inspectionTable.columns.map(col => {
        const cell = row.cells.find(c => c.columnId === col.id);
        return formatCellValue(cell?.value, col.type);
      });
    });
    
    const inspectionSheet = XLSX.utils.aoa_to_sheet([
      tableHeaders,
      ...tableData
    ]);
    XLSX.utils.book_append_sheet(wb, inspectionSheet, "Inspection");
    
    // Save file
    XLSX.writeFile(wb, `inspection-report-${report.header.reportNumber}.xlsx`);
  };

  const formatCellValue = (value, type) => {
    if (type === 'checkbox') return value ? 'Yes' : 'No';
    if (type === 'date' && value) return new Date(value).toLocaleDateString();
    return value;
  };

  return (
    <div className="exporter">
      <button onClick={exportPDF} className="btn-primary">Export to PDF</button>
      <button onClick={exportExcel} className="btn-primary">Export to Excel</button>
    </div>
  );
};

export default ReportExporter; 
