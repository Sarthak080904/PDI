import { v4 as uuidv4 } from 'uuid';

const defaultTemplate = () => {
  // Generate column IDs first
  const column1Id = uuidv4();
  const column2Id = uuidv4();
  
  return {
    header: {
      companyName: "Iobot Technologies India pvt.ltd",
      companyCIN: "CNU 172000N2016FTG166992",
      companyAddress: "B102 Shreenanda Classic Rahatani Fune -411017",
      companyContact: "(+91)7447422228",
      companyEmail: "info@lobot.in",
      reportTitle: "Pre-Dispatch Inspection Report",
      reportNumber: `VTS_${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      reportDate: new Date().toISOString().split('T')[0],
      clientName: "",
      quantity: 0
    },
    identifications: [
      { id: uuidv4(), imei: "", uccId: "", canResistance: "" }
    ],
    inspectionTable: {
      columns: [
        { 
          id: column1Id, 
          label: "Test Case", 
          type: "text" 
        },
        { 
          id: column2Id, 
          label: "Status", 
          type: "dropdown",
          options: ["OK", "NOT OK", "NA"]
        }
      ],
      rows: [
        {
          id: uuidv4(),
          label: "Voltage Test",
          cells: [
            { columnId: column1Id, value: "Check input voltage" },
            { columnId: column2Id, value: "OK" }
          ]
        }
      ]
    },
    footer: {
      testedBy: { name: "", signature: null },
      verifiedBy: { name: "", signature: null }
    }
  };
};

export default defaultTemplate;