import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
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
} from "@tanstack/react-table";
import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Center,
  Group,
  Input,
  Menu,
  Popover,
  ScrollArea,
  Stack,
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
  IconArrowBackUp,
  IconArrowForwardUp,
  IconBaselineDensityMedium,
  IconBaselineDensitySmall,
  IconCheck,
  IconCopy,
  IconCopyPlus,
  IconDeselect,
  IconDotsVertical,
  IconInfoCircle,
  IconMaximize,
  IconMenu,
  IconMinimize,
  IconQuestionMark,
  IconSelectAll,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { G, useMessage } from "../../../global/G";
import {
  HASHTAGS_SEP,
  HashtagsAlert,
  HashTagsInput,
  SplitHashtags,
} from "../../../global/global-comp/Hashtags";
import {
  useClickOutside,
  useDisclosure,
  useResizeObserver,
} from "@mantine/hooks";
import { useAppHeaderNdSide } from "../../../hooks/useAppHeaderNdSide";
import { Wtsb } from "../../../global/global-comp/Wtsb";
import { MemoEditorApp } from "../../../global/AppEditor";
import { CurrenciesDropped } from "../../../global/global-comp/Currencies";
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
const HashTagHeader = ({ table }) => {
  return (
    <Group justify="center">
      <Box>hashtags</Box>
      <HashtagsAlert />
    </Group>
  );
};
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
    // if (value && value.split) {
    //   let values_ = value.split(HASHTAGS_SEP);
    //   // for (let i = 0; i < values_.length; i++) {
    //   table.options.meta?.updateData(index, id, values_, "");
    //   // }
    // } else table.options.meta?.updateData(index, id, value, beforEditingValue);
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
          {value && value.join && value.length > 0 ? value.join(",") : [value]}
        </Box>
      )}
      {/* <Tooltip
        label={t(
          "hashtag_info_message",
          "Please enter the hashtag and press Enter"
        )}
      >
        <ActionIcon c="orange" variant="light" style={{ cursor: "help" }}>
          <IconQuestionMark stroke={1.5} size="1.2rem" />
        </ActionIcon>
      </Tooltip> */}
      {onEdit && (
        <Group
          className={classesG.editingExcelCell}
          justify="space-between"
          gap={1}
          p="2px"
          style={{
            fontFamily: "inherit",
            fontSize: "inherit",
            fontWeight: "inherit",
            whiteSpace: "nowrap",
            overflow: "hidden",
            border: "1px solid red;",
            position: "absolute",
            top: -2,
            left: -2,
            // bottom: 0,
            width: "320px",
            minWidth: "325px",
            zIndex: 4000,
          }}
        >
          <Box w="250px">
            <HashTagsInput
              withinPortal={30000}
              placeholder={t("enter_hashtags", "Please Enter#")}
              ref={inputRef}
              // h="100%"
              w="100%"
              defaultValue={
                Array.isArray(initialValue) ? initialValue : [initialValue]
              }
              value={Array.isArray(value) ? value : [value]}
              onChange={setValue}
              onBlur={() => {
                if (beforEditingValue === value) onCancel();
                // onSave()
              }}
              readOnly={false}
              onEscape={onCancel}
            />
          </Box>

          <Group gap={"3px"} justify="space-between" p="2px">
            <ActionIcon c="red" variant="light" onClick={onCancel}>
              <IconX stroke={1.5} size="1.2rem" />
            </ActionIcon>
            <ActionIcon variant="filled" onClick={onSave}>
              <IconCheck stroke={1.5} size="1.2rem" />
            </ActionIcon>
          </Group>
        </Group>
      )}
    </>
  );
};
const TypeCell = ({ getValue, row: { index }, column: { id }, table }) => {
  const [forceClick, setForceClick] = useState("");

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
    if (onEdit) {
      setForceClick(new Date().getTime().toString());
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
        <Group
          className={classesG.editingExcelCell}
          justify="space-between"
          gap={1}
          p="2px"
          style={{
            fontFamily: "inherit",
            fontSize: "inherit",
            fontWeight: "inherit",
            whiteSpace: "nowrap",
            overflow: "hidden",
            border: "1px solid red;",
            position: "absolute",
            top: -2,
            left: -2,
            // bottom: 0,
            width: "320px",
            minWidth: "320px",
            zIndex: 4000,
          }}
        >
          <Wtsb
            forceClick={forceClick}
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
          <Group gap={"3px"} justify="space-between" p="2px">
            <ActionIcon c="red" variant="light" onClick={onCancel}>
              <IconX stroke={1.5} size="1.2rem" />
            </ActionIcon>
            <ActionIcon variant="filled" onClick={onSave}>
              <IconCheck stroke={1.5} size="1.2rem" />
            </ActionIcon>
          </Group>
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
  const ref = useRef<HTMLDivElement | null>(null); // Explicitly type the ref
  const [opened, setOpened] = useState(false);
  const { t } = useTranslation("common", { keyPrefix: "table" });
  const inputRef = useRef<any>(null);
  const { classes: classesG } = useGlobalStyl();
  const forceCloseTm = table.options.meta?.forceCloseTm;
  useEffect(() => {
    if (!forceCloseTm || forceCloseTm == "") return;
    // setOpened(false);
  }, [forceCloseTm]);
  const handler = (event: any) => {
    try {
      if (ref.current && ref.current.contains(event.target)) {
        event.stopPropagation();
        return;
      }
    } catch (error) {}

    setOpened(false);
  };
  useEffect(() => {
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, []);
  return (
    <Center>
      <Menu
        shadow="md"
        width={200}
        position="bottom-start"
        opened={opened}
        withinPortal={true}
        zIndex={100000000000005}
      >
        <Menu.Target>
          <ActionIcon
            variant="subtle"
            onClick={() => {
              setOpened((prev) => !prev);
            }}
            title={t("action_menu", "Action Menu")}
          >
            <IconDotsVertical stroke={1.5} size="1.2rem" />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown ref={ref}>
          <Menu.Item
            c="red"
            leftSection={
              <Box>
                <IconTrash stroke={1.5} size="1rem" />
              </Box>
            }
            onClick={() => {
              table.options.meta?.deleteRow(index);
              setOpened(false);
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
const PriceCell = ({ getValue, row: { index }, column: { id }, table }) => {
  const inputRef = useRef<any>(null);
  const contnrRef = useRef<any>(null);
  const currRef = useRef<any>(null);
  const { classes: classesG } = useGlobalStyl();
  const editingCell = table.options.meta?.editingCell;
  const onEdit =
    editingCell && editingCell[0] === index && editingCell[2] === id;
  const initialValue = getValue();
  const [beforEditingValue, setBeforEditingValue] =
    React.useState(initialValue);
  const [value, setValue] = React.useState(
    G.parseNumberAndString(initialValue).number
  );
  const [curr, setCurr] = React.useState(
    G.parseNumberAndString(initialValue).text
  );

  const HandleOnEdit = (val) => {
    table.options.meta?.onEdit(val);
  };
  useEffect(() => {
    if (onEdit && inputRef.current && inputRef.current.focus) {
      inputRef.current.focus();
      resizeInput();
      setBeforEditingValue(value + curr);
      if (editingCell[3] == "Backspace") {
        // setValue("");
      }
    }
  }, [onEdit]);
  const onSave = () => {
    HandleOnEdit(false);
    table.options.meta?.updateData(index, id, value + curr, beforEditingValue);
  };
  const onCancel = () => {
    updateMixedValues(beforEditingValue);
    table.options.meta?.cancelEditing();
  };
  React.useEffect(() => {
    updateMixedValues(initialValue);
  }, [initialValue]);
  const updateMixedValues = (iput) => {
    let vl = G.parseNumberAndString(iput);
    setValue(vl.number);
    setCurr(vl.text);
  };
  const resizeInput = () => {
    if (contnrRef.current && inputRef.current) {
      inputRef.current.style.width = "auto";
      inputRef.current.style.width = `${inputRef.current.scrollWidth}px`;

      contnrRef.current.style.width = "auto";
      contnrRef.current.style.width = `${inputRef.current.scrollWidth + 155}px`;
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
          {(value + curr) as string}
        </Box>
      )}
      {onEdit && (
        <Group
          gap={2}
          style={{
            fontFamily: "inherit",
            fontSize: "inherit",
            fontWeight: "inherit",
            whiteSpace: "nowrap",
            overflow: "hidden",
            border: "1px solid red;",
            position: "absolute",
            top: -2,
            left: -2,
            // bottom: 0,
            width: "auto",
            minWidth: "200px",
            zIndex: 400000000000000,
          }}
          className={classesG.editingExcelCell}
          ref={contnrRef}
          justify="space-between"
        >
          <TextInput
            classNames={{
              input: classesG.width75,
            }}
            style={{ width: 75 }}
            variant="unstyled"
            ref={inputRef}
            onKeyDown={(event) => {
              if (event.key == "Enter") {
                if (currRef.current) currRef.current.focus();
                //onSave();
              }
              if (event.key == "Escape") {
                onCancel();
              }
            }}
            value={value as string}
            onChange={(e) => setValue(e.target.value)}
            onBlur={() => {
              // if (beforEditingValue === value) onCancel();
              // onSave()
            }}
          />
          <Group justify="flex-end" w={135}>
            <Group gap={"2px"} w={"100%"} justify="flex-end">
              <CurrenciesDropped
                defaultValue={curr}
                ref={currRef}
                onSubmit={(val) => {
                  setCurr(val);
                  onSave();
                }}
                onKeyDown={(event) => {
                  if (event.key == "Escape") {
                    onCancel();
                  }
                }}
              />

              <ActionIcon c="red" variant="light" onClick={onCancel}>
                <IconX stroke={1.5} size="1.2rem" />
              </ActionIcon>
              <ActionIcon variant="filled" onClick={onSave}>
                <IconCheck stroke={1.5} size="1.2rem" />
              </ActionIcon>
            </Group>
          </Group>
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
    cell: PriceCell,
  },
  {
    accessorKey: "hashtags",
    header: ({ table }) => <HashTagHeader table={table} />,
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
    editingCell: [number, number, string, string] | null;
    cellIsHighlighted: (rowIndex: number, columnIndex: number) => boolean;
    cancelEditing: () => void;
    deleteRow: (rowIndex: number) => void;
    getRowCanExpand: (row: Row<TData>) => boolean;
    forceCloseTm: string;
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
        if (editingCell[3] == "Backspace") {
          setValue("");
        }
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
            className={classesG.editingExcelCell}
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
              top: -2,
              left: -2,
              // bottom: 0,
              width: "auto",
              minWidth: "100px",
              zIndex: 400000000000000,
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
  const elementRef: any = useRef(null);
  const [forceCloseTm, setForceCloseTm] = useState("");
  const [lastTap, setLastTap] = useState(0);
  const doubleTapDelay = 300; // Maximum delay between taps in milliseconds

  const { classes: classesG } = useGlobalStyl();
  const { desktopFocus, setDesktopfocus }: any = useAppHeaderNdSide();
  const { succeed } = useMessage();
  const { t } = useTranslation("common", { keyPrefix: "table" });
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 1000,
  });

  const defaults = () => {
    let dta: any = [];
    let dta_s = JSON.stringify(defaultData);
    for (let i = 0; i < 5; i++) {
      let df = JSON.parse(dta_s);
      for (let i = 0; i < df.length; i++) {
        dta.push(df[i]);
      }
    }
    console.log(dta, "DATA");
    return dta;
  };
  const [data, setData] = useState<any>(() => [...defaults()]);
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
  const [columns] = React.useState<typeof defaultColumns>(() => [
    ...defaultColumns,
  ]);
  useEffect(() => {
    console.log(editingCell);
  }, [editingCell]);
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
      forceCloseTm: forceCloseTm,
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
        const availableHeight = window.innerHeight - topOffset-20;

        // Set the calculated height
        setMaxHeight(`${availableHeight}px`);
      }
    } catch (error) {
      
    }
    
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
                  {headerGroup.headers.map((header, header_idx) => (
                    <th
                      {...{
                        key: header.id,
                        colSpan: header.colSpan,
                        className: `${classesG.actionSides} ${
                          isFixed ? classesG.excelTableHeaderFullScreen : ""
                        } `,
                        style: {
                          width: header_idx == 0 ? "30px" : header.getSize(),
                          maxWidth: header_idx == 0 ? "30px" : "auto",
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
          {/* </ScrollArea> */}
        </Box>
      </Box>
    </>
  );
}
