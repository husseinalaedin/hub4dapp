import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Card,
  Grid,
  Group,
  LoadingOverlay,
  Menu,
  Modal,
  Overlay,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  rem,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeActive } from "../../../store/features/ActiveNav";
import {
  SharedVsResponsesPerGroup2,
  SharedVsResponsesPerGroup,
  SharesResponsesPerMonth,
  SharesResponsesPerDay,
  SharesResponsesCalendar,
  SharesResponsesGaugePerformance,
  SharesResponsesCounts,
} from "./components/Analytic";
import {
  selectLarge,
  selectMedium,
  selectSmall,
  selectxLarge,
  selectxLarger,
} from "../../../store/features/ScreenStatus";
import { useDisclosure, useHover, useOs } from "@mantine/hooks";
import {
  createSearchParams,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";
import { BUILD_API, G, useMessage } from "../../../global/G";
import { useTranslation } from "react-i18next";
import { GridLayOut, openWhatsappAsWeb } from "../../../global/Misc";
import { useGlobalStyl } from "../../../hooks/useTheme";
import { useAxiosGet } from "../../../hooks/Https";
import { AppHeader } from "../app-admin/AppHeader";
import {
  IconDots,
  IconEye,
  IconFileZip,
  IconInfoCircle,
  IconMaximize,
  IconMinimize,
  IconRefresh,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { SearchPannel } from "../../../global/SearchPannel";
import { ChannelGroups } from "../../../global/global-comp/ChannelGroups";
import { ActiveSelect } from "../../../global/global-comp/ActiveSelect";
import { DatePeriods } from "../../../global/global-comp/DatePeriods";
import { IconBrands } from "../../../global/IconBrands";
import {
  DATETIMEVALUES_FILL,
  DateRange,
  DaysRangeSelect,
  HoursRangeSelect,
  useDateValues,
} from "../../../hooks/useDateRange";
export const Analytic = () => {
  let { src, id } = useParams();
  const grid_name = "ANALYTIC";
  const os = useOs();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchChannles, setSearchChannles] = useState<any>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { error } = useMessage();
  const { t } = useTranslation("private", { keyPrefix: "analytic" });

  const [forceOpenLinkInfo, setForceOpenLinkInfo] = useState<any>("");
  const [popUpObj, setPopUpObj] = useState<any>("");
  const [charts, setCharts] = useState<any>({});
  let charts_data = {};
  // const [dataReport, setDataReport] = useState<any>({});
  const layout = () => {
    if (searchChannles && searchChannles["listdir"])
      return searchChannles["listdir"];
    return GridLayOut(grid_name, "", "GET", "grid_view");
  };
  const [listDir, setListDir] = useState<string>(() => {
    return layout();
  });

  const { data, getError, errorMessage, succeeded, isLoading, executeGet } =
    useAxiosGet(
      BUILD_API(
        "shares/report/analytic" +
          (src && src != "" && id && id != "" ? "/" + src + "/" + id : "")
      ),
      searchChannles
    );
  // const { data: dataReport, getError: getErrorReport, errorMessage: errorMessageError, succeeded: succeededReport, isLoading: isLoadingReport, executeGet: executeGetReport } = useAxiosGet(BUILD_API('shares/report'), {});
  const {
    data: dataCurrentPlan,
    getError: getErrorCurrentPlan,
    errorMessage: errorMessageCurrentPlan,
    succeeded: succeededCurrentPlan,
    isLoading: isLoadingCurrentPlan,
    executeGet: executeGetCurrentPlan,
  } = useAxiosGet(BUILD_API("my-plan"), searchChannles);

  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const large = useSelector(selectLarge);
  const xlarge = useSelector(selectxLarge);
  const xlarger = useSelector(selectxLarger);
  const { classes: classesG } = useGlobalStyl();
  const [showPlanInfo, setShowPlanInfo] = useState(false);
  useEffect(() => {
    executeGetCurrentPlan();
    refresh();
  }, [searchParams, src, id]);
  useEffect(() => {
    if (errorMessageCurrentPlan) error(errorMessageCurrentPlan);
    if (succeededCurrentPlan) {
      setShowPlanInfo(true);
    }
  }, [succeededCurrentPlan, errorMessageCurrentPlan]);
  useEffect(() => {
    dispatch(changeActive("analytic"));
  }, []);
  const refresh = () => {
    let expired = searchParams.get("expired");
    if (!expired || expired == "") {
      searchParams.set("expired", "no");
    }
    setSearchChannles(Object.fromEntries([...searchParams]));
    executeGet({
      url_e: BUILD_API(
        "shares/report/analytic" +
          (src && src != "" && id && id != "" ? "/" + src + "/" + id : "")
      ),
    });
  };
  useEffect(() => {
    setListDir(() => {
      return layout();
    });
  }, [searchChannles]);
  useEffect(() => {
    if (errorMessage) error(errorMessage);
    // if (succeeded) {
    //     setDataReport(() => {
    //         if (data)
    //             return data;
    //         return {}
    //     })
    // }
  }, [succeeded, errorMessage]);
  const isPhone = () => {
    return os == "ios" || os == "android";
  };
  const getDataRows = (source) => {
    if (data && data[source]) return data[source];
    return [];
  };
  const hasData = () => {
    if (data && data["per_channel_data"]) return true;
    return false;
  };
  const opengroupurl = (channel_group_id, url) => {
    if (channel_group_id == "WATS_APP") {
      if (!isPhone() && openWhatsappAsWeb()) {
        url = "https://web.whatsapp.com";
      } else url = "whatsapp://";
    }
    window.open(url, channel_group_id);
  };
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
  const planInfo = () => {
    return (
      dataCurrentPlan &&
      showPlanInfo && (
        <Alert
          icon={<IconInfoCircle size={16} />}
          fs="sm"
          color="blue.9"
          mb="xs"
          p="xs"
          withCloseButton={true}
          closeButtonLabel="Close this message"
          onClose={() => {
            setShowPlanInfo(false);
          }}
        >
          <Text>
            {t("you_can_view", `You can view`)}{" "}
            <b>
              {t("up_to", `Up to`)} {dataCurrentPlan.dashboard_performance_days}{" "}
              {t("days_analytics", `Days Analytics`)}
            </b>{" "}
            {t("for", "for")}{" "}
            <i>{t("dashboard_performance", `Dashboard Performance`)}</i>.
          </Text>
        </Alert>
      )
    );
  };

  return (
    <>
      {/* <div>
                Analytic works fine
            </div> */}
      {isLoading && <Overlay opacity={1} color="#000" zIndex={5} />}
      {isLoading && (
        <LoadingOverlay
          visible={isLoading}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
      )}

      {/* {(isLoading || isLoadingPut) && <Overlay opacity={1} color="#000" zIndex={5} />}
            {(isLoading || isLoadingPut) && <LoadingOverlay visible={isLoading || isLoadingPut} overlayProps={{ radius: "sm", blur: 2 }} />} */}

      <AppHeader title={t("analytics", "Analytics")}>
        <Group justify="right" gap="xs">
          <Button
            variant="default"
            onClick={(val) => {
              refresh();
            }}
          >
            <IconRefresh />
          </Button>
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
              <AnalyticSearch grid={grid_name} planInfo={planInfo()} />
            </Box>
          </Group>
          {!isLoading && hasData() && (
            <Grid mt="sm" align="flex-start">
              {data && data["channel"] && (
                <Grid.Col span={12}>
                  <ChannelAnalytic data={data["channel"]} />
                </Grid.Col>
              )}

              <Grid.Col span={small || medium ? 6 : 3}>
                <CardAnalytic
                  onModal={(opened) => {
                    charts_data["text_share_counts"] = opened;
                    setCharts((charts) => ({
                      ...charts,
                      ...charts_data,
                    }));
                  }}
                  title={t("shares_counts", "Shares Counts")}
                  miw={250}
                >
                  <SharesResponsesCounts
                    label={t("shares", "Shares")}
                    data={data["per_group_data"]}
                    field={"nb_shared"}
                    t={t}
                    show_tools={!!charts["text_share_counts"]}
                    c="blue.5"
                  />
                </CardAnalytic>
              </Grid.Col>
              <Grid.Col span={small || medium ? 6 : 3}>
                <CardAnalytic
                  onModal={(opened) => {
                    charts_data["text_responses_counts"] = opened;
                    setCharts((charts) => ({
                      ...charts,
                      ...charts_data,
                    }));
                  }}
                  title={t("responses_counts", "Responses Counts")}
                  miw={250}
                >
                  <SharesResponsesCounts
                    label={t("responses", "Respns")}
                    data={data["per_group_data"]}
                    field={"nb_responses"}
                    t={t}
                    show_tools={!!charts["text_responses_counts"]}
                    c="green.5"
                  />
                </CardAnalytic>
              </Grid.Col>

              <Grid.Col span={small || medium ? 12 : 6}>
                <CardAnalytic
                  onModal={(opened) => {
                    charts_data["guage_performance"] = opened;
                    setCharts((charts) => ({
                      ...charts,
                      ...charts_data,
                    }));
                  }}
                  title={t(
                    "responses_per_share_performance",
                    "Responses Per Share Performance"
                  )}
                  miw={600}
                >
                  <SharesResponsesGaugePerformance
                    data={getDataRows("per_group_data")}
                  />
                </CardAnalytic>
              </Grid.Col>
              <Grid.Col span={small || medium ? 12 : 6}>
                <CardAnalytic
                  onModal={(opened) => {
                    charts_data["pie_share_vs_resp_grp"] = opened;
                    setCharts((charts) => ({
                      ...charts,
                      ...charts_data,
                    }));
                  }}
                  title={t(
                    "shares_vs_responses_per_group",
                    "Shares VS Responses Per Group"
                  )}
                  miw={600}
                >
                  <SharedVsResponsesPerGroup
                    data={getDataRows("per_group_data")}
                    t={t}
                  />
                </CardAnalytic>
              </Grid.Col>
              <Grid.Col span={small || medium ? 12 : 6}>
                <CardAnalytic
                  onModal={(opened) => {
                    charts_data["bar_share_vs_resp_grp"] = opened;
                    setCharts((charts) => ({
                      ...charts,
                      ...charts_data,
                    }));
                  }}
                  title={t(
                    "shares_vs_responses_per_group",
                    "Shares VS Responses Per Group"
                  )}
                  miw={600}
                >
                  <SharedVsResponsesPerGroup2
                    data={data["per_group_data"]}
                    t={t}
                    x_group={"channel_group"}
                    show_tools={!!charts["bar_share_vs_resp_grp"]}
                  />
                </CardAnalytic>
              </Grid.Col>

              <Grid.Col span={small || medium ? 12 : 12}>
                <CardAnalytic
                  onModal={(opened) => {
                    charts_data["bar_share_vs_resp_chnl"] = opened;
                    setCharts((charts) => ({
                      ...charts,
                      ...charts_data,
                    }));
                  }}
                  title={t(
                    "shares_vs_responses_per_group",
                    "Shares VS Responses Per Channel"
                  )}
                  miw={600}
                >
                  <SharedVsResponsesPerGroup2
                    data={getDataRows("per_channel_data")}
                    t={t}
                    x_group={"channel_name_short"}
                    show_tools={!!charts["bar_share_vs_resp_chnl"]}
                  />
                </CardAnalytic>
              </Grid.Col>

              <Grid.Col span={small || medium ? 12 : 12}>
                <CardAnalytic
                  onModal={(opened) => {
                    charts_data["line_share_and_resp_month"] = opened;
                    setCharts((charts) => ({
                      ...charts,
                      ...charts_data,
                    }));
                  }}
                  title={t(
                    "shares_and_responses_per_month",
                    "Shares And Responses Per Month"
                  )}
                  miw={600}
                >
                  <SharesResponsesPerMonth
                    data={getDataRows("per_day_share_responses_data")}
                    t={t}
                    x_group={"year_month"}
                    show_tools={!!charts["line_share_and_resp_month"]}
                  />
                </CardAnalytic>
              </Grid.Col>
              <Grid.Col span={small || medium ? 12 : 6}>
                <CardAnalytic
                  onModal={(opened) => {
                    charts_data["line_share_and_resp_day"] = opened;
                    setCharts((charts) => ({
                      ...charts,
                      ...charts_data,
                    }));
                  }}
                  title={t(
                    "shares_and_responses_per_day",
                    "Shares And Responses Per Day"
                  )}
                  miw={600}
                >
                  <SharesResponsesPerDay
                    data={getDataRows("per_day_share_responses_data")}
                    t={t}
                    x_group={"day_name"}
                    show_tools={!!charts["line_share_and_resp_day"]}
                  />
                </CardAnalytic>
              </Grid.Col>

              <Grid.Col span={small || medium ? 12 : 6}>
                <CardAnalytic
                  onModal={(opened) => {
                    charts_data["calendar_share_per_day"] = opened;
                    setCharts((charts) => ({
                      ...charts,
                      ...charts_data,
                    }));
                  }}
                  title={t("shares_per_day", "Shares Per Day")}
                  miw={600}
                >
                  <SharesResponsesCalendar
                    data={getDataRows("per_day_share_responses_data")}
                    years={getDataRows("shared_years")}
                    t={t}
                    field={"nb_shared"}
                    show_tools={!!charts["calendar_share_per_day"]}
                    maxPerformance={10}
                  />
                </CardAnalytic>
              </Grid.Col>
              <Grid.Col span={small || medium ? 12 : 6}>
                <CardAnalytic
                  onModal={(opened) => {
                    charts_data["calendar_response_per_day"] = opened;
                    setCharts((charts) => ({
                      ...charts,
                      ...charts_data,
                    }));
                  }}
                  title={t("responses_per_day", "Responses Per Day")}
                  miw={600}
                >
                  <SharesResponsesCalendar
                    data={getDataRows("per_day_share_responses_data")}
                    years={getDataRows("responses_years")}
                    t={t}
                    field={"nb_responses"}
                    show_tools={!!charts["calendar_response_per_day"]}
                    maxPerformance={50}
                  />
                </CardAnalytic>
              </Grid.Col>
            </Grid>
          )}
        </Stack>
      </Box>
    </>
  );
};
const CardAnalytic = ({ title, children, onModal, miw }) => {
  const { hovered, ref } = useHover();
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    onModal(opened);
  }, [opened]);
  return (
    <>
      <Card shadow="sm" radius="md" withBorder ref={ref}>
        <Card.Section withBorder inheritPadding py="xs">
          <Group justify="space-between">
            <Text fw="bold">{title}</Text>
            {
              <ActionIcon
                onClick={open}
                style={{ color: hovered ? "" : "transparent" }}
              >
                <IconMaximize size="1.2rem" />
              </ActionIcon>
            }
          </Group>
        </Card.Section>
        <ScrollArea>
          <Box h={400} miw={miw}>
            {children}
          </Box>
        </ScrollArea>

        {/* {children} */}
      </Card>

      <Modal
        opened={opened}
        onClose={close}
        withCloseButton={false}
        fullScreen
        transitionProps={{ transition: "fade", duration: 200 }}
        // scrollAreaComponent={ScrollArea.Autosize}
      >
        <Card shadow="sm" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>{title}</Text>
              <ActionIcon onClick={close}>
                <IconMinimize size="1.2rem" />
              </ActionIcon>
            </Group>
          </Card.Section>
          {/* <Card.Section miw={miw}> */}
          {/* <Group justify="center"> */}
          <Box h="calc(100vh - 200px)" miw={miw}>
            {children}
          </Box>
          {/* </Group> */}

          {/* </Card.Section> */}
        </Card>
      </Modal>
    </>
  );
};

export const AnalyticSearch = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation("private", { keyPrefix: "channels" });
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const navigate = useNavigate();
  // const { data: dataLastDays, errorMessage: errorMessageLastDays, succeeded: succeededLastDays, isLoading: isLoadingLastDays, executeGet: executeGetLastDays } = useAxiosGet(BUILD_API('util/last_days_list'), null);
  let { lastXDays, lastXHours } = useDateValues({
    fill: DATETIMEVALUES_FILL.ALL,
  });
  const {
    data: dataChannelsGroups,
    errorMessage: errorMessageChannelsGroups,
    succeeded: succeededChannelsGroups,
    isLoading: isLoadingChannelsGroups,
    executeGet: executeGetChannelsGroups,
  } = useAxiosGet(BUILD_API("channels_groups"), null);

  const form = useForm({
    initialValues: {
      active: G.ifNull(searchParams.get("active"), "yes"),
      decision_initiated: G.ifNull(searchParams.get("decision_initiated"), ""),
      verified: G.ifNull(searchParams.get("verified"), ""),
      channel_group_id: G.ifNull(searchParams.get("channel_group_id"), ""),
      channel_name: G.ifNull(searchParams.get("channel_name"), ""),
      channel_data: G.ifNull(searchParams.get("channel_data"), ""),
      searchterm: G.ifNull(searchParams.get("searchterm"), ""),
    },
  });
  useEffect(() => {
    // executeGetLastDays()
    executeGetChannelsGroups();
  }, []);
  useEffect(() => {
    let trm = searchParams.get("searchterm");
    if (trm != form.values.searchterm) form.setValues({ searchterm: trm });
  }, [searchParams]);
  const clear = () => {
    G.clearForm(form);
    let params: any = [];

    params.splice(0, 0, ["t", new Date().getTime().toString()]);
    params.splice(0, 0, ["src", "clear"]);
    navigate({
      search: createSearchParams(params).toString(),
    });
  };

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
  const initForm = () => {
    G.clearForm(form);
  };
  return (
    <>
      <SearchPannel
        searchterm={t("channel_searchterm", "Search")}
        grid={props.grid}
        // listDirs={[
        //     { id: 'grid_view', name: t('grid_view', 'Grid View') },
        //     { id: 'list_view', name: t('list_view', 'List View') }
        // ]}
        sortBy={[
          {
            id: "channel_name",
            name: t("channel_name", "Name"),
          },
          {
            id: "last_share_created_on",
            name: t("last_shared_age", "Last Shared Age"),
            asc: t("old_to_new", "Old To New"),
            desc: t("new_to_old", "New To Old"),
          },
          {
            id: "last_share_expired_on",
            name: t("last_expired_age", "Last Expired Age"),
            asc: t("old_to_new", "Old To New"),
            desc: t("new_to_old", "New To Old"),
          },
          {
            id: "created_on",
            name: t("channel_age", "Channel Age"),
            asc: t("old_to_new", "Old To New"),
            desc: t("new_to_old", "New To Old"),
          },
          {
            id: "nb_shared_last_hr",
            name: t("shared_last_hr", "Shared in the last hour"),
            asc: t("min_to_max", "Min To Max"),
            desc: t("max_to_min", "Max To Min"),
          },
          {
            id: "nb_shared_last_24hr",
            name: t("shared_last_24hr", "Shared in the last 24 hours"),
            asc: t("min_to_max", "Min To Max"),
            desc: t("max_to_min", "Max To Min"),
          },
          {
            id: "nb_responses_last_hr",
            name: t("nb_responses_last_hr", "Responses in the last hour"),
            asc: t("min_to_max", "Min To Max"),
            desc: t("max_to_min", "Max To Min"),
          },
          {
            id: "nb_responses_last_24hr",
            name: t("nb_responses_last_24hr", "Responses in the last 24 hours"),
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
        footer={props.planInfo}
      >
        <Grid gutter={15}>
          <Grid.Col>
            <ChannelGroups
              dataChannelsGroups={dataChannelsGroups}
              {...form.getInputProps("channel_group_id")}
            />
          </Grid.Col>
          <Grid.Col>
            {/* <DatePeriods dataLastDays={dataLastDays} {...form.getInputProps('period')} /> */}
            <Group justify="space-between" gap={4}>
              <Box maw={"calc(50% - 4px)"}>
                <HoursRangeSelect
                  data={lastXHours}
                  {...form.getInputProps("period_hours")}
                  label={t("shared_last_hours", "Shared last(hours)")}
                  placeholder={t(
                    "shared_last_hours",
                    "Shared in the last hours"
                  )}
                />
              </Box>
              <Box maw={"calc(50% - 4px)"}>
                <DaysRangeSelect
                  data={lastXDays}
                  {...form.getInputProps("period_days")}
                  label={t("shared_days", "Shared(days)")}
                  placeholder={t("shared_last_days", "Shared in the last days")}
                />
              </Box>
            </Group>
          </Grid.Col>
          <Grid.Col>
            <DateRange
              fromD="fromD"
              toD="toD"
              form={form}
              label={t("share_date_range", "Share dates range")}
              placeholder={t("share_date_range", "Share dates range")}
            />
          </Grid.Col>
          <Grid.Col>
            <ActiveSelect {...form.getInputProps("active")} />
          </Grid.Col>

          <Grid.Col>
            <TextInput
              autoComplete="off"
              label={t("channel_name", "Name")}
              placeholder={t("channel_name", "Name")}
              {...form.getInputProps("channel_name")}
            />
          </Grid.Col>

          <Grid.Col>
            <TextInput
              autoComplete="off"
              label={t("channel_data", "Url/Email")}
              placeholder={t("channel_data", "Url/Email")}
              {...form.getInputProps("channel_data")}
            />
          </Grid.Col>
        </Grid>
      </SearchPannel>
    </>
  );
};
const ChannelAnalytic = ({ data }) => {
  const navigate = useNavigate();
  return (
    <>
      {data && data.length > 0 && (
        <Card shadow="sm" radius="md" withBorder>
          <Group justify="space-between">
            <Group style={{ whiteSpace: "nowrap" }} fz={24} fw="bolder">
              <IconBrands brand={data[0].channel_group_id} size={32} />
              <Text>{data[0].channel_name}</Text>
            </Group>
            <ActionIcon
              onClick={() => {
                navigate(`../board/analytic`);
              }}
            >
              {<IconX size={30} color="red" />}
            </ActionIcon>
          </Group>
        </Card>
      )}
    </>
  );
};
