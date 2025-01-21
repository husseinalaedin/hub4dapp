import { useTranslation } from "react-i18next";
import { renderWtsWtbDropVOption } from "../WtsWtbDropV";
import { AppSelect } from "./AppSelect";
import { useAxiosGet } from "../../hooks/Https";
import { BUILD_API } from "../G";
import { useEffect, useState } from "react";
import { useDbData } from "../DbData";

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
