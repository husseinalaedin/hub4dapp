import { useEffect, useState } from "react";
import { DateInput, DatePickerInput, DatesProvider } from "@mantine/dates";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { selectMedium, selectSmall } from "../store/features/ScreenStatus";
import { IconCalendar } from "@tabler/icons-react";
import { useSearchParams } from "react-router";
import { D } from "../global/Date";
import dayjs from "dayjs";
import { selectLanguage } from "../store/features/CurrentSettings";
// import en from 'react-phone-number-input/locale/en.json'
// import es from 'react-phone-number-input/locale/es.json'
// import pt from 'react-phone-number-input/locale/pt.json'
// import fr from 'react-phone-number-input/locale/fr.json'

// import de from 'react-phone-number-input/locale/de.json'

import "dayjs/locale/en";
import "dayjs/locale/es";
import "dayjs/locale/pt";
import "dayjs/locale/fr";
import "dayjs/locale/de";
import { Select } from "@mantine/core";
import { useAuth } from "../providers/AuthProvider";
import { BUILD_API, useMessage } from "../global/G";
import {
  change_last_x_datetime,
  selectDateLastXDateTime,
} from "../store/features/DateValues";
import { useAxiosGet } from "./Https";
import { AppSelect } from "../global/global-comp/AppSelect";

const useDateRange = () => {};

export const DateRange = ({ form, fromD, toD, ...others }) => {
  const lang = useSelector(selectLanguage);

  const [searchParams, setSearchParams] = useSearchParams();
  const small = useSelector(selectSmall);
  const { t } = useTranslation("public");
  const [value, setValue] = useState<[Date | null, Date | null]>([null, null]);
  // useEffect(() => {
  //     dayjs.locale(lang)
  // }, [lang])
  useEffect(() => {
    let valFrom: any = searchParams.get(fromD);
    let valTo: any = searchParams.get(toD);
    let valFromD: Date | null;
    let valToD: Date | null;
    try {
      valFromD = D.local_to_utc_d(valFrom);
      valToD = D.local_to_utc_d(valTo);
      if (!valFrom || valFrom === "") valFromD = null;
      if (!valTo || valTo === "") valToD = null;
      setValue([valFromD, valToD]);
    } catch (error) {}
  }, [searchParams]);
  return (
    <DatesProvider settings={{ locale: lang }}>
      <DatePickerInput
        popoverProps={{ withinPortal: false }}
        leftSection={<IconCalendar size="1.1rem" stroke={1.5} />}
        // size={small ? "sm" : "md"}

        type="range"
        // valueFormat="YYYY-MM-DD"
        value={value}
        onChange={(val: any) => {
          setValue(val);
          form.setFieldValue(fromD, D.local_to_utc(val[0], "yyyy-MM-dd"));
          form.setFieldValue(toD, D.local_to_utc(val[1], "yyyy-MM-dd"));
        }}
        mx="auto"
        maw={400}
        {...others}
      />
    </DatesProvider>
  );
};

export const HoursRangeSelect = ({ data, ...others }) => {
  return (
    <AppSelect
     {...others}
      
      searchable
      clearable
      maxDropdownHeight={300}
      data={data}
     
    />
  );
};
export const DaysRangeSelect = ({ data, ...others }) => {
  return (
    <Select
      // zIndex={501}
      // withinPortal={true}

      {...others}
      comboboxProps={{ withinPortal: false }}
      searchable
      clearable
      maxDropdownHeight={300}
      data={data}
    />
  );
};
export const DATETIMEVALUES_FILL = {
  ALL: "ALL",
  DAY: "DAY",
  HOUR: "HOUR",
};
export const useDateValues = ({ fill }) => {
  const { islogged } = useAuth();
  const { error } = useMessage();
  const dispatch = useDispatch();
  const language = useSelector(selectLanguage);
  const lastXDatetimeDb = useSelector(selectDateLastXDateTime);
  // const [lastXDateTime, setLastXDateTime] = useState<any>(selectDateLastXDateTime)
  const [lastXDays, setLastXDays] = useState<any>([]);
  const [lastXHours, setLastXHours] = useState<any>([]);
  const {
    data: data,
    errorMessage: errorMessage,
    succeeded: succeeded,
    isLoading: isLoading,
    executeGet: executeGet,
  } = useAxiosGet(BUILD_API("util/last-datetime-list"), null);

  useEffect(() => {
    if (errorMessage) error("ai-last-x-datetime:" + errorMessage);
    if (succeeded) {
      dispatch(
        change_last_x_datetime({
          lang: language,
          last_x_datetime: data,
        })
      );
      fillDateTimeValues(data);
    }
  }, [succeeded, errorMessage]);
  useEffect(() => {
    checkDateTimeValues();
  }, [language]);
  const checkDateTimeValues = () => {
    if (!islogged) return;
    if (
      !(lastXDatetimeDb && lastXDatetimeDb.last_x_datetime.length >= 1) ||
      !(lastXDatetimeDb && lastXDatetimeDb.lang == language)
    )
      executeGet();
    else fillDateTimeValues(lastXDatetimeDb.last_x_datetime);
  };
  useEffect(() => {
    checkDateTimeValues();
  }, []);
  const fillDateTimeValues = (data) => {
    let last_xdays: any = [];
    let last_xhours: any = [];

    data?.map((datum) => {
      if (
        datum["type"] == DATETIMEVALUES_FILL.DAY &&
        (fill == DATETIMEVALUES_FILL.ALL || fill == DATETIMEVALUES_FILL.DAY)
      )
        last_xdays.push({
          id: datum.id,
          value: datum.id,
          label: datum.last_desc,
        });
      if (
        datum["type"] == DATETIMEVALUES_FILL.HOUR &&
        (fill == DATETIMEVALUES_FILL.ALL || fill == DATETIMEVALUES_FILL.HOUR)
      )
        last_xhours.push({
          id: datum.id,
          value: datum.id,
          label: datum.last_desc,
        });
    });
    setLastXDays(last_xdays);
    setLastXHours(last_xhours);
  };
  return { lastXDays, lastXHours };
};
