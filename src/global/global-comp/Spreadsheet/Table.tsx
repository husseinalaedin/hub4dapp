import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  useReactTable,
  ColumnResizeMode,
  getCoreRowModel,
  ColumnDef,
  flexRender,
  ColumnResizeDirection,
  RowData,
  getPaginationRowModel,
  Row,
  PaginationState,
  getExpandedRowModel,
} from "@tanstack/react-table";
import { ActionIcon, Box, Group, TextInput } from "@mantine/core";
import { getFilteredRowModel } from "@tanstack/react-table";
import { useGlobalStyl } from "../../../hooks/useTheme";
import { useTranslation } from "react-i18next";
import {
  IconArrowBackUp,
  IconArrowForwardUp,
  IconBaselineDensityMedium,
  IconBaselineDensitySmall,
  IconCheck,
  IconCopy,
  IconCopyPlus,
  IconDeselect,
  IconMaximize,
  IconMinimize,
  IconSelectAll,
  IconX,
} from "@tabler/icons-react";
import { useMessage } from "../../G";
import { SplitHashtags } from "../Hashtags";

import { useAppHeaderNdSide } from "../../../hooks/useAppHeaderNdSide";
const MAX_HISTORY_SIZE = 40;

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (
      rowIndex: number,
      columnId: string,
      value: unknown,
      beforEditingValue: unknown
    ) => void;
    updateValues:(
      rowIndex: number,
      values: any,
    )=>void,
    onEdit: (onEdit_: boolean) => void;
    editingCell: [number, number, string, string] | null;
    cellIsHighlighted: (rowIndex: number, columnIndex: number) => boolean;
    cancelEditing: () => void;
    deleteRow: (rowIndex: number) => void;
    getRowCanExpand: (row: Row<TData>) => boolean;
    forceCloseTm: string;
    cellInEdit: (rowIndex: number, colIndex: number, id: string) => boolean;
  }
}

// const defaultColumn: Partial<ColumnDef<Deal>> = {
//   cell: ({ getValue, row: { index }, column: { id }, table }) => {
//     const inputRef = useRef<any>(null);
//     const { classes: classesG } = useGlobalStyl();
//     const editingCell = table.options.meta?.editingCell;
//     const onEdit =
//       editingCell && editingCell[0] === index && editingCell[2] === id;
//     const initialValue = getValue();
//     const [beforEditingValue, setBeforEditingValue] = useState(initialValue);
//     const [value, setValue] = useState(initialValue);
//     const HandleOnEdit = (val) => {
//       table.options.meta?.onEdit(val);
//     };
//     useEffect(() => {
//       if (onEdit && inputRef.current && inputRef.current.focus) {
//         inputRef.current.focus();
//         resizeInput();
//         setBeforEditingValue(value);
//         if (editingCell[3] == "Backspace") {
//           setValue("");
//         }
//       }
//     }, [onEdit]);
//     const onSave = () => {
//       HandleOnEdit(false);
//       table.options.meta?.updateData(index, id, value, beforEditingValue);
//     };
//     const onCancel = () => {
//       setValue(beforEditingValue);
//       table.options.meta?.cancelEditing();
//     };
//     useEffect(() => {
//       setValue(initialValue);
//     }, [initialValue]);
//     const resizeInput = () => {
//       if (inputRef.current) {
//         inputRef.current.style.width = "auto";
//         inputRef.current.style.width = `${inputRef.current.scrollWidth + 10}px`;
//       }
//     };
//     useEffect(() => {
//       resizeInput();
//     }, [value]);

//     return (
//       <>
//         {!onEdit && (
//           <Box
//             bg="transparent"
//             pl="2px"
//             pr="2px"
//             style={{
//               display: "block",
//               alignItems: "center",
//               fontFamily: "inherit",
//               fontSize: "inherit",
//               fontWeight: "inherit",
//               pointerEvents: "none",
//             }}
//           >
//             {value as string}
//           </Box>
//         )}
//         {onEdit && (
//           <TextInput
//             className={classesG.editingExcelCell}
//             ref={inputRef}
//             onKeyDown={(event) => {
//               if (event.key == "Enter") onSave();
//               if (event.key == "Escape") {
//                 onCancel();
//               }
//             }}
//             value={value as string}
//             onChange={(e) => setValue(e.target.value)}
//             onBlur={() => {
//               if (beforEditingValue === value) onCancel();
//               // onSave()
//             }}
//             style={{
//               fontFamily: "inherit",
//               fontSize: "inherit",
//               fontWeight: "inherit",
//               whiteSpace: "nowrap",
//               overflow: "hidden",
//               border: "1px solid red;",
//               position: "absolute",
//               top: -2,
//               left: -2,
//               // bottom: 0,
//               width: "auto",
//               minWidth: "100px",
//               zIndex: 400000000000000,
//             }}
//             rightSectionWidth={60}
//             rightSection={
//               <Group gap={"2px"}>
//                 <ActionIcon c="red" variant="light" onClick={onCancel}>
//                   <IconX stroke={1.5} size="1.2rem" />
//                 </ActionIcon>
//                 <ActionIcon variant="filled" onClick={onSave}>
//                   <IconCheck stroke={1.5} size="1.2rem" />
//                 </ActionIcon>
//               </Group>
//             }
//           />
//         )}
//       </>
//     );
//   },
// };

function useSkipper() {
  const shouldSkipRef = useRef(true);
  const shouldSkip = shouldSkipRef.current;

  // Wrap a function with this to skip a pagination reset temporarily
  const skip = useCallback(() => {
    shouldSkipRef.current = false;
  }, []);

  useEffect(() => {
    shouldSkipRef.current = true;
  });

  return [shouldSkip, skip] as const;
}
export function AppTable({
  initData,
  columns,
  SecondRowRender,
  defaultColumn,
  showSecondRow,
  fixedCols,
}) {
  const elementRef: any = useRef(null);
  const [forceCloseTm, setForceCloseTm] = useState("");
  const [lastTap, setLastTap] = useState(0);
  const doubleTapDelay = 300; // Maximum delay between taps in milliseconds

  const { classes: classesG } = useGlobalStyl();
  const { desktopFocus, setDesktopfocus }: any = useAppHeaderNdSide();
  const { succeed } = useMessage();
  const { t } = useTranslation("common", { keyPrefix: "table" });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 1000,
  });

  // const defaults = () => {
  //   let dta: any = [];
  //   let dta_s = JSON.stringify(defaultData);
  //   for (let i = 0; i < 5; i++) {
  //     let df = JSON.parse(dta_s);
  //     for (let i = 0; i < df.length; i++) {
  //       dta.push(df[i]);
  //     }
  //   }
  //   console.log(dta, "DATA");
  //   return dta;
  // };
  const [data, setData] = useState<any>(() => [...initData]);
  const [history, setHistory] = useState<any>([]);
  const [redoStack, setRedoStack] = useState<any>([]);
  const [deletedIds, setDeletedIds] = useState<any>([]);
  const [editedIds, setEditedIds] = useState<any>([]);
  const [startCell, setStartCell] = useState<any>(null); // Starting cell coordinates
  const [endCell, setEndCell] = useState<any>(null); // Ending cell coordinates
  const [onEdit, setOnEdit] = useState(false);
  const [density, setDensity] = useState<boolean>(true);
  const [editingCell, setEditingCell] = useState<
    [number, number, string, string] | null
  >(null);
  const cellInEdit = (
    rowIndex: number,
    colIndex: number,
    id: string
  ): boolean => {
    return (
      (!!editingCell &&
        editingCell[0] == rowIndex &&
        editingCell[1] == colIndex &&
        colIndex > 0) ||
      (!!editingCell &&
        editingCell[0] == rowIndex &&
        editingCell[2] == id &&
        id != "")
    );
  };
  const [isShiftPressed, setIsShiftPressed] = useState(false);

  const handleMouseDown = (event, row, col) => {
    setForceCloseTm(new Date().getTime().toString());
    if (isShiftPressed) {
      setEndCell({ row, col });
      return;
    }
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
  const tableKeyDown = (event) => {
    moveCell(event);
    activeCellByTyping(event);
  };
  const moveCell = (event) => {
    let row_ = 0;
    let col_ = 0;
    if (event.key === "Tab") {
      col_ = 1;
      if (event.shiftKey) {
        col_ = -1;
      }
    }
    if (col_ == 0)
      switch (event.key) {
        case "ArrowUp":
          row_ = -1; // Move up
          break;
        case "ArrowDown":
          row_ = 1; // Move down
          break;
        case "ArrowLeft":
          col_ = -1; // Move left
          break;
        case "ArrowRight":
          col_ = 1; // Move right
          break;
        default:
          return;
      }

    if ((editingCell && editingCell[0] >= 0) || !startCell) return;
    let all_cols = table.getAllColumns();
    let all_rows_count = table.getRowCount();
    let newCol = startCell.col + col_;
    let newRow = startCell.row + row_;

    newRow = newRow >= all_rows_count ? all_rows_count - 1 : newRow;
    newCol = newCol >= all_cols.length ? all_cols.length - 1 : newCol;

    newCol = newCol <= 1 ? 1 : newCol;
    newRow = newRow < 0 ? 0 : newRow;
    if (newCol == startCell.col && newRow == startCell.row) return;

    event.preventDefault();
    setStartCell({ row: newRow, col: newCol });
    setEndCell({ row: newRow, col: newCol });
  };
  const activeCellByTyping = (event) => {
    if (editingCell) return;
    const isPrintableKey =
      (event.key.length === 1 && // Ensure it's a single character
        !event.ctrlKey && // Exclude Ctrl key combinations
        !event.metaKey && // Exclude Meta/Command key combinations
        !event.altKey) ||
      event.key == "Enter" ||
      event.key == "Backspace";
    // Include Backspace;
    if (!isPrintableKey || (editingCell && editingCell[0] >= 0) || !startCell)
      return;

    let all_cols = table.getAllColumns();
    let targetCol = startCell.col;
    let targetColId = all_cols.length > targetCol ? all_cols[targetCol].id : "";
    event.preventDefault();
    setEditingCell([startCell.row, startCell.col, targetColId, event.key]);
  };

  useEffect(() => {
    console.log(editingCell);
  }, [editingCell]);
  const [columnResizeMode, setColumnResizeMode] =
    useState<ColumnResizeMode>("onChange");

  const [columnResizeDirection, setColumnResizeDirection] =
    useState<ColumnResizeDirection>("ltr");

  const rerender = useReducer(() => ({}), {})[1];
  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();
  const isHighlighted = (row, col) => {
    if (!startCell || !endCell || onEdit) return false;
    const minRow = Math.min(startCell.row, endCell.row);
    const maxRow = Math.max(startCell.row, endCell.row);
    const minCol = Math.min(startCell.col, endCell.col);
    const maxCol = Math.max(startCell.col, endCell.col);
    return row >= minRow && row <= maxRow && col >= minCol && col <= maxCol;
  };
  const rowInEditMode = (rowIndex) => {
    return editingCell && editingCell[0] == rowIndex;
  };
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Shift") {
        setIsShiftPressed(true);
      }
    };

    const handleKeyUp = (event) => {
      if (event.key === "Shift") {
        setIsShiftPressed(false);
      }
    };

    // Attach event listeners
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Cleanup event listeners
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
  const undo = () => {
    if (history.length === 0) return; // No history to undo

    const lastState = history[history.length - 1];
    const newRedoStack = [data, ...redoStack];
    if (newRedoStack.length > MAX_HISTORY_SIZE) {
      newRedoStack.pop(); // Remove the oldest redo state if exceeding max size
    }

    setRedoStack(newRedoStack);
    setHistory((prev) => prev.slice(0, -1)); // Remove the last state from history
    setData(lastState);
    // rerender()
  };

  // Redo the last undone action
  const redo = () => {
    if (redoStack.length === 0) return; // No redo actions available

    const nextState = redoStack[0];
    const newHistory = [...history, data];
    if (newHistory.length > MAX_HISTORY_SIZE) {
      newHistory.shift(); // Remove the oldest state if exceeding max size
    }
    setHistory(newHistory);
    setRedoStack((prev) => prev.slice(1)); // Remove the redone state from redo stack
    setData(nextState);
  };
  const saveToHistory = () => {
    setHistory((prevHistory) => {
      const newHistory = [...prevHistory, JSON.parse(JSON.stringify(data))];
      if (newHistory.length > MAX_HISTORY_SIZE) newHistory.shift(); // Limit history size
      return newHistory;
    });
    setRedoStack([]); // Clear redo stack on new operation
  };
  const copyToClipboard = (withheader) => {
    if (!startCell || !endCell) return; // Ensure start and end cells are selected

    // Calculate the range of cells from startCell to endCell
    const rows = Math.min(startCell.row, endCell.row);
    const cols = Math.min(startCell.col, endCell.col);

    const rowCount = Math.abs(startCell.row - endCell.row) + 1;
    const colCount = Math.abs(startCell.col - endCell.col) + 1;

    let all_cols = table.getAllColumns();
    let selectedData = "";
    if (withheader) {
      for (let jj = 0; jj < colCount; jj++) {
        let col_d = cols + jj;
        let targetColId_d = all_cols.length > col_d ? all_cols[col_d].id : "";
        let colHeader: any = all_cols[col_d].columnDef.header;
        colHeader = colHeader && colHeader != "" ? colHeader : targetColId_d;
        if (colHeader)
          selectedData += colHeader + (jj === colCount - 1 ? "" : "\t");
      }
    }
    if (selectedData != "") selectedData += "\n";

    for (let i = 0; i < rowCount; i++) {
      for (let j = 0; j < colCount; j++) {
        const row = rows + i;
        const col = cols + j;
        let targetColId = all_cols.length > col ? all_cols[col].id : "";

        if (data[row] && targetColId != "") {
          selectedData +=
            data[row][targetColId] + (j === colCount - 1 ? "" : "\t");
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
        succeed(t("data_copied", "Data copied!."));
      })
      .catch((error) => {
        console.error("Failed to copy: ", error);
      });
  };
  const getTopLeftCell = () => {
    if (!startCell || !endCell) return startCell; // Use startCell if endCell is null
    const topRow = Math.min(startCell.row, endCell.row);
    const leftCol = Math.min(startCell.col, endCell.col);
    return { row: topRow, col: leftCol };
  };
  const getBottomRightCell = () => {
    if (!startCell || !endCell) return startCell; // Use startCell if endCell is null
    const bottomRow = Math.max(startCell.row, endCell.row);
    const rightCol = Math.max(startCell.col, endCell.col);
    return { row: bottomRow, col: rightCol };
  };
  const handlePaste = (event: ClipboardEvent) => {
    if (editingCell) return;
    event.preventDefault();
    const clipboardText = event.clipboardData?.getData("text/plain");
    if (!clipboardText) return;

    const rows = clipboardText
      .split("\n")
      .filter((row) => row.trim() !== "") // Ignore empty rows
      .map((row) => row.split("\t")); // Split by tabs

    const topLeftCell = getTopLeftCell();
    const bottomRightCell = getBottomRightCell();
    let all_cols = table.getAllColumns();

    if (!topLeftCell) return;
    saveToHistory();
    const newData = [...data];
    const startRow0 = topLeftCell.row;
    const startCol0 = topLeftCell.col;
    const endRow0 = bottomRightCell.row;
    const endCol0 = bottomRightCell.col;
    const colCount = endCol0 - startCol0 + 1;
    let startPastMass = 0;
    try {
      let startRow = startRow0;
      while (startRow === startRow0 || startRow + rows.length - 1 <= endRow0) {
        rows.forEach((rowData, rowIndex) => {
          let startCol = startCol0;
          while (
            startCol == startCol0 ||
            startCol + rowData.length - 1 <= endCol0
          ) {
            rowData.forEach((cellData, colIndex) => {
              const targetRow = startRow + rowIndex;
              const targetCol = startCol + colIndex;
              let targetColId =
                all_cols.length > targetCol ? all_cols[targetCol].id : "";

              if (targetRow < newData.length && targetColId != "") {
                if (targetColId === "hashtags") {
                  let cellData_arr = SplitHashtags(cellData);
                  newData[targetRow][targetColId] = cellData_arr;
                } else newData[targetRow][targetColId] = cellData;
              }
            });
            // console.log(
            //   "before",
            //   startCol,
            //   startCol + rowData.length - 1,
            //   endCol0,
            //   "count",
            //   colCount
            // );
            startCol = startCol + rowData.length;
            // console.log(
            //   "after",
            //   startCol,
            //   startCol + rowData.length - 1,
            //   endCol0
            // );
          }
        });
        startRow = startRow + rows.length;
      }

      setData(newData);
    } catch (error) {}
  };

  useEffect(() => {
    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, [data, startCell, endCell, editingCell]);
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "z") {
        event.preventDefault();
        undo();
      } else if (event.ctrlKey && event.key === "y") {
        event.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [history, redoStack, data]);
  const selectAll = () => {
    setStartCell({ row: 0, col: 1 });
    setEndCell({
      row: table.getRowCount() - 1,
      col: table.getAllColumns().length - 1,
    });
  };
  const deSelectAny = () => {
    setStartCell(null);
    setEndCell(null);
  };
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!editingCell && event.ctrlKey && event.key === "c") {
        event.preventDefault();
        copyToClipboard(false);
      } else if (!editingCell && event.ctrlKey && event.key === "a") {
        event.preventDefault();
        selectAll();
      }
    };
    const touchMoveHandler = (event) => {
      event.preventDefault();
    };

    document.addEventListener("touchmove", touchMoveHandler, {
      passive: false,
    });
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("touchmove", touchMoveHandler);
    };
  }, [data, startCell, endCell, editingCell]);

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
    getExpandedRowModel: getExpandedRowModel(),
    meta: {
      updateData: (rowIndex, columnId, value, beforEditingValue) => {
        skipAutoResetPageIndex();
        setEditingCell(null);

        if (value === beforEditingValue) return;

        saveToHistory();
        let id = data[rowIndex]["id"];
        const editedIds_n = [...editedIds];
        editedIds_n.push(id);
        setEditedIds(editedIds_n);
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

      updateValues: (rowIndex, values) => {
        if (!values || !values.length) return;
        console.log("data before updated", data);
        skipAutoResetPageIndex();
        setEditingCell(null);
        saveToHistory();
        let id = data[rowIndex]["id"];
        const editedIds_n = [...editedIds];
        editedIds_n.push(id);
        setEditedIds(editedIds_n);
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              const updates = values.reduce(
                (acc, { columnId, value }) => ({
                  ...acc,
                  [columnId]: value,
                }),
                {}
              );
              console.log("data during update", updates);
              return {
                ...row,
                ...updates,
              };
            }
            return row;
          })
        );
        console.log('data after updated',data)
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
      deleteRow: (rowIndex) => {
        saveToHistory();
        let id = data[rowIndex]["id"];
        const updatedItems = [...data]; // Make a copy of the array

        updatedItems.splice(rowIndex, 1); // Remove item at the index
        setData(updatedItems); // Update state with the modified array
        const deletedIds_n = [...deletedIds];
        deletedIds_n.push(id);
        setDeletedIds(deletedIds_n);
      },
      getRowCanExpand: (row) => true,
      forceCloseTm: forceCloseTm,
      cellInEdit: cellInEdit,
    },
    state: {
      pagination,
    },
    // debugTable: true,
    // debugHeaders: true,
    // debugColumns: true,
  });
  useEffect(() => {
    if (!editingCell) enforceTabIndex();
  }, [editingCell]);
  const enforceTabIndex = () => {
    try {
      const element = elementRef.current;
      if (!element) return;
      element.tabIndex = 0;
      element.focus();
    } catch (error) {}
  };
  const [isFixed, setIsFixed] = useState(false);

  const togglePosition = () => {
    setIsFixed((prev) => !prev);
  };
  const contentRef = useRef<any>(null);
  const [maxHeight, setMaxHeight] = useState("100%");
  const adjustHeight = () => {
    try {
      if (contentRef.current) {
        window.scrollTo(0, 0);
        // Get the top offset of the div relative to the viewport
        const topOffset = contentRef.current.getBoundingClientRect().top;

        // Calculate the maximum height
        const availableHeight = window.innerHeight - topOffset - 20;

        // Set the calculated height
        setMaxHeight(`${availableHeight}px`);
      }
    } catch (error) {}
  };

  useEffect(() => {
    // Adjust height on mount and resize
    adjustHeight();
    window.addEventListener("resize", adjustHeight);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("resize", adjustHeight);
    };
  }, []);
  const _fixedCols = (colidx) => {
    if (colidx == 0) return 30;
    let fxd = fixedCols(colidx);
    return fxd && fxd > 0 ? fxd : -1;
  };
  return (
    <>
      <Box
        bg="dark"
        className={`${isFixed ? classesG.excelContainerFullScreen : ""}`}
      >
        <Group
          bg="dark"
          justify="flex-start"
          mb="md"
          gap="2px"
          className={`${isFixed ? classesG.excelHeaderToolFullScreen : ""}`}
        >
          <ActionIcon
            variant="filled"
            onClick={() => {
              // setDesktopfocus((prev) => !prev);
              togglePosition();
            }}
            title={
              desktopFocus
                ? t("minimize", "Minimize")
                : t("maximize", "Maximize")
            }
          >
            {!desktopFocus && <IconMaximize stroke={1.5} size="1rem" />}
            {desktopFocus && <IconMinimize stroke={1.5} size="1rem" />}
          </ActionIcon>

          <ActionIcon
            variant="light"
            onClick={undo}
            title={t("undo", "Undo")}
            disabled={history.length === 0}
          >
            <IconArrowBackUp stroke={1.5} size="1rem" />
          </ActionIcon>
          <ActionIcon
            variant="light"
            onClick={redo}
            title={t("redo", "Redo")}
            disabled={redoStack.length === 0}
          >
            <IconArrowForwardUp stroke={1.5} size="1rem" />
          </ActionIcon>
          <ActionIcon
            variant="light"
            onClick={() => selectAll()}
            title={t("select_all", "Select All")}
            disabled={!data || !data.length}
          >
            <IconSelectAll stroke={1.5} size="1rem" />
          </ActionIcon>
          <ActionIcon
            variant="light"
            c="red"
            onClick={() => deSelectAny()}
            title={t("deselect", "DeSelect")}
            disabled={!getTopLeftCell()}
          >
            <IconDeselect stroke={1.5} size="1rem" />
          </ActionIcon>
          <ActionIcon
            variant="light"
            onClick={() => copyToClipboard(false)}
            title={t("copy", "Copy")}
            disabled={!getTopLeftCell()}
          >
            <IconCopy stroke={1.5} size="1rem" />
          </ActionIcon>
          <ActionIcon
            variant="light"
            onClick={() => copyToClipboard(true)}
            title={t("copy_with_header", "Copy With Header")}
            disabled={!getTopLeftCell()}
          >
            <IconCopyPlus stroke={1.5} size="1rem" />
          </ActionIcon>
          <ActionIcon
            variant="light"
            onClick={() => {
              setDensity((prev) => !prev);
            }}
            title={
              density
                ? t("low_density", "Low Density")
                : t("high_density", "High Density")
            }
          >
            {!density && <IconBaselineDensitySmall stroke={1.5} size="1rem" />}
            {density && <IconBaselineDensityMedium stroke={1.5} size="1rem" />}
          </ActionIcon>
        </Group>

        <Box
          // ref={contentRef}

          className={`${isFixed ? classesG.excelTableContainerFullScreen : ""}`}
          style={{ overflow: "auto" }}
          // mah={isFixed ? "auto" : maxHeight}
        >
          {/* <ScrollArea maw={"100%"} mx="auto" type="auto"> */}
          <table
            ref={elementRef}
            {...{
              style: {
                width: table.getCenterTotalSize(),
              },
              tabIndex: 0,
              onKeyDown: (event) => tableKeyDown(event),
            }}
          >
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header, header_idx) => {
                    let col_w = _fixedCols(header_idx);
                    let ww = col_w > 0 ? col_w + "px" : header.getSize();
                    let mx_ww = col_w > 0 ? col_w + "px" : "auto";
                    return (
                      <th
                        {...{
                          key: header.id,
                          colSpan: header.colSpan,
                          className: `${classesG.actionSides} ${
                            isFixed ? classesG.excelTableHeaderFullScreen : ""
                          } `,
                          style: {
                            width: ww,
                            maxWidth: mx_ww,
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
                            } ${
                              header.column.getIsResizing() ? "isResizing" : ""
                            }`,
                            style: {
                              transform:
                                columnResizeMode === "onEnd" &&
                                header.column.getIsResizing()
                                  ? `translateX(${
                                      (table.options.columnResizeDirection ===
                                      "rtl"
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
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, rowIndex) => (
                <Fragment key={row.id}>
                  <tr
                    {...{
                      className: `${
                        rowInEditMode(rowIndex) ? classesG.excelRowEditMode : ""
                      }`,
                    }}
                  >
                    {row.getVisibleCells().map((cell, colIndex) => {
                      let col_w = _fixedCols(colIndex);
                      let ww = col_w > 0 ? col_w + "px" : cell.column.getSize();
                      let mx_ww = col_w > 0 ? col_w + "px" : "auto";
                      return (
                        <td
                          {...{
                            key: cell.id,
                            "data-row": rowIndex,
                            "data-col": colIndex,
                            className: `${
                              cell.column.id == "action"
                                ? classesG.actionSides
                                : ""
                            } ${
                              !cellInEdit(rowIndex, colIndex, cell.column.id) &&
                              density
                                ? classesG.excelCellcollapsed
                                : ""
                            } `,
                            style: {
                              position: "relative",
                              width: ww,
                              maxWidth: mx_ww,
                              backgroundColor:
                                cell.column.id == "action"
                                  ? ""
                                  : isHighlighted(rowIndex, colIndex)
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
                              if (cell.column.id == "action") {
                                return;
                              }
                              setEditingCell([
                                rowIndex,
                                colIndex,
                                cell.column.id,
                                "",
                              ]);
                            },
                            onMouseDown: (event) => {
                              setForceCloseTm(new Date().getTime().toString());
                              if (cell.column.id == "action") {
                                return;
                              }
                              handleMouseDown(event, rowIndex, colIndex);
                            },
                            onMouseMove: (event) => {
                              if (cell.column.id == "action") {
                                return;
                              }
                              handleMouseMove(event, rowIndex, colIndex);
                            },
                            onTouchStart: (event) => {
                              if (cell.column.id == "action") {
                                return;
                              }
                              const now = Date.now();
                              if (now - lastTap <= doubleTapDelay) {
                                //handleDoubleClick(); // Trigger double-tap action
                                if (cell.column.id == "action") {
                                  return;
                                }
                                setEditingCell([
                                  rowIndex,
                                  colIndex,
                                  cell.column.id,
                                  "",
                                ]);
                              }
                              setLastTap(now);

                              handleMouseDown(event, rowIndex, colIndex);
                              // event.preventDefault();
                            },
                            onTouchMove: (event) => {
                              if (cell.column.id == "action") {
                                return;
                              }
                              handleTouchMove(event);
                            },
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      );
                    })}
                  </tr>
                  {
                    // cellInEdit(rowIndex, -1, "description")
                    showSecondRow && showSecondRow(row, editingCell, table) && (
                      <tr>
                        <td colSpan={row.getVisibleCells().length}>
                          {SecondRowRender && (
                            <SecondRowRender
                              row={row}
                              rowIndex={rowIndex}
                              table={table}
                              editingCell={editingCell}
                              data={data}
                            />
                          )}
                        </td>
                      </tr>
                    )
                  }
                </Fragment>
              ))}
            </tbody>
          </table>
          {/* </ScrollArea> */}
        </Box>
      </Box>
    </>
  );
}
