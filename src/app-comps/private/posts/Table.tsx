import React, { useEffect, useRef, useState } from "react";
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
import { Box, Button, Input, Table, Textarea, TextInput } from "@mantine/core";
import { getFilteredRowModel } from "@tanstack/react-table";
import { useGlobalStyl } from "../../../hooks/useTheme";

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
  {
    dealtype: "WTS",
    title: "iPhone 13 Pro Max 128GB Grade A/A-",
    quantity: "500pcs",
    price: "600$",
    hashtags: "iPhone13ProMax,128GB,GradeA",
    description:
      "Fully Tested with HSO BATTERY 80%+, Grade B, Pack Boxes included.",
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
  {
    dealtype: "WTS",
    title: "iPhone 13 Pro Max 128GB Grade A/A-",
    quantity: "500pcs",
    price: "600$",
    hashtags: "iPhone13ProMax,128GB,GradeA",
    description:
      "Fully Tested with HSO BATTERY 80%+, Grade B, Pack Boxes included.",
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
    onEdit: (onEdit_: boolean) => void;
    editingCell: [number, number, string] | null;
    cellIsHighlighted: (rowIndex: number, columnIndex: number) => boolean;
    cancelEditing:()=>void
  }
}

// Give our default column cell renderer editing superpowers!
const defaultColumn: Partial<ColumnDef<Deal>> = {
  cell: ({ getValue, row: { index }, column: { id }, table }) => {
    const inputRef = useRef<any>(null);
    const { classes: classesG } = useGlobalStyl();
    // const [onEdit, setOnEdit] = useState(false);
    const columnIndex = table.getColumn(id)?.getIndex();

    const editingCell = table.options.meta?.editingCell;
    const highlitedCell =
      columnIndex &&
      columnIndex >= 0 &&
      table.options.meta?.cellIsHighlighted(
        index,
        columnIndex && columnIndex >= 0 ? columnIndex : -1
      );
    const onEdit = editingCell && editingCell[0] === index && editingCell[2] === id;

    const initialValue = getValue();
    const [beforEditingValue, setBeforEditingValue]=React.useState(initialValue);
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue);
    const HandleOnEdit = (val) => {
      //   setOnEdit(val);
      table.options.meta?.onEdit(val);
    };
    useEffect(() => {
      if (onEdit && inputRef.current && inputRef.current.focus) {
        inputRef.current.focus();
        resizeInput();
        setBeforEditingValue(value)
      }
    }, [onEdit]);
    // When the input is blurred, we'll call our table meta's updateData function
    const onSave = () => {
      HandleOnEdit(false);
      table.options.meta?.updateData(index, id, value);
      
    };
 
    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);
    const resizeInput = () => {
      if (inputRef.current) {
        // Reset width to get the right size
        inputRef.current.style.width = "auto";
        // inputRef.current.style.height = "auto";

        // Set width and height based on content size
        inputRef.current.style.width = `${inputRef.current.scrollWidth + 10}px`;
        // inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
      }
    };
    useEffect(() => {
      resizeInput();
    }, [value]);

    return (
      <>
        {!onEdit && (
          <Box
            // w="100%"
            // h="100%"
            bg="transparent"
            pl="2px"
            pr="2px"
            // onDoubleClick={() => {
            //   HandleOnEdit(true);
            // }}
            style={{
              display: "flex",
              alignItems: "center",
              fontFamily: "inherit",
              fontSize: "inherit",
              fontWeight: "inherit",
              pointerEvents: "none",
              //   border: highlitedCell
              //     ? "1px solid #d3d3d366"
              //     : "1px solid transparent",
              //   justifyContent: "center",
            }}
          >
            {value as string}
          </Box>
        )}
        {onEdit && (
          <input
            // size="sm"
            // p="0px"
            // h="30px"
            
            className={classesG.inputExcel}
            ref={inputRef}
            onKeyDown={(event) => { 
              if (event.key == "Enter") onSave();
              if (event.key == "Escape") {
                setValue(beforEditingValue);
                table.options.meta?.cancelEditing()
              }
            }}
            // w="100%"
            // h="30px"
            // classNames={{ input: classesG.inputT, wrapper: classesG.inputW }}
            // bg="violet.9"
            // variant="filled"
            value={value as string}
            onChange={(e) => setValue(e.target.value)}
            onBlur={onSave}
            style={{
              fontFamily: "inherit",
              fontSize: "inherit",
              fontWeight: "inherit",
              whiteSpace: "nowrap", // Prevent line breaks
              overflow: "hidden", // Prevent horizontal overflow

              //   height: "100%",
              border: "1px solid red;",
              position: "absolute", // Position input absolutely within the td
              top: 0,
              left: 0,
              bottom: 0,
              width: "auto", // Allow input width to grow with content
              // Allow input height to grow with content
              //   resize: "none", // Prevent manual resizing
              minWidth: "100px", // Minimum width for the input
              zIndex: 4000,
            }}
          />
        )}
      </>
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
  const [startCell, setStartCell] = useState<any>(null); // Starting cell coordinates
  const [endCell, setEndCell] = useState<any>(null); // Ending cell coordinates
  const [onEdit, setOnEdit] = useState(false);
  const [editingCell, setEditingCell] = useState<
    [number, number, string] | null
  >(null);

  const handleMouseDown = (event, row, col) => {
    if (event.buttons === 1) {
      // Left mouse button
      setStartCell({ row, col });
      setEndCell({ row, col });
    }
  };
  const handleMouseMove = (event, row, col) => {
    if (startCell && event.buttons === 1) {
      setEndCell({ row, col });
    }
  };
  const handleTouchMove = (event) => {
    if (!startCell) return;

    const touch = event.touches[0]; // Get the first touch point
    const targetElement = document.elementFromPoint(
      touch.clientX,
      touch.clientY
    );

    if (targetElement) {
      const row = targetElement.getAttribute("data-row"); // Use getAttribute for custom data attributes
      const col = targetElement.getAttribute("data-col");

      if (row && col) {
        setEndCell({ row: parseInt(row, 10), col: parseInt(col, 10) });
      }
    }
  };
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
  const isHighlighted = (row, col) => {
    if (!startCell || !endCell || onEdit) return false;
    const minRow = Math.min(startCell.row, endCell.row);
    const maxRow = Math.max(startCell.row, endCell.row);
    const minCol = Math.min(startCell.col, endCell.col);
    const maxCol = Math.max(startCell.col, endCell.col);
    return row >= minRow && row <= maxRow && col >= minCol && col <= maxCol;
  };
  const table = useReactTable({
    data,
    columns,
    defaultColumn,
    columnResizeMode,
    columnResizeDirection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex,
    // Provide our updateData function to our table meta
    meta: {
      updateData: (rowIndex, columnId, value) => {
        // Skip page index reset until after next rerender
        skipAutoResetPageIndex();
        setEditingCell(null);
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
      onEdit: (onEdit_) => setOnEdit(onEdit_),
      editingCell: editingCell,
      cellIsHighlighted: (rowIndex, columnIndex) => {
        return isHighlighted(rowIndex, columnIndex);
      },
      cancelEditing: () => {
        setEditingCell(null);
        setOnEdit(false);
      },
    },
  });
  const copyToClipboard = () => {
    if (!startCell || !endCell) return; // Ensure start and end cells are selected

    // Calculate the range of cells from startCell to endCell
    const rows = Math.min(startCell.row, endCell.row);
    const cols = Math.min(startCell.col, endCell.col);
    const rowCount = Math.abs(startCell.row - endCell.row) + 1;
    const colCount = Math.abs(startCell.col - endCell.col) + 1;

    let selectedData = "";
    for (let jj = 0; jj < colCount; jj++) {
      let col_d = cols + jj;
      let colHeader: any = defaultColumns[col_d]["header"];
      selectedData += colHeader + (jj === colCount - 1 ? "" : "\t");
    }
    selectedData += "\n";
    for (let i = 0; i < rowCount; i++) {
      for (let j = 0; j < colCount; j++) {
        const row = rows + i;
        const col = cols + j;
        if (data[row]) {
          let colDef: any = defaultColumns[col]["accessorKey"];
          selectedData += data[row][colDef] + (j === colCount - 1 ? "" : "\t");
        }
      }
      selectedData += "\n";
    }
    // alert(selectedData);
    // Copy the selected data to clipboard
    navigator.clipboard
      .writeText(selectedData)
      .then(() => {
        // alert("Copied to clipboard!");
      })
      .catch((error) => {
        console.error("Failed to copy: ", error);
      });
  };
  useEffect(() => {
    const touchMoveHandler = (event) => {
      event.preventDefault();
    };

    document.addEventListener("touchmove", touchMoveHandler, {
      passive: false,
    });

    return () => {
      document.removeEventListener("touchmove", touchMoveHandler);
    };
  }, []);
  return (
    <>
      <Button onClick={copyToClipboard} mb="md">
        Copy Selected Range
      </Button>
      <Box pb="xl">
        <table
          {...{
            style: {
              width: table.getCenterTotalSize(),
            },
          }}
          //   striped
          //   verticalSpacing={0}
          //   horizontalSpacing={0}
          //   withTableBorder
          //   withColumnBorders
          //   className="excel-table"
        >
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
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
                            columnResizeMode === "onEnd" &&
                            header.column.getIsResizing()
                              ? `translateX(${
                                  (table.options.columnResizeDirection === "rtl"
                                    ? -1
                                    : 1) *
                                  (table.getState().columnSizingInfo
                                    .deltaOffset ?? 0)
                                }px)`
                              : "",
                        },
                      }}
                    />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, rowIndex) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell, colIndex) => (
                  <td
                    {...{
                      key: cell.id,
                      "data-row": rowIndex, // Add data-row attribute
                      "data-col": colIndex, // Add data-col attribute
                      style: {
                        position: "relative",
                        width: cell.column.getSize(),
                        backgroundColor: isHighlighted(rowIndex, colIndex) // Check if the cell should be highlighted
                          ? "#0650eb1a"
                          : "transparent",
                        userSelect: isHighlighted(rowIndex, colIndex)
                          ? "none"
                          : "inherit",
                        border: isHighlighted(rowIndex, colIndex)
                          ? "1.5px solid #d3d3d366"
                          : "1.5px solid lightgray",
                      },
                      onDoubleClick: (event) => {
                        setEditingCell([rowIndex, colIndex, cell.column.id]);
                      },
                      onMouseDown: (event) =>
                        handleMouseDown(event, rowIndex, colIndex),
                      onMouseMove: (event) => {
                        handleMouseMove(event, rowIndex, colIndex);
                      },
                      onTouchStart: (event) => {
                        event.preventDefault();
                        handleMouseDown(event, rowIndex, colIndex);
                      },
                      onTouchMove: handleTouchMove,
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </>
  );
}
