import { useEffect, useRef, useState } from "react";
import {
  Modal,
  Button,
  Group,
  Box,
  Textarea,
  Text,
  Flex,
  Grid,
  CopyButton,
  ActionIcon,
  TextInput,
  Title,
  Alert,
  Card,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { NumericFormat } from "react-number-format";
import { IconCopy, IconInfoCircle } from "@tabler/icons-react";
import { BUILD_URL, useMessage } from "./G";
import { D } from "./Date";
import { decimalSep, thousandSep } from "./Misc";

import { useForm } from "@mantine/form";
import { ConcernStatus } from "./global-comp/Concerns";
import { useGlobalStyl } from "../hooks/useTheme";
import { useSelector } from "react-redux";
import { selectMedium, selectSmall } from "../store/features/ScreenStatus";
import { closeModal, modals } from "@mantine/modals";
import { useBlocker } from "react-router";

export const ConfirmDialog = ({
  showDialog,
  cancelNavigation,
  confirmNavigation,
}) => {
  const { t } = useTranslation("common", { keyPrefix: "tool" });
  const [opened, setOpened] = useState(false);
  useEffect(() => {
    setOpened(showDialog);
  }, [showDialog]);
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Introduce yourself!"
      >
        <Box>Are you sure?</Box>
      </Modal>

      <Group justify="right">
        <Button
          type="button"
          variant="default"
          style={{ width: 100 }}
          onClick={() => {
            setOpened(false);
            cancelNavigation();
          }}
        >
          {t("no", "No")}
        </Button>
        <Button
          type="button"
          style={{ width: 100 }}
          onClick={() => {
            setOpened(false);
            confirmNavigation();
          }}
        >
          {t("yes", "Yes")}
        </Button>
      </Group>
    </>
  );
};
export const ConfirmUnsaved = ({ blocker }: any) => {
  const { t } = useTranslation("common", { keyPrefix: "tool" });
  return (
    <>
      {blocker && blocker.state === "blocked" ? (
        <Card p="md" maw={450}>
          <Group justify="flex-start">
             
            <Alert
              variant="light"
              color="orange"
              title={t("confirm", "Confirm")}
              icon={<IconInfoCircle />}
              w="100%"
            >
              {t(
                "unsave_confirm_message",
                "Do you want to leave the page without saving your changes?"
              )}
            </Alert>
          </Group>
          <Group justify="flex-end" mt="md">
            <Button
              variant="light"
              onClick={() => {
                if (blocker && blocker.proceed) blocker.proceed();
              }}
            >
              {t("leave", "Leave")}
            </Button>
            <Button
              variant="filled"
              onClick={() => {
                if (blocker && blocker.reset) blocker.reset();
              }}
            >
              {t("stay", "Stay")}
            </Button>
          </Group>
        </Card>
      ) : null}
    </>
  );
};
export const PopInfo = ({ forceOpen, data, children }) => {
  const { t } = useTranslation("common", { keyPrefix: "tool" });
  const [opened, setOpened] = useState(false);
  const { classes: classesG } = useGlobalStyl();
  useEffect(() => {
    if (forceOpen == "") return;
    setOpened(true);
  }, [forceOpen]);
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={data && data.title ? data.title : ""}
      >
        <Textarea
          style={{ fontSize: 10 }}
          autosize={true}
          minRows={4}
          maxRows={10}
          readOnly={true}
          autoComplete="off"
        >
          {data && data.info ? data.info : ""}
        </Textarea>

        <Box className={classesG.seperatorPop}></Box>
        <Group justify="right">
          <Button onClick={() => setOpened(false)}>
            {t("close", "Close")}
          </Button>
        </Group>
      </Modal>
      <Box
        onClick={() => {
          setOpened((o) => {
            return !o;
          });
        }}
      >
        {children}
      </Box>
    </>
  );
};

export const PopEmailsInfo = ({
  valid_emails,
  to_valid_emails,
  invalid_emails,
  label,
  children,
}) => {
  const { t } = useTranslation("common", { keyPrefix: "tool" });
  const [opened, setOpened] = useState(false);
  const { classes: classesG } = useGlobalStyl();
  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)} title={label}>
        <Textarea
          label={
            <Text color="blue">{t("total_valid_emails", "Valid Emails")}</Text>
          }
          style={{ fontSize: 10 }}
          autosize={true}
          minRows={4}
          maxRows={4}
          readOnly={true}
          autoComplete="off"
        >
          {valid_emails}
        </Textarea>
        <Textarea
          mt="sm"
          label={
            <Text color="orange.4">
              {t("total_emails_to_validate", "Emails To Validate")}
            </Text>
          }
          style={{ fontSize: 10 }}
          autosize={true}
          minRows={4}
          maxRows={4}
          readOnly={true}
          autoComplete="off"
        >
          {to_valid_emails}
        </Textarea>
        <Textarea
          mt="sm"
          label={
            <Text color="red">
              {t("total_invalid_emails", "Invalid Emails")}
            </Text>
          }
          style={{ fontSize: 10 }}
          autosize={true}
          minRows={4}
          maxRows={4}
          readOnly={true}
          autoComplete="off"
        >
          {invalid_emails}
        </Textarea>
        <Box className={classesG.seperatorPop}></Box>
        <Group justify="right">
          <Button onClick={() => setOpened(false)}>
            {t("close", "Close")}
          </Button>
        </Group>
      </Modal>
      <Box
        onClick={() => {
          setOpened((o) => {
            return !o;
          });
        }}
      >
        {children}
      </Box>
    </>
  );
};

export const PopShareStatInfo = ({ data, children }) => {
  const { t } = useTranslation("common", { keyPrefix: "tool" });
  const [opened, setOpened] = useState(false);
  const { classes: classesG } = useGlobalStyl();

  return (
    <>
      <Modal
        // size={600}
        opened={opened}
        onClose={() => setOpened(false)}
        title={<Group justify="right">{data.channel_name}</Group>}
      >
        <Grid gutter={0}>
          <Grid.Col span={{ base: 4 }} style={{ margin: "auto" }}></Grid.Col>
          <Grid.Col
            span={{ base: 4 }}
            style={{ margin: "auto", textAlign: "right" }}
          >
            <Text>{t("shareresponse", "Shared")}</Text>
          </Grid.Col>

          <Grid.Col
            span={{ base: 4 }}
            style={{ margin: "auto", textAlign: "right" }}
          >
            <Text>{t("shareresponse", "Responses")}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 4 }} style={{ margin: "auto" }}>
            <Text>{t("last1hr", "Last Hour")}</Text>
          </Grid.Col>
          <Grid.Col
            span={{ base: 4 }}
            style={{ margin: "auto", textAlign: "right" }}
            c="orange.4"
          >
            <NumericFormat
              decimalScale={0}
              displayType="text"
              value={`${data.nb_shared_last_hr}`}
              thousandSeparator={thousandSep()}
              decimalSeparator={decimalSep()}
            />
          </Grid.Col>
          <Grid.Col
            span={{ base: 4 }}
            style={{ margin: "auto", textAlign: "right" }}
            c="orange.4"
          >
            <NumericFormat
              decimalScale={0}
              displayType="text"
              value={`${data.nb_responses_last_hr}`}
              thousandSeparator={thousandSep()}
              decimalSeparator={decimalSep()}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 4 }} style={{ margin: "auto" }}>
            <Text>{t("last24hr", "Last 24 Hours")}</Text>
          </Grid.Col>
          <Grid.Col
            span={{ base: 4 }}
            style={{ margin: "auto", textAlign: "right" }}
            c="red"
          >
            <NumericFormat
              decimalScale={0}
              displayType="text"
              value={`${data.nb_shared_last_24hr}`}
              thousandSeparator={thousandSep()}
              decimalSeparator={decimalSep()}
            />
          </Grid.Col>
          <Grid.Col
            span={{ base: 4 }}
            style={{ margin: "auto", textAlign: "right" }}
            c="red"
          >
            <NumericFormat
              decimalScale={0}
              displayType="text"
              value={`${data.nb_responses_last_24hr}`}
              thousandSeparator={thousandSep()}
              decimalSeparator={decimalSep()}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 4 }} style={{ margin: "auto" }}>
            <Text>{t("anytime", "Any Time")}</Text>
          </Grid.Col>
          <Grid.Col
            span={{ base: 4 }}
            style={{ margin: "auto", textAlign: "right" }}
            c="blue"
          >
            <NumericFormat
              decimalScale={0}
              displayType="text"
              value={`${data.nb_shared}`}
              thousandSeparator={thousandSep()}
              decimalSeparator={decimalSep()}
            />
          </Grid.Col>
          <Grid.Col
            span={{ base: 4 }}
            style={{ margin: "auto", textAlign: "right" }}
            c="blue"
          >
            <NumericFormat
              decimalScale={0}
              displayType="text"
              value={`${data.nb_responses}`}
              thousandSeparator={thousandSep()}
              decimalSeparator={decimalSep()}
            />
          </Grid.Col>
        </Grid>

        <Box className={classesG.seperatorPop}></Box>
        <Group justify="right">
          <Button onClick={() => setOpened(false)}>
            {t("close", "Close")}
          </Button>
        </Group>
      </Modal>
      <Box
        onClick={() => {
          setOpened((o) => {
            return !o;
          });
        }}
      >
        {children}
      </Box>
    </>
  );
};

export const ShareLinksDialog = ({ element, forceOpen, children }) => {
  const { t } = useTranslation("common", { keyPrefix: "tool" });
  const [opened, setOpened] = useState(false);
  const { error, succeed } = useMessage();
  const { classes: classesG } = useGlobalStyl();
  const [expired, setExpired] = useState("");
  const [shareableLink, setShareableLink] = useState("");
  useEffect(() => {
    if (!forceOpen || forceOpen == "") return;
    setOpened(true);
    setExpired(element.expired);
    setShareableLink(BUILD_URL(element["idhex"]));
    //         shareableLink = { BUILD_URL(element['idhex'])
    // } expired = { element.expired }
  }, [forceOpen, element]);

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={t("shareable_link", "Shareable Link")}
      >
        {expired == "X" && (
          <Title c="red" order={4}>
            {t("link_expired", "Link Expired!.")}
          </Title>
        )}
        <TextInput
          value={shareableLink}
          readOnly={true}
          autoComplete="off"
          description={
            <Box c="orange.5" td={expired == "X" ? "line-through" : ""}>
              {t(
                "public_access",
                "Any one with this link can access your company deals!."
              )}
            </Box>
          }
          rightSection={
            <Box style={{ width: "40px" }}>
              <CopyButton value={shareableLink}>
                {({ copied, copy }) => (
                  <ActionIcon
                    onClick={() => {
                      copy();
                      succeed(t("link_copied", "Link copied!."));
                    }}
                    color={copied ? "" : "gray.6"}
                  >
                    <IconCopy size={34} />
                  </ActionIcon>
                )}
              </CopyButton>
            </Box>
          }
        />

        <Box className={classesG.seperatorPop}></Box>
        <Group justify="right">
          <Button
            component="a"
            href={shareableLink}
            variant="subtle"
            onClick={() => {
              setOpened(false);
            }}
          >
            {t("go_to_deals", "Go To Deals")}
          </Button>
          <Button variant="light" onClick={() => setOpened(false)}>
            {t("close", "Close")}
          </Button>
          <CopyButton value={shareableLink}>
            {({ copied, copy }) => (
              <Button
                variant="filled"
                onClick={() => {
                  copy();
                  succeed(t("link_copied", "Link copied!."));
                  setOpened(false);
                }}
              >
                {t("copy_n_close", "Copy And Close")}
              </Button>

              // <ActionIcon onClick={() => {
              //     copy();
              //     succeed(t('link_copied', 'Link copied!.'))
              // }} color={copied ? '' : 'gray.6'}>
              //     <IconCopy size={34} />
              // </ActionIcon>
            )}
          </CopyButton>
        </Group>
      </Modal>
      <Box
        onClick={() => {
          setOpened((o) => {
            return !o;
          });
        }}
      >
        {children}
      </Box>
    </>
  );
};

export const ConcernStatusDialog = ({
  changeStatus,
  element,
  forceOpen,
  children,
  dataStatus,
}) => {
  const form = useForm({
    initialValues: {
      status_id: element.status_id,
      co_admin_note: element.co_admin_note,
    },

    // functions will be used to validate values at corresponding key

    validate: {
      status_id: (value) =>
        value.length < 1
          ? t("status_cannot_be_blank", "Status cannot be blank")
          : null,
    },
  });

  const { t } = useTranslation("common", { keyPrefix: "tool" });
  const [opened, setOpened] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const ref = useRef(null);
  const { classes: classesG } = useGlobalStyl();
  const labl = "";
  // const [co_admin_note, setCo_admin_note] = useState('');
  // const [shareableLink, setShareableLink] = useState('');
  useEffect(() => {
    if (!forceOpen || forceOpen == "") return;
    setOpened(true);
    // setCo_admin_note(element.co_admin_note)
    form.values.status_id = element.status_id;
    form.values.co_admin_note = element.co_admin_note;
  }, [forceOpen, element]);

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={t("change_concern_status", "Change Concern Status..")}
      >
        <ConcernStatus
          ref={ref}
          data={dataStatus}
          {...form.getInputProps("status_id")}
        />
        {/* {labl} */}
        <Textarea
          readOnly={false}
          autoComplete="off"
          minRows={7}
          {...form.getInputProps("co_admin_note")}
          label={t("concern_notes", "Concern Notes")}
          placeholder={t(
            "please_enter_conc_notes",
            "Please enter notes before closing the concern!."
          )}
        />

        <Box className={classesG.seperatorPop}></Box>
        <Group justify="right">
          <Button variant="light" onClick={() => setOpened(false)}>
            {t("close", "Close")}
          </Button>
          <Button
            variant="filled"
            onClick={() => {
              if (changeStatus)
                changeStatus(
                  element.id,
                  form.values.status_id,
                  form.values.co_admin_note
                );
              setOpened(false);
            }}
          >
            {t("submit_n_close", "Sumbit And Close")}
          </Button>
        </Group>
      </Modal>
      <Box
        onClick={() => {
          setOpened((o) => {
            return !o;
          });
        }}
      >
        {children}
      </Box>
    </>
  );
};
export const PopDealStatInfo = ({ dataDeal, forceOpen, children }) => {
  const { t } = useTranslation("common", { keyPrefix: "tool" });
  const [opened, setOpened] = useState(false);
  const { classes: classesG } = useGlobalStyl();
  useEffect(() => {
    if (forceOpen == "") return;
    setOpened(true);
  }, [forceOpen, dataDeal]);
  return (
    <>
      <Modal
        // size={600}
        opened={opened}
        onClose={() => setOpened(false)}
        title={<Group justify="right">{dataDeal.title}</Group>}
      >
        <Grid gutter={0}>
          <Grid.Col span={{ base: 4 }} style={{ margin: "auto" }}>
            <Text fw="bolder">{t("reached_by", "Reached By")}</Text>
          </Grid.Col>
          <Grid.Col
            span={{ base: 4 }}
            style={{ margin: "auto", textAlign: "right" }}
          >
            <Text>{t("reached_by_search", "Search")}</Text>
          </Grid.Col>

          <Grid.Col
            span={{ base: 4 }}
            style={{ margin: "auto", textAlign: "right" }}
          >
            <Text>{t("reached_by_share", "Share")}</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 4 }} style={{ margin: "auto" }}>
            <Text>{t("anytime", "Any Time")}</Text>
          </Grid.Col>
          <Grid.Col
            span={{ base: 4 }}
            style={{ margin: "auto", textAlign: "right" }}
            c="blue"
          >
            <NumericFormat
              decimalScale={0}
              displayType="text"
              value={`${dataDeal.reached_by_search_count}`}
              thousandSeparator={thousandSep()}
              decimalSeparator={decimalSep()}
            />
          </Grid.Col>
          <Grid.Col
            span={{ base: 4 }}
            style={{ margin: "auto", textAlign: "right" }}
            c="blue"
          >
            <NumericFormat
              decimalScale={0}
              displayType="text"
              value={`${dataDeal.reached_by_share_count}`}
              thousandSeparator={thousandSep()}
              decimalSeparator={decimalSep()}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 4 }} style={{ margin: "auto" }}>
            <Text>{t("last1hr", "Last Hour")}</Text>
          </Grid.Col>
          <Grid.Col
            span={{ base: 4 }}
            style={{ margin: "auto", textAlign: "right" }}
            c="orange.4"
          >
            <NumericFormat
              decimalScale={0}
              displayType="text"
              value={`${dataDeal.reached_by_search_count_last_hr}`}
              thousandSeparator={thousandSep()}
              decimalSeparator={decimalSep()}
            />
          </Grid.Col>
          <Grid.Col
            span={{ base: 4 }}
            style={{ margin: "auto", textAlign: "right" }}
            c="orange.4"
          >
            <NumericFormat
              decimalScale={0}
              displayType="text"
              value={`${dataDeal.reached_by_share_count_last_hr}`}
              thousandSeparator={thousandSep()}
              decimalSeparator={decimalSep()}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 4 }} style={{ margin: "auto" }}>
            <Text>{t("last24hr", "Last 24 Hours")}</Text>
          </Grid.Col>
          <Grid.Col
            span={{ base: 4 }}
            style={{ margin: "auto", textAlign: "right" }}
            c="teal.4"
          >
            <NumericFormat
              decimalScale={0}
              displayType="text"
              value={`${dataDeal.reached_by_search_count_last_24hr}`}
              thousandSeparator={thousandSep()}
              decimalSeparator={decimalSep()}
            />
          </Grid.Col>
          <Grid.Col
            span={{ base: 4 }}
            style={{ margin: "auto", textAlign: "right" }}
            c="teal.4"
          >
            <NumericFormat
              decimalScale={0}
              displayType="text"
              value={`${dataDeal.reached_by_share_count_last_24hr}`}
              thousandSeparator={thousandSep()}
              decimalSeparator={decimalSep()}
            />
          </Grid.Col>
        </Grid>

        <Box className={classesG.seperatorPopGray}></Box>
        <Group justify="left">
          <Text fw="bolder">{t("deal_status_renewed", "Deal Renewed")}</Text>

          <Group gap={0} c="blue.5" fw="bolder">
            <NumericFormat
              decimalScale={0}
              displayType="text"
              value={`${dataDeal.renewed_count}`}
              thousandSeparator={thousandSep()}
              decimalSeparator={decimalSep()}
            />
            <Text c="blue">x</Text>
          </Group>
        </Group>
        <Box className={classesG.seperatorPop}></Box>
        <Group justify="right">
          <Button onClick={() => setOpened(false)}>
            {t("close", "Close")}
          </Button>
        </Group>
      </Modal>
      <Box
        onClick={() => {
          setOpened((o) => {
            return !o;
          });
        }}
      >
        {children}
      </Box>
    </>
  );
};
export const PopShareVisitedStatInfo = ({ data, children }) => {
  const { t } = useTranslation("common", { keyPrefix: "tool" });
  const [opened, setOpened] = useState(false);
  const { classes: classesG } = useGlobalStyl();

  return (
    <>
      <Modal
        // size={600}
        opened={opened}
        onClose={() => setOpened(false)}
        title={<Group justify="right">{data.channel_name}</Group>}
      >
        <Grid gutter={0}>
          <Grid.Col span={{ base: 12, xs: 6 }} style={{ margin: "auto" }}>
            <Text fw="bolder">
              {t("visited_through_this_share", "Visited Through This Share")}
            </Text>
          </Grid.Col>
          <Grid.Col
            span={{ base: 12, xs: 6 }}
            style={{ margin: "auto", textAlign: "right" }}
            c="teal.4"
          >
            <Group justify="left">
              <Group gap={0} c="blue.5" fw="bolder">
                <NumericFormat
                  decimalScale={0}
                  displayType="text"
                  value={`${data.nb_visited}`}
                  thousandSeparator={thousandSep()}
                  decimalSeparator={decimalSep()}
                />
                <Text c="blue">x</Text>
              </Group>
              {/* <Text fw="bolde">{t('times_through_this_share', ' Through This Share')}</Text> */}
            </Group>
          </Grid.Col>
          <Grid.Col span={{ base: 12, xs: 6 }} style={{ margin: "auto" }}>
            <Text fw="bolder">{t("shared", "Shared")}</Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, xs: 6 }} style={{ margin: "auto" }}>
            <Text c="orange.4" fw="bolde">
              {D.utc_to_distance(data.created_on)}
            </Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, xs: 6 }} style={{ margin: "auto" }}>
            <Text fw="bolder">{t("expire", "Expire")}</Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, xs: 6 }} style={{ margin: "auto" }}>
            <Text c="red.4" fw="bolde">
              {D.utc_to_distance(data.expired_on)}
            </Text>
          </Grid.Col>
        </Grid>

        <Box className={classesG.seperatorPop}></Box>
        <Group justify="right">
          <Button onClick={() => setOpened(false)}>
            {t("close", "Close")}
          </Button>
        </Group>
      </Modal>
      <Box
        onClick={() => {
          setOpened((o) => {
            return !o;
          });
        }}
      >
        {children}
      </Box>
    </>
  );
};
