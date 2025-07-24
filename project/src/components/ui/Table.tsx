import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface TableColumn<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
  sortable?: boolean;
  sortAccessor?: (item: T) => string | number;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  onRowRightClick?: (row: any, e: React.MouseEvent<HTMLTableRowElement>) => void;

}

function Table<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No data available',
  onRowClick,
  onRowRightClick,
}: TableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: number | null;
    direction: 'asc' | 'desc';
  }>({
    key: null,
    direction: 'asc'
  });

  const handleSort = (columnIndex: number, column: TableColumn<T>) => {
    if (!column.sortable || !column.sortAccessor) return;

    setSortConfig({
      key: sortConfig.key === columnIndex && sortConfig.direction === 'asc' ? columnIndex : columnIndex,
      direction: sortConfig.key === columnIndex && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const sortedData = React.useMemo(() => {
    if (sortConfig.key === null) return data;

    const column = columns[sortConfig.key];
    if (!column.sortAccessor) return data;

    return [...data].sort((a, b) => {
      const aValue = column.sortAccessor(a);
      const bValue = column.sortAccessor(b);

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortConfig.direction === 'asc'
        ? (aValue > bValue ? 1 : -1)
        : (bValue > aValue ? 1 : -1);
    });
  }, [data, sortConfig, columns]);

  return (
    <div className="overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 ${
                  column.sortable ? 'cursor-pointer select-none' : ''
                } ${column.className || ''}`}
                onClick={() => column.sortable && handleSort(index, column)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.header}</span>
                  {column.sortable && (
                    <span className="inline-flex flex-col">
                      <ChevronUp
                        className={`h-3 w-3 ${
                          sortConfig.key === index &&
                          sortConfig.direction === 'asc'
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-400 dark:text-gray-500'
                        }`}
                      />
                      <ChevronDown
                        className={`h-3 w-3 -mt-1 ${
                          sortConfig.key === index &&
                          sortConfig.direction === 'desc'
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-400 dark:text-gray-500'
                        }`}
                      />
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
          {sortedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((item) => (
              <tr
                  key={keyExtractor(item)}
                  onClick={() => onRowClick?.(item)}
                  onContextMenu={(e) => onRowRightClick?.(item, e)}
                  className="cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                {columns.map((column, index) => (
                  <td
                    key={index}
                    className={`whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300 ${column.className || ''}`}
                  >
                    {typeof column.accessor === 'function'
                      ? column.accessor(item)
                      : (item[column.accessor] as React.ReactNode)}
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

export default Table;