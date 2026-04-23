import * as XLSX from 'xlsx';

/**
 * exportToExcel
 * @param {Object[]} rows     - Array of flat objects (column: value)
 * @param {string}   sheetName - Sheet tab name
 * @param {string}   fileName  - Output file name (include .xlsx)
 */
export function exportToExcel(rows, sheetName, fileName) {
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, fileName);
}
