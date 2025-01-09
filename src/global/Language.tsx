import { Box, LoadingOverlay, Select } from "@mantine/core";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useAxiosPost } from "../hooks/Https";
import { useChangeLanguage } from "../hooks/useChangeLanLocal";
import { useAuth } from "../providers/AuthProvider";
import { change_language } from "../store/features/CurrentSettings";

import { BUILD_API, useMessage } from "./G";
import { initLang, setSettingLocal } from "./Misc";
import { AppSelect } from "./global-comp/AppSelect";
// import i18next from "i18next";
const languageMap = {
  en: { label: "English", active: true },
  es: { label: "Española", active: false },
};

export const LanguageSelect = () => {
  let [selected, setSelected] = useState(() => {
    return initLang(); //localStorage.getItem("i18nextLng") || "en";
  });
  const { islogged } = useAuth();
  const { error, succeed, warning } = useMessage();
  let { changeLang } = useChangeLanguage();
  let {
    data: post_data,
    isLoading,
    succeeded: post_succeeded,
    errorMessage,
    executePost,
  } = useAxiosPost(BUILD_API("settings"), { key: "LANG", value: selected });

  const [data, setData] = useState<any>([]);

  const { t, i18n } = useTranslation("public");

  useEffect(() => {
    let selected_found = false;

    let dt: any = [];
    Object.keys(languageMap).map((key, index) => {
      if (selected == key) {
        selected_found = true;
      }
      dt.push({
        value: key,
        label: languageMap[key].label,
      });
    });
    if (!selected_found) {
      setSelected("en");
      changeLang("en");

      // localStorage.setItem("i18nextLng", "en");
      // dispatch(change_language('en'))
    }

    setData(dt);
  }, []);

  const lang_changed = (value) => {
    _lang_changed(value);
    if (islogged) executePost();
  };
  const _lang_changed = (value) => {
    setSelected(value);
    changeLang(value);
    // i18n.changeLanguage(value);
    // localStorage.setItem("i18nextLng", value);
    // window['__localeId__'] = value
    // dispatch(change_language(value))
  };
  useEffect(() => {
    if (post_succeeded) {
      succeed(post_data["message"]);
    }

    if (errorMessage) error(errorMessage);
  }, [post_succeeded, errorMessage]);
  return (
    <Box pos="relative">
      <LoadingOverlay
        visible={isLoading}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <AppSelect
        value={selected}
        // defaultValue={selected}
        label={t("select_language", "Select Language")}
        placeholder={t("select_language", "Select Language")}
        data={data}
        onChange={lang_changed}
      />
    </Box>
  );
};
