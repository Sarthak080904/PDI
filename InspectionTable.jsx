import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useReportContext } from 'ReportContext.jsx';
import ColumnConfigEditor from 'ColumnConfigEditor.jsx';
import { FaTrash, FaPlus, FaCog } from 'react-icons/fa';

const InspectionTable = () => {
  const { report, updateInspectionTable } = useReportContext();
  
  // Safely access inspectionTable with defaults
  const inspectionTable = report?.inspectionTable || {
    columns: [],
    rows: []
  };

  const [editingColumn, setEditingColumn] = useState(null);

  const addRow = () => {
    const newRow = {
      id: uuidv4(),
      label: `Row ${inspectionTable.rows.length + 1}`,
      cells: inspectionTable.columns.map(col => ({
        columnId: col.id,
        value: col.type === 'checkbox' ? false : ''
      }))
    };
    updateInspectionTable({ 
      ...inspectionTable, 
      rows: [...inspectionTable.rows, newRow] 
    });
  };

  const addColumn = () => {
    const newColumn = {
      id: uuidv4(),
      label: `Column ${inspectionTable.columns.length + 1}`,
      type: 'text',
      options: []
    };
    
    const updatedRows = inspectionTable.rows.map(row => ({
      ...row,
      cells: [...row.cells, { columnId: newColumn.id, value: '' }]
    }));
    
    updateInspectionTable({
      ...inspectionTable,
      columns: [...inspectionTable.columns, newColumn],
      rows: updatedRows
    });
  };

  const deleteRow = (rowId) => {
    updateInspectionTable({
      ...inspectionTable,
      rows: inspectionTable.rows.filter(row => row.id !== rowId)
    });
  };

  const deleteColumn = (columnId) => {
    if (inspectionTable.columns.length <= 1) return;
    
    updateInspectionTable({
      ...inspectionTable,
      columns: inspectionTable.columns.filter(col => col.id !== columnId),
      rows: inspectionTable.rows.map(row => ({
        ...row,
        cells: row.cells.filter(cell => cell.columnId !== columnId)
      }))
    });
  };

  const updateCell = (rowId, columnId, value) => {
    updateInspectionTable({
      ...inspectionTable,
      rows: inspectionTable.rows.map(row => {
        if (row.id === rowId) {
          return {
            ...row,
            cells: row.cells.map(cell => {
              if (cell.columnId === columnId) {
                return { ...cell, value };
              }
              return cell;
            })
          };
        }
        return row;
      })
    });
  };

  const updateRowLabel = (rowId, newLabel) => {
    updateInspectionTable({
      ...inspectionTable,
      rows: inspectionTable.rows.map(row => {
        if (row.id === rowId) {
          return { ...row, label: newLabel };
        }
        return row;
      })
    });
  };

  const renderCell = (row, column) => {
    const cell = row.cells.find(c => c.columnId === column.id);
    if (!cell) return null;

    switch (column.type) {
      case 'text':
        return (
          <input
            type="text"
            value={cell.value || ''}
            onChange={(e) => updateCell(row.id, column.id, e.target.value)}
            className="cell-input"
          />
        );
      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={cell.value || false}
            onChange={(e) => updateCell(row.id, column.id, e.target.checked)}
            className="cell-checkbox"
          />
        );
      case 'dropdown':
        return (
          <select
            value={cell.value || ''}
            onChange={(e) => updateCell(row.id, column.id, e.target.value)}
            className="cell-dropdown"
          >
            {column.options?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );
      case 'number':
        return (
          <input
            type="number"
            value={cell.value || ''}
            onChange={(e) => updateCell(row.id, column.id, e.target.value)}
            className="cell-number"
          />
        );
      case 'date':
        return (
          <input
            type="date"
            value={cell.value || ''}
            onChange={(e) => updateCell(row.id, column.id, e.target.value)}
            className="cell-date"
          />
        );
      default:
        return <input type="text" className="cell-input" />;
    }
  };

  return (
    <div className="inspection-table">
      <div className="flex justify-between mb-4">
        <h2>Inspection Table</h2>
        <div className="space-x-2">
          <button onClick={addRow} className="btn-primary">
            <FaPlus /> Add Row
          </button>
          <button onClick={addColumn} className="btn-primary">
            <FaPlus /> Add Column
          </button>
        </div>
      </div>

      {inspectionTable.columns.length === 0 ? (
        <div className="empty-table-message">
          No columns defined. Add your first column to get started.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th>Row Label</th>
                {inspectionTable.columns.map(col => (
                  <th key={col.id} className="relative">
                    <div className="flex items-center justify-between">
                      <span>{col.label}</span>
                      <div className="flex">
                        <button 
                          onClick={() => setEditingColumn(col)}
                          className="text-sm"
                        >
                          <FaCog />
                        </button>
                        {inspectionTable.columns.length > 1 && (
                          <button 
                            onClick={() => deleteColumn(col.id)}
                            className="text-sm ml-1 text-red-500"
                          >
                            <FaTrash size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inspectionTable.rows.map(row => (
                <tr key={row.id}>
                  <td>
                    <input
                      type="text"
                      value={row.label || ''}
                      onChange={(e) => updateRowLabel(row.id, e.target.value)}
                      className="row-label-input"
                    />
                  </td>
                  {inspectionTable.columns.map(col => (
                    <td key={`${row.id}-${col.id}`}>
                      {renderCell(row, col)}
                    </td>
                  ))}
                  <td>
                    <button 
                      onClick={() => deleteRow(row.id)}
                      className="btn-danger"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingColumn && (
        <ColumnConfigEditor 
          column={editingColumn} 
          onClose={() => setEditingColumn(null)}
          onSave={(updatedCol) => {
            const updatedColumns = inspectionTable.columns.map(c => 
              c.id === updatedCol.id ? updatedCol : c
            );
            updateInspectionTable({ ...inspectionTable, columns: updatedColumns });
            setEditingColumn(null);
          }}
        />
      )}
    </div>
  );
};

export default InspectionTable;
