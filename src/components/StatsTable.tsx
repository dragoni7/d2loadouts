import React, { useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

const defaultData = [
  // Add your data here
  {
    exotic: "image_url",
    mobility: 30,
    resilience: 100,
    recovery: 50,
    discipline: 44,
    intellect: 70,
    strength: 24,
    tiers: 31,
    usedMods: "Mod1, Mod2, Mod3",
  },
  // Add the rest of the data
];

const columnHelper = createColumnHelper();

const columns: any = [
  columnHelper.accessor("exotic", {
    cell: (info) => (
      <img
        src={info.getValue()}
        alt="exotic"
        style={{ width: "30px", height: "30px" }}
      />
    ),
    header: "Exotic",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("mobility", {
    cell: (info) => info.getValue(),
    header: "Mobility",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("resilience", {
    cell: (info) => info.getValue(),
    header: "Resilience",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("recovery", {
    cell: (info) => info.getValue(),
    header: "Recovery",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("discipline", {
    cell: (info) => info.getValue(),
    header: "Discipline",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("intellect", {
    cell: (info) => info.getValue(),
    header: "Intellect",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("strength", {
    cell: (info) => info.getValue(),
    header: "Strength",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("tiers", {
    cell: (info) => info.getValue(),
    header: "Tiers",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("usedMods", {
    cell: (info) => info.getValue(),
    header: "Used Mods",
    footer: (info) => info.column.id,
  }),
];

const StatsTable: React.FC = () => {
  const [data, setData] = useState(() => [...defaultData]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-2" style={{ fontSize: "10px" }}>
      <table
        style={{
          width: "100%",
          border: "1px solid white",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              style={{ borderBottom: "1px solid white" }}
            >
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  style={{
                    fontSize: "10px",
                    padding: "4px",
                    border: "1px solid white",
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              style={{ cursor: "pointer", borderBottom: "1px solid white" }}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  style={{ padding: "4px", border: "1px solid white" }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id} style={{ borderTop: "1px solid white" }}>
              {footerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  style={{
                    fontSize: "10px",
                    padding: "4px",
                    border: "1px solid white",
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
    </div>
  );
}

export default StatsTable;
