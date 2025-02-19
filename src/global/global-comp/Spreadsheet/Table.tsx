import React, {
  Dispatch,
  forwardRef,
  Fragment,
  SetStateAction,
  useCallback,
  useEffect,
  useImperativeHandle,
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
import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Checkbox,
  Divider,
  Group,
  Menu,
  Modal,
  Popover,
  Table,
  Text,
  Textarea,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { getFilteredRowModel } from "@tanstack/react-table";
import { useGlobalStyl } from "../../../hooks/useTheme";
import { useTranslation } from "react-i18next";
import {
  IconAlertCircle,
  IconArrowBackUp,
  IconArrowForwardUp,
  IconBaselineDensityMedium,
  IconBaselineDensitySmall,
  IconCheck,
  IconCircleDashedLetterD,
  IconCircleLetterFFilled,
  IconCircleXFilled,
  IconClipboardListFilled,
  IconClipboardPlus,
  IconCopy,
  IconCopyPlus,
  IconDeselect,
  IconDeviceFloppy,
  IconHelp,
  IconMaximize,
  IconMinimize,
  IconPlus,
  IconQuestionMark,
  IconRestore,
  IconRotate360,
  IconSelectAll,
  IconX,
} from "@tabler/icons-react";
import { useMessage } from "../../G";
import { HashtagsAlert, SplitHashtags } from "../Hashtags";

import { useAppHeaderNdSide } from "../../../hooks/useAppHeaderNdSide";
import { useDisclosure } from "@mantine/hooks";
import { MassDealEntry } from "../../../app-comps/private/posts/DealsEntryMass";
import { useNavigate } from "react-router";
import {
  selectMedium,
  selectSmall,
} from "../../../store/features/ScreenStatus";
import { useSelector } from "react-redux";
const MAX_HISTORY_SIZE = 40;

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (
      rowIndex: number,
      columnId: string,
      value: unknown,
      beforEditingValue: unknown
    ) => void;
    updateValues: (rowIndex: number, columnId: string, values: any) => void;
    onEdit: (onEdit_: boolean) => void;
    editingCell: [number, number, string, string] | null;
    cellIsHighlighted: (rowIndex: number, columnIndex: number) => boolean;
    cancelEditing: () => void;
    deleteRow: (rowIndex: number) => void;
    getRowCanExpand: (row: Row<TData>) => boolean;
    forceCloseTm: string;
    cellInEdit: (rowIndex: number, colIndex: number, id: string) => boolean;
    rowData: (rowIndex: number) => any;
  }
}

function useSkipper() {
  const shouldSkipRef = useRef(true);
  const shouldSkip = shouldSkipRef.current;

  const skip = useCallback(() => {
    shouldSkipRef.current = false;
  }, []);

  useEffect(() => {
    shouldSkipRef.current = true;
  });

  return [shouldSkip, skip] as const;
}
export const AppTable = forwardRef((props: any, ref) => {
  let {
    data,
    setData,
    columns,
    SecondRowRender,
    defaultColumn,
    showSecondRow,
    fixedCols,
    onCopyCell,
    onSave,
    colIs4Data,
  } = props;

  const tableRef: any = useRef(null);
  const [forceCloseTm, setForceCloseTm] = useState("");
  const [lastTap, setLastTap] = useState(0);
  const doubleTapDelay = 300;

  const { classes: classesG } = useGlobalStyl();
  const { desktopFocus, setDesktopfocus }: any = useAppHeaderNdSide();
  const { succeed } = useMessage();
  const { t } = useTranslation("common", { keyPrefix: "table" });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 1000,
  });

  const [history, setHistory] = useState<any>([]);
  const [redoStack, setRedoStack] = useState<any>([]);
  const [deletedIds, setDeletedIds] = useState<any>([]);
  const [startCell, setStartCell] = useState<any>(null);
  const [endCell, setEndCell] = useState<any>(null);
  const [onEdit, setOnEdit] = useState(false);
  const [density, setDensity] = useState<boolean>(true);
  const [editingCell, setEditingCell] = useState<
    [number, number, string, string] | null
  >(null);
  const [initData, setInitData] = useState([]);
  const [saveMsg, setSaveMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [afterSaved, setAfterSaved] = useState("");
  const [isHandlingPaste, setIsHandlingPaste] = useState(false);
  useEffect(() => {
    let initD = JSON.parse(JSON.stringify(data));
    setInitData(initD);
  }, [afterSaved]);
  const cancelChanges = () => {
    let initD = JSON.parse(JSON.stringify(initData));
    setData(initD);
    setHistory([]);
    setRedoStack([]);
    setDeletedIds([]);
    setStartCell(null);
    setEndCell(null);
    setOnEdit(false);
    setEditingCell(null);
  };
  const afterGotSucceededSaved = () => {
    setHistory([]);
    setRedoStack([]);
    setDeletedIds([]);
    setStartCell(null);
    setEndCell(null);
    setOnEdit(false);
    setEditingCell(null);
    const updatedData = data.map((item) => {
      return { ...item, changed: false };
    });
    setData(updatedData);
    setAfterSaved(new Date().getTime().toString());
  };

  const add = (is_draft) => {
    saveToHistory();
    const newItem = {
      id: "new",
      ref: new Date().getTime().toString(),
      changed: true,
      is_draft: is_draft,
    };
    setData([...data, newItem]);
  };
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

  useImperativeHandle(ref, () => ({
    dataEdited: () => {
      return _dataEdited() || deletedIds.length > 0;
    },
    getDeletedIds: () => {
      let deleted_ids: any = [];
      for (let i = 0; i < deletedIds.length; i++) {
        let id_found = false;
        for (let j = 0; j < data.length; j++)
          if (deletedIds[i] == data[j]["id"]) {
            id_found = true;
            break;
          }
        if (!id_found) {
          let id_found_d = false;
          for (let k = 0; k < deleted_ids.length; k++) {
            if (deleted_ids[k] == deletedIds[i]) {
              id_found_d = true;
              break;
            }
          }
          if (!id_found_d) deleted_ids.push(deletedIds[i]);
        }
      }
      return deleted_ids;
    },
    gotSaved: (error, msg, ids) => {
      if (error) setIsError(true);
      else {
        const updatedData = data.map((item) => {
          const match = ids.find((userItem) => userItem.ref === item.ref);
          return match
            ? { ...item, id: match.id, changed: false }
            : { ...item, changed: false };
        });

        setData(updatedData);
        afterGotSucceededSaved();
      }
      setSaveMsg(msg);
      setTimeout(() => {
        setIsError(false);
        setSaveMsg("");
      }, 5000);
    },
  }));

  const handleMouseDown = (event, row, col) => {
    handleRemoveText(tableRef);
    setForceCloseTm(new Date().getTime().toString());
    if (isShiftPressed) {
      setEndCell({ row, col });
      return;
    }
    if (event.buttons === 1) {
      setStartCell({ row, col });
      setEndCell({ row, col });
    }
  };
  const handleMouseMove = (event, row, col) => {
    handleRemoveText(tableRef);
    if (startCell && event.buttons === 1) {
      setEndCell({ row, col });
    }
  };
  const handleTouchMove = (event) => {
    if (!startCell) return;
    handleRemoveText(tableRef);
    const touch = event.touches[0];
    const targetElement = document.elementFromPoint(
      touch.clientX,
      touch.clientY
    );

    if (targetElement) {
      const row = targetElement.getAttribute("data-row");
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
          row_ = -1;
          break;
        case "ArrowDown":
          row_ = 1;
          break;
        case "ArrowLeft":
          col_ = -1;
          break;
        case "ArrowRight":
          col_ = 1;
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
      (event.key.length === 1 &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey) ||
      event.key == "Enter" ||
      event.key == "Backspace";
    if (!isPrintableKey || (editingCell && editingCell[0] >= 0) || !startCell)
      return;

    let all_cols = table.getAllColumns();
    let targetCol = startCell.col;
    let targetColId = all_cols.length > targetCol ? all_cols[targetCol].id : "";
    event.preventDefault();
    setEditingCell([startCell.row, startCell.col, targetColId, event.key]);
  };

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
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
  const undo = () => {
    if (history.length === 0) return;

    const lastState = history[history.length - 1];
    const newRedoStack = [data, ...redoStack];
    if (newRedoStack.length > MAX_HISTORY_SIZE) {
      newRedoStack.pop();
    }

    setRedoStack(newRedoStack);
    setHistory((prev) => prev.slice(0, -1));
    setData(lastState);
  };
  const redo = () => {
    if (redoStack.length === 0) return;

    const nextState = redoStack[0];
    const newHistory = [...history, data];
    if (newHistory.length > MAX_HISTORY_SIZE) {
      newHistory.shift();
    }
    setHistory(newHistory);
    setRedoStack((prev) => prev.slice(1));
    setData(nextState);
  };
  const saveToHistory = () => {
    let currentData = JSON.parse(JSON.stringify(data));
    setHistory((prevHistory) => {
      const newHistory = [...prevHistory, currentData];
      if (newHistory.length > MAX_HISTORY_SIZE) newHistory.shift();
      return newHistory;
    });
    setRedoStack([]);
  };
  const copyToClipboard = (withheader) => {
    if (!startCell || !endCell) return;
    const rows = Math.min(startCell.row, endCell.row);
    const cols = Math.min(startCell.col, endCell.col);

    const rowCount = Math.abs(startCell.row - endCell.row) + 1;
    const colCount = Math.abs(startCell.col - endCell.col) + 1;

    let all_cols = table.getAllColumns();
    let copyAsText = "";
    let copyAsHTML = "<table>";
    if (withheader) {
      copyAsHTML = "<thead><tr>";
      for (let jj = 0; jj < colCount; jj++) {
        let col_d = cols + jj;
        let targetColId_d = all_cols.length > col_d ? all_cols[col_d].id : "";
        let colHeader: any = all_cols[col_d].columnDef.header;
        colHeader = colHeader && colHeader != "" ? colHeader : targetColId_d;
        colHeader = onCopyCell("H", col_d, targetColId_d, colHeader, "");
        copyAsText += colHeader.text + (jj === colCount - 1 ? "" : "\t");
        copyAsHTML += "<th>" + colHeader.html + "<th>";
      }
      copyAsHTML += "</tr></thead>";
    }
    if (copyAsText != "") copyAsText += "\n";
    copyAsHTML += "<tbody>";
    for (let i = 0; i < rowCount; i++) {
      copyAsHTML += "<tr>";
      for (let j = 0; j < colCount; j++) {
        const row = rows + i;
        const col = cols + j;
        let colidx = all_cols.length > col ? col : all_cols.length - 1;
        let targetColId = all_cols.length > col ? all_cols[col].id : "";

        if (data[row] && targetColId != "") {
          let cellData = data[row][targetColId];
          cellData = onCopyCell(
            "D",
            colidx,
            all_cols[col].id,
            cellData,
            data[row]
          );
          copyAsText += cellData.text + (j === colCount - 1 ? "" : "\t");
          copyAsHTML += "<th>" + cellData.html + "<th>";
        }
      }
      copyAsText += "\n";
      copyAsHTML += "</tr>";
    }
    copyAsHTML += "</tbody></table>";
    console.log(copyAsText);
    navigator.clipboard
      .writeText(copyAsText)
      .then(() => {
        succeed(t("data_copied", "Data copied!."));
      })
      .catch((error) => {
        console.error("Failed to copy: ", error);
      });
  };
  const getTopLeftCell = () => {
    if (!startCell || !endCell) return startCell;
    const topRow = Math.min(startCell.row, endCell.row);
    const leftCol = Math.min(startCell.col, endCell.col);
    return { row: topRow, col: leftCol };
  };
  const getBottomRightCell = () => {
    if (!startCell || !endCell) return startCell;
    const bottomRow = Math.max(startCell.row, endCell.row);
    const rightCol = Math.max(startCell.col, endCell.col);
    return { row: bottomRow, col: rightCol };
  };
  const handlePaste = (event: ClipboardEvent) => {
    if (editingCell) return;
    if (isHandlingPaste) return;
    if (document.activeElement !== tableRef.current) return;
    try {
      setIsHandlingPaste(true);
      event.preventDefault();
      const clipboardText = event.clipboardData?.getData("text/plain");
      if (!clipboardText) return;

      const rows = clipboardText
        .split("\n")
        .filter((row) => row.trim() !== "")
        .map((row) => row.split("\t"));

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
                newData[targetRow]["changed"] = true;
                if (targetColId === "hashtags") {
                  let cellData_arr = SplitHashtags(cellData);
                  newData[targetRow][targetColId] = cellData_arr;
                } else newData[targetRow][targetColId] = cellData;
              }
            });
            startCol = startCol + rowData.length;
          }
        });
        startRow = startRow + rows.length;
      }
      setData(newData);
    } catch (error) {
    } finally {
      setIsHandlingPaste(false);
    }
  };

  useEffect(() => {
    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, [data, startCell, endCell, editingCell]);
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (document.activeElement !== tableRef.current) return;
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
    setStartCell({ row: 0, col: 2 });
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
      if (document.activeElement !== tableRef.current) return;
      if (!editingCell && event.ctrlKey && event.key === "c") {
        event.preventDefault();
        copyToClipboard(false);
      } else if (!editingCell && event.ctrlKey && event.key === "a") {
        event.preventDefault();
        selectAll();
      }
    };
    const touchMoveHandler = (event) => {
      if (document.activeElement !== tableRef.current) return;
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
  const goToNext = (row, col, colid) => {
    if (row < 0 || (col < 0 && colid == "")) return;
    if (col < 0 && colid != "") {
      let colsmn = table.getAllColumns();
      for (let i = 0; i < colsmn.length; i++) {
        if (colsmn[i].id == colid) {
          col = i;
          break;
        }
      }
    }
    if (col < 0) return;
    let row_count = table.getRowCount();
    let col_count = table.getAllColumns().length;
    if (col + 1 > col_count) row_count = row_count + 1;
    else col = col + 1;
    if (row_count > row_count) return;

    setStartCell({ row: row, col: col });
    setEndCell({ row: row, col: col });
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
    getExpandedRowModel: getExpandedRowModel(),
    meta: {
      updateData: (rowIndex, columnId, value, beforEditingValue) => {
        skipAutoResetPageIndex();
        goToNext(rowIndex, -1, columnId);
        setEditingCell(null);

        if (value === beforEditingValue) return;

        saveToHistory();
        let id = data[rowIndex]["id"];
        if (id == "new") id = data[rowIndex]["ref"];

        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
                ["changed"]: true,
              };
            }
            return row;
          })
        );
      },

      updateValues: (rowIndex, columnId, values) => {
        goToNext(rowIndex, -1, columnId);
        if (!values || !values.length) return;
        skipAutoResetPageIndex();
        setEditingCell(null);
        saveToHistory();
        let id = data[rowIndex]["id"];
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              const updates = values.reduce(
                (acc, { columnId, value }) => ({
                  ...acc,
                  [columnId]: value,
                  ["changed"]: true,
                }),
                {}
              );
              return {
                ...row,
                ...updates,
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
      deleteRow: (rowIndex) => {
        saveToHistory();
        let id = data[rowIndex]["id"];
        const updatedItems = [...data];

        updatedItems.splice(rowIndex, 1);
        setData(updatedItems);
        if (id !== "new") {
          const deletedIds_n = [...deletedIds];
          deletedIds_n.push(id);
          setDeletedIds(deletedIds_n);
        }
      },
      getRowCanExpand: (row) => true,
      forceCloseTm: forceCloseTm,
      cellInEdit: cellInEdit,
      rowData: (rowIndex) => {
        return data[rowIndex];
      },
    },
    state: {
      pagination,
    },
  });
  useEffect(() => {
    if (!editingCell) enforceTabIndex();
  }, [editingCell]);
  const enforceTabIndex = () => {
    try {
      const element = tableRef.current;
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
        const topOffset = contentRef.current.getBoundingClientRect().top;
        const availableHeight = window.innerHeight - topOffset - 20;
        setMaxHeight(`${availableHeight}px`);
      }
    } catch (error) {}
  };

  useEffect(() => {
    adjustHeight();
    window.addEventListener("resize", adjustHeight);
    return () => {
      window.removeEventListener("resize", adjustHeight);
    };
  }, []);
  const _fixedCols = (colidx) => {
    if (colidx == 0) return 30;
    let fxd = fixedCols(colidx);
    return fxd && fxd > 0 ? fxd : -1;
  };
  const _dataEdited = () => {
    for (let i = 0; i < data.length; i++) if (!!data[i]["changed"]) return true;
    return false;
  };
  return (
    <>
      <Box className={`${isFixed ? classesG.excelContainerFullScreen : ""}`}>
        <Group
          justify="flex-start"
          mb="md"
          gap="2px"
          className={`${isFixed ? classesG.excelHeaderToolFullScreen : ""}`}
        >
          <ActionIcon
            variant="outline"
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
          <Divider orientation="vertical" size="sm" ml="2px" mr="2px" />
          <CheckSave
            t={t}
            editingCell={editingCell}
            onSave={onSave}
            disabled={!(_dataEdited() || deletedIds.length > 0)}
          />
          {/* <ActionIcon
            variant="filled"
            onClick={onSave}
            title={t("save", "Save")}
            disabled={!(_dataEdited() || deletedIds.length > 0)}
          >
            <IconDeviceFloppy stroke={1.5} size="1rem" />
          </ActionIcon> */}
          {/* <ActionIcon
            
            color="red"
            variant="filled"
            onClick={cancelChanges}
            title={t("cancel", "Cancel")}
            disabled={!(editedIds.length > 0 || deletedIds.length > 0)}
          >
            <IconRotate360 stroke={1.5} size="1rem" />
          </ActionIcon> */}
          <ConfirmRestore
            t={t}
            disabled={!(_dataEdited() || deletedIds.length > 0)}
            onConfirm={cancelChanges}
          />
          {/* <ActionIcon
            variant="outline"
            onClick={add}
            title={t("new", "New")}
          >
            <IconPlus stroke={1.5} size="1rem" />
          </ActionIcon> */}
          <Add t={t} add={add} />
          <AddByPaste isIcon={true} init={false} />
          <Divider orientation="vertical" size="sm" ml="2px" mr="2px" />
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

          <Divider orientation="vertical" size="sm" ml="2px" mr="2px" />
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

          <Divider orientation="vertical" size="sm" ml="2px" mr="2px" />
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
          <Popover width={400} position="bottom" withArrow shadow="md">
            <Popover.Target>
              <ActionIcon c="orange" variant="transparent">
                <IconQuestionMark stroke={1.5} size="1.2rem" />
              </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown p="xs">
              <Alert color="red" maw="500px" mb="xs">
                <Text size="md">
                  {t(
                    "help_excel_work_on_desctop",
                    "The spreadsheet view works well only on a desktop device."
                  )}
                </Text>
              </Alert>
              <Alert color="violet" maw="500px">
                <Text size="md">
                  {t(
                    "help_excel_changes",
                    "All changes are saved at once, so either all of them succeed or they all fail."
                  )}
                </Text>
                <Text size="md">
                  {t(
                    "help_excel_changes_loss",
                    "To avoid losing your work, save your data as often as you can."
                  )}
                </Text>
              </Alert>
              <Alert color="green" maw="500px" mt="xs">
                <Text size="md">
                  {t(
                    "help_excel_recommendation",
                    "It is recommended to create a draft first and then renew it later from a different screen view."
                  )}
                </Text>
              </Alert>
              <Alert color="red" maw="500px" mt="xs">
                <Text size="md">
                  {t(
                    "help_excel_delete",
                    "Delete or terminate: If the deal is in draft status, it will be completely removed from the system; otherwise, it will be terminated."
                  )}
                </Text>
              </Alert>
              <Alert color="blue" maw="500px" mt="xs">
                <Text size="md">
                  {t(
                    "help_excel_behaviors",
                    "Most Excel-like behaviors are supported. You can double-click, start typing, or press Enter on any cell to edit it—even if the cell contains pictures."
                  )}
                </Text>
              </Alert>
            </Popover.Dropdown>
          </Popover>
          {saveMsg !== "" && (
            <Alert color={!isError ? "blue" : "red"} p="2px" pl="lg" pr="lg">
              <Box>{saveMsg}</Box>
            </Alert>
          )}
        </Group>

        <Box
          // ref={contentRef}

          className={`${isFixed ? classesG.excelTableContainerFullScreen : ""}`}
          style={{ overflow: "auto" }}
          pb="50px"
          // mah={isFixed ? "auto" : maxHeight}
        >
          {/* <ScrollArea maw={"100%"} mx="auto" type="auto"> */}
          <table
            className="table-container"
            ref={tableRef}
            {...{
              style: {
                width: table.getCenterTotalSize(),
                marginBottom: editingCell ? "150px" : "auto",
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
                              if (!colIs4Data(colIndex)) {
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
                              if (!colIs4Data(colIndex)) {
                                return;
                              }
                              handleMouseDown(event, rowIndex, colIndex);
                            },
                            onMouseMove: (event) => {
                              if (!colIs4Data(colIndex)) {
                                return;
                              }
                              handleMouseMove(event, rowIndex, colIndex);
                            },
                            onTouchStart: (event) => {
                              if (!colIs4Data(colIndex)) {
                                return;
                              }
                              const now = Date.now();
                              if (now - lastTap <= doubleTapDelay) {
                                //handleDoubleClick(); // Trigger double-tap action
                                if (!colIs4Data(colIndex)) {
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
                              if (!colIs4Data(colIndex)) {
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
        </Box>
      </Box>
    </>
  );
});
export function getDivContentWithLineBreaks(divElement) {
  // Clone the div to avoid modifying the original content
  const clone = divElement.cloneNode(true);

  // Replace <br> with a tab for proper CSV tab spacing
  const brElements = clone.querySelectorAll("br");
  brElements.forEach((br) => br.replaceWith("\n"));

  // Replace block elements like <p>, <div>, <h1>, etc., with new lines or tabs depending on structure
  const blockElements = clone.querySelectorAll(
    "p, div, h1, h2, h3, h4, h5, h6, section, article, footer, header"
  );
  blockElements.forEach((block) => {
    block.insertAdjacentText("beforebegin", "\n"); // Insert newline before block elements
  });

  // Convert the content to text
  let text = clone.textContent || clone.innerText;

  // Ensure proper handling of nested elements and format for CSV (removes extra spaces or lines)
  text = text.replace(/[ \t]+/g, " "); // Clean up extra spaces
  text = text.replace(/\n+/g, "\n");
  if (text[0] === "\n") {
    text = text.slice(1); // Remove the first character
  }
  return text;
}
function CheckSave({ t, onSave, disabled, editingCell }) {
  const [opened, { close, open }] = useDisclosure(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        size="auto"
        withCloseButton={true}
        title={t("confirm", "Confirm...")}
      >
        <Text>
          {" "}
          {t(
            "please_confirm_the_cell_changes",
            "Please confirm or cancel the active cell changes,including the images and description."
          )}
        </Text>

        <Group mt="xl" justify="right" gap="md">
          <Button
            variant="filled"
            onClick={() => {
              close();
            }}
          >
            {t("ok", "Ok")}
          </Button>
        </Group>
      </Modal>
      <Group justify="center">
        <ActionIcon
          variant="filled"
          onClick={() => {
            if (!editingCell) onSave();
            else open();
          }}
          title={t("save", "Save")}
          disabled={disabled}
        >
          <IconDeviceFloppy stroke={1.5} size="1rem" />
        </ActionIcon>
      </Group>
    </>
  );
}
function ConfirmRestore({ t, onConfirm, disabled }) {
  const [opened, { close, open }] = useDisclosure(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        size="auto"
        withCloseButton={true}
        title={t("restore_confirmation", "Restore Confirmation..")}
      >
        <Text>
          {" "}
          {t(
            "are_you_sure_you_want_to_restore_changes_before_save",
            "Are you sure you want to revert the data to its previous state? This action is irreversible."
          )}
        </Text>

        <Group mt="xl" justify="right" gap="md">
          <Button variant="light" onClick={close}>
            {t("no", "No")}
          </Button>
          <Button
            variant="filled"
            color="red"
            onClick={() => {
              onConfirm();
              close();
            }}
          >
            {t("yes", "Yes")}
          </Button>
        </Group>
      </Modal>
      <Group justify="center">
        <ActionIcon
          // c="orange"
          color="red"
          variant="filled"
          onClick={open}
          title={t("restore", "Restore")}
          disabled={disabled}
        >
          <IconRestore stroke={1.5} size="1rem" />
        </ActionIcon>
      </Group>
    </>
  );
}
const Add = ({ t, add }) => {
  return (
    <Menu
      shadow="md"
      width={200}
      position="bottom-start"
      withinPortal={true}
      zIndex={100000000000005}
    >
      <Menu.Target>
        <ActionIcon variant="outline" title={t("new", "New")}>
          <IconPlus stroke={1.5} size="1rem" />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          leftSection={
            <Box c="orange">
              <IconCircleDashedLetterD stroke={1.5} size="1rem" />
            </Box>
          }
          onClick={() => {
            add("X");
          }}
        >
          {t("new_as_draft", "New draft")}
        </Menu.Item>
        <Menu.Item
          leftSection={
            <Box c="blue">
              <IconCircleLetterFFilled stroke={1.5} size="1rem" />
            </Box>
          }
          onClick={() => {
            add("");
          }}
        >
          {t("new_as_final_version", "New final")}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
const handleRemoveText = (elementRef) => {
  const selection = window.getSelection();
  if (!selection?.rangeCount || !elementRef) return;
  const range = selection.getRangeAt(0);

  // Check if the selection is inside the referenced element
  if (elementRef.current.contains(range.commonAncestorContainer)) {
    selection.removeAllRanges();
  }
};

export const AddByPaste = ({ isIcon, init }) => {
  const { t } = useTranslation("common", { keyPrefix: "table" });
  const [tableData, setTableData] = useState<any>([]);
  const { classes: classesG } = useGlobalStyl();
  const hash = window.location.hash.substring(1);
  const [opened, { close, open }] = useDisclosure(false);
  const [value, setValue] = useState("");
  const navigate = useNavigate();
  const [selectAll0, SetSelectAll0] = useState(false);
  const [intermidiate0, setIntermidiate0] = useState(false);

  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);

  const selectAll = (val) => {
    setTableData((prevData) =>
      prevData.map((item) => ({
        ...item, // Keep other properties unchanged
        selected: val, // Update the 'selected' field
      }))
    );
  };
  useEffect(() => {
    if (value == "") return;
    const pastedText = value; // Get pasted text
    const rows = pastedText.split("\n").filter((row) => row.trim() !== ""); // Split by lines and filter empty rows

    const parsedData = rows.map((row) => {
      const [type, title, quantity, price, hashtags, description] =
        row.split("\t"); // Split by tab
      return {
        type: type?.trim() || "",
        title: title?.trim() || "",
        quantity: quantity?.trim() || "",
        price: price?.trim() || "",
        hashtags: SplitHashtags(hashtags?.trim() || ""),
        description: description?.trim() || "",
      };
    });
    parsedData.sort((a, b) => a?.title.localeCompare(b?.title));
    setTableData(parsedData); // Update the state with parsed data
    setValue("");
    SetSelectAll0(true);
    selectAll(true);
  }, [value]);

  useEffect(() => {
    if (hash == "bypasting" && !opened && init) {
      open();
    }
  }, [hash, opened]);
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => {
          window.location.hash = "";
          close();
        }}
        size="auto"
        withCloseButton={true}
        title={t("adding_deals_by_paste", "Adding deals via pasting...")}
        fullScreen={small || medium}
      >
        <Box>
          <Alert
            icon={<IconAlertCircle />}
            variant="light"
            color="red"
            title={t(
              "guidlines_for_mass_adding_deals_via_paste",
              "Guidelines for Mass Adding Deals via Paste"
            )}
            mb="md"
          >
            <Text size="md">
              {t("paste_rule0", `The type must be either WTS or WTB.`)}
            </Text>
            <Text size="md">
              {t(
                "paste_rule1",
                `Ensure the fields follow the same order as shown in the example below.`
              )}
            </Text>
            <Text size="md" mt="2px">
              {t(
                "paste_rule2",
                `The values must be separated by a TAB, and each line must end with a \\n. In other words, copying directly from Excel or Google Sheets should work.`
              )}
            </Text>
            <Text size="md" mt="2px">
              {t(
                "paste_rule3",
                `Pasted hashtags must be separated by either the # symbol or commas.`
              )}
            </Text>
            <Text size="md" mt="2px">
              {t(
                "paste_rule5",
                `You can paste up to 15 deals at a time. Only the first 15 will be processed, and any additional deals will be ignored.`
              )}
            </Text>
          </Alert>
          <table>
            <thead>
              <tr>
                <th
                  {...{
                    className: `${classesG.actionSides}`,
                  }}
                >
                  {t("type", "Type")}
                </th>
                <th
                  {...{
                    className: `${classesG.actionSides}`,
                  }}
                >
                  {t("title", "Title")}
                </th>
                <th
                  {...{
                    className: `${classesG.actionSides}`,
                  }}
                >
                  {t("quantity", "Quantity")}
                </th>
                <th
                  {...{
                    className: `${classesG.actionSides}`,
                  }}
                >
                  {t("price", "Price")}
                </th>
                <th
                  {...{
                    className: `${classesG.actionSides}`,
                  }}
                >
                  <Group justify="flex-start" gap={0}>
                    <Box>{t("hashtags", "Hashtags")} </Box>

                    <Popover
                      width={500}
                      position="bottom"
                      withArrow
                      shadow="md"
                    >
                      <Popover.Target>
                        <ActionIcon variant="transparent">
                          <IconHelp size={"1.2rem"} />
                        </ActionIcon>
                      </Popover.Target>
                      <Popover.Dropdown>
                        <Alert variant="light" color="blue">
                          <Text size="md">
                            {t(
                              "hashtag_restrictions",
                              `Hashtags cannot contain the # symbol or commas, but it can contains spaces.`
                            )}
                          </Text>

                          <Text size="md" mt="xs">
                            {t(
                              "hashtag_allowence",
                              `The pasted hashtags must be separated either by the # symbol or by commas.`
                            )}
                          </Text>
                        </Alert>
                        <Alert variant="light" color="teal" mt="xs">
                          <Text size="md" mt="xs">
                            {t(
                              "hashtag_example",
                              `e.g grade A,Grade B,iphone 15 promax,used`
                            )}
                          </Text>
                          <Text size="md">
                            {t(
                              "hashtag_example2",
                              `e.g grade A#Grade B#iphone 15 promax#used`
                            )}
                          </Text>
                          <Text size="md" c="indigo">
                            {t(
                              "hashtag_example_result",
                              `Either one will be converted to: [grade A] [Grade B] [iphone 15 promax] [used]`
                            )}
                          </Text>
                        </Alert>
                      </Popover.Dropdown>
                    </Popover>
                  </Group>
                </th>
                <th
                  {...{
                    className: `${classesG.actionSides}`,
                  }}
                >
                  {t("description", "Description")}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  {...{
                    className: `${classesG.actionSides}`,
                  }}
                >
                  WTS
                </td>
                <td
                  {...{
                    className: `${classesG.actionSides}`,
                  }}
                >
                  {"Iphone 15 pro max"}
                </td>
                <td
                  {...{
                    className: `${classesG.actionSides}`,
                  }}
                >
                  100CS
                </td>
                <td
                  {...{
                    className: `${classesG.actionSides}`,
                  }}
                >
                  400$
                </td>
                <td
                  {...{
                    className: `${classesG.actionSides}`,
                  }}
                >
                  iPhone,Grade A/A-,used
                </td>
                <td
                  {...{
                    className: `${classesG.actionSides}`,
                  }}
                >
                  mixed colors and items will be ready by Jan 20
                </td>
              </tr>
            </tbody>
          </table>
        </Box>
        <Textarea
          autosize
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          // h={100}
          mt="lg"
          label={t("paste_deals", "Paste deals")}
          placeholder={t("paste_deals_here", "Paste deals here")}
          minRows={4}
          maxRows={4}
          mb="xs"
        />

        <MassDealEntry
          dataSet={tableData}
          setData={setTableData}
          onClose={() => {
            window.location.hash = "";
            close();
          }}
          onSucceed={(dt) => {
            window.location.hash = "";
            close();
            navigate("../app/mydeals?src=navigator&created_on=" + dt);
          }}
          selectAll0={selectAll0}
          SetSelectAll0={SetSelectAll0}
          intermidiate0={intermidiate0}
          setIntermidiate0={setIntermidiate0}
          selectAll={selectAll}
        />
        <Box c="orange" mt="xs">
          {tableData?.length} {t("deals_extracted", "Deals extracted")}
        </Box>
      </Modal>
      <Group justify="center">
        {isIcon && (
          <ActionIcon
            variant="filled"
            onClick={() => {
              window.location.hash = "bypasting";
            }}
            title={t("add_deals_by_pasting", "Add deals by pasting")}
          >
            <IconClipboardPlus stroke={1.5} size="1.7rem" />
          </ActionIcon>
        )}
        {!isIcon && (
          <Tooltip
            label={t("add_new_deal_by_pasting", "Add new deals by pasting.")}
          >
            <Button
              variant="gradient"
              gradient={{ from: "lime", to: "indigo", deg: 60 }}
              type="button"
              style={{ width: small || medium ? "auto" : 150 }}
              // onClick={open}
              onClick={() => {
                window.location.hash = "bypasting";
              }}
            >
              <Group>
                <IconClipboardPlus />
                {!(small || medium) && (
                  <Box>{t("by_pasting", "By Pasting")}</Box>
                )}
              </Group>
            </Button>
          </Tooltip>
        )}
      </Group>
    </>
  );
};
