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
  Tabs,
  Text,
  Textarea,
  Timeline,
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
import {
  IconAlertCircle,
  IconCheck,
  IconCheckbox,
  IconGitBranch,
  IconGitCommit,
  IconRefresh,
  IconSquareX,
} from "@tabler/icons-react";
import { changeActive } from "../../../store/features/ActiveNav";
import { useAuth } from "../../../providers/AuthProvider";
import { CoAdminChannelDecision } from "../co-admin/CoAdminChannelDecision";
import { IconQuestionMark } from "@tabler/icons-react";
import { AppSelect } from "../../../global/global-comp/AppSelect";

export const ChannelOwnerResponses = () => {
  const { iscoadmin, islogged } = useAuth();
  const { t } = useTranslation("public", { keyPrefix: "chnl-owner-resp" });
  const { classes: classesG } = useGlobalStyl();
  const navigate = useNavigate();
  let { short_link, id } = useParams();

  const { error, succeed, warning } = useMessage();
  const [note_by_user, setNote_by_user] = useState("");
  const [decision_by_user, setDecision_by_user] = useState("");
  const { data, getError, errorMessage, succeeded, isLoading, executeGet } =
    useAxiosGet(
      BUILD_API(
        "decision/channels/" + (id && id != "" ? "/id" + id : short_link)
      ),
      {}
    );
  const {
    data: dataPut,
    putError,
    isLoading: isLoadingPut,
    succeeded: succeededPut,
    errorMessage: errorMessagePut,
    errorCode,
    executePut,
  } = useAxiosPut(
    BUILD_API("decision/channels/" + short_link + "/decision-noted/"),
    { note_by_user: note_by_user, decision_by_user: decision_by_user }
  );
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const large = useSelector(selectLarge);
  const xlarge = useSelector(selectxLarge);
  const xlarger = useSelector(selectxLarger);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(changeActive("decisionnoted"));
  }, []);
  useEffect(() => {
    executeGet();
  }, []);
  useEffect(() => {
    if (succeededPut) {
      succeed(dataPut?.message);
    }
    if (errorMessagePut) {
      error(errorMessagePut);
    }
  }, [succeededPut, errorMessagePut]);

  useEffect(() => {
    if (errorMessage) {
      error(errorMessage);
    }
  }, [errorMessage]);
  return (
    <Box className={classesG.editMax800}>
      {(isLoading || isLoadingPut) && (
        <Overlay opacity={1} color="#000" zIndex={5} />
      )}
      {(isLoading || isLoadingPut) && (
        <LoadingOverlay
          visible={isLoading || isLoadingPut}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
      )}
      <AppHeader title={t("ownership_note", "Ownership Decision")}>
        <Group justify="right" gap="xs">
          <Button
            variant="default"
            onClick={(val) => {
              executeGet();
            }}
          >
            <IconRefresh />
          </Button>
        </Group>
      </AppHeader>
      <Card>
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
          mb="lg"
        >
          <TextLabel
            labelleft={<IconBrands brand={data?.channel_group_id} size={20} />}
            text={data?.channel_group}
            label={t("group", "Group")}
          />
          <TextLabel
            labelleft=""
            text={data?.channel_name}
            label={t("name", "Name")}
          />
        </SimpleGrid>

        <TextLabel
          labelleft=""
          text={data?.channel_data}
          label={t("url", "Url")}
        />
      </Card>
      <Divider my="xl" label="" size="lg" />
      <Timeline active={1} bulletSize={40} lineWidth={2}>
        <Timeline.Item
          color={
            data.decision_by_user == ""
              ? "orange"
              : data.decision_by_user == "ACCEPTED"
              ? "teal"
              : "red"
          }
          bullet={
            <>
              {data.decision_by_user == "" && <IconQuestionMark size={32} />}
              {data.decision_by_user == "ACCEPTED" && (
                <IconCheckbox size={32} />
              )}
              {data.decision_by_user == "REFUSED" && <IconSquareX size={32} />}
            </>
          }
          title={
            <Title size="h2" style={{ marginRight: 10 }}>
              {t("decision", "Decision")} {data.decision_by_user}
            </Title>
          }
        >
          <Text mb={0}>
            {t(
              "channel_decision_message1",
              "*Please select enter note if needed and select your decision. It can be changed at any time."
            )}
          </Text>
          <Text mb="md">
            {t(
              "channel_decision_message2",
              `*If you choose the "Approve" option, please note that our team may require up to 24 hours to reach a final decision.`
            )}
          </Text>
          <Stack mb="lg">
            <Group justify="space-between" grow>
              <Textarea
                defaultValue={data.note_by_user}
                onChange={(e) => {
                  setNote_by_user(e.currentTarget.value);
                  // setShareablePosts(e.currentTarget.value)
                }}
                style={{ position: "relative" }}
                minRows={3}
                autoComplete="off"
                label={t("owner_decis_note", "Ownership Decision Note")}
                placeholder={t(
                  "please_enter_your_own_note_des",
                  "Please Enter Your Note About Ownership Decision"
                )}
              />
            </Group>
            <Group justify="right">
              <Button
                color="red"
                onClick={() => {
                  setDecision_by_user(() => {
                    return "REFUSED";
                  });
                  executePut();
                }}
              >
                {t("refuse", "Refuse")}
              </Button>
              <Button
                onClick={() => {
                  setDecision_by_user(() => {
                    return "ACCEPTED";
                  });
                  executePut();
                }}
              >
                {t("accept", "Accept")}
              </Button>
            </Group>
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
        </Timeline.Item>

        <Timeline.Item
          color={
            data.decision == ""
              ? "orange"
              : data.decision == "ACCEPTED"
              ? "teal"
              : "red"
          }
          bullet={
            <>
              {data.decision == "" && <IconQuestionMark size={32} />}
              {data.decision == "ACCEPTED" && <IconCheckbox size={32} />}
              {data.decision == "REFUSED" && <IconSquareX size={32} />}
            </>
          }
          title={
            <Title size="h2" style={{ marginRight: 10 }}>
              {t("admin-decision", "Admin Decision")} {data.decision}
            </Title>
          }
        >
          <CoAdminChannelDecision data={data} />
        </Timeline.Item>
      </Timeline>
    </Box>
  );
};

export const OwnerChannelDecisionSelect = ({ ...others }) => {
  const { t } = useTranslation("public", { keyPrefix: "chnl-owner-resp" });
  let data = [
    {
      value: "ACCEPTED",
      label: t("ACCEPTED", "Accepted"),
    },
    {
      value: "REFUSED",
      label: t("REFUSED", "Refused"),
    },
  ];
  return (
    <AppSelect
      {...others}
      label={t("channel_owner_decision", "Owenership Decision")}
      placeholder={t("channel_owner_decision", "Owenership Decision")}
      maxDropdownHeight={300}
      data={data}
    />
  );
};
