import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { BUILD_API, G, useMessage } from "../../../global/G";
import { useAxiosGet, useAxiosPut } from "../../../hooks/Https";
import {
  Alert,
  Box,
  Button,
  Card,
  Divider,
  Group,
  LoadingOverlay,
  Overlay,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useGlobalStyl } from "../../../hooks/useTheme";
import { AppHeader } from "../app-admin/AppHeader";
import { TextLabel } from "../../../global/TextLabel";
import { useDispatch, useSelector } from "react-redux";

import {
  selectLarge,
  selectMedium,
  selectSmall,
  selectxLarge,
  selectxLarger,
} from "../../../store/features/ScreenStatus";
import { IconBrands } from "../../../global/IconBrands";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";
import { changeActive } from "../../../store/features/ActiveNav";
import { useAuth } from "../../../providers/AuthProvider";

export const CoAdminChannelDecision = ({ data }) => {
  const { iscoadmin, islogged } = useAuth();
  const { t } = useTranslation("public", { keyPrefix: "chnl-owner-resp" });
  const { classes: classesG } = useGlobalStyl();
  const navigate = useNavigate();
  let { short_link } = useParams();
  const { error, succeed, warning } = useMessage();
  const [note, setNote] = useState("");
  const [decision, setDecision] = useState("");
  // const { data, getError, errorMessage, succeeded, isLoading, executeGet } = useAxiosGet(BUILD_API('pub/channels/' + short_link), {});
  const {
    data: dataPut,
    putError,
    isLoading: isLoadingPut,
    succeeded: succeededPut,
    errorMessage: errorMessagePut,
    errorCode,
    executePut,
  } = useAxiosPut(
    BUILD_API("co-admin/channels/" + short_link + "/decision-taken/"),
    { note: note, decision: decision }
  );
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const large = useSelector(selectLarge);
  const xlarge = useSelector(selectxLarge);
  const xlarger = useSelector(selectxLarger);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(changeActive("co-admin"));
  }, []);
  // useEffect(() => {
  //     executeGet();
  // }, [])
  useEffect(() => {
    if (succeededPut) {
      succeed(dataPut?.message);
    }
    if (errorMessagePut) {
      error(errorMessagePut);
    }
  }, [succeededPut, errorMessagePut]);

  // useEffect(() => {

  //     if (errorMessage) {
  //         error(errorMessage)
  //     }
  // }, [errorMessage])
  return (
    <Box className={classesG.editMax800}>
      {isLoadingPut && <Overlay opacity={1} color="#000" zIndex={5} />}
      {isLoadingPut && (
        <LoadingOverlay
          visible={isLoadingPut}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
      )}

      <Text mb={0}>
        {t(
          "channel_decision_message1",
          '*Please select refuse if the user decision is "Refuse".'
        )}
      </Text>

      <Stack mb="lg">
        <Group justify="space-between" grow>
          <Textarea
            readOnly={!iscoadmin}
            defaultValue={data.note}
            onChange={(e) => {
              setNote(e.currentTarget.value);

              // setShareablePosts(e.currentTarget.value)
            }}
            style={{ position: "relative" }}
            minRows={3}
            autoComplete="off"
            label={t("coadmin_decis_note", "Decision Note")}
            placeholder={t(
              "please_enter_your_own_note_des",
              "Please Enter Your Note About Ownership Decision"
            )}
          />
        </Group>
        {iscoadmin && islogged && (
          <Group justify="right">
            <Button
              color="red"
              onClick={() => {
                setDecision(() => {
                  return "REFUSED";
                });
                executePut();
              }}
            >
              {t("refuse", "Refuse")}
            </Button>
            <Button
              onClick={() => {
                setDecision(() => {
                  return "ACCEPTED";
                });
                executePut();
              }}
            >
              {t("accept", "Accept")}
            </Button>
          </Group>
        )}
      </Stack>
      {errorMessagePut && errorMessagePut != "" && (
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title={t("error", "Error")}
          color="red"
        >
          {errorMessagePut}
        </Alert>
      )}
      {dataPut && dataPut.message && dataPut.message != "" && (
        <Alert
          icon={<IconCheck size="1rem" />}
          title={
            dataPut && dataPut.level == "OK"
              ? t("succeded", "Succeded")
              : t("warning", "Warning")
          }
          color={dataPut && dataPut.level == "OK" ? "teal" : "orange"}
        >
          {dataPut.message}
        </Alert>
      )}
    </Box>
  );
};
