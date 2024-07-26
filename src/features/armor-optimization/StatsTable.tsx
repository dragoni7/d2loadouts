import React, { useMemo, useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { DestinyArmor } from '../../types';

const columnHelper = createColumnHelper<{
  type: string;
  mobility: number;
  resilience: number;
  recovery: number;
  discipline: number;
  intellect: number;
  strength: number;
}>();

const columns: any = [
  columnHelper.accessor('type', {
    cell: (info) => info.getValue(),
    header: 'Type',
  }),
  columnHelper.accessor('mobility', {
    cell: (info) => info.getValue(),
    header: 'Mobility',
  }),
  columnHelper.accessor('resilience', {
    cell: (info) => info.getValue(),
    header: 'Resilience',
  }),
  columnHelper.accessor('recovery', {
    cell: (info) => info.getValue(),
    header: 'Recovery',
  }),
  columnHelper.accessor('discipline', {
    cell: (info) => info.getValue(),
    header: 'Discipline',
  }),
  columnHelper.accessor('intellect', {
    cell: (info) => info.getValue(),
    header: 'Intellect',
  }),
  columnHelper.accessor('strength', {
    cell: (info) => info.getValue(),
    header: 'Strength',
  }),
];

interface StatsTableProps {
  permutations: DestinyArmor[][];
}

const StatsTable: React.FC<StatsTableProps> = ({ permutations }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const data = useMemo(() => {
    return permutations.map((permutation, index) => {
      return {
        type: `Permutation ${index + 1}`,
        mobility: permutation.reduce((sum, item) => sum + item.mobility, 0),
        resilience: permutation.reduce((sum, item) => sum + item.resilience, 0),
        recovery: permutation.reduce((sum, item) => sum + item.recovery, 0),
        discipline: permutation.reduce((sum, item) => sum + item.discipline, 0),
        intellect: permutation.reduce((sum, item) => sum + item.intellect, 0),
        strength: permutation.reduce((sum, item) => sum + item.strength, 0),
      };
    });
  }, [permutations]);

  const paginatedData = useMemo(() => {
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    return data.slice(start, end);
  }, [currentPage, data]);

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-2" style={{ fontSize: '10px', width: '50%' }}>
      <div style={{ display: 'flex', borderBottom: '1px solid white' }}>
        {table.getHeaderGroups().map((headerGroup) =>
          headerGroup.headers.map((header) => (
            <div
              key={header.id}
              style={{
                fontSize: '10px',
                padding: '2px',
                border: '1px solid white',
                flex: 1,
              }}
            >
              {header.isPlaceholder
                ? null
                : flexRender(header.column.columnDef.header, header.getContext())}
            </div>
          ))
        )}
      </div>
      <div>
        {table.getRowModel().rows.map((row) => (
          <div key={row.id} style={{ display: 'flex', borderBottom: '1px solid white' }}>
            {row.getVisibleCells().map((cell) => (
              <div
                key={cell.id}
                style={{
                  padding: '2px',
                  border: '1px solid white',
                  flex: 1,
                }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: '10px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        <span>
          Page {currentPage + 1} of {Math.ceil(data.length / itemsPerPage)}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(data.length / itemsPerPage) - 1))
          }
          disabled={currentPage === Math.ceil(data.length / itemsPerPage) - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StatsTable;
