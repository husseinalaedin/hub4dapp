import {
  ActionIcon,
  Switch,
  Box,
  Button,
  Grid,
  Group,
  LoadingOverlay,
  Menu,
  Drawer,
  Overlay,
  Paper,
  Select,
  Text,
  TextInput,
  Title,
  useMantineTheme,
  Pagination,
  Textarea,
  Spoiler,
  Alert,
  NumberInput,
  Flex,
  NativeSelect,
  Card,
  CopyButton,
  Stack,
  Divider,
  SimpleGrid,
  ScrollArea,
  Table,
  Tooltip,
} from "@mantine/core";

import { useForm } from "@mantine/form";
import {
  IconAlertCircle,
  IconDots,
  IconExternalLink,
  IconGraph,
  IconPlaylistAdd,
  IconRefresh,
  IconShare,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  createSearchParams,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";
import { D } from "../../../global/Date";
import { BUILD_API, G, useMessage } from "../../../global/G";
import { HelpPopUp } from "../../../global/HelpPopUp";
import { NoDataFound } from "../../../global/NoDataFound";
import { SearchPannel } from "../../../global/SearchPannel";
import { useGlobalStyl } from "../../../hooks/useTheme";
import { useAxiosGet } from "../../../hooks/Https";
import { Pages } from "../../../hooks/usePage";
import { changeActive } from "../../../store/features/ActiveNav";
import {
  selectLarge,
  selectMedium,
  selectSmall,
  selectxLarge,
  selectxLarger,
} from "../../../store/features/ScreenStatus";
import { AppHeader } from "../app-admin/AppHeader";

import { Test } from "./Test"; 
import { GridLayOut, decimalSep, thousandSep } from "../../../global/Misc";
import { IconBrands } from "../../../global/IconBrands";
import { CardIn } from "../../../global/CardIn";
import {
  DATETIMEVALUES_FILL,
  DateRange,
  DaysRangeSelect,
  HoursRangeSelect,
  useDateValues,
} from "../../../hooks/useDateRange";

export const EmailsSharesReport = () => {
  const grid_name = "EMAILS_STTS";
  let { src, id } = useParams();

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchEmailsShrRep, setSearchEmailsShrRep] = useState<any>();
  const [data, setData] = useState<any>();
  const [dataInfo, setDataInfo] = useState<any>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { error } = useMessage();
  const { t } = useTranslation("private", { keyPrefix: "shares" });
  const large = useSelector(selectLarge);
  const xlarge = useSelector(selectxLarge);
  const xlarger = useSelector(selectxLarger);
  const layout = () => {
    if (searchEmailsShrRep && searchEmailsShrRep["listdir"])
      return searchEmailsShrRep["listdir"];
    return GridLayOut(grid_name, "", "GET", "grid_view");
  };
  const [listDir, setListDir] = useState<string>(() => {
    return layout();
  });
  const [compressed, setCompressed] = useState<string>(() => {
    return searchEmailsShrRep && searchEmailsShrRep["listdir"]
      ? searchEmailsShrRep["listdir"]
      : "full";
  });
  const {
    data: dataStatus,
    getError,
    errorMessage,
    succeeded,
    isLoading,
    executeGet,
  } = useAxiosGet(
    BUILD_API("shares/report/email/" + src + "/" + id),
    searchEmailsShrRep
  );
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const { classes: classesG } = useGlobalStyl();
  useEffect(() => {
    refresh();
  }, [searchParams]);

  useEffect(() => {
    refresh();
  }, [src, id]);
  useEffect(() => {
    setListDir(() => {
      return layout();
    });
  }, [searchEmailsShrRep]);
  useEffect(() => {
    dispatch(changeActive("emailsStat"));
  }, []);
  useEffect(() => {
    fit_data_grid_view();
  }, [small, medium, large, xlarge, xlarger]);
  const fit_data_grid_view = () => {
    if (small || medium) {
      // searchParams.set('listdir', 'grid_view')
      setListDir(() => {
        return "grid_view";
      });
    } else {
      let lstdr: any = searchParams.get("listdir");
      if (lstdr && lstdr != "" && lstdr != listDir)
        setListDir(() => {
          return lstdr;
        });
    }
  };
  const refresh = () => {
    setSearchEmailsShrRep(Object.fromEntries([...searchParams]));
    executeGet({
      url_e: BUILD_API(
        "shares/report/email" +
          (src && src != "" && id && id != "" ? "/" + src + "/" + id : "")
      ),
    });
    // executeGet();
  };
  useEffect(() => {
    setCompressed(() => {
      return searchEmailsShrRep && searchEmailsShrRep["listdir"]
        ? searchEmailsShrRep["listdir"]
        : "full";
    });
  }, [searchEmailsShrRep]);
  useEffect(() => {
    if (errorMessage) error(errorMessage);
    if (succeeded) {
      setData(dataStatus.data);
      setDataInfo(dataStatus.data_info);
    }
  }, [succeeded, errorMessage]);

  return (
    <>
      <Test />
      {isLoading && <Overlay opacity={1} color="#000" zIndex={5} />}
      {isLoading && (
        <LoadingOverlay
          visible={isLoading}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
      )}

      <AppHeader title={t("email_share_status", "Email Share Status")}>
        <Group justify="right" gap="xs">
          <Button
            variant="default"
            onClick={(val) => {
              refresh();
            }}
          >
            <IconRefresh />
          </Button>
          <HelpPopUp>
            <Card
              shadow="lg"
              m="md"
              style={{ textAlign: "justify", textJustify: "inter-word" }}
            >
              <Box>
                {t(
                  "email_report_note_all_channels",
                  "* For all channels, the generation of the emails shares status report is restricted to a frequency of once every 24 hours!."
                )}
              </Box>
              <Divider my="lg" />
              <Box>
                {t(
                  "email_report_note_one_channel",
                  "* For one channel, the generation of the emails shares status report is restricted to a frequency of once every 12 hours!."
                )}
              </Box>
              <Divider my="lg" />
              <Box>
                {t(
                  "email_report_note_one_channel_share",
                  "* For one channel share, the generation of the emails shares status report is restricted to a frequency of once every one hour!."
                )}
              </Box>
            </Card>
          </HelpPopUp>
        </Group>
      </AppHeader>
      <Box style={{ width: "100%" }}>
        <Stack justify="flex-start" gap={0}>
          <Group
            bg="transparent"
            justify={small || medium ? "apart" : "right"}
            style={{ width: "100%" }}
          >
            <Box
              p={0}
              m={0}
              className={`${classesG.searchHandle}`}
              style={{
                width: "100%",
              }}
            >
              <EmailsSharesReportSearch grid={grid_name} />
            </Box>
          </Group>
          <Box style={{ width: "100%" }}></Box>
          <Box>
            {!data ||
              (data.length <= 0 && (
                <NoDataFound
                  title={t("no_emails_share_found", "No Email Shares Found!.")}
                />
              ))}
            {!(!data || data.length <= 0) && (
              <Box>
                {listDir == "grid_view" && (
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
                    {data?.map((element, index) => {
                      return (
                        <CardIn
                          shadow="sm"
                          radius="md"
                          withBorder
                          key={element.id}
                          classesG={classesG}
                        >
                          <Group justify="space-between" mb="sm">
                            <Box
                              style={{
                                overflow: "hidden",
                                maxWidth: "calc(100% - 100px)",
                              }}
                              className={classesG.title}
                              onClick={() => {
                                // navigate(`../channel/${element.id}`)
                              }}
                            >
                              <Text lineClamp={1}>{element.email}</Text>
                            </Box>
                          </Group>

                          <Group justify="space-between" mb="md">
                            <Stack gap={2}>
                              <Text fz="sm" style={{ opacity: 0.7 }}>
                                {t("delivered", "Delivered")}
                              </Text>
                              <Text
                                m={0}
                                p={0}
                                c="indigo.7"
                                style={{ fontSize: "1rem" }}
                              >
                                {element.nb_delivered}
                              </Text>
                            </Stack>
                            <Stack gap={2}>
                              <Text fz="sm" style={{ opacity: 0.7 }}>
                                {t("read", "Read")}
                              </Text>
                              <Text
                                m={0}
                                p={0}
                                c="orange.7"
                                style={{ fontSize: "1rem" }}
                              >
                                {element.nb_opened}
                              </Text>
                            </Stack>
                            <Stack gap={2} mr="md">
                              <Text fz="sm" style={{ opacity: 0.7 }}>
                                {t("response_percent", "Response Percent")}
                              </Text>
                              <Text
                                m={0}
                                p={0}
                                c={
                                  element.responses_percnt < 0.2
                                    ? "red"
                                    : element.responses_percnt < 0.45
                                    ? "orange"
                                    : "teal"
                                }
                                style={{ fontSize: "1rem" }}
                              >
                                {element.responses_percnt * 100} %
                              </Text>
                            </Stack>
                          </Group>

                          <Divider
                            size={1.5}
                            my={2}
                            label={
                              <Text fz={16} style={{ opacity: 0.7 }}>
                                {t("last_email", "Last Email")}
                              </Text>
                            }
                          />

                          <Group justify="space-between" mr="md">
                            <Stack
                              fw="bold"
                              m={0}
                              p={0}
                              justify="flex-end"
                              gap={2}
                              fz="sm"
                            >
                              <Text ta="left" fz="sm" style={{ opacity: 0.7 }}>
                                {t("delivered_on", "Delivered On")}
                              </Text>
                              <Text ta="right" fz="sm">
                                {D.utc_to_distance(
                                  element.last_email_delivered_on,
                                  t("never", "Never")
                                )}
                              </Text>
                            </Stack>
                            <Divider size={1.5} orientation="vertical" />
                            <Stack
                              fw="bold"
                              m={0}
                              p={0}
                              justify="flex-end"
                              gap={2}
                              fz="sm"
                            >
                              <Text ta="left" fz="sm" style={{ opacity: 0.7 }}>
                                {t("read_on", "Read On")}
                              </Text>
                              <Text ta="right" fz="sm">
                                {D.utc_to_distance(
                                  element.last_email_opened_on,
                                  t("never", "Never")
                                )}
                              </Text>
                            </Stack>
                          </Group>
                        </CardIn>
                      );
                    })}
                  </SimpleGrid>
                )}
                {listDir != "grid_view" && (
                  <EmailsSharesReportList data={data} t={t} />
                )}
                <Pages data={data} small={small} />
              </Box>
            )}
            <Alert mt="lg">
              {src == "co" && (
                <Text>
                  {t("co_email_report_info", "Email status for all channels")}
                </Text>
              )}
              {src == "chnl" && (
                <Group justify="left" mr={0} pr={0} gap={5}>
                  <Text>
                    {t(
                      "channel_email_report_info",
                      "Email status of channel called"
                    )}
                  </Text>
                  <Box ml={0} pl={0} fw="bolder">
                    {dataInfo?.channel_name}
                  </Box>
                </Group>
              )}
              {src == "shr" && (
                <Group justify="left" mr={0} pr={0} gap={5}>
                  <Text>
                    {t(
                      "share_email_report_info",
                      "Email status of share created"
                    )}
                  </Text>
                  <Box ml={0} pl={0} fw="bolder">
                    {D.utc_to_distance(
                      dataInfo?.created_on,
                      t("never", "Never")
                    )}
                  </Box>
                  <Text>
                    {t(
                      "share_email_report_info_for_channel",
                      "with channel name called"
                    )}
                  </Text>
                  <Box ml={0} pl={0} fw="bolder">
                    {dataInfo?.channel_name}
                  </Box>
                </Group>
              )}
              {data && data.length > 0 && (
                <>
                  <Box fs="oblique">
                    {t("email_report_created_on", "Report Created")}{" "}
                    {D.utc_to_distance(
                      data[0].report_created_on,
                      t("never", "Never")
                    )}
                  </Box>
                </>
              )}
            </Alert>
          </Box>
        </Stack>
      </Box>
    </>
  );
};

export const EmailsSharesReportSearch = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { t } = useTranslation("private", { keyPrefix: "shares" });
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const navigate = useNavigate();
  let { lastXDays, lastXHours } = useDateValues({
    fill: DATETIMEVALUES_FILL.ALL,
  });

  const form = useForm({
    initialValues: {
      period: G.ifNull(searchParams.get("period"), "0"),
      email: G.ifNull(searchParams.get("email"), ""),
      searchterm: G.ifNull(searchParams.get("searchterm"), ""),
    },
  });
  useEffect(() => {}, []);
  useEffect(() => {
    let trm = searchParams.get("searchterm");
    if (trm != form.values.searchterm) form.setValues({ searchterm: trm });
  }, [searchParams]);

  const search = () => {
    G.updateParamsFromForm(searchParams, form);
    searchParams.set("page", "1");
    searchParams.set("t", new Date().getTime().toString());
    searchParams.set("src", "search");

    setSearchParams(searchParams);
    navigate({
      search: searchParams.toString(),
    });
  };
  const clear = () => {
    G.clearForm(form);
    let params: any = [];

    params.splice(0, 0, ["t", new Date().getTime().toString()]);
    params.splice(0, 0, ["src", "clear"]);
    navigate({
      search: createSearchParams(params).toString(),
    });
  };
  const initForm = () => {
    G.clearForm(form);
  };
  return (
    <>
      <SearchPannel
        listDirs={[
          { id: "grid_view", name: t("grid_view", "Grid View") },
          { id: "list_view", name: t("list_view", "List View") },
          // { id: 'comp2', name: t('copressed_more', 'Compressed More') }
        ]}
        sortBy={[
          {
            id: "email",
            name: t("email", "E-mail"),
          },
          {
            id: "nb_delivered",
            name: t("nb_delivered", "Delivered#"),
            asc: t("min_to_max", "Min To Max"),
            desc: t("max_to_min", "Max To Min"),
          },
          {
            id: "nb_opened",
            name: t("nb_opened", "Opened#"),
            asc: t("min_to_max", "Min To Max"),
            desc: t("max_to_min", "Max To Min"),
          },
          {
            id: "responses_percnt",
            name: t("responses_percnt", "Responses %"),
            asc: t("min_to_max", "Min To Max"),
            desc: t("max_to_min", "Max To Min"),
          },
        ]}
        onClear={() => {
          clear();
        }}
        onApply={() => {
          search();
        }}
        onSearchTerm={() => {
          initForm();
        }}
      >
        <Grid gutter={15}>
          <Grid.Col>
            {/* <DatePeriods dataLastDays={dataLastDays} {...form.getInputProps('period')} /> */}
            <Group justify="space-between" gap={4}>
              <Box maw={"calc(50% - 4px)"}>
                <HoursRangeSelect
                  data={lastXHours}
                  {...form.getInputProps("period_hours")}
                  label={t("event_last_hours", "Event last(hours)")}
                  placeholder={t("event_last_hours", "Event last hours")}
                />
              </Box>
              <Box maw={"calc(50% - 4px)"}>
                <DaysRangeSelect
                  data={lastXDays}
                  {...form.getInputProps("period_days")}
                  label={t("event_days", "Event(days)")}
                  placeholder={t("event_last_days", "Event last days")}
                />
              </Box>
            </Group>
          </Grid.Col>
          <Grid.Col>
            <DateRange
              fromD="fromD"
              toD="toD"
              form={form}
              label={t("event_date_range", "Event dates range")}
              placeholder={t("event_date_range", "Event dates range")}
            />
          </Grid.Col>
          <Grid.Col>
            <TextInput
              autoComplete="off"
              label={t("email", "E-mail")}
              placeholder={t("email", "E-mail")}
              {...form.getInputProps("email")}
            />
          </Grid.Col>
        </Grid>
      </SearchPannel>
    </>
  );
};

const EmailsSharesReportList = ({ data, t }) => {
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const { classes: classesG, cx } = useGlobalStyl();
  const navigate = useNavigate();
  const [selection, setSelection] = useState(["1"]);

  const rows = data?.map((item) => {
    const selected = selection.includes(item.id);
    return (
      <Table.Tr
        key={item.id}
        className={cx({ [classesG.rowSelected]: selected })}
      >
        <Table.Td>
          <Box className={classesG.title}>
            <Text
              style={{
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              {item.email}
            </Text>
          </Box>
        </Table.Td>
        <Table.Td>
          <Text m={0} p={0}>
            {D.utc_to_distance(
              item.last_email_delivered_on,
              t("never", "Never")
            )}
          </Text>
        </Table.Td>
        <Table.Td>
          <Text m={0} p={0}>
            {D.utc_to_distance(item.last_email_opened_on, t("never", "Never"))}
          </Text>
        </Table.Td>
        <Table.Td>
          <Text
            ta="right"
            m={0}
            p={0}
            c="indigo.7"
            style={{ fontSize: "1rem" }}
          >
            {item.nb_delivered}
          </Text>
        </Table.Td>

        <Table.Td>
          <Text
            ta="right"
            m={0}
            p={0}
            c="orange.7"
            style={{ fontSize: "1rem" }}
          >
            {item.nb_opened}
          </Text>
        </Table.Td>
        <Table.Td>
          <Text
            ta="right"
            m={0}
            p={0}
            c={
              item.responses_percnt < 0.2
                ? "red"
                : item.responses_percnt < 0.45
                ? "orange"
                : "teal"
            }
            style={{ fontSize: "1rem" }}
          >
            {item.responses_percnt * 100} %
          </Text>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <ScrollArea mt="lg">
      <Table
        verticalSpacing="xs"
        highlightOnHover
        className={`${"TableCss"} ${classesG.table}`}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{t("email", "Email")}</Table.Th>
            <Table.Th>
              {t("last_email_delivered_on", "Last Email Read On")}
            </Table.Th>
            <Table.Th>{t("last_email_read_on0", "Deliverd On")}</Table.Th>
            <Table.Th>
              <Box ta="right">{t("delivered", "Delivered")}</Box>{" "}
            </Table.Th>
            <Table.Th>
              <Box ta="right">{t("read", "Read")}</Box>
            </Table.Th>
            <Table.Th>
              <Box ta="right">{t("response_percent", "Response %")}</Box>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
  );
};
