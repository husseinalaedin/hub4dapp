import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../providers/AuthProvider";
import { BUILD_API, useMessage } from "./G";
import { selectLanguage } from "../store/features/CurrentSettings";
import { useEffect, useState } from "react";
import {
  change_curr,
  change_privacy,
  change_uom,
  change_wtsb,
  selectCurr,
  selectPrivacy,
  selectUom,
  selectWtsb,
} from "../store/features/DbData";
import { useAxiosGet } from "../hooks/Https";

export const useDbData = () => {
  const { islogged } = useAuth();
  const { error } = useMessage();
  const dispatch = useDispatch();
  const language = useSelector(selectLanguage);

  const curr_db = useSelector(selectCurr);
  const [curr, setCurr] = useState<any>([]);

  const wtsb_db = useSelector(selectWtsb);
  const [wtsb, setWtsb] = useState<any>([]);

  const privacy_db = useSelector(selectPrivacy);
  const [privacy, setPrivacy] = useState<any>([]);

  const uom_db = useSelector(selectUom);
  const [uom, setUom] = useState<any>([]);

  const {
    data: dataWTSB,
    errorMessage: errorMessageWTSB,
    succeeded: succeededWTSB,
    isLoading: isLoadingWTSB,
    executeGet: executeGetWTSB,
  } = useAxiosGet(BUILD_API("util/wtsb"), null);
  const {
    data: dataCURR,
    errorMessage: errorMessageCURR,
    succeeded: succeededCURR,
    isLoading: isLoadingCURR,
    executeGet: executeGetCURR,
  } = useAxiosGet(BUILD_API("util/currencies"), null);
  const {
    data: dataPrivacies,
    errorMessage: errorMessagePrivacies,
    succeeded: succeededPrivacies,
    isLoading: isLoadingPrivacies,
    executeGet: executeGetPrivacies,
  } = useAxiosGet(BUILD_API("util/privacies"), null);

  const {
    data: dataUoms,
    errorMessage: errorMessageUoms,
    succeeded: succeededUoms,
    isLoading: isLoadingUoms,
    executeGet: executeGetUoms,
  } = useAxiosGet(BUILD_API("util/uoms"), null);

  useEffect(() => {
    if (errorMessageCURR) error("curr:" + errorMessageCURR);
    if (succeededCURR) {
      dispatch(
        change_curr({
          lang: language,
          values: dataCURR,
        })
      );
      fillCurr(dataCURR);
    }
  }, [succeededCURR, errorMessageCURR]);

  useEffect(() => {
    if (errorMessageWTSB) error("wtsb:" + errorMessageWTSB);
    if (succeededWTSB) {
      dispatch(
        change_wtsb({
          lang: language,
          values: dataWTSB,
        })
      );
      fillWtsb(dataWTSB);
    }
  }, [succeededWTSB, errorMessageWTSB]);

  useEffect(() => {
    if (errorMessagePrivacies) error("privacies:" + errorMessagePrivacies);
    if (succeededPrivacies) {
      dispatch(
        change_privacy({
          lang: language,
          values: dataPrivacies,
        })
      );
      fillPrivacy(dataPrivacies);
    }
  }, [succeededPrivacies, errorMessagePrivacies]);
useEffect(() => {
  if (errorMessageUoms) error("Uoms:" + errorMessageUoms);
  if (succeededUoms) {
    dispatch(
      change_uom({
        lang: language,
        values: dataUoms,
      })
    );
    fillUom(dataUoms);
  }
}, [succeededUoms, errorMessageUoms]);
  useEffect(() => {
    checks();
  }, [language]);

  const checkCurr = () => {
    if (!islogged) return;
    if (
      !(curr_db && curr_db.values.length >= 1) ||
      !(curr_db && curr_db.lang == language)
    )
      executeGetCURR();
    else fillCurr(curr_db.values);
  };
  const checkWtsb = () => {
    if (!islogged) return;
    if (
      !(wtsb_db && wtsb_db.values.length >= 1) ||
      !(wtsb_db && wtsb_db.lang == language)
    )
      executeGetWTSB();
    else fillWtsb(wtsb_db.values);
  };
  const checkPrivacy = () => {
    if (!islogged) return;
    if (
      !(privacy_db && privacy_db.values.length >= 1) ||
      !(privacy_db && privacy_db.lang == language)
    )
      executeGetPrivacies();
    else fillPrivacy(privacy_db.values);
  };
  const checkUom = () => { 
    if (!islogged) return;
    if (
      !(uom_db && uom_db.values.length >= 1) ||
      !(uom_db && uom_db.lang == language)
    )
      executeGetUoms();
    else fillUom(uom_db.values);
  };
  useEffect(() => {
    checks();
  }, []);

  const fillCurr = (data) => {
    setCurr(data);
  };
  const fillWtsb = (data) => {
    setWtsb(data);
  };
  const fillPrivacy = (data) => {
    setPrivacy(data);
  };
  const fillUom = (data) => {
    setUom(data);
  };
  const checks = () => {
    checkCurr();
    checkWtsb();
    checkPrivacy();
    checkUom()
  };
  const getCurrFromSymbol = (curr_symbol) => {
    if (!dataCURR || !dataCURR.length) return "USD";
    for (let i = 0; i < dataCURR.length; i++) {
      if (dataCURR[i]["curr_symbol"] == curr_symbol) return dataCURR[i]["curr"];
    }
    return "USD";
  };
  return { checks, curr, wtsb, privacy, uom, getCurrFromSymbol };
};
