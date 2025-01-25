import { useTranslation } from "react-i18next";
import { renderWtsWtbDropVOption } from "../WtsWtbDropV";
import { AppSelect } from "./AppSelect";
import { useAxiosGet } from "../../hooks/Https";
import { BUILD_API } from "../G";
import { useEffect, useState } from "react";
import { useDbData } from "../DbData";
import { AppMultiSelect } from "./AppMultiSelect";

export const Wtsb = ({ ...others }) => {
  //   const {
  //     data: dataWTSB,
  //     errorMessage: errorMessageWTSB,
  //     succeeded: succeededWTSB,
  //     isLoading: isLoadingWTSB,
  //     executeGet: executeGetWTSB,
  //   } = useAxiosGet(BUILD_API("util/wtsb"), null);
  let {
    checks: checkDbData,
    curr: dataCURR,
    wtsb: dataWTSB,
    privacy: dataPrivacies,
  } = useDbData();
  const { t } = useTranslation("common", { keyPrefix: "wtsb" });

  //   useEffect(() => {
  //     executeGetWTSB();
  //   }, []);
  return (
    <AppSelect
      {...others}
      renderOption={renderWtsWtbDropVOption}
      searchable
      withAsterisk
      placeholder={t("deal_type", "Deal Type")}
      limit={8}
      maxDropdownHeight={500}
      //   defaultValue={defaultValue}
      data={dataWTSB?.map((itm) => {
        return {
          value: itm.wtsb,
          label: itm.wtsb_desc,
          dir: itm.dir,
        };
      })}
    />
  );
};

export const WtsbMulti = ({ ...others }) => {
  const { t } = useTranslation("common", { keyPrefix: "wtsb" });

  let {
    checks: checkDbData,
    curr: dataCURR,
    wtsb: dataWTSB,
    privacy: dataPrivacies,
  } = useDbData();
  return (
    <AppMultiSelect
      label={t("deal_type", "Deal Type")}
      {...others}
      renderOption={renderWtsWtbDropVOption}
      data={dataWTSB?.map((itm) => {
        return {
          value: itm.wtsb,
          label: itm.wtsb_desc,
          dir: itm.dir,
        };
      })}
      placeholder={t("deal_type", "Deal Type")}
      searchable
      clearable
      maxDropdownHeight={250}
      limit={20}
    />
  );
};
