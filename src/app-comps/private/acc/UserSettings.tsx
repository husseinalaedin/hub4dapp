import {
  Box,
  Card,
  Flex,
  Group,
  LoadingOverlay,
  NumberInput,
  Paper,
  Select,
  Switch,
  Text,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { BUILD_API, useMessage } from "../../../global/G";
import { LanguageSelect } from "../../../global/Language";
import {
  NumbSep2,
  setSettingLocal,
  shareExpirationPeriodList,
} from "../../../global/Misc";
import { ActiveTheme, Themes, useGlobalStyl } from "../../../hooks/useTheme";
import { useAxiosPost } from "../../../hooks/Https";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { useAuth } from "../../../providers/AuthProvider";
import { changeActive } from "../../../store/features/ActiveNav";
import { AppHeader } from "../app-admin/AppHeader";
import { LocalsAvail } from "../../../global/Locals";
import { useChangeLocal } from "../../../hooks/useChangeLanLocal";

export const UserSetings = () => {
  const { t } = useTranslation("common", { keyPrefix: "tool" });
  const { classes: classesG } = useGlobalStyl();
  let { theme } = useAppTheme();
  const dispatch = useDispatch();
  const [icon, setIcon] = useState(() => {
    return React.createElement(ActiveTheme(), {
      key: "ThemeId",
    });
  });
  useEffect(() => {
    let v = NumbSep2();
    dispatch(changeActive("NONE"));
  }, []);
  useEffect(() => {
    setIcon(() => {
      return React.createElement(ActiveTheme(), {
        key: "ThemeId",
      });
    });
  }, [theme]);
  return (
    <>
      <AppHeader title={t("settings", "Settings")}></AppHeader>
      <Flex
        className={classesG.paper}
        p="lg"
        gap="md"
        justify="flex-start"
        align="flex-start"
        direction="column"
        wrap="nowrap"
      >
        <Text className={`${classesG.textAsLabel}`}>{t("theme", "Theme")}</Text>

        <Group className={classesG.paper} mt={-10}>
          <Box pl="md" pr="md">
            {icon}
          </Box>

          <Themes />
        </Group>
        <LanguageSelect />
        <Local />
        <DefaultShareExpire />
        {/* <NumberSeperator /> */}
        <WhatsappAsWeb />
      </Flex>
    </>
  );
};
const NumberSeperator = () => {
  const { t } = useTranslation("common", { keyPrefix: "tool" });
  const { setUserData, userData } = useAuth();
  const { error, succeed, warning } = useMessage();
  let [numberSep, setNumbSep] = useState(() => {
    return userData["numb_sep"];
  });
  let {
    data: post_data,
    isLoading,
    succeeded: post_succeeded,
    errorMessage,
    executePost,
  } = useAxiosPost(BUILD_API("settings"), { key: "NUMBER", value: numberSep });
  useEffect(() => {
    setNumbSep(userData["numb_sep"]);
  }, [userData.numb_sep]);
  useEffect(() => {
    console.log("too many ++", post_succeeded, errorMessage);
    if (post_succeeded) {
      setUserData(setSettingLocal("numb_sep", numberSep));
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
      <Select
        value={numberSep}
        onChange={(e) => {
          setNumbSep(e);
          executePost();
        }}
        label={t("number_separator", "Number Seperator")}
        placeholder={t("number_separator", "Number Seperator")}
        limit={8}
        maxDropdownHeight={500}
        data={[
          {
            value: ",.",
            label: ", . e.g 12,234.56",
          },
          {
            value: ".,",
            label: ". , e.g 12.234,56",
          },
        ]}
      />
    </Box>
  );
};
const WhatsappAsWeb = () => {
  const { classes: classesG } = useGlobalStyl();
  const { t } = useTranslation("common", { keyPrefix: "tool" });
  const { setUserData, userData } = useAuth();
  const openwhatsapp_as_web = userData["openwhatsapp_as_web"];
  const { error, succeed, warning } = useMessage();
  let [openWhatsAsWeb, setOpenWhatsAsWeb] = useState(() => {
    return openwhatsapp_as_web == "X";
  });
  let {
    data: post_data,
    isLoading,
    succeeded: post_succeeded,
    errorMessage,
    executePost,
  } = useAxiosPost(BUILD_API("settings"), {
    key: "WHATSAPP",
    value: openWhatsAsWeb ? "X" : "",
  });
  // useEffect(() => {
  //     setOpenWhatsAsWeb(userData['openwhatsapp_as_web']=='X')
  // }, userData.openwhatsapp_as_web)
  useEffect(() => {
    console.log("too many ++", post_succeeded, errorMessage);
    if (post_succeeded) {
      setUserData(
        setSettingLocal("openwhatsapp_as_web", openWhatsAsWeb ? "X" : "")
      );
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
      <Card className={classesG.border}>
        <Switch
          readOnly={false}
          description={t(
            "recomanded_wats",
            "It is recomanded to use the Whatsapp application and not the web if you are not on the phone!"
          )}
          onChange={(event) => {
            setOpenWhatsAsWeb(event.currentTarget.checked);
            executePost();
          }}
          label={t(
            "openwhatsapp_as_web_if_not_phone",
            "Open Whatsapp from Web if your are not on the phone.!"
          )}
          checked={openWhatsAsWeb}
        />
      </Card>
    </Box>
  );
};

const Local = () => {
  const { t } = useTranslation("common", { keyPrefix: "tool" });
  const { setUserData, userData } = useAuth();
  const { error, succeed, warning } = useMessage();
  const { changeLocal } = useChangeLocal();
  let [local, setLocal] = useState(() => {
    return userData["local"];
  });
  let {
    data: post_data,
    isLoading,
    succeeded: post_succeeded,
    errorMessage,
    executePost,
  } = useAxiosPost(BUILD_API("settings"), { key: "LOCAL", value: local });
  // useEffect(() => {
  //     setLocal(userData['local'])
  // }, [userData.numb_sep])
  useEffect(() => {
    console.log("too many ++", post_succeeded, errorMessage);
    if (post_succeeded) {
      setUserData(changeLocal(local));
      succeed(post_data["message"]);
    }

    if (errorMessage) error(errorMessage);
  }, [post_succeeded, errorMessage]);
  let lang: any = LocalsAvail();
  return (
    <Box pos="relative">
      <LoadingOverlay
        visible={isLoading}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <Select
        w={"100%"}
        maw={400}
        value={local}
        onChange={(e) => {
          setLocal(e);
          executePost();
        }}
        label={t("local", "Local")}
        placeholder={t("local", "Local")}
        limit={8}
        maxDropdownHeight={500}
        data={lang}
      />
      <Text mt={-4} fz={25}>
        {new Intl.NumberFormat(local).format(123456789.45)}
      </Text>
    </Box>
  );
};

const DefaultShareExpire = () => {
  const { t } = useTranslation("common", { keyPrefix: "tool" });
  const { error, succeed, warning } = useMessage();
  const { setUserData, userData } = useAuth();
  let [defaultExpireShare, setDefaultExpireShare] = useState(() => {
    let val = userData["default_expire_share_in_days"];
    if (!val) val = 2;
    return userData["default_expire_share_in_days"];
  });
  let {
    data: post_data,
    isLoading,
    succeeded: post_succeeded,
    errorMessage,
    executePost,
  } = useAxiosPost(BUILD_API("settings"), {
    key: "DEFAULT_EXPIRE_SHARE",
    value: defaultExpireShare,
  });

  useEffect(() => {
    console.log("too many ++", post_succeeded, errorMessage);
    if (post_succeeded) {
      setUserData(
        setSettingLocal("default_expire_share_in_days", defaultExpireShare)
      );
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
      <Select
        disabled={true}
        maxDropdownHeight={300}
        value={defaultExpireShare}
        onChange={(e) => {
          setDefaultExpireShare(e);
          executePost();
        }}
        label={t(
          "default_link_expiration_perion.",
          "Default link expiration period(in days)."
        )}
        placeholder={t(
          "default_link_expiration_perion.",
          "Default link expiration period(in days)."
        )}
        limit={8}
        data={shareExpirationPeriodList({ t, is_for: "settings", expire: 1 })}
      />
    </Box>
  );
};
