import React from 'react';
import './DataTable.css';

function DataTable({ columns, data, onDelete, onEdit }) {
  const formatValue = (value, key) => {
    if (!value) return '-';
    
    if (key && key.includes('time')) {
      const date = new Date(value);
      return date.toLocaleString('uk-UA');
    }
    
    if (typeof value === 'number') {
      return value.toFixed(2);
    }
    
    return value;
  };

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key}>{col.label}</th>
            ))}
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr className="empty-row">
              <td colSpan={columns.length + 1}>Немає даних</td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={idx} className="data-row">
                {columns.map(col => (
                  <td key={col.key} data-label={col.label}>
                    {formatValue(row[col.key], col.key)}
                  </td>
                ))}
                <td className="actions">
                  <button 
                    className="btn-edit"
                    onClick={() => onEdit(row._id || row.id)}
                    title="Редагувати"
                  >
                    ✏️
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => onDelete(row._id || row.id)}
                    title="Видалити"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
