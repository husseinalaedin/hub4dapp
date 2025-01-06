import { useEffect, useState } from "react";
import { BUILD_API, G, useMessage } from "../../../global/G";
import { useAxiosGet } from "../../../hooks/Https";
import {
  Alert,
  Box,
  Card,
  LoadingOverlay,
  NavLink,
  Overlay,
  Paper,
  SimpleGrid,
  Text,
  rem,
} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { changeActive } from "../../../store/features/ActiveNav";
import {
  IconAlertCircle,
  IconArrowNarrowRight,
  IconChevronRight,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import {
  selectLarge,
  selectMedium,
  selectSmall,
  selectxLarge,
  selectxLarger,
} from "../../../store/features/ScreenStatus";
import { useGlobalStyl } from "../../../hooks/useTheme";
import { useNavigate } from "react-router";

export const CoAdminMenu = () => {
  const { t } = useTranslation("coadmin", { keyPrefix: "menu" });
  const { classes: classesG } = useGlobalStyl();
  const dispatch = useDispatch();
  const [co_admin, setCo_admin] = useState<boolean>(false);
  const { error, succeed, info } = useMessage();

  useEffect(() => {
    dispatch(changeActive("co-admin"));
  }, []);
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const large = useSelector(selectLarge);
  const xlarge = useSelector(selectxLarge);
  const xlarger = useSelector(selectxLarger);
  const {
    data: validateGet,
    isLoading: isLoadingValidateGet,
    errorMessage: errorMessageValidateGet,
    succeeded: succeededValidateGet,
    executeGet: executeValidateGet,
  } = useAxiosGet(BUILD_API("co-admin/validate"), {});
  useEffect(() => {
    executeValidateGet();
  }, []);
  useEffect(() => {
    let errorMsg = errorMessageValidateGet;
    if (errorMsg) error(errorMsg);
    else {
      if (succeededValidateGet) {
        setCo_admin(() => {
          return true;
        });
      }
    }
  }, [errorMessageValidateGet, succeededValidateGet]);

  return (
    <>
      {isLoadingValidateGet && <Overlay opacity={1} color="#000" zIndex={5} />}
      {isLoadingValidateGet && (
        <LoadingOverlay
          visible={isLoadingValidateGet}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
      )}
      {co_admin && (
        <SimpleGrid
          cols={G.grid({
            small,
            medium,
            large,
            xlarge,
            s: 1,
            m: 1,
            l: 2,
            xl: 2,
            o: 3,
          })}
          mt="lg"
        >
          <CoAdminLink
            href="co-admin-companies"
            key="companies"
            label={t("companies", "Companies")}
            desc={t("copmanies_desc", "Where co-admin handels the companies.")}
          />
          {/* <CoAdminLink href="co-admin-channels" key='channels' label={t('channels', 'Channels')} desc={t('channels_desc', 'Where co-admin handels the channels.')} /> */}
          <CoAdminLink
            href="co-admin-concerns"
            key="concerns"
            label={t("concerns", "Concerns")}
            desc={t(
              "concerns",
              "Where co-admin handels the portal concerns and reports."
            )}
          />
        </SimpleGrid>
      )}
      {!co_admin && (
        <Box>
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title={t("access_denied", "Access Denied")}
            color="red"
          >
            {t("access_denied", "Only co-admins can access this resource!.")}
          </Alert>
        </Box>
      )}
    </>
  );
};
const CoAdminLink = ({ key, label, desc, href }) => {
  const navigate = useNavigate();
  const { classes: classesG } = useGlobalStyl();
  return (
    <Card shadow="sm" radius="md" withBorder p={0}>
      <NavLink
        className={classesG.linkHover}
        p="xl"
        key={key}
        label={<Text fz={rem("1.2rem")}>{label}</Text>}
        description={<Text fz={rem("0.9rem")}>{desc}</Text>}
        rightSection={<IconArrowNarrowRight size="1.8rem" stroke={1.5} />}
        // icon={<item.icon size="1rem" stroke={1.5} />}
        // onClick={() => setActive(index)}
        onClick={() => {
          navigate(`../${href}`);
        }}
      />
    </Card>
  );
};
