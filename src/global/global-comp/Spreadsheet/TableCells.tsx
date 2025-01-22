import {
  ActionIcon,
  Box,
  Button,
  Center,
  Group,
  Image,
  Menu,
  TextInput,
} from "@mantine/core";
import {
  IconCheck,
  IconCircleDashedLetterD,
  IconCircleFilled,
  IconCircleLetterFFilled,
  IconDotsVertical,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { CurrenciesDropped, UomsDropped } from "../Currencies";
import { forwardRef, useEffect, useRef, useState } from "react";
import { CLOUDFARE_IMAGE_URL1, G } from "../../G";
import { useGlobalStyl } from "../../../hooks/useTheme";
import { useTranslation } from "react-i18next";
import { Wtsb } from "../Wtsb";
import { HashtagsAlert, HashTagsInput } from "../Hashtags";
import { ColumnDef } from "@tanstack/react-table";
import { MemoEditorApp } from "../../AppEditor";
import {
  ImagesZoneDeals,
  MAX_NB_IMAGES,
} from "../../../app-comps/private/posts/ImagesZoneDeals";
import { AppDiv } from "../../AppDiv";
import { NumericFormat } from "react-number-format";
import { decimalSep, thousandSep } from "../../Misc";

const NumericFormatRef = forwardRef((props: any, ref) => (
  <NumericFormat {...props} getInputRef={ref} />
));
// const defaultData: Deal[] = [
//   {
//     dealtype: "WTS",
//     title: "iPhone 14 pro max",
//     quantity: "400pcs",
//     price: "500$",
//     hashtags: "iphone 13,iphone 14,new".split(","),
//     description:
//       "Grade A/A-, Fully Tested, Pack Boxes included, Grade B condition.",
//   },
//   {
//     dealtype: "WTS",
//     title: "iPhone 13 Pro Max 128GB Grade A/A-",
//     quantity: "500pcs",
//     price: "600$",
//     hashtags: "iPhone13ProMax,128GB,GradeA".split(","),
//     description:
//       "Fully Tested with HSO BATTERY 80%+, Grade B, Pack Boxes included.",
//   },
//   {
//     dealtype: "WTS",
//     title: "iPhone 13 Pro Max 128GB Grade A/A-",
//     quantity: "500pcs",
//     price: "600$",
//     hashtags: "iPhone13ProMax,128GB,GradeA".split(","),
//     description:
//       "Fully Tested with HSO BATTERY 80%+, Grade B, Pack Boxes included.",
//   },
//   {
//     dealtype: "WTS",
//     title: "iPhone 13 Pro Max 128GB Grade A/A-",
//     quantity: "500pcs",
//     price: "600$",
//     hashtags: "iPhone13ProMax,128GB,GradeA".split(","),
//     description:
//       "Fully Tested with HSO BATTERY 80%+, Grade B, Pack Boxes included.",
//   },
//   {
//     dealtype: "WTS",
//     title: "iPhone 13 Pro Max 128GB Grade A/A-",
//     quantity: "500pcs",
//     price: "600$",
//     hashtags: "iPhone13ProMax,128GB,GradeA".split(","),
//     description:
//       "Fully Tested with HSO BATTERY 80%+, Grade B, Pack Boxes included.",
//   },
//   {
//     dealtype: "WTS",
//     title: "iPhone 13 Pro Max 128GB Grade A/A-",
//     quantity: "500pcs",
//     price: "600$",
//     hashtags: "iPhone13ProMax,128GB,GradeA".split(","),
//     description:
//       "Fully Tested with HSO BATTERY 80%+, Grade B, Pack Boxes included.",
//   },
// ];
export const HashTagHeader = ({ table }) => {
  return (
    <Group justify="center" gap={0}>
      <Box>Hashtags</Box>
      <HashtagsAlert />
    </Group>
  );
};
export const HashTagCell = ({
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
  const [beforEditingValue, setBeforEditingValue] = useState(initialValue);
  const [value, setValue] = useState(initialValue);
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
  useEffect(() => {
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
              // zIndex={30000000}
              initSearchValue={
                onEdit &&
                editingCell &&
                editingCell[3].length == 1 &&
                editingCell[3] != "Enter"
                  ? editingCell[3]
                  : ""
              }
              withinPortal={true}
              placeholder={t("enter_hashtags", "Please Enter#")}
              ref={inputRef}
              // h="100%"
              w="100%"
              defaultValue={
                Array.isArray(initialValue) ? initialValue : [initialValue]
              }
              value={ Array.isArray(value) ? value : []}
             
              onChange={setValue}
              onBlur={() => {
                if (beforEditingValue === value) onCancel();
                // onSave()
              }}
              readOnly={false}
              onEscape={onCancel}
              onEmptyEnter={onSave}
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
export const TypeCell = ({
  getValue,
  row: { index },
  column: { id },
  table,
}) => {
  const [forceClick, setForceClick] = useState("");

  const { t } = useTranslation("common", { keyPrefix: "table" });
  const inputRef = useRef<any>(null);
  const { classes: classesG } = useGlobalStyl();
  const editingCell = table.options.meta?.editingCell;
  const onEdit =
    editingCell && editingCell[0] === index && editingCell[2] === id;

  const initialValue = getValue();
  const [beforEditingValue, setBeforEditingValue] = useState(initialValue);
  const [value, setValue] = useState(initialValue);
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
  const onSave = (val) => {
    HandleOnEdit(false);
    table.options.meta?.updateData(index, id, val, beforEditingValue);
  };
  const onCancel = () => {
    setValue(beforEditingValue);
    table.options.meta?.cancelEditing();
  };
  useEffect(() => {
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
            onSubmit={(val) => {
              setValue(val);
              onSave(val);
            }}
            onBlur={() => {
              if (beforEditingValue === value) onCancel();
              // else onSave();
            }}
            // onKeyDown={(event) => {
            //   // if (event.key == "Enter") onSave();
            //   if (event.key == "Escape") {
            //     setValue(beforEditingValue);
            //     table.options.meta?.cancelEditing();
            //   }
            // }}
            onEscape={onCancel}
            onEmptyEnter={() => {
              onSave(value);
            }}
          />
          <Group gap={"3px"} justify="space-between" p="2px">
            <ActionIcon c="red" variant="light" onClick={onCancel}>
              <IconX stroke={1.5} size="1.2rem" />
            </ActionIcon>
            <ActionIcon
              variant="filled"
              onClick={() => {
                onSave(value);
              }}
            >
              <IconCheck stroke={1.5} size="1.2rem" />
            </ActionIcon>
          </Group>
        </Group>
      )}
    </>
  );
};
export const ActionMenuCell = ({
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
            {t("delete_or_terminate", "Delete / Terminate Deal")}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Center>
  );
};
export const ReadOnlyCell = ({
  getValue,
  row: { index },
  column: { id },
  table,
}) => {
  const { t } = useTranslation("common", { keyPrefix: "table" });
  const [show, setShow] = useState(false);
  const editingCell = table.options.meta?.editingCell;
  const onEdit =
    editingCell && editingCell[0] === index && editingCell[2] === id;
  const initialValue = getValue();
  useEffect(() => {
    if (!onEdit) {
      setShow(false);
      return;
    }
    let tmr = setTimeout(() => {
      setShow(true);
    }, 750);
    return () => clearTimeout(tmr);
  }, [onEdit]);
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
            overflow: "hidden",
            maxHeight: "20px",
          }}
        >
          <AppDiv contRef={null} html={initialValue} />
        </Box>
      )}
      {onEdit && show && (
        <Group gap={1} justify="center">
          <ActionIcon
            variant="transparent"
            c="red"
            onClick={() => {
              table.options.meta?.cancelEditing();
            }}
          >
            <IconX />
          </ActionIcon>
        </Group>
      )}
    </>
  );
};
export const IamageCell = ({
  getValue,
  row: { index },
  column: { id },
  table,
}) => {
  const { t } = useTranslation("common", { keyPrefix: "table" });
  const [show, setShow] = useState(false);
  const editingCell = table.options.meta?.editingCell;
  const onEdit =
    editingCell && editingCell[0] === index && editingCell[2] === id;
  const initialValue = getValue();
  useEffect(() => {
    if (!onEdit) {
      setShow(false);
      return;
    }
    let tmr = setTimeout(() => {
      setShow(true);
    }, 750);
    return () => clearTimeout(tmr);
  }, [onEdit]);
  return (
    <>
      {!onEdit && (
        <Group gap={1} justify="center">
          <Image
            maw={"20px"}
            src={`${CLOUDFARE_IMAGE_URL1}${initialValue}/public`}
          />
        </Group>
      )}
      {onEdit && show && (
        <Group gap={1} justify="center">
          <ActionIcon
            variant="transparent"
            c="red"
            onClick={() => {
              table.options.meta?.cancelEditing();
            }}
          >
            <IconX />
          </ActionIcon>
        </Group>
      )}
    </>
  );
};
export const IamgeCellEdit = ({
  data,
  row,
  rowIndex,
  table,
  // images,
  // setImages,
  // pictures,
  // main_pic,
  // setMain_pic,
}) => {
  const { t } = useTranslation("common", { keyPrefix: "table" });
  const [changed, setChanged] = useState(false);
  const bodyRef = useRef<any>(null);
  const [pictures, setPictures] = useState([]);
  const [main_pic, setMain_pic] = useState("");
  const [images, setImages] = useState<any>(() => {
    let imgs: any = [];
    for (let i = 0; i < MAX_NB_IMAGES; i++) imgs.push({});
    return imgs;
  });
  const updatePicturesFromImages = () => {
    let pics: any = [];
    for (let i = 0; i < images.length; i++) {
      let img = images[i];
      if (
        img.uploaded &&
        img.image_upload_data &&
        img.image_upload_data.id &&
        img.image_upload_data.id != ""
      )
        pics.push(img.image_upload_data.id);
    }
    return pics;
  };
  const HandleOnEdit = (val) => {
    table.options.meta?.onEdit(val);
  };
  useEffect(() => {
    if (data) {
      console.log(data[rowIndex]["pictures"], "pictures");
      setMain_pic(data[rowIndex]["main_pic"]);
      if (data[rowIndex]["pictures"] && data[rowIndex]["pictures"] != "")
        setPictures(data[rowIndex]["pictures"].split(" "));
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const onSave = () => {
    HandleOnEdit(false);
    // let picts = pictures.;
    table.options.meta?.updateValues(rowIndex, "main_pic", [
      { columnId: "main_pic", value: main_pic },
      { columnId: "pictures", value: updatePicturesFromImages().join(" ") },
    ]);
  };
  const onCancel = () => {
    table.options.meta?.cancelEditing();
  };
  return (
    <Box>
      <Group gap={"2px"} justify="flex-start" m="md">
        <Button
          size="compact-sm"
          variant="filled"
          onClick={onSave}
          leftSection={<IconCheck stroke={1.5} size="1.2rem" />}
        >
          {t("confirm", "Confirm")}
        </Button>
        <Button
          size="compact-sm"
          c="red"
          variant="light"
          onClick={onCancel}
          leftSection={<IconX stroke={1.5} size="1.2rem" />}
        >
          {t("cancel", "Cancel")}
        </Button>
      </Group>

      <ImagesZoneDeals
        images={images}
        setImages={setImages}
        pictures={pictures}
        main_pic={main_pic}
        setMain_pic={setMain_pic}
        onChange={() => {
          setChanged(true);
        }}
      />
    </Box>
  );
};
export const QuantityCell = ({
  getValue,
  row: { index },
  column: { id },
  table,
}) => {
  const inputRef = useRef<any>(null);
  const contnrRef = useRef<any>(null);
  const uomRef = useRef<any>(null);
  const { classes: classesG } = useGlobalStyl();
  const editingCell = table.options.meta?.editingCell;
  const onEdit =
    editingCell && editingCell[0] === index && editingCell[2] === id;
  const initialValue = getValue();
  const [beforEditingValue, setBeforEditingValue] = useState(initialValue);

  const [value, setValue] = useState(() => G.parseNumberAndString(initialValue).number);
  const [uom, setUom] = useState(G.parseNumberAndString(initialValue).text);

  const HandleOnEdit = (val) => {
    table.options.meta?.onEdit(val);
  };
  useEffect(() => {
    if (onEdit && inputRef.current && inputRef.current.focus) {
      inputRef.current.focus();
      resizeInput();
      setBeforEditingValue(value + uom);
      if (
        onEdit &&
        editingCell &&
        editingCell[3] != "" &&
        editingCell[3].length == 1 &&
        editingCell[3] != "Enter"
      ) {
        if (G.isNumber(editingCell[3])) {
          setValue(editingCell[3]);
        } else {
          setValue("");
        }
      }
      if (editingCell[3] == "Backspace") {
        // setValue("");
      }
    }
  }, [onEdit]);
  const onSave = (quom) => {
    HandleOnEdit(false);
    let val = value.replace(thousandSep(), "").replace(decimalSep(), ".");
    table.options.meta?.updateData(index, id, val + quom, beforEditingValue);
  };
  const onCancel = () => {
    updateMixedValues(beforEditingValue);
    table.options.meta?.cancelEditing();
  };
  useEffect(() => {
    updateMixedValues(initialValue);
  }, [initialValue]);
  const updateMixedValues = (iput) => {
    let vl = G.parseNumberAndString(iput);
    setValue(vl.number);
    setUom(vl.text);
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
          <NumericFormat
            decimalScale={0}
            readOnly={true}
            displayType="text"
            value={value}
            thousandSeparator={thousandSep()}
            decimalSeparator={decimalSep()}
          />
          {uom}
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
          pl="2px"
          pr="2px"
        >
          <NumericFormatRef
            ref={inputRef}
            customInput={TextInput}
            classNames={{
              input: classesG.width75,
            }}
            style={{ width: 75 }}
            variant="unstyled"
            //
            thousandSeparator={thousandSep()}
            decimalSeparator={decimalSep()}
            onKeyDown={(event) => {
              if (event.key == "Enter") {
                if (uomRef.current) uomRef.current.focus();
                //onSave();
              }
              if (event.key == "Escape") {
                onCancel();
              }
            }}
            value={value as string}
            onChange={(e) => setValue(e.target.value)}
          />
          <Group justify="flex-end" w={135}>
            <Group gap={"2px"} w={"100%"} justify="flex-end">
              <UomsDropped
                defaultValue={uom}
                ref={uomRef}
                onSubmit={(val) => {
                  setUom(val);
                  onSave(val);
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
              <ActionIcon
                variant="filled"
                onClick={() => {
                  onSave(uom);
                }}
              >
                <IconCheck stroke={1.5} size="1.2rem" />
              </ActionIcon>
            </Group>
          </Group>
        </Group>
      )}
    </>
  );
};
export const PriceCell = ({
  getValue,
  row: { index },
  column: { id },
  table,
}) => {
  const inputRef = useRef<any>(null);
  const contnrRef = useRef<any>(null);
  const currRef = useRef<any>(null);
  const { classes: classesG } = useGlobalStyl();
  const editingCell = table.options.meta?.editingCell;
  const onEdit =
    editingCell && editingCell[0] === index && editingCell[2] === id;
  const initialValue = getValue();
  const [beforEditingValue, setBeforEditingValue] = useState(initialValue);
  const [value, setValue] = useState(
    G.parseNumberAndString(initialValue).number
  );
  const [curr, setCurr] = useState(G.parseNumberAndString(initialValue).text);

  const HandleOnEdit = (val) => {
    table.options.meta?.onEdit(val);
  };
  useEffect(() => {
    if (onEdit && inputRef.current && inputRef.current.focus) {
      inputRef.current.focus();
      resizeInput();
      setBeforEditingValue(value + curr);
      if (
        onEdit &&
        editingCell &&
        editingCell[3] != "" &&
        editingCell[3].length == 1 &&
        editingCell[3] != "Enter"
      ) {
        if (G.isNumber(editingCell[3])) {
          setValue(editingCell[3]);
        } else {
          setValue("");
        }
      }
      if (editingCell[3] == "Backspace") {
        // setValue("");
      }
    }
  }, [onEdit]);
  const onSave = (pcurr) => {
    HandleOnEdit(false);
    let val = value?.replace(thousandSep(), "").replace(decimalSep(), ".");
    table.options.meta?.updateData(index, id, val + pcurr, beforEditingValue);
  };
  const onCancel = () => {
    updateMixedValues(beforEditingValue);
    table.options.meta?.cancelEditing();
  };
  useEffect(() => {
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
          <NumericFormatRef
            ref={inputRef}
            customInput={TextInput}
            classNames={{
              input: classesG.width75,
            }}
            style={{ width: 75 }}
            variant="unstyled"
            thousandSeparator={thousandSep()}
            decimalSeparator={decimalSep()}
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
                  onSave(val);
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
              <ActionIcon
                variant="filled"
                onClick={() => {
                  onSave(curr);
                }}
              >
                <IconCheck stroke={1.5} size="1.2rem" />
              </ActionIcon>
            </Group>
          </Group>
        </Group>
      )}
    </>
  );
};
export const EditDescription = ({ row, rowIndex, table }) => {
  const { t } = useTranslation("common", { keyPrefix: "table" });
  const initialValue = row.original.body;
  // const [value, setValue] = useState(initialValue);
  const HandleOnEdit = (val) => {
    table.options.meta?.onEdit(val);
  };
  const bodyRef = useRef<any>(null);
  const onSave = () => {
    HandleOnEdit(false);
    let body = bodyRef?.current?.editorObject?.currentContent;
    table.options.meta?.updateData(
      rowIndex,
      "body",
      body,
      row.original.description
    );
  };
  const onCancel = () => {
    table.options.meta?.cancelEditing();
  };
  return (
    <Box>
      <Group gap={"2px"} justify="flex-start" m="md">
        <Button
          size="compact-sm"
          variant="filled"
          onClick={onSave}
          leftSection={<IconCheck stroke={1.5} size="1.2rem" />}
        >
          {t("confirm", "Confirm")}
        </Button>
        <Button
          size="compact-sm"
          c="red"
          variant="light"
          onClick={onCancel}
          leftSection={<IconX stroke={1.5} size="1.2rem" />}
        >
          {t("cancel", "Cancel")}
        </Button>
      </Group>
      <MemoEditorApp
        ref={bodyRef}
        content={initialValue}
        edit={true}
        onEscape={onCancel}
      />
    </Box>
  );
};
export const ChangeFlagCell = ({
  getValue,
  row: { index },
  column: { id },
  table,
}) => {
  const rowData = table.options.meta?.rowData(index);
  const rowEdited = rowData && !!rowData["changed"];
  const is_draft = rowData && rowData["is_draft"] == "X";
  return (
    <>
      <Center c={rowEdited ? "red" : "blue"}>
        {is_draft && <IconCircleDashedLetterD stroke={1.5} size="1rem" />}
        {!is_draft && <IconCircleLetterFFilled size={"1rem"} />}
      </Center>
    </>
  );
};
export const DefaultCell = ({
  getValue,
  row: { index },
  column: { id },
  table,
}) => {
  const inputRef = useRef<any>(null);
  const { classes: classesG } = useGlobalStyl();
  const editingCell = table.options.meta?.editingCell;
  const onEdit =
    editingCell && editingCell[0] === index && editingCell[2] === id;
  const initialValue = getValue();
  const [beforEditingValue, setBeforEditingValue] = useState(initialValue);
  const [value, setValue] = useState(initialValue);
  const HandleOnEdit = (val) => {
    table.options.meta?.onEdit(val);
  };
  useEffect(() => {
    if (onEdit && inputRef.current && inputRef.current.focus) {
      inputRef.current.focus();
      resizeInput();
      setBeforEditingValue(value);
      if (
        onEdit &&
        editingCell &&
        editingCell[3] != "" &&
        editingCell[3].length == 1 &&
        editingCell[3] != "Enter"
      ) {
        setValue(editingCell[3]);
      }
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
  useEffect(() => {
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
};
