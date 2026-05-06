'use client';

import React from 'react';
import styles from './dataTable.module.scss';
import Loader from '@/components/loader';
import TableSkeleton from '@/components/skeleton/TableSkeleton';

/**
 * DataTable
 *
 * Props:
 *  - columns: Array<{ key: string, label: string, render?: (row) => ReactNode }>
 *  - data: Array<object>
 *  - loading?: boolean
 *  - emptyMessage?: string
 *  - rowKey?: string | ((row) => string)   (default: 'id')
 */
export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'No data found.',
  rowKey = 'id',
}) {
  const getKey = (row) =>
    typeof rowKey === 'function' ? rowKey(row) : row[rowKey];

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {loading || data === null ? (
            <TableSkeleton rows={10} cols={columns.length} />
          ) : data?.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={styles.empty}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={getKey(row)}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row, undefined, index) : row[col.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
