import React from "react";
import {
  useReactTable,
  ColumnResizeMode,
  getCoreRowModel,
  ColumnDef,
  flexRender,
  ColumnResizeDirection,
  RowData,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { Input, Table } from "@mantine/core";
import { getFilteredRowModel } from "@tanstack/react-table";
 

type Deal = {
  dealtype: string;
  title: string;
  quantity: string;
  price: string;
  hashtags: string;
  description: string;
};

const defaultData: Deal[] = [
  {
    dealtype: "WTS",
    title: "iPhone 14 pro max",
    quantity: "400pcs",
    price: "500$",
    hashtags: "iphone 13,iphone 14,new",
    description:
      "Grade A/A-, Fully Tested, Pack Boxes included, Grade B condition.",
  },
  {
    dealtype: "WTS",
    title: "iPhone 13 Pro Max 128GB Grade A/A-",
    quantity: "500pcs",
    price: "600$",
    hashtags: "iPhone13ProMax,128GB,GradeA",
    description:
      "Fully Tested with HSO BATTERY 80%+, Grade B, Pack Boxes included.",
  },
];
 
const defaultColumns: ColumnDef<Deal>[] = [
  {
    accessorKey: "dealtype",
    header: "Type",
    // cell: (info) => info.getValue(),
  },
  {
    accessorKey: "title",
    header: "Title",
    // cell: (info) => info.getValue(),
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    // cell: (info) => info.getValue(),
  },
  {
    accessorKey: "price",
    header: "Price",
    // cell: (info) => info.getValue(),
  },
  {
    accessorKey: "hashtags",
    header: "Hashtags",
    // cell: (info) => info.getValue(),
  },
  {
    accessorKey: "description",
    header: "Description",
    // cell: (info) => info.getValue(),
  },
];
declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

// Give our default column cell renderer editing superpowers!
const defaultColumn: Partial<ColumnDef<Deal>> = {
  cell: ({ getValue, row: { index }, column: { id }, table }) => {
    const initialValue = getValue();
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue);

    // When the input is blurred, we'll call our table meta's updateData function
    const onBlur = () => {
      table.options.meta?.updateData(index, id, value);
    };

    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return (
      <Input
        variant="unstyled"
            value={value as string}
            onChange={(e) => setValue(e.target.value)}
            onBlur={onBlur}
      />
      //   <input
      //     value={value as string}
      //     onChange={(e) => setValue(e.target.value)}
      //     onBlur={onBlur}
      //   />
    );
  },
};

 function useSkipper() {
   const shouldSkipRef = React.useRef(true);
   const shouldSkip = shouldSkipRef.current;

   // Wrap a function with this to skip a pagination reset temporarily
   const skip = React.useCallback(() => {
     shouldSkipRef.current = false;
   }, []);

   React.useEffect(() => {
     shouldSkipRef.current = true;
   });

   return [shouldSkip, skip] as const;
 }
export function AppTable() {
  //   const [data] = React.useState(() => [...defaultData]);
  const [data, setData] = React.useState(() => [...defaultData]);
  const [columns] = React.useState<typeof defaultColumns>(() => [
    ...defaultColumns,
  ]);

  const [columnResizeMode, setColumnResizeMode] =
    React.useState<ColumnResizeMode>("onChange");

  const [columnResizeDirection, setColumnResizeDirection] =
    React.useState<ColumnResizeDirection>("ltr");

  const rerender = React.useReducer(() => ({}), {})[1];
  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  const table = useReactTable({
    data,
    columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex,
    // Provide our updateData function to our table meta
    meta: {
      updateData: (rowIndex, columnId, value) => {
        // Skip page index reset until after next rerender
        skipAutoResetPageIndex();
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
    },
    debugTable: true,
  });

  return (
    <Table
      {...{
        style: {
          width: table.getCenterTotalSize(),
        },
      }}
      striped
      highlightOnHover
      withTableBorder
      withColumnBorders
    >
      <Table.Thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <Table.Tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <Table.Th
                {...{
                  key: header.id,
                  colSpan: header.colSpan,
                  style: {
                    width: header.getSize(),
                  },
                }}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                <div
                  {...{
                    onDoubleClick: () => header.column.resetSize(),
                    onMouseDown: header.getResizeHandler(),
                    onTouchStart: header.getResizeHandler(),
                    className: `resizer ${
                      table.options.columnResizeDirection
                    } ${header.column.getIsResizing() ? "isResizing" : ""}`,
                    style: {
                      transform:
                        columnResizeMode === "onChange" &&
                        header.column.getIsResizing()
                          ? `translateX(${
                              (table.options.columnResizeDirection === "rtl"
                                ? -1
                                : 1) *
                              (table.getState().columnSizingInfo.deltaOffset ??
                                0)
                            }px)`
                          : "",
                    },
                  }}
                />
              </Table.Th>
            ))}
          </Table.Tr>
        ))}
      </Table.Thead>
      <Table.Tbody>
        {table.getRowModel().rows.map((row) => (
          <Table.Tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <Table.Td
                {...{
                  key: cell.id,
                  style: {
                    width: cell.column.getSize(),
                  },
                }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Table.Td>
            ))}
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
