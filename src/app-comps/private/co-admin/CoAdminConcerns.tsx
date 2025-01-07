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
import { useOs } from "@mantine/hooks";
import {
  IconDots,
  IconAlertCircle,
  IconCheck,
  IconCopy,
  IconExternalLink,
  IconLink,
  IconLinkOff,
  IconMail,
  IconPlus,
  IconRefresh,
  IconEdit,
  IconPlaylistAdd,
  IconFileAnalytics,
  IconGraph,
  IconStatusChange,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NumericFormat } from "react-number-format";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  createSearchParams,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";
import { D } from "../../../global/Date";
import { ExpiredSelect } from "../../../global/ExpiredSelect";
import { BUILD_API, BUILD_URL, G, useMessage } from "../../../global/G";
import { IconBrands } from "../../../global/IconBrands";
import {
  decimalSep,
  GridLayOut,
  openWhatsappAsWeb,
  thousandSep,
} from "../../../global/Misc";
import { NoDataFound } from "../../../global/NoDataFound";
import {
  ConcernStatusDialog,
  PopShareVisitedStatInfo,
  ShareLinksDialog,
} from "../../../global/PopUpDialogs";
import { SearchPannel } from "../../../global/SearchPannel";
import { ShareOrShareNOpen } from "../../../global/ShareOrShareNOpen";
import { useGlobalStyl } from "../../../hooks/useTheme";
import { axios_put, useAxiosGet, useAxiosPost } from "../../../hooks/Https";
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
import { ChannelGroups } from "../../../global/global-comp/ChannelGroups";
import { CardIn } from "../../../global/CardIn";
import {
  ConcernCategories,
  ConcernPriorities,
  ConcernStatus,
} from "../../../global/global-comp/Concerns";

export const CoAdminConcerns = () => {
  const grid_name = "COADM_INCONCERS";
  const os = useOs();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchCoAdminConcern, setSearchCoAdminConcern] = useState<any>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { error } = useMessage();
  const { t } = useTranslation("private", { keyPrefix: "co_admin" });

  const [forceOpenConcernStatus, setForceOpenConcernStatus] = useState<any>("");
  const [popUpObj, setPopUpObj] = useState<any>("");
  const [objectUpdated, setObjectUpdated] = useState<any>({});
  const layout = () => {
    if (searchCoAdminConcern && searchCoAdminConcern["listdir"])
      return searchCoAdminConcern["listdir"];
    return GridLayOut(grid_name, "", "GET", "grid_view");
  };
  const [listDir, setListDir] = useState<string>(() => {
    return layout();
  });

  const {
    data,
    getError,
    errorMessage,
    succeeded,
    isLoading,
    executeGet,
    setData: setDataGet,
  } = useAxiosGet(BUILD_API("co-admin/concerns"), searchCoAdminConcern);

  const {
    data: dataStatus,
    getError: getErrorStatus,
    errorMessage: errorMessageStatus,
    succeeded: succeededStatus,
    isLoading: isLoadingStatus,
    executeGet: executeGetStatus,
  } = useAxiosGet(BUILD_API("concerns/status"), []);
  const {
    data: dataPriorities,
    getError: getErrorPriorities,
    errorMessage: errorMessagePriorities,
    succeeded: succeededPriorities,
    isLoading: isLoadingPriorities,
    executeGet: executeGetPriorities,
  } = useAxiosGet(BUILD_API("concerns/priorities"), []);
  const {
    data: dataCategories,
    getError: getErrorCategories,
    errorMessage: errorMessageCategories,
    succeeded: succeededCategories,
    isLoading: isLoadingCategories,
    executeGet: executeGetCategories,
  } = useAxiosGet(BUILD_API("concerns/categories"), []);

  const { succeed } = useMessage();

  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const large = useSelector(selectLarge);
  const xlarge = useSelector(selectxLarge);
  const xlarger = useSelector(selectxLarger);
  const { classes: classesG } = useGlobalStyl();
  useEffect(() => {
    refresh();
  }, [searchParams]);

  useEffect(() => {
    dispatch(changeActive("co-admin"));
    executeGetStatus();
    executeGetPriorities();
    executeGetCategories();
  }, []);
  const refresh = () => {
    fit_data_grid_view();
    setSearchCoAdminConcern(Object.fromEntries([...searchParams]));
    executeGet();
  };
  useEffect(() => {
    setListDir(() => {
      return layout();
    });
  }, [searchCoAdminConcern]);
  useEffect(() => {
    if (errorMessage) error(errorMessage);
    if (errorMessageStatus) error(errorMessageStatus);
    if (errorMessagePriorities) error(errorMessagePriorities);
    if (errorMessageCategories) error(errorMessageCategories);
  }, [
    succeeded,
    errorMessage,
    errorMessageStatus,
    errorMessagePriorities,
    errorMessageCategories,
  ]);
  const isPhone = () => {
    return os == "ios" || os == "android";
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
  const getStatusDesc = (id) => {
    if (dataStatus)
      for (let i = 0; i < dataStatus.length; i++) {
        if (dataStatus[i]["id"] == id) return dataStatus[i]["status"];
      }
    return "";
  };
  const changeStatus = (id, status, note) => {
    setObjectUpdated(() => {
      return { tm: new Date().getTime(), id, action: "processing" };
    });
    axios_put(
      BUILD_API("co-admin/concerns/") + id + "/change-ststus",
      { status_id: status, co_admin_note: note },
      (actionData) => {
        if (actionData) {
          succeed(actionData.data.message);
          setObjectUpdated(() => {
            return {
              tm: new Date().getTime(),
              id,
              action: "completed",
              status_id: status,
              co_admin_note: note,
              status_desc: getStatusDesc(status),
            };
          });
        }
      },
      (err) => {
        error(err.message);
        setObjectUpdated(() => {
          return { tm: new Date().getTime(), id, action: "" };
        });
      }
    );
  };
  useEffect(() => {
    if (!objectUpdated.id || objectUpdated.id == "") return;
    updated(
      objectUpdated.id,
      objectUpdated.action,
      objectUpdated.status_id,
      objectUpdated.co_admin_note,
      objectUpdated.status_desc
    );
  }, [objectUpdated.tm]);
  const updated = async (id, action, status_id, co_admin_note, status_desc) => {
    if (!data || data.length <= 0) return;
    const updatedData = data.map((item) => {
      if (item.id === id) {
        if (action == "processing") return { ...item, action: action };
        return {
          ...item,
          expired: action == "renew" ? "" : "X",
          action: action,
          status_id,
          co_admin_note,
          status: status_desc,
        };
      } else return item;
    });
    setDataGet(updatedData);
  };
  return (
    <>
      {(isLoading ||
        isLoadingStatus ||
        isLoadingPriorities ||
        isLoadingCategories) && <Overlay opacity={1} color="#000" zIndex={5} />}
      {(isLoading ||
        isLoadingStatus ||
        isLoadingPriorities ||
        isLoadingCategories) && (
        <LoadingOverlay
          visible={
            isLoading ||
            isLoadingStatus ||
            isLoadingPriorities ||
            isLoadingCategories
          }
          overlayProps={{ radius: "sm", blur: 2 }}
        />
      )}

      <AppHeader title={t("concern_title", "Concerns")}>
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
              <CoAdminConcernsSearch
                dataStatus={dataStatus}
                dataPriorities={dataPriorities}
                dataCategories={dataCategories}
              />
            </Box>
          </Group>

          <Box>
            {!data ||
              (data.length <= 0 && (
                <NoDataFound
                  title={t("no_concerns_found", "No Concerns Found!.")}
                />
              ))}
            <ConcernStatusDialog
              changeStatus={changeStatus}
              dataStatus={dataStatus}
              element={popUpObj}
              forceOpen={forceOpenConcernStatus}
            >
              <></>
            </ConcernStatusDialog>
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
                          pr={5}
                          key={element.id}
                          classesG={classesG}
                        >
                          <Group justify="space-between" mb="sm">
                            <Box>
                              <Box
                                style={{ overflow: "hidden" }}
                                className={classesG.titleHref2}
                                onClick={() => {
                                  navigate(`../concerns/${element.id}`);
                                }}
                              >
                                <Text>{element.subject}</Text>
                              </Box>

                              <Text mt={-5} lineClamp={1}>
                                {element.company_name}
                              </Text>
                              <Text mt={-5} lineClamp={1}>
                                {element.first_name}, {element.last_name}
                              </Text>
                              <CopyButton value={element.email}>
                                {({ copied, copy }) => (
                                  <Text
                                    onClick={() => {
                                      copy();
                                      succeed(
                                        t("email_copied", "Email copied!.")
                                      );
                                    }}
                                    c={copied ? "indigo.7" : ""}
                                    fz={small ? "sm" : "md"}
                                  >
                                    <span className={classesG.textToCopy}>
                                      {element.email}
                                    </span>
                                  </Text>
                                )}
                              </CopyButton>
                            </Box>
                            <Spoiler
                              mt={-15}
                              style={{ whiteSpace: "pre-line" }}
                              maxHeight={20}
                              showLabel={t("show_more", "More")}
                              hideLabel={t("show_more", "Less")}
                            >
                              {element.body}
                            </Spoiler>

                            <Box
                              style={{ position: "absolute", right: 5, top: 5 }}
                            >
                              <CoAdminConcernMenu
                                element={element}
                                t={t}
                                navigate={navigate}
                                setPopUpObj={setPopUpObj}
                                setForceOpenConcernStatus={
                                  setForceOpenConcernStatus
                                }
                              />
                            </Box>
                          </Group>
                          {element.company_name_concern &&
                            element.company_name_concern != "" && (
                              <>
                                <Divider
                                  size={1.5}
                                  my={2}
                                  label={
                                    <Text fz={16} style={{ opacity: 0.7 }}>
                                      {t(
                                        "reported_compnay",
                                        "Reported Company"
                                      )}
                                    </Text>
                                  }
                                />
                                <Text fw={600} fz={small ? "sm" : "md"}>
                                  {element.company_name_concern}
                                </Text>
                              </>
                            )}
                          <Divider
                            size={1.5}
                            my={2}
                            label={
                              <Text fz={16} style={{ opacity: 0.7 }}>
                                {t("info", "Info")}
                              </Text>
                            }
                          />
                          <Group justify="space-between" mb="md">
                            <Stack gap={2} mr="md">
                              <Stack
                                fw="bold"
                                m={0}
                                p={0}
                                justify="flex-end"
                                gap={2}
                                fz="sm"
                              >
                                <Text
                                  fw="bold"
                                  fz="sm"
                                  style={{ opacity: 0.7 }}
                                >
                                  {t("category", "Category")}
                                </Text>
                                <Text
                                  fw={600}
                                  fz={small ? "sm" : "md"}
                                  style={{ alignItems: "center" }}
                                >
                                  {element.category}
                                </Text>
                              </Stack>
                            </Stack>
                            <Divider size={1.5} orientation="vertical" />
                            <Stack gap={2} mr="md">
                              <Stack
                                fw="bold"
                                m={0}
                                p={0}
                                justify="flex-end"
                                gap={2}
                                fz="sm"
                              >
                                <Text
                                  fw="bold"
                                  fz="sm"
                                  style={{ opacity: 0.7 }}
                                >
                                  {t("priority", "Priority")}
                                </Text>
                                <Text
                                  fw={600}
                                  fz={small ? "sm" : "md"}
                                  style={{ alignItems: "center" }}
                                  c="red.4"
                                >
                                  {element.priority}
                                </Text>
                              </Stack>
                            </Stack>
                            <Divider size={1.5} orientation="vertical" />
                            <Stack gap={2} mr="md">
                              <Stack
                                fw="bold"
                                m={0}
                                p={0}
                                justify="flex-end"
                                gap={2}
                                fz="sm"
                              >
                                <Text
                                  fw="bold"
                                  fz="sm"
                                  style={{ opacity: 0.7 }}
                                >
                                  {t("status", "Status")}
                                </Text>
                                <Text
                                  fw={600}
                                  fz={small ? "sm" : "md"}
                                  style={{ alignItems: "center" }}
                                >
                                  {element.status}
                                </Text>
                              </Stack>
                            </Stack>
                            <Spoiler
                              style={{ whiteSpace: "pre-line" }}
                              maxHeight={20}
                              showLabel={t("show_more", "More")}
                              hideLabel={t("show_more", "Less")}
                            >
                              {element.co_admin_note}
                            </Spoiler>
                          </Group>
                        </CardIn>
                      );
                    })}
                  </SimpleGrid>
                )}
                {listDir != "grid_view" && (
                  <CoAdminConcernsList
                    data={data}
                    succeed={succeed}
                    setPopUpObj={setPopUpObj}
                    setForceOpenConcernStatus={setForceOpenConcernStatus}
                    t={t}
                  />
                )}
                <Pages data={data} small={small} />
              </Box>
            )}
          </Box>
        </Stack>
      </Box>
    </>
  );
};

export const CoAdminConcernsSearch = ({
  dataStatus,
  dataPriorities,
  dataCategories,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { t } = useTranslation("private", { keyPrefix: "shares" });
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const navigate = useNavigate();
  const {
    data: dataChannelsGroups,
    errorMessage: errorMessageChannelsGroups,
    succeeded: succeededChannelsGroups,
    isLoading: isLoadingChannelsGroups,
    executeGet: executeGetChannelsGroups,
  } = useAxiosGet(BUILD_API("channels_groups"), null);

  const form = useForm({
    initialValues: {
      status: G.ifNull(searchParams.get("status"), ""),
      priority: G.ifNull(searchParams.get("priority"), ""),
      category: G.ifNull(searchParams.get("category"), ""),
      searchterm: G.ifNull(searchParams.get("searchterm"), ""),
    },
  });
  useEffect(() => {
    executeGetChannelsGroups();
  }, []);
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
          // { id: 'full', name: t('full', 'Full List') },
          // { id: 'comp1', name: t('copressed', 'Compressed') },
          // { id: 'comp2', name: t('copressed_more', 'Compressed More') }
          { id: "grid_view", name: t("grid_view", "Grid View") },
          { id: "list_view", name: t("list_view", "List View") },
        ]}
        sortBy={[
          {
            id: "channel_name",
            name: t("channel_name", "Name"),
          },
          {
            id: "created_on",
            name: t("shared_age", "Shared Age"),
            asc: t("old_to_new", "Old To New"),
            desc: t("new_to_old", "New To Old"),
          },
          {
            id: "nb_visited",
            name: t("nb_visited", "Visited#"),
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
            <ConcernStatus
              data={dataStatus}
              {...form.getInputProps("status")}
              clearable
            />
          </Grid.Col>
          <Grid.Col>
            <ConcernPriorities
              data={dataPriorities}
              {...form.getInputProps("priority")}
              clearable
            />
          </Grid.Col>
          <Grid.Col>
            <ConcernCategories
              data={dataCategories}
              {...form.getInputProps("category")}
              clearable
            />
          </Grid.Col>
        </Grid>
      </SearchPannel>
    </>
  );
};

const CoAdminConcernsList = ({
  data,
  succeed,
  setPopUpObj,
  setForceOpenConcernStatus,
  t,
}) => {
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const { classes: classesG } = useGlobalStyl();
  const navigate = useNavigate();
  const [selection, setSelection] = useState(["1"]);

  const rows = data.map((item) => {
    const selected = selection.includes(item.id);
    return (
      <Table.Tr key={item.id} className={selected ? classesG.rowSelected : ""}>
        <Table.Td>
          <Text>{item.subject}</Text>
        </Table.Td>
        <Table.Td>
          <Text>{item.company_name}</Text>
        </Table.Td>
        <Table.Td>
          <Text>
            {item.first_name}, {item.last_name}
          </Text>
        </Table.Td>

        <Table.Td>
          <CopyButton value={item.email}>
            {({ copied, copy }) => (
              <Text
                onClick={() => {
                  copy();
                  succeed(t("email_copied", "Email copied!."));
                }}
                c={copied ? "indigo.7" : ""}
                fz={small ? "sm" : "md"}
              >
                <span className={classesG.textToCopy}>{item.email}</span>
              </Text>
            )}
          </CopyButton>
        </Table.Td>
        <Table.Td>
          <Spoiler
            style={{ whiteSpace: "pre-line" }}
            maxHeight={20}
            showLabel={t("show_more", "More")}
            hideLabel={t("show_more", "Less")}
          >
            {item.body}
          </Spoiler>
        </Table.Td>
        <Table.Td>
          <Text
            fw={600}
            fz={small ? "sm" : "md"}
            style={{ alignItems: "center" }}
          >
            {item.category}
          </Text>
        </Table.Td>
        <Table.Td>
          <Text
            fw={600}
            fz={small ? "sm" : "md"}
            style={{ alignItems: "center" }}
            c="red.4"
          >
            {item.priority}
          </Text>
        </Table.Td>
        <Table.Td>
          <Text
            fw={600}
            fz={small ? "sm" : "md"}
            style={{ alignItems: "center" }}
          >
            {item.status}
          </Text>
        </Table.Td>
        <Table.Td>
          <Spoiler
            style={{ whiteSpace: "pre-line" }}
            maxHeight={20}
            showLabel={t("show_more", "More")}
            hideLabel={t("show_more", "Less")}
          >
            {item.co_admin_note}
          </Spoiler>
        </Table.Td>
        <Table.Td>
          <CoAdminConcernMenu
            element={item}
            t={t}
            navigate={navigate}
            setPopUpObj={setPopUpObj}
            setForceOpenConcernStatus={setForceOpenConcernStatus}
          />
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <ScrollArea mt="lg">
      <Table
        verticalSpacing="xs"
        highlightOnHover
        className={`${"TableCss"}  ${classesG.table}`}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{t("subject", "Subject")}</Table.Th>
            <Table.Th>{t("company", "Company")}</Table.Th>

            <Table.Th>{t("contact", "Contact")}</Table.Th>
            <Table.Th>{t("email", "Email")}</Table.Th>
            <Table.Th>{t("body", "Body")}</Table.Th>
            <Table.Th>{t("category", "Category")}</Table.Th>
            <Table.Th>{t("priority", "Priority")}</Table.Th>
            <Table.Th>{t("status", "Status")}</Table.Th>
            <Table.Th>{t("co_admin_note", "CoAdmin Note")}</Table.Th>

            <Table.Th style={{ textAlign: "right" }}>
              {t("nb_visited", "Visited")}
            </Table.Th>

            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
  );
};
const CoAdminConcernMenu = ({
  element,
  setPopUpObj,
  setForceOpenConcernStatus,
  navigate,
  t,
}) => {
  return (
    <Menu position="left-start" offset={0} withinPortal={true}>
      <Menu.Target>
        <ActionIcon size="md" variant="subtle">
          <IconDots size={25} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          leftSection={<IconStatusChange size={20} />}
          onClick={() => {
            setPopUpObj(element);
            setForceOpenConcernStatus(() => {
              return new Date().getTime().toString();
            });
          }}
        >
          <Box>{t("change_status", "Change Status")}</Box>
        </Menu.Item>

        <Menu.Item
          leftSection={<IconGraph size={20} stroke={1.5} />}
          onClick={() => {
            navigate(`../board/analytic/shr/${element.id}`);
          }}
        >
          {t("dashboard_chnl_share_report", "Channel Share Report")}
        </Menu.Item>

        {element.channel_group_id == "EMAIL" && (
          <Menu.Item
            leftSection={<IconMail size={20} stroke={1.5} />}
            onClick={() => {
              navigate(`../board/emailsStat/shr/${element.id}`);
            }}
          >
            {t("dashboard_email_share_status", "Email Share Status")}
          </Menu.Item>
        )}
      </Menu.Dropdown>
    </Menu>
  );
};
