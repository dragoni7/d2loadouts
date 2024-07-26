import React, { useMemo, useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { styled } from '@mui/system';
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

const StatsTableContainer = styled('div')({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflowX: 'auto',
});

const TableHeader = styled('div')({
  display: 'flex',
});

const TableRow = styled('div')({
  display: 'flex',
});

const TableCell = styled('div')({
  flex: 1,
  padding: '8px',
  border: '1px solid white',
  fontSize: '10px',
  textAlign: 'center',
});

const TableHeaderCell = styled(TableCell)({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  fontWeight: 'bold',
});

const TableFooter = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '10px',
});

const TableFooterButton = styled('button')({
  padding: '5px 10px',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  border: '1px solid white',
  color: 'white',
  cursor: 'pointer',
  fontSize: '10px',
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  '@media (max-width: 768px)': {
    padding: '3px 6px',
    fontSize: '8px',
  },
  '@media (max-width: 480px)': {
    padding: '2px 4px',
    fontSize: '6px',
  },
});

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
    <StatsTableContainer>
      <TableHeader>
        {table
          .getHeaderGroups()
          .map((headerGroup) =>
            headerGroup.headers.map((header) => (
              <TableHeaderCell key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHeaderCell>
            ))
          )}
      </TableHeader>
      <div>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </div>
      <TableFooter>
        <TableFooterButton
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
        >
          Previous
        </TableFooterButton>
        <span>
          Page {currentPage + 1} of {Math.ceil(data.length / itemsPerPage)}
        </span>
        <TableFooterButton
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(data.length / itemsPerPage) - 1))
          }
          disabled={currentPage === Math.ceil(data.length / itemsPerPage) - 1}
        >
          Next
        </TableFooterButton>
      </TableFooter>
    </StatsTableContainer>
  );
};

export default StatsTable;
