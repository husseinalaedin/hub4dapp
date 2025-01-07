import {
  Modal,
  ScrollArea,
  Table,
  TextInput,
  Box,
  Paper,
  LoadingOverlay,
} from "@mantine/core";
import { Children, useEffect, useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { useTranslation } from "react-i18next";
import {
  IconArrowBigUpLine,
  IconArrowNarrowUp,
  IconCircleCaretDown,
  IconCircleCaretUp,
  IconSearch,
} from "@tabler/icons-react";

export const InputPopUpListSelect = (props) => {
  const { t } = useTranslation("common", { keyPrefix: "tool" });
  const isMobile = useMediaQuery("(max-width: 600px)");
  // let { onSelected } = props
  // let { onPopUp } = props

  let {
    dataList,
    keySearch,
    isLoading,
    labelSearch,
    form,
    formKey,
    canedit,
    textBeforeEdit,
    onSelected,
    onPopUp,
    withAsterisk,
    label,
    placeholder,
  } = props;
  const [opened, setOpened] = useState(false);
  const [dataListLcl, setDataListLclc] = useState(dataList);
  const [value, setValue] = useState("");
  const [rows, setRows] = useState<any>([]);
  // console.log(data, " data")
  const openPopUp = () => {
    if (!canedit) {
      return;
    }

    let isToOpen = !opened;
    setOpened((o) => !o);
    if (isToOpen && onPopUp) {
      setDataListLclc(dataList);
      onPopUp();
    }
  };
  useEffect(() => {
    setDataListLclc(dataList);
  }, [dataList]);
  useEffect(() => {
    if (!dataListLcl || !dataListLcl.map) return;
    const rows2 = dataListLcl.map((element) => (
      <Table.Tr
        key={element.label}
        style={{ cursor: "pointer" }}
        onClick={() => {
          let val: any = {};
          val[formKey] = element[keySearch];
          form.setValues(val);
          form.setTouched(form.getInputProps(formKey));
          form.setDirty(form.getInputProps(formKey));
          setOpened(false);
          if (onSelected) {
            onSelected(element);
          }
        }}
      >
        <Table.Td>{element[labelSearch]}</Table.Td>
      </Table.Tr>
    ));
    setRows(rows2);
  }, [dataListLcl]);

  useEffect(() => {
    let list = dataListLcl.filter((lst) => {
      let valF =
        form && form.values && form.values[formKey]
          ? form?.values[formKey].toLowerCase()
          : "";
      return lst[keySearch].toLowerCase() == valF;
    });
    if (list && list.length > 0) setValue(list[0][labelSearch]);
    else setValue(textBeforeEdit);
  }, [form?.values[formKey], textBeforeEdit]);

  const ths = (
    <Table.Tr>
      <Table.Th></Table.Th>
    </Table.Tr>
  );

  return (
    <>
      <div style={{ position: "relative" }}>
        <div className={`${canedit ? "text-as-div" : ""}`}>
          <TextInput
            rightSection={
              canedit && (
                <>
                  {!opened && (
                    <IconCircleCaretDown
                      size={24}
                      onClick={openPopUp}
                      style={{ opacity: 0.7 }}
                    />
                  )}
                  {opened && (
                    <IconCircleCaretUp
                      size={24}
                      onClick={openPopUp}
                      style={{ opacity: 0.7 }}
                    />
                  )}
                </>
              )
            }
            rightSectionWidth={50}
            withAsterisk={withAsterisk}
            label={label}
            placeholder={placeholder}
            autoComplete="off"
            value={value || ""}
            readOnly={true}
            onClick={openPopUp}
          ></TextInput>
        </div>

        <Modal
          fullScreen={isMobile}
          closeButtonProps={{
            "aria-label": t("close_auth_modal", "Close authentication modal"),
          }}
          // overflow="inside"
          opened={opened}
          withCloseButton
          onClose={() => {
            setOpened(false);
            setDataListLclc(dataList);
          }}
        >
          <Paper mr="md" style={{ position: "sticky", top: 0, zIndex: 10000 }}>
            <LoadingOverlay
              visible={isLoading}
              overlayProps={{ radius: "sm", blur: 2 }}
            />
            <TextInput
              icon={<IconSearch size={24} />}
              placeholder={t("search", "Search")}
              label={t("search", "Search")}
              autoComplete="off"
              style={{ marginTop: 0 }}
              onChange={(e) => {
                let list = dataList.filter((lst) =>
                  lst[labelSearch]
                    ? lst[labelSearch]
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase())
                    : ""
                );
                setDataListLclc(list);
              }}
            ></TextInput>
          </Paper>
          <Box mr="md">
            <Table highlightOnHover> 
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
            {/* {dataList.map((item, index) => {
                        return <div key={index} style={{cursor:"pointer"}}>{item[label]}</div>
                    })} */}
          </Box>
        </Modal>
      </div>
    </>
  );
};
