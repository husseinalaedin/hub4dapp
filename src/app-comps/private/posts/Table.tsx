import React, { Fragment, useEffect, useRef, useState } from "react";
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
} from "@tanstack/react-table";
import {
  ActionIcon,
  Box,
  Button,
  Center,
  Group,
  Input,
  Menu,
  ScrollArea,
  Stack,
  Table,
  Textarea,
  TextInput,
} from "@mantine/core";
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
  IconDotsVertical,
  IconMaximize,
  IconMenu,
  IconMinimize,
  IconSelectAll,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { G, useMessage } from "../../../global/G";
import { HashTagsInput } from "../../../global/global-comp/Hashtags";
import { useResizeObserver } from "@mantine/hooks";
import { useAppHeaderNdSide } from "../../../hooks/useAppHeaderNdSide";
import { Wtsb } from "../../../global/global-comp/Wtsb";
import { MemoEditorApp } from "../../../global/AppEditor";
const MAX_HISTORY_SIZE = 40;
type Deal = {
  dealtype: string;
  title: string;
  quantity: string;
  price: string;
  hashtags: string[];
  description: string;
};

const defaultData: Deal[] = [
  {
    dealtype: "WTS",
    title: "iPhone 14 pro max",
    quantity: "400pcs",
    price: "500$",
    hashtags: "iphone 13,iphone 14,new".split(","),
    description:
      "Grade A/A-, Fully Tested, Pack Boxes included, Grade B condition.",
  },
  {
    dealtype: "WTS",
    title: "iPhone 13 Pro Max 128GB Grade A/A-",
    quantity: "500pcs",
    price: "600$",
    hashtags: "iPhone13ProMax,128GB,GradeA".split(","),
    description:
      "Fully Tested with HSO BATTERY 80%+, Grade B, Pack Boxes included.",
  },
  {
    dealtype: "WTS",
    title: "iPhone 13 Pro Max 128GB Grade A/A-",
    quantity: "500pcs",
    price: "600$",
    hashtags: "iPhone13ProMax,128GB,GradeA".split(","),
    description:
      "Fully Tested with HSO BATTERY 80%+, Grade B, Pack Boxes included.",
  },
  {
    dealtype: "WTS",
    title: "iPhone 13 Pro Max 128GB Grade A/A-",
    quantity: "500pcs",
    price: "600$",
    hashtags: "iPhone13ProMax,128GB,GradeA".split(","),
    description:
      "Fully Tested with HSO BATTERY 80%+, Grade B, Pack Boxes included.",
  },
  {
    dealtype: "WTS",
    title: "iPhone 13 Pro Max 128GB Grade A/A-",
    quantity: "500pcs",
    price: "600$",
    hashtags: "iPhone13ProMax,128GB,GradeA".split(","),
    description:
      "Fully Tested with HSO BATTERY 80%+, Grade B, Pack Boxes included.",
  },
  {
    dealtype: "WTS",
    title: "iPhone 13 Pro Max 128GB Grade A/A-",
    quantity: "500pcs",
    price: "600$",
    hashtags: "iPhone13ProMax,128GB,GradeA".split(","),
    description:
      "Fully Tested with HSO BATTERY 80%+, Grade B, Pack Boxes included.",
  },
];
const HashTagCell = ({ getValue, row: { index }, column: { id }, table }) => {
  const { t } = useTranslation("common", { keyPrefix: "table" });
  const inputRef = useRef<any>(null);
  const { classes: classesG } = useGlobalStyl();
  const editingCell = table.options.meta?.editingCell;
  const onEdit =
    editingCell && editingCell[0] === index && editingCell[2] === id;

  const initialValue = getValue();
  const [beforEditingValue, setBeforEditingValue] =
    React.useState(initialValue);
  const [value, setValue] = React.useState(initialValue);
  const HandleOnEdit = (val) => {
    table.options.meta?.onEdit(val);
  };
  useEffect(() => {
    setBeforEditingValue(value);
    if (onEdit && inputRef.current && inputRef.current.focus) {
      inputRef.current.focus();
      resizeInput();
    }
  }, [onEdit]);
  const onSave = () => {
    HandleOnEdit(false);
    table.options.meta?.updateData(index, id, value, beforEditingValue);
  };
  const onCancel = () => {
    setValue(beforEditingValue);
    table.options.meta?.cancelEditing();
  };
  React.useEffect(() => {
    setValue(getValue());
  }, [initialValue]);
  const resizeInput = () => {
    if (inputRef.current) {
      inputRef.current.style.width = "auto";
      inputRef.current.style.width = `${inputRef.current.scrollWidth + 10}px`;
    }
  };
  useEffect(() => {
    resizeInput();
  }, [value]);

  return (
    <>
      {!onEdit && (
        <Box
          pl="2px"
          pr="2px"
          style={{
            display: "block",
            alignItems: "center",
            fontFamily: "inherit",
            fontSize: "inherit",
            fontWeight: "inherit",
            pointerEvents: "none",
          }}
        >
          {value && value.length > 0 ? value.join(",") : ""}
        </Box>
      )}
      {onEdit && (
        <Group justify="flex-end" gap={1} w="100%" p="2px">
          <Group gap={"2px"} justify="flex-end" p="2px">
            <ActionIcon c="red" variant="light" onClick={onCancel}>
              <IconX stroke={1.5} size="1.2rem" />
            </ActionIcon>
            <ActionIcon variant="filled" onClick={onSave}>
              <IconCheck stroke={1.5} size="1.2rem" />
            </ActionIcon>
          </Group>
          <HashTagsInput
            placeholder={t("enter_hashtags", "Please Enter the hashtag")}
            //   ref={inputRef}
            h="100%"
            w="100%"
            defaultValue={initialValue}
            value={value}
            onChange={setValue}
            onBlur={() => {
              if (beforEditingValue === value) onCancel();
              // onSave()
            }}
            readOnly={false}
            onEscape={onCancel}
          />
        </Group>
      )}
    </>
  );
};
const TypeCell = ({ getValue, row: { index }, column: { id }, table }) => {
  const { t } = useTranslation("common", { keyPrefix: "table" });
  const inputRef = useRef<any>(null);
  const { classes: classesG } = useGlobalStyl();
  const editingCell = table.options.meta?.editingCell;
  const onEdit =
    editingCell && editingCell[0] === index && editingCell[2] === id;

  const initialValue = getValue();
  const [beforEditingValue, setBeforEditingValue] =
    React.useState(initialValue);
  const [value, setValue] = React.useState(initialValue);
  const HandleOnEdit = (val) => {
    table.options.meta?.onEdit(val);
  };
  useEffect(() => {
    setBeforEditingValue(value);
    if (onEdit && inputRef.current && inputRef.current.focus) {
      inputRef.current.focus();
      resizeInput();
    }
  }, [onEdit]);
  const onSave = () => {
    HandleOnEdit(false);
    table.options.meta?.updateData(index, id, value, beforEditingValue);
  };
  const onCancel = () => {
    setValue(beforEditingValue);
    table.options.meta?.cancelEditing();
  };
  React.useEffect(() => {
    setValue(getValue());
  }, [initialValue]);
  const resizeInput = () => {
    if (inputRef.current) {
      inputRef.current.style.width = "auto";
      inputRef.current.style.width = `${inputRef.current.scrollWidth + 10}px`;
    }
  };
  useEffect(() => {
    resizeInput();
  }, [value]);

  return (
    <>
      {!onEdit && (
        <Box
          pl="2px"
          pr="2px"
          style={{
            display: "block",
            alignItems: "center",
            fontFamily: "inherit",
            fontSize: "inherit",
            fontWeight: "inherit",
            pointerEvents: "none",
          }}
        >
          {value}
        </Box>
      )}
      {onEdit && (
        <Group justify="flex-end" gap={1} p="2px">
          <Group gap={"2px"} justify="flex-end" p="2px">
            <ActionIcon c="red" variant="light" onClick={onCancel}>
              <IconX stroke={1.5} size="1.2rem" />
            </ActionIcon>
            <ActionIcon variant="filled" onClick={onSave}>
              <IconCheck stroke={1.5} size="1.2rem" />
            </ActionIcon>
          </Group>
          <Wtsb
            withinPortal={true}
            defaultValue={initialValue}
            value={value}
            onChange={setValue}
            onBlur={() => {
              if (beforEditingValue === value) onCancel();
              // onSave()
            }}
            onKeyDown={(event) => {
              if (event.key == "Enter") onSave();
              if (event.key == "Escape") {
                setValue(beforEditingValue);
                table.options.meta?.cancelEditing();
              }
            }}
          />
        </Group>
      )}
    </>
  );
};
const ActionMenuCell = ({
  getValue,
  row: { index },
  column: { id },
  table,
}) => {
  const { t } = useTranslation("common", { keyPrefix: "table" });
  const inputRef = useRef<any>(null);
  const { classes: classesG } = useGlobalStyl();
  const editingCell = table.options.meta?.editingCell;
  const onEdit =
    editingCell && editingCell[0] === index && editingCell[2] === id;

  const initialValue = getValue();
  const [beforEditingValue, setBeforEditingValue] =
    React.useState(initialValue);
  const [value, setValue] = React.useState(initialValue);
  const HandleOnEdit = (val) => {
    table.options.meta?.onEdit(val);
  };
  useEffect(() => {
    console.log(inputRef);
    if (onEdit && inputRef.current && inputRef.current.focus) {
      inputRef.current.focus();
      resizeInput();
      setBeforEditingValue(value);
    }
  }, [onEdit]);

  React.useEffect(() => {
    setValue(getValue());
  }, [initialValue]);
  const resizeInput = () => {
    if (inputRef.current) {
      inputRef.current.style.width = "auto";
      inputRef.current.style.width = `${inputRef.current.scrollWidth + 10}px`;
    }
  };
  useEffect(() => {
    resizeInput();
  }, [value]);

  return (
    <Center>
      <Menu shadow="md" width={200} position="bottom-start">
        <Menu.Target>
          <ActionIcon
            variant="subtle"
            //   onClick={undo}
            title={t("action_menu", "Action Menu")}
          >
            <IconDotsVertical stroke={1.5} size="1.2rem" />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            c="red"
            leftSection={
              <Box>
                <IconTrash stroke={1.5} size="1rem" />
              </Box>
            }
            onClick={() => {
              table.options.meta?.deleteRow(index);
            }}
          >
            {t("delete", "Delete Record")}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Center>
  );
};
const ReadOnlyCell = ({ getValue, row: { index }, column: { id }, table }) => {
  const { t } = useTranslation("common", { keyPrefix: "table" });
  const inputRef = useRef<any>(null);
  const { classes: classesG } = useGlobalStyl();
  const editingCell = table.options.meta?.editingCell;
  const onEdit =
    editingCell && editingCell[0] === index && editingCell[2] === id;

  const initialValue = getValue();
  const [beforEditingValue, setBeforEditingValue] =
    React.useState(initialValue);
  const [value, setValue] = React.useState(initialValue);
  const HandleOnEdit = (val) => {
    table.options.meta?.onEdit(val);
  };
  useEffect(() => {
    setBeforEditingValue(value);
    if (onEdit && inputRef.current && inputRef.current.focus) {
      inputRef.current.focus();
      resizeInput();
    }
  }, [onEdit]);
  const onSave = () => {
    HandleOnEdit(false);
    table.options.meta?.updateData(index, id, value, beforEditingValue);
  };
  const onCancel = () => {
    setValue(beforEditingValue);
    table.options.meta?.cancelEditing();
  };
  React.useEffect(() => {
    setValue(getValue());
  }, [initialValue]);
  const resizeInput = () => {
    if (inputRef.current) {
      inputRef.current.style.width = "auto";
      inputRef.current.style.width = `${inputRef.current.scrollWidth + 10}px`;
    }
  };
  useEffect(() => {
    resizeInput();
  }, [value]);

  return (
    <>
      {!onEdit && (
        <Box
          pl="2px"
          pr="2px"
          style={{
            display: "block",
            alignItems: "center",
            fontFamily: "inherit",
            fontSize: "inherit",
            fontWeight: "inherit",
            pointerEvents: "none",
          }}
        >
          {value}
        </Box>
      )}
      {onEdit && (
        <Group gap={1}>
          {t("editing", "editing")}
          <Box>...</Box>
        </Group>
      )}
    </>
  );
};
const defaultColumns: ColumnDef<Deal>[] = [
  {
    accessorKey: "action",
    header: "#",
    cell: ActionMenuCell,
  },
  {
    accessorKey: "dealtype",
    header: "Type",
    cell: TypeCell,
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "hashtags",
    header: "Hashtags",
    cell: HashTagCell,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ReadOnlyCell,
  },
];
declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (
      rowIndex: number,
      columnId: string,
      value: unknown,
      beforEditingValue: unknown
    ) => void;
    onEdit: (onEdit_: boolean) => void;
    editingCell: [number, number, string] | null;
    cellIsHighlighted: (rowIndex: number, columnIndex: number) => boolean;
    cancelEditing: () => void;
    deleteRow: (rowIndex: number) => void;
    getRowCanExpand: (row: Row<TData>) => boolean;
  }
}

const defaultColumn: Partial<ColumnDef<Deal>> = {
  cell: ({ getValue, row: { index }, column: { id }, table }) => {
    const inputRef = useRef<any>(null);
    const { classes: classesG } = useGlobalStyl();
    const editingCell = table.options.meta?.editingCell;
    const onEdit =
      editingCell && editingCell[0] === index && editingCell[2] === id;
    const initialValue = getValue();
    const [beforEditingValue, setBeforEditingValue] =
      React.useState(initialValue);
    const [value, setValue] = React.useState(initialValue);
    const HandleOnEdit = (val) => {
      table.options.meta?.onEdit(val);
    };
    useEffect(() => {
      if (onEdit && inputRef.current && inputRef.current.focus) {
        inputRef.current.focus();
        resizeInput();
        setBeforEditingValue(value);
      }
    }, [onEdit]);
    const onSave = () => {
      HandleOnEdit(false);
      table.options.meta?.updateData(index, id, value, beforEditingValue);
    };
    const onCancel = () => {
      setValue(beforEditingValue);
      table.options.meta?.cancelEditing();
    };
    React.useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);
    const resizeInput = () => {
      if (inputRef.current) {
        inputRef.current.style.width = "auto";
        inputRef.current.style.width = `${inputRef.current.scrollWidth + 10}px`;
      }
    };
    useEffect(() => {
      resizeInput();
    }, [value]);

    return (
      <>
        {!onEdit && (
          <Box
            bg="transparent"
            pl="2px"
            pr="2px"
            style={{
              display: "block",
              alignItems: "center",
              fontFamily: "inherit",
              fontSize: "inherit",
              fontWeight: "inherit",
              pointerEvents: "none",
            }}
          >
            {value as string}
          </Box>
        )}
        {onEdit && (
          <TextInput
            className={classesG.inputExcel}
            ref={inputRef}
            onKeyDown={(event) => {
              if (event.key == "Enter") onSave();
              if (event.key == "Escape") {
                onCancel();
              }
            }}
            value={value as string}
            onChange={(e) => setValue(e.target.value)}
            onBlur={() => {
              if (beforEditingValue === value) onCancel();
              // onSave()
            }}
            style={{
              fontFamily: "inherit",
              fontSize: "inherit",
              fontWeight: "inherit",
              whiteSpace: "nowrap",
              overflow: "hidden",
              border: "1px solid red;",
              position: "absolute",
              top: 0,
              left: 0,
              // bottom: 0,
              width: "auto",
              minWidth: "100px",
              zIndex: 4000,
            }}
            rightSectionWidth={60}
            rightSection={
              <Group gap={"2px"}>
                <ActionIcon c="red" variant="light" onClick={onCancel}>
                  <IconX stroke={1.5} size="1.2rem" />
                </ActionIcon>
                <ActionIcon variant="filled" onClick={onSave}>
                  <IconCheck stroke={1.5} size="1.2rem" />
                </ActionIcon>
                
              </Group>
            }
          />
        )}
      </>
    );
  },
};
const EditDescription = ({ row, rowIndex, table }) => {
  const { t } = useTranslation("common", { keyPrefix: "table" });
  const initialValue = row.original.description;
  // const [value, setValue] = React.useState(initialValue);
  const HandleOnEdit = (val) => {
    table.options.meta?.onEdit(val);
  };
  const bodyRef = useRef<any>(null);
  const onSave = () => {
    HandleOnEdit(false);
    let body = bodyRef?.current?.editorObject?.currentContent;
    table.options.meta?.updateData(
      rowIndex,
      "description",
      body,
      row.original.description
    );
  };
  const onCancel = () => {
    table.options.meta?.cancelEditing();
  };
  return (
    <Box>
      <Group gap={"2px"} justify="flex-end" p="2px">
        <Button
          size="compact-lg"
          c="red"
          variant="light"
          onClick={onCancel}
          leftSection={<IconX stroke={1.5} size="1.2rem" />}
        >
          {t("cancel", "Cancel")}
        </Button>
        <Button
          size="compact-lg"
          variant="filled"
          onClick={onSave}
          leftSection={<IconCheck stroke={1.5} size="1.2rem" />}
        >
          {t("confirm", "Confirm")}
        </Button>
      </Group>
      <MemoEditorApp ref={bodyRef} content={initialValue} edit={true} />
    </Box>
  );
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
  const { classes: classesG } = useGlobalStyl();
  const { desktopFocus, setDesktopfocus }: any = useAppHeaderNdSide();
  const { succeed } = useMessage();
  const { t } = useTranslation("common", { keyPrefix: "table" });
  const [data, setData] = useState<any>(() => [...defaultData]);
  const [history, setHistory] = useState<any>([]);
  const [redoStack, setRedoStack] = useState<any>([]);
  const [deletedIds, setDeletedIds] = useState<any>([]);
  const [editedIds, setEditedIds] = useState<any>([]);
  const [startCell, setStartCell] = useState<any>(null); // Starting cell coordinates
  const [endCell, setEndCell] = useState<any>(null); // Ending cell coordinates
  const [onEdit, setOnEdit] = useState(false);
  const [density, setDensity] = useState<boolean>(true);
  const [editingCell, setEditingCell] = useState<
    [number, number, string] | null
  >(null);
  const cellInEdit = (rowIndex, colIndex, id) => {
    return (
      (editingCell &&
        editingCell[0] == rowIndex &&
        editingCell[1] == colIndex &&
        colIndex > 0) ||
      (editingCell &&
        editingCell[0] == rowIndex &&
        editingCell[2] == id &&
        id != "")
    );
  };
  const [isShiftPressed, setIsShiftPressed] = useState(false);

  const handleMouseDown = (event, row, col) => {
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
  const activeCellByTyping = (event) => {
    const isPrintableKey =
      (event.key.length === 1 && // Ensure it's a single character
        !event.ctrlKey && // Exclude Ctrl key combinations
        !event.metaKey && // Exclude Meta/Command key combinations
        !event.altKey) ||
      event.key === "Backspace"; // Include Backspace;
    if (!isPrintableKey || (editingCell && editingCell[0] >= 0) || !startCell)
      return;

    let all_cols = table.getAllColumns();
    let targetCol = startCell.col;
    let targetColId = all_cols.length > targetCol ? all_cols[targetCol].id : "";
    event.preventDefault();
    setEditingCell([startCell.row, startCell.col, targetColId]);
  };
  const [columns] = React.useState<typeof defaultColumns>(() => [
    ...defaultColumns,
  ]);
useEffect(()=>{
console.log(editingCell);
},[editingCell])
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
  const rowInEditMode = (rowIndex) => {
    return editingCell && editingCell[0] == rowIndex;
  };
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Shift") {
        setIsShiftPressed(true); // Mark Shift as pressed
      }
    };

    const handleKeyUp = (event) => {
      if (event.key === "Shift") {
        setIsShiftPressed(false); // Mark Shift as released
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

  const handlePaste = (event: ClipboardEvent) => {
    event.preventDefault();
    const clipboardText = event.clipboardData?.getData("text/plain");
    if (!clipboardText) return;

    const rows = clipboardText
      .split("\n")
      .filter((row) => row.trim() !== "") // Ignore empty rows
      .map((row) => row.split("\t")); // Split by tabs

    const topLeftCell = getTopLeftCell();
    let all_cols = table.getAllColumns();

    if (!topLeftCell) return;
    saveToHistory();
    const newData = [...data];
    const startRow = topLeftCell.row;
    const startCol = topLeftCell.col;

    rows.forEach((rowData, rowIndex) => {
      rowData.forEach((cellData, colIndex) => {
        const targetRow = startRow + rowIndex;
        const targetCol = startCol + colIndex;
        let targetColId =
          all_cols.length > targetCol ? all_cols[targetCol].id : "";

        if (targetRow < newData.length && targetColId != "") {
          newData[targetRow][targetColId] = cellData;
        }
      });
    });

    setData(newData);
  };

  useEffect(() => {
    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, [data, startCell, endCell]);
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
    setEndCell({ row: table.getRowCount(), col: table.getAllColumns().length });
  };
  const deSelectAny = () => {
    setStartCell(null);
    setEndCell(null);
  };
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "c") {
        event.preventDefault();
        copyToClipboard(false);
      } else if (event.ctrlKey && event.key === "a") {
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
  }, [data, startCell, endCell]);
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

    meta: {
      updateData: (rowIndex, columnId, value, beforEditingValue) => {
        setEditingCell(null);
        if (value === beforEditingValue) return;
        skipAutoResetPageIndex();

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
      getRowCanExpand: (row) => {
        return true;
      },
    },
  });

  return (
    <>
      <Group justify="flex-start" mb="md" gap="2px">
        <ActionIcon
          variant="filled"
          onClick={() => {
            setDesktopfocus((prev) => !prev);
          }}
          title={
            desktopFocus ? t("minimize", "Minimize") : t("maximize", "Maximize")
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

      <Box pb="xl">
        <ScrollArea maw={"100%"} mx="auto" type="auto">
          <table
            {...{
              style: {
                width: table.getCenterTotalSize(),
              },
              tabIndex: 0,
              onKeyDown: (event) => activeCellByTyping(event),
            }}
          >
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header, header_idx) => (
                    <th
                      {...{
                        key: header.id,
                        colSpan: header.colSpan,
                        className: `${classesG.actionSides}`,
                        style: {
                          width: header_idx == 0 ? "30px" : header.getSize(),
                          maxWidth: header_idx == 0 ? "30px" : "auto",
                          height: "30px",
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
                  ))}
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
                    {row.getVisibleCells().map((cell, colIndex) => (
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
                            width:
                              colIndex == 0 ? "30px" : cell.column.getSize(),
                            maxWidth: colIndex == 0 ? "30px" : "auto",
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
                            ]);
                          },
                          onMouseDown: (event) => {
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
                            event.preventDefault();
                            handleMouseDown(event, rowIndex, colIndex);
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
                    ))}
                  </tr>
                  {cellInEdit(rowIndex, -1, "description") && (
                    <tr>
                      {/* 2nd row is a custom 1 cell row */}
                      <td colSpan={row.getVisibleCells().length}>
                        <EditDescription
                          row={row}
                          rowIndex={rowIndex}
                          table={table}
                        />
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      </Box>
    </>
  );
}
