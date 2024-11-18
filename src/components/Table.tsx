import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type Row,
  type TableOptions,
} from '@tanstack/react-table';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { forwardRef, useRef, useState, type MouseEvent } from 'react';
import { twJoin, twMerge } from 'tailwind-merge';

type TableProps = {
  /** The caption for the table. */
  caption: string;
  /** Optional additional class names for the component. */
  className?: string;
  /** The columns configuration for the table.
   * Corresponds to the same prop in react table (https://tanstack.com/table/v8/docs/api/core/table#columns)
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: any[];
  /** The data to be displayed in the table.
   * Corresponds to the same prop in react table (https://tanstack.com/table/v8/docs/api/core/table#data)
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  /** Optional visibility settings for table columns. */
  visibility?: Record<string, boolean>;
  /** Additional properties for the table, excluding columns and data. */
  additionalTableProps?: Omit<TableOptions<unknown>, 'columns' | 'data' | 'getCoreRowModel'>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getRowRange = (rows: Row<any>[], currentIndex: number, selectedIndex: number | null): Row<any>[] => {
  if (selectedIndex === null) {
    return [rows[currentIndex]];
  }

  const rangeStart = selectedIndex > currentIndex ? currentIndex : selectedIndex;
  const rangeEnd = rangeStart === currentIndex ? selectedIndex : currentIndex;
  return rows.slice(rangeStart, rangeEnd + 1);
};

function InnerTable(
  { columns, data, className, caption, visibility, additionalTableProps }: TableProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const [columnVisibility] = useState(visibility ?? {});

  const { getHeaderGroups, getRowModel, setRowSelection, getState } = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      columnVisibility,
    },
    ...additionalTableProps,
  });

  const parentRef = useRef(null);
  const lastSelectedIndex = useRef<number | null>(null);

  return (
    <div ref={forwardedRef} className={twMerge('relative', className)}>
      <div className="h-full overflow-auto" ref={parentRef} tabIndex={0}>
        <table className="w-full table-fixed border-collapse">
          <caption className="sr-only">{caption}</caption>
          <thead className="sticky top-0 bg-zinc-200 text-base dark:bg-zinc-800">
            {getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className={'relative p-2 text-left'} style={{ width: header.getSize() }}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={twJoin(
                          header.column.getCanSort() && 'flex cursor-pointer select-none items-center justify-between',
                          header.column.getIsSorted() &&
                            'before:absolute before:-bottom-1 before:left-0 before:z-10 before:block before:h-2 before:w-full before:rounded-full',
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <ChevronUpIcon className="h-4" />,
                          desc: <ChevronDownIcon className="h-4" />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {getRowModel().rows.map((row, index) => {
              let even = index % 2 === 0;
              let odd = !even;
              const isSelected = row.getIsSelected();
              if (isSelected) {
                even = false;
                odd = false;
              }

              return (
                <tr
                  key={row.id}
                  className={twJoin(
                    additionalTableProps?.enableRowSelection && 'cursor-pointer select-none',
                    'border-y border-y-zinc-200 dark:border-y-zinc-700',
                    even && 'bg-zinc-100 dark:bg-zinc-500',
                    odd && 'bg-zinc-200 dark:bg-zinc-600',
                    row.getIsSelected() && 'bg-primary-500 text-zinc-50',
                  )}
                  onClick={
                    additionalTableProps?.enableRowSelection
                      ? (e: MouseEvent<HTMLTableRowElement>): void => {
                          const { rowSelection } = getState();
                          const isCellSelected = row.getIsSelected();
                          if (e.shiftKey) {
                            const { rows } = getRowModel();
                            const rowsToToggle = getRowRange(rows, index, lastSelectedIndex.current);
                            setRowSelection(Object.fromEntries(rowsToToggle.map((r) => [r.id, !isCellSelected])));
                          } else if (e.metaKey || e.ctrlKey) {
                            const newSelection = structuredClone(rowSelection);
                            if (newSelection[row.id]) {
                              delete newSelection[row.id];
                            } else {
                              newSelection[row.id] = true;
                            }
                            console.log('newSelection', newSelection);
                            setRowSelection(newSelection);
                          } else {
                            if (Object.keys(rowSelection).length > 1) {
                              setRowSelection({ [row.id]: true });
                            } else {
                              row.toggleSelected();
                            }
                          }

                          if (!isCellSelected) {
                            lastSelectedIndex.current = index;
                          }
                        }
                      : undefined
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="truncate p-2"
                      title={cell.getValue() as string}
                      style={{ width: `${cell.column.getSize()}px` }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const Table = forwardRef(InnerTable);
