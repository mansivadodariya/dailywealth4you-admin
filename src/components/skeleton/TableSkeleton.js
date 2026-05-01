import React from 'react';
import Skeleton from './index';

const TableSkeleton = ({ rows = 5, cols = 5 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex}>
          {Array.from({ length: cols }).map((_, colIndex) => (
            <td key={colIndex}>
              <Skeleton height="20px" width={colIndex === 0 ? '60%' : '80%'} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export default TableSkeleton;
