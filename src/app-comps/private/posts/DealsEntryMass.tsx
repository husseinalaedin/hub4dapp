import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useGlobalStyl } from "../../../hooks/useTheme";
import { BUILD_API, G, useMessage } from "../../../global/G";
import { useNavigate, useSearchParams } from "react-router";
import { useDbData } from "../../../global/DbData";
import { useAxiosPut } from "../../../hooks/Https";
import { selectSmall } from "../../../store/features/ScreenStatus";
import { closeModal } from "@mantine/modals";
import {
  Box,
  Button,
  Checkbox,
  Group,
  LoadingOverlay,
  Table,
} from "@mantine/core";

export const MassDealEntry = ({ dataSet, setData,onClose,onSucceed,selectAll0, SetSelectAll0,intermidiate0, setIntermidiate0,selectAll }: any) => {
  const { t } = useTranslation("private", { keyPrefix: "deals" });
  const { classes: classesG } = useGlobalStyl();
  
  const [dataToPut, setDataToPut] = useState([]);
  const { error, succeed, info } = useMessage();
  const navigate = useNavigate();
  let { getCurrFromSymbol } = useDbData();
  useEffect(()=>{

  },[])
  let {
    data: dataPut,
    isLoading: isLoadingPut,
    succeeded: succeededPut,
    errorMessage: errorMessagePut,
    executePut,
  } = useAxiosPut(BUILD_API("deals/company/mass"), {
    changed: dataToPut,
    deleted: [],
  });

  
  const changeSelect = (val, idx) => {
    setData((prevData) =>
      prevData.map((item, index) => ({
        ...item, // Keep other properties unchanged
        selected: index === idx ? val : item.selected, // Update 'selected' only for the matching index
      }))
    );
  };
  const recheckAllCheck = () => {
    let checked = 0;
    let notcheked = 0;

    for (let i = 0; i < dataSet?.length; i++) {
      if (dataSet[i].selected) checked++;
      else notcheked++;
    }
    if (checked > 0 && notcheked > 0) {
      setIntermidiate0(true);
      SetSelectAll0(false);
    } else {
      if (checked > 0 || notcheked == 0) {
        setIntermidiate0(false);
        SetSelectAll0(true);
      } else {
        setIntermidiate0(false);
        SetSelectAll0(false);
      }
    }
  };
  useEffect(() => {
    recheckAllCheck();
  }, [dataSet]);
  const anySelect = () => {
    for (let i = 0; i < dataSet?.length; i++) {
      if (dataSet[i].selected) return true;
    }
    return false;
  };
  const formulate_object = (item, is_draft) => {
    let quantity = G.parseNumberAndString(item.quantity);
    let price = G.parseNumberAndString(item.price);

    return {
      id: "new",
      main_pic: "",
      title: item.title,
      pictures: [],
      wtsb: item.type,
      quantity: quantity.number,
      uom: quantity.text,
      price: price.number,
      curr: getCurrFromSymbol(price.text),
      hashtags: item.hashtags,
      body: item.details,
      ref: "",
      is_draft: is_draft,
    };
  };
  const createDraft = (is_draft) => {
    let dta: any = [];
    for (let i = 0; i < dataSet?.length; i++) {
      if (dataSet[i].selected) dta.push(formulate_object(dataSet[i], is_draft));
    }
    setDataToPut(dta);
    if (dta.length > 0) {
      executePut();
    }
  };
  useEffect(() => {
    let errorMsg = errorMessagePut;
    if (errorMsg) error(errorMsg);
    if (succeededPut) {
        onSucceed(dataPut?.info?.created_on)
    //   let created_on = dataPut?.info?.created_on;
    //   goToSpread(created_on);
    }
  }, [errorMessagePut, succeededPut]);
//   const goToSpread = (dt) => {
//     closeModal("ai_parser_pop_up");
//     navigate("../app/mydeals?src=navigator&created_on=" + dt);
//   };
  const data = dataSet && dataSet.length > 0 ? dataSet : [];
  const rows = data.map((element, idx) => (
    <Table.Tr
      key={idx}
      className={element.selected ? classesG.rowSelected : ""}
    >
      <Table.Td>
        <Checkbox
          checked={element.selected}
          onChange={() => {
            changeSelect(!element.selected, idx);
          }}
        />
      </Table.Td>
      <Table.Td>{element.type}</Table.Td>
      <Table.Td>{element.title}</Table.Td>

      <Table.Td>{element.quantity}</Table.Td>
      <Table.Td>{element.price}</Table.Td>
      <Table.Td>
        {element.hashtags &&
        element.hashtags.length > 0 &&
        element.hashtags.join
          ? element.hashtags.join(",")
          : ""}
      </Table.Td>
      <Table.Td>{element.description}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Box>
      <LoadingOverlay
        visible={isLoadingPut}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <Group justify="right" mb="xs">
        <Button
          variant="light"
          onClick={onClose}
        >
          {t("close", "Close")}
        </Button>
        <Button
          disabled={!(dataSet && dataSet.length > 0) || !anySelect()}
          onClick={() => {
            createDraft("X");
          }}
          variant="gradient"
          gradient={{ from: "teal", to: "blue", deg: 60 }}
        >
          {t("create_draft", "Create Draft")}
        </Button>
        <Button
          disabled={!(dataSet && dataSet.length > 0) || !anySelect()}
          onClick={() => {
            createDraft("");
          }}
          variant="gradient"
          gradient={{ from: "orange", to: "blue", deg: 60 }}
        >
          {t("create_final", "Create Final")}
        </Button>
      </Group>
      <Box style={{ overflow: "auto", maxWidth: "100%" }}>
        <Table className={`${"TableCss"} ${classesG.table}`}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>
                {" "}
                <Checkbox
                  checked={selectAll0}
                  indeterminate={intermidiate0}
                  onChange={(event) => {
                    SetSelectAll0(event.currentTarget.checked);
                    selectAll(event.currentTarget.checked);
                  }}
                />
              </Table.Th>
              <Table.Th>{t("deal_type", "Deal Type")}</Table.Th>
              <Table.Th>{t("deal_title", "Title")}</Table.Th>

              <Table.Th>{t("quantity", "Quantity")}</Table.Th>
              <Table.Th>{t("price", "Price")}</Table.Th>
              <Table.Th>{t("hashtags", "Hashtags")}</Table.Th>
              <Table.Th>{t("description", "Description")}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Box>
    </Box>
  );
};
