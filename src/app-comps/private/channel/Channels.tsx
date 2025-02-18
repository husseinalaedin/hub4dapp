import {
  ActionIcon,
  Box,
  Button,
  Grid,
  Group,
  LoadingOverlay,
  Menu,
  Overlay,
  Select,
  Text,
  TextInput,
  Textarea,
  Alert,
  Stack,
  Tooltip,
  SimpleGrid,
  Divider,
} from "@mantine/core";

import { useForm } from "@mantine/form";

import {
  IconAlertCircle,
  IconCalendarTime,
  IconCircleCheck,
  IconEdit,
  IconExternalLink,
  IconFileAnalytics,
  IconInfinity,
  IconMail,
  IconPlaylistAdd,
  IconPlus,
  IconRefresh,
  IconShare,
  IconDots,
  IconCheck,
  IconError404,
  IconExclamationMark,
  IconGraph,
  IconArrowBearRight,
  IconArrowUpRight,
} from "@tabler/icons-react";
import {
  forwardRef,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  createSearchParams,
  useBlocker,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";

import { useOs } from "@mantine/hooks";
import { NumericFormat } from "react-number-format";

import { Table } from "@mantine/core";
import {
  selectLarge,
  selectMedium,
  selectSmall,
  selectxLarge,
  selectxLarger,
} from "../../../store/features/ScreenStatus";
import { BUILD_API, G, useMessage } from "../../../global/G";
import { useAxiosGet, useAxiosPost, useAxiosPut } from "../../../hooks/Https";
import { useGlobalStyl } from "../../../hooks/useTheme";
import { changeActive } from "../../../store/features/ActiveNav";
import {
  decimalSep,
  GridLayOut,
  openWhatsappAsWeb,
  thousandSep,
} from "../../../global/Misc";
import { AppHeader } from "../app-admin/AppHeader";
import { NoDataFound } from "../../../global/NoDataFound";
import { IconBrands } from "../../../global/IconBrands";
import { D } from "../../../global/Date";
import { Pages } from "../../../hooks/usePage";
import { EditSave } from "../../../global/EditSave";
import { SearchPannel } from "../../../global/SearchPannel";
import { ConfirmUnsaved, PopShareStatInfo } from "../../../global/PopUpDialogs";
import { ChannelGroups } from "../../../global/global-comp/ChannelGroups";
import { ActiveSelect } from "../../../global/global-comp/ActiveSelect";
import { CardIn } from "../../../global/CardIn";
import {
  DATETIMEVALUES_FILL,
  DateRange,
  HoursRangeSelect,
  useDateValues,
} from "../../../hooks/useDateRange"; 
import { AppSelect } from "../../../global/global-comp/AppSelect";

export const Channels = () => {
  const grid_name = "CHANNELS";
  const os = useOs();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchChannles, setSearchChannles] = useState<any>();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { error, succeed } = useMessage();
  const { t } = useTranslation("private", { keyPrefix: "channels" });
  const layout = () => {
    if (searchChannles && searchChannles["listdir"])
      return searchChannles["listdir"];
    return GridLayOut(grid_name, "", "GET", "grid_view");
  };
  const [listDir, setListDir] = useState<string>(() => {
    return layout();
  });
  const { data, errorMessage, succeeded, isLoading, executeGet } = useAxiosGet(
    BUILD_API("channels"),
    searchChannles
  );
  let {
    data: dataPut,
    isLoading: isLoadingPut,
    succeeded: succeededPut,
    errorMessage: errorMessagePut,
    executePut,
  } = useAxiosPut(BUILD_API("/channels"), {});
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const large = useSelector(selectLarge);
  const xlarge = useSelector(selectxLarge);
  const xlarger = useSelector(selectxLarger);
  const { classes: classesG } = useGlobalStyl();

  useEffect(() => {
    dispatch(changeActive("channels"));
  }, []);

  useEffect(() => {
    refresh();
  }, [searchParams]);

  const refresh = () => {
    fit_data_grid_view();
    setSearchChannles(Object.fromEntries([...searchParams]));
    executeGet();
  };
  useEffect(() => {
    setListDir(() => {
      return layout();
    });
  }, [searchChannles]);
  useEffect(() => {
    if (errorMessage) error(errorMessage);
  }, [succeeded, errorMessage]);
  const isPhone = () => {
    return os == "ios" || os == "android";
  };
  const opengroupurl = (channel_group_id: any, url: any) => {
    if (channel_group_id == "WATS_APP") {
      if (!isPhone() && openWhatsappAsWeb()) {
        url = "https://web.whatsapp.com";
      } else url = "whatsapp://";
    }
    window.open(url, channel_group_id);
  };
  useEffect(() => {
    if (succeededPut) {
      succeed(dataPut?.message);
    }
    if (errorMessagePut) error(errorMessagePut);
  }, [errorMessagePut, succeededPut]);

  const activate_or_deactivate = (id: any, action: string) => {
    executePut(BUILD_API("channels/") + id + "/" + action);
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
  return (
    <>
      {(isLoading || isLoadingPut) && (
        <Overlay opacity={1} color="#000" zIndex={5} />
      )}
      {(isLoading || isLoadingPut) && (
        <LoadingOverlay
          visible={isLoading || isLoadingPut}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
      )}

      <AppHeader title={t("channel_title_channel", "Channels")}>
        <Group justify="right" gap="xs">
          <Button
            variant="default"
            onClick={() => {
              refresh();
            }}
          >
            <IconRefresh />
          </Button>
          <Button
            variant="filled"
            onClick={() => {
              navigate("../channel/new");
            }}
          >
            <IconPlus />
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
              <ChannelSearch grid={grid_name} />
            </Box>
          </Group>
          <Box style={{ width: "100%" }}></Box>
          <Box>
            {!data ||
              (data.length <= 0 && (
                <NoDataFound
                  title={t("no_channel_found", "No Channels Found!.")}
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
                    {data?.map(
                      (element: {
                        id: Key | null | undefined;
                        inactive: string;
                        channel_name:
                          | string
                          | number
                          | boolean
                          | ReactElement<
                              any,
                              string | JSXElementConstructor<any>
                            >
                          | Iterable<ReactNode>
                          | ReactPortal
                          | Iterable<ReactNode>
                          | null
                          | undefined;
                        channel_group_id: unknown;
                        channel_data: any;
                        created_on: any;
                        last_share_created_on: any;
                        last_share_expired_on: any;
                        nb_shared_last_hr: any;
                        nb_responses_last_hr: any;
                        nb_shared_last_24hr: any;
                        nb_responses_last_24hr: any;
                        nb_shared: any;
                        nb_responses: any;
                      }) => {
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
                                className={classesG.titleHref2}
                                onClick={() => {
                                  navigate(`../channel/${element.id}`);
                                }}
                              >
                                <Text
                                  lineClamp={1}
                                  td={
                                    element.inactive == "X"
                                      ? "line-through"
                                      : ""
                                  }
                                >
                                  {element.channel_name}
                                </Text>
                              </Box>
                              <Box>
                                <Group justify="space-between" gap={1}>
                                  <Group
                                    gap={0}
                                    justify="left"
                                    className={`${classesG.cursorAsPointer}`}
                                    onClick={() => {
                                      opengroupurl(
                                        element.channel_group_id,
                                        element.channel_data
                                      );
                                    }}
                                  >
                                    <IconBrands
                                      brand={element.channel_group_id}
                                      size={small ? 18 : medium ? 20 : 22}
                                    />
                                    <IconExternalLink
                                      size={small ? 18 : medium ? 20 : 22}
                                      stroke={2}
                                    />
                                  </Group>
                                  <Box>
                                    <Menu
                                      position="left-start"
                                      offset={0}
                                      withinPortal={true}
                                    >
                                      <Menu.Target>
                                        <ActionIcon size="md" variant="subtle">
                                          <IconDots size={25} />
                                        </ActionIcon>
                                      </Menu.Target>
                                      <Menu.Dropdown>
                                        <Menu.Item
                                          leftSection={
                                            <IconShare size={20} stroke={1.5} />
                                          }
                                          onClick={() => {
                                            navigate(`../share/${element.id}`);
                                          }}
                                        >
                                          {t("share", "Share")}
                                        </Menu.Item>
                                        <Menu.Item
                                          leftSection={
                                            <IconGraph size={20} stroke={1.5} />
                                          }
                                          onClick={() => {
                                            navigate(
                                              `../board/analytic/chnl/${element.id}`
                                            );
                                          }}
                                        >
                                          {t(
                                            "dashboard_chnl_shares_report",
                                            "Channel Shares Report"
                                          )}
                                        </Menu.Item>
                                        {element.channel_group_id ==
                                          "EMAIL" && (
                                          <Menu.Item
                                            leftSection={
                                              <IconGraph
                                                size={20}
                                                stroke={1.5}
                                              />
                                            }
                                            onClick={() => {
                                              navigate(
                                                `../board/emailsStat/chnl/${element.id}`
                                              );
                                            }}
                                          >
                                            {t(
                                              "dashboard_email_shares_status",
                                              "Email Shares Status"
                                            )}
                                          </Menu.Item>
                                        )}

                                        <Menu.Divider />
                                        <Menu.Item
                                          leftSection={
                                            <IconEdit size={20} stroke={1.5} />
                                          }
                                          onClick={() => {
                                            navigate(
                                              `../channel/${element.id}`
                                            );
                                          }}
                                        >
                                          {t("edit_channel", "Edit Channel")}
                                        </Menu.Item>
                                        <Menu.Item
                                          c="teal.4"
                                          leftSection={
                                            <IconPlaylistAdd
                                              size={20}
                                              stroke={1.5}
                                            />
                                          }
                                          onClick={() => {
                                            activate_or_deactivate(
                                              element.id,
                                              "activate"
                                            );
                                          }}
                                        >
                                          {t(
                                            "activate_channel",
                                            "Activate Channel"
                                          )}
                                        </Menu.Item>
                                        <Menu.Item
                                          c="red.5"
                                          leftSection={
                                            <IconAlertCircle
                                              size={20}
                                              stroke={1.5}
                                            />
                                          }
                                          onClick={() => {
                                            activate_or_deactivate(
                                              element.id,
                                              "deactivate"
                                            );
                                          }}
                                        >
                                          {t(
                                            "de_activate_channel",
                                            "Deactivate Channel"
                                          )}
                                        </Menu.Item>
                                      </Menu.Dropdown>
                                    </Menu>
                                  </Box>
                                </Group>
                              </Box>
                            </Group>

                            <Group justify="space-between" mb="md">
                              <Stack gap={2}>
                                <Text fz="sm" style={{ opacity: 0.7 }}>
                                  {" "}
                                  {t("since", "Since")}
                                </Text>
                                <Text fz="sm">
                                  {" "}
                                  {D.utc_to_local(element.created_on)}
                                </Text>
                              </Stack>
                              <Stack gap={2}>
                                <Text fz="sm" style={{ opacity: 0.7 }}>
                                  {t("shared", "Shared")}
                                </Text>
                                <Text fz="sm">
                                  {D.utc_to_distance(
                                    element.last_share_created_on,
                                    t("never", "Never")
                                  )}
                                </Text>
                              </Stack>
                              <Stack gap={2} mr="md">
                                <Text fz="sm" style={{ opacity: 0.7 }}>
                                  {t("share_expire", "Share Expire")}
                                </Text>
                                <Text c="red.5" fz="sm">
                                  {D.utc_to_distance(
                                    element.last_share_expired_on,
                                    t("never", "Never"), t("never", "Never")
                                  )}
                                </Text>
                              </Stack>
                            </Group>

                            <Divider
                              size={1.5}
                              my={2}
                              label={
                                <Text fz={16} style={{ opacity: 0.7 }}>
                                  {t(
                                    "sahred_n_responses",
                                    "Shared And Responses"
                                  )}
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
                                <Text
                                  ta="right"
                                  fz="sm"
                                  style={{ opacity: 0.7 }}
                                >
                                  {t("last_1_hr", "Last hour")}
                                </Text>
                                <Stack
                                  align="flex-end"
                                  justify="flex-start"
                                  gap={0}
                                >
                                  <NumericFormat
                                    decimalScale={0}
                                    readOnly={true}
                                    displayType="text"
                                    value={`${element.nb_shared_last_hr}`}
                                    thousandSeparator={thousandSep()}
                                    decimalSeparator={decimalSep()}
                                  />
                                  <NumericFormat
                                    decimalScale={0}
                                    readOnly={true}
                                    displayType="text"
                                    value={`${element.nb_responses_last_hr}`}
                                    thousandSeparator={thousandSep()}
                                    decimalSeparator={decimalSep()}
                                  />
                                </Stack>
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
                                <Text
                                  ta="right"
                                  fz="sm"
                                  style={{ opacity: 0.7 }}
                                >
                                  {t("last_24_hrs", "Last 24 hours")}
                                </Text>
                                <Stack
                                  align="flex-end"
                                  justify="flex-start"
                                  gap={0}
                                  c="orange.6"
                                >
                                  <NumericFormat
                                    decimalScale={0}
                                    readOnly={true}
                                    displayType="text"
                                    value={`${element.nb_shared_last_24hr}`}
                                    thousandSeparator={thousandSep()}
                                    decimalSeparator={decimalSep()}
                                  />
                                  <NumericFormat
                                    decimalScale={0}
                                    readOnly={true}
                                    displayType="text"
                                    value={`${element.nb_responses_last_24hr}`}
                                    thousandSeparator={thousandSep()}
                                    decimalSeparator={decimalSep()}
                                  />
                                </Stack>
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
                                <Text
                                  ta="right"
                                  fz="sm"
                                  style={{ opacity: 0.7 }}
                                >
                                  {t("total", "Total")}
                                </Text>
                                <Stack
                                  align="flex-end"
                                  justify="flex-start"
                                  gap={0}
                                >
                                  <NumericFormat
                                    decimalScale={0}
                                    readOnly={true}
                                    displayType="text"
                                    value={`${element.nb_shared}`}
                                    thousandSeparator={thousandSep()}
                                    decimalSeparator={decimalSep()}
                                  />
                                  <NumericFormat
                                    decimalScale={0}
                                    readOnly={true}
                                    displayType="text"
                                    value={`${element.nb_responses}`}
                                    thousandSeparator={thousandSep()}
                                    decimalSeparator={decimalSep()}
                                  />
                                </Stack>
                              </Stack>
                            </Group>
                            {/* {element.hashtags && element.hashtags.length > 0 && <ScrollArea.Autosize maw={600} mah={50} mx="auto">
                                                <Group mt="md" p={3}>
                                                    {element.hashtags.map((itm, index) => {
                                                        return (<Paper variant="outline" color="gray" radius="sm" p={5}>
                                                            <Text>{itm}</Text>
                                                        </Paper >)
                                                    })
                                                    }

                                                </Group>


                                            </ScrollArea.Autosize>
                                            } */}
                          </CardIn>
                        );
                      }
                    )}
                  </SimpleGrid>
                )}
                {listDir != "grid_view" && (
                  <ChannelsList
                    data={data}
                    opengroupurl={opengroupurl}
                    activate_or_deactivate={activate_or_deactivate}
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
export const AddEditChannel = () => {
  return <AddEditChannelMain fromPopup={false} onSaved={null} />;
};
export const AddEditChannelMain = ({ fromPopup, onSaved }: any) => {
  let { id: id0 } = useParams();
  const os = useOs();
  const { error, succeed, warning } = useMessage();
  const { t } = useTranslation("private", { keyPrefix: "channels" });
  const { classes: classesG } = useGlobalStyl();
  const dispatch = useDispatch();
  const [id, setId] = useState<any>(null);
  useEffect(() => {}, []);
  // const title = id == 'new' ? t('channel_title_new_channel', 'New Channel') : t('channel_title_channel', 'Channel')
  const [cancelEdit, setCancelEdit] = useState(1);
  const [owner_, setOwner_] = useState(false);
  const [public_, setPublic_] = useState(false);
  const [edit, setEdit] = useState<boolean>(false);

  useEffect(() => {
    if(fromPopup) return
    dispatch(changeActive("channels"));
  }, []);
  const navigate = useNavigate();
  // const buttonSaveTitle = id == 'new' ? t('add', 'Add') : t('save', 'Save')
  // const buttonCancelTitle = id == 'new' ? t('cancel', 'Cancel') : t('back', 'Back')
  // const theme_2 = useMantineTheme();
  const [urlGroup, setUrlGroup] = useState("");

  const form = useForm({
    initialValues: {
      channel_group_id: "",
      channel_name: "",
      channel_data: "",
      owner_: "",
      public_: "",
      ownership_verified: "",
      hashtags: [],
      invalid_emails: "",
      channel_note: "",
    },

    // functions will be used to validate values at corresponding key

    validate: {
      channel_group_id: (value) =>
        value.length < 1
          ? t("channel_group_cannot_be_blank", "Channel group cannot be blank")
          : null,
      channel_name: (value) =>
        value.length < 1
          ? t("channel_name_cannot_be_blank", "Channel name cannot be blank")
          : null,
      channel_data: (value) =>
        value.length < 1
          ? t("channel_data_cannot_be_blank", "Channel data cannot be blank")
          : null,
    },
  });

  const {
    data: dataGet,
    errorMessage: errorMessagelGet,
    succeeded: succeededGet,
    isLoading: isLoadingGet,
    executeGet: executeGet,
  } = useAxiosGet(BUILD_API("channels"), null);
  const {
    data: dataChannelsGroups,
    errorMessage: errorMessageChannelsGroups,
    executeGet: executeGetChannelsGroups,
  } = useAxiosGet(BUILD_API("channels_groups"), { to_edit: "X" });
  let {
    data: dataPost,
    isLoading: isLoadingPost,
    succeeded: succeededPost,
    errorMessage: errorMessagePost,
    executePost,
  } = useAxiosPost(BUILD_API("channels"), form.values);
  let {
    data: dataPut,
    isLoading: isLoadingPut,
    succeeded: succeededPut,
    errorMessage: errorMessagePut,
    executePut,
  } = useAxiosPut(BUILD_API("channels"), form.values);
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const isPhone = () => {
    return os == "ios" || os == "android";
  };
  const Info = (itm: string) => {
    let dataa = dataGet && dataGet.length > 0 ? dataGet[0] : {};
    return dataa[itm];
  };
  useEffect(() => {
    if (!id0) setId("new");
    else setId(id0);

    if (id0 && id0 != "new")
      executeGet({ url_e: BUILD_API("channels") + "/" + id0 });
    else setEdit(true);
    executeGetChannelsGroups();
  }, []);
  useEffect(() => {
    let errorMsg = errorMessagelGet || errorMessageChannelsGroups;
    if (errorMsg) error(errorMsg);

    if (succeededGet && dataGet) {
      try {
        let datum = dataGet && dataGet.length > 0 ? dataGet[0] : {};
        form.setValues(datum);
        setOwner_(() => {
          return datum["owner_"] == "X";
        });
        setPublic_(() => {
          return datum["public_"] == "X";
        });
        form.resetDirty();
      } catch (error) {}
    }
  }, [errorMessagelGet, errorMessageChannelsGroups, succeededGet]);
  const buildUrlGroup = () => {
    let url = form.values.channel_data;
    if (form.values.channel_group_id == "WATS_APP") {
      if (!isPhone()) {
        url = "https://web.whatsapp.com";
      } else url = "whatsapp://";
    }
    setUrlGroup(url);
  };
  useEffect(() => {
    buildUrlGroup();
  }, [form.values.channel_group_id, form.values.channel_data]);
  useEffect(() => {
    let errorMsg = errorMessagePost || errorMessagePut;

    if (succeededPost || succeededPut) {
      let succeededMsg = dataPost?.message || dataPut?.message;
      succeed(succeededMsg);

      if (onSaved) {
        onSaved(succeededMsg);
      }
      if (succeededPost && !fromPopup)
        navigate("../channels", { replace: true });
      form.resetDirty();
      setEdit(false);
    }

    if (errorMsg) error(errorMsg);
  }, [errorMessagePost, succeededPost, errorMessagePut, succeededPut]);
  // useEffect(() => {
  //     let errorMsg = errorMessageHashGet
  //     if (errorMsg)
  //         error(errorMsg)
  //     if (succeededHashGet && hashGet) {
  //         setData(() => {
  //             if (hashGet) {
  //                 let hashtags = form.values.hashtags
  //                 if (hashtags && hashtags.length > 0) {
  //                     hashtags?.map((item) => {
  //                         let found = false
  //                         hashGet?.map((itemS) => {
  //                             if (item == itemS) {
  //                                 found = true;
  //                                 return;
  //                             }
  //                         })
  //                         if (!found) {
  //                             hashGet.push(item)
  //                         }
  //                     })
  //                 }
  //                 return hashGet
  //             }

  //             return []
  //         })
  //     }
  // }, [errorMessageHashGet, succeededHashGet])

  const save = () => {
    if (!form.isDirty()) {
      warning(t("no_change", "No data got changed!."));
      return;
    }
    form.validate();
    if (!form.isValid()) return;
    if (id == "new") executePost();
    else executePut(BUILD_API("channels") + "/" + id);
  };

  let blocker = useBlocker(
    ({ currentLocation, nextLocation }: any) =>
      !!form.isDirty() && currentLocation.pathname !== nextLocation.pathname
  );
  return (
    <>
      {!fromPopup && (
        <AppHeader
          title={t("channels", "Channels")}
          titleClicked={() => {
            navigate("../channels", { replace: true });
          }}
        >
          <EditSave
            setEditCompletedFromPrarent={succeededPost || succeededPut}
            initEdit={!id0 || id0 == "new"}
            onSave={() => {
              save();
            }}
            onEdit={(e: boolean | ((prevState: boolean) => boolean)) => {
              setEdit(e);
            }}
          />
        </AppHeader>
      )}
      <ConfirmUnsaved blocker={blocker} />
      <Box
        className={classesG.editMax800}
        opacity={blocker.state === "blocked" ? 0.1 : 1}
        style={{
          pointerEvents: blocker.state === "blocked" ? "none" : "inherit",
        }}
      >
        <LoadingOverlay
          visible={isLoadingGet || isLoadingPost || isLoadingPut}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <form>
          <Grid gutter={small ? 7 : medium ? 10 : 15} m={0}>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <ChannelGroups
                searchable
                withAsterisk
                readOnly={!edit}
                dataChannelsGroups={dataChannelsGroups}
                {...form.getInputProps("channel_group_id")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12 }}>
              <TextInput
                withAsterisk
                autoComplete="off"
                readOnly={!edit}
                label={t("channel_name", "Name")}
                placeholder={t("channel_name", "Name")}
                {...form.getInputProps("channel_name")}
              />
            </Grid.Col>
            {form.values.channel_group_id != "EMAIL" && (
              <>
                <Grid.Col span={{ base: 12 }}>
                  <TextInput
                    withAsterisk
                    autoComplete="off"
                    readOnly={!edit}
                    label={t("channel_data", "Url")}
                    placeholder={t("channel_data", "Url")}
                    {...form.getInputProps("channel_data")}
                  />
                </Grid.Col>

                {/* <Grid.Col sm={12} md={6}>
                                    <Text className={classesG.textAsLabel}>{t('owner', 'Owner?')}</Text>
                                    <Card className={classesG.border}>
                                        <Group justify="space-between" style={{ maxWidth: "500px" }}>
                                            <Switch disabled={!edit}
                                                checked={owner_}
                                                onChange={(event) => {
                                                    setOwner_(event.currentTarget.checked);
                                                    let val = event.currentTarget.checked === true ? 'X' : '';
                                                    form.setValues({ owner_: val })
                                                    form.setTouched(form.getInputProps('owner_'))
                                                    form.setDirty(form.getInputProps('owner_'))
                                                }
                                                }
                                                label={t('yes', 'Yes')}
                                            />
                                        </Group>
                                        <Text mt={0} size="sm">{t('do_u_own_the_chnl', 'Do you own the channel?')}</Text>
                                        {owner_ && <>
                                             {form.values.ownership_verified == '' && <Alert color="red" leftSection={<IconExclamationMark size="1rem" />} variant="outline" maw={rem(130)}><Box c="red">{t('NOT_VERIFIED', 'Not Verified')}</Box> </Alert>}
                                            {form.values.ownership_verified == 'X' && <Alert color="teal.9" leftSection={<IconCheck size="1rem" />} variant="outline" maw={rem(130)}> <Box c="teal.9">{t('VERIFIED', 'Verified')}</Box></Alert>}
                                             
                                        </>
                                        }
                                    </Card>
                                </Grid.Col> */}
                {/* <Grid.Col sm={12} md={6} opacity={owner_ ? 1 : 0.5}>
                                    <Text className={classesG.textAsLabel}>{t('public', 'Public?')}</Text>
                                    <Card className={classesG.border}>
                                        <Group justify="space-between" style={{ maxWidth: "500px" }}>
                                            <Switch disabled={!edit || !owner_}
                                                checked={public_}
                                                onChange={(event) => {
                                                    setPublic_(event.currentTarget.checked);
                                                    let val = event.currentTarget.checked === true ? 'X' : '';
                                                    form.setValues({ public_: val })
                                                    form.setTouched(form.getInputProps('public_'))
                                                    form.setDirty(form.getInputProps('public_'))
                                                }
                                                }
                                                label={t('yes', 'Yes')}
                                            />
                                        </Group>
                                        <Text mt={0} size="sm">{t('make_channel_public', 'Make the channel public to users?')}</Text>
                                        <Text c="orange.9" mt={0} size="sm">{t('once_owner_ship_verif_it_be_visibl', 'Once your ownership is verified, your channel will be visible to users.')}</Text>
                                    </Card>
                                </Grid.Col> */}
                {/* <Grid.Col span={{base:12}}>
                                    <MultiSelect
                                        
                                        readOnly={!edit}
                                        {...form.getInputProps('hashtags')}
                                        onKeyDown={(event) => {
                                            if (event.code === 'Space') {
                                                event.preventDefault();
                                            }
                                        }}

                                        data={data ? data : []}
                                        label="Hashtag#"
                                        placeholder="#"
                                        searchable
                                        searchValue={searchValue}
                                        onSearchChange={(event) => {
                                            executeHashGet()
                                            return onSearchChange(event)
                                        }}
                                        
                                        clearable={edit}
                                        creatable={edit}
                                        maxDropdownHeight={250}
                                        valueComponent={HashValue}
                                        itemComponent={HashItem}
                                        limit={20}
                                        getCreateLabel={(query) => `+ Create ${query}`}
                                        onCreate={(query) => {
                                            const item = { value: query, label: query };
                                            setData((current) => [...current, item]);
                                            return item;
                                        }}
                                    />
                                </Grid.Col> */}
                <Grid.Col span={{ base: 12 }}>
                  <Textarea
                    autoComplete="off"
                    readOnly={!edit}
                    label={t("channel_note", "Note")}
                    placeholder={t("channel_note", "Note")}
                    {...form.getInputProps("channel_note")}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12 }}>
                  <Group justify="space-between">
                    <a href={urlGroup} target={form.values.channel_group_id}>
                      {urlGroup}
                    </a>
                    {/* <a href={urlGroup} target={form.values.channel_group_id}>
                                            <IconExternalLink size={small ? 18 : medium ? 20 : 22} />
                                        </a> */}
                  </Group>
                  {/* <TextInput variant="filled" leftSection={<IconBrands brand={form.values.channel_group_id} size={small ? 18 : medium ? 20 : 22} />} value={urlGroup} readOnly={true} autoComplete="off" label={t('channel_data', 'Channel URL')} placeholder={t('channel_data', 'Channel URL')}

                                        rightSection={<a href={urlGroup} target={form.values.channel_group_id}>
                                            <IconExternalLink size={small ? 18 : medium ? 20 : 22} />
                                        </a>}
                                    /> */}
                </Grid.Col>
                {form.values.channel_group_id == "WATS_APP" && (
                  <Grid.Col span={{ base: 12 }}>
                    <Text size="xs">
                      {t(
                        "if_whats_app_change_open",
                        "You can change how to open the whatsapp(https://web.whatsapp.com/ or the app itself) from the settings!."
                      )}
                    </Text>
                  </Grid.Col>
                )}
              </>
            )}
            {form.values.channel_group_id == "EMAIL" && (
              <>
                <Grid.Col span={{ base: 12 }}>
                  <Textarea
                    style={{ fontSize: "10px" }}
                    autosize={true}
                    minRows={4}
                    maxRows={4}
                    withAsterisk
                    autoComplete="off"
                    readOnly={!edit}
                    description="Up to 20 E-mails Separated by comma; like abc@sample.com;def@example.com"
                    label={t("channel_email", "E-mails")}
                    placeholder={t(
                      "channel_email_place",
                      "e.g abc@sample.com;def@example.com"
                    )}
                    {...form.getInputProps("channel_data")}
                  />
                </Grid.Col>
                {id != "new" && (
                  <>
                    <Grid.Col span={{ base: 12 }}>
                      <Textarea
                        style={{ fontSize: 10 }}
                        autosize={true}
                        minRows={4}
                        maxRows={4}
                        readOnly={true}
                        autoComplete="off"
                        label={t("emails_to_validate", "E-mails To Validate")}
                        placeholder={t(
                          "emails_to_validate",
                          "E-mails To Validate"
                        )}
                        {...form.getInputProps("to_valid_emails")}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12 }}>
                      <Textarea
                        style={{ fontSize: 10 }}
                        autosize={true}
                        minRows={4}
                        maxRows={4}
                        readOnly={true}
                        autoComplete="off"
                        label={t("invalid_emails", "Invalid E-mails")}
                        placeholder={t("invalid_emails", "Invalid E-mails")}
                        {...form.getInputProps("invalid_emails")}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12 }}>
                      <Textarea
                        autoComplete="off"
                        readOnly={!edit}
                        label={t("channel_note", "Note")}
                        placeholder={t("channel_note", "Note")}
                        {...form.getInputProps("channel_note")}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12 }}>
                      <Group mt="md">
                        <Alert
                          p={10}
                          radius="md"
                          variant="outline"
                          icon={<IconCalendarTime size={18} stroke={1.5} />}
                          color="gray"
                        >
                          {t("since", "Since")}{" "}
                          {D.utc_to_local(Info("created_on"))}
                        </Alert>
                        <Alert
                          p={10}
                          radius="md"
                          variant="outline"
                          icon={<IconCircleCheck size={18} stroke={1.5} />}
                          color="teal"
                        >
                          {Info("valid_count")}{" "}
                          {t("total_valid_emails", "Valid Emails")}
                        </Alert>
                        <Alert
                          p={10}
                          radius="md"
                          variant="outline"
                          icon={<IconCircleCheck size={18} stroke={1.5} />}
                          color="yellow"
                        >
                          {Info("to_valid_count")}{" "}
                          {t("total_emails_to_validate", "Emails To Validate")}
                        </Alert>
                        <Alert
                          p={10}
                          radius="md"
                          variant="outline"
                          icon={<IconCircleCheck size={18} stroke={1.5} />}
                          color="red"
                        >
                          {Info("invalid_count")}{" "}
                          {t("total_invalid_emails", "Invalid Emails")}
                        </Alert>
                      </Group>
                    </Grid.Col>
                  </>
                )}
              </>
            )}
            {fromPopup && (
              <Grid.Col span={{ base: 12 }}>
                <Group justify="right">
                  <Button
                    onClick={() => {
                      save();
                    }}
                  >
                    {t("save", "Save")}
                  </Button>
                </Group>
              </Grid.Col>
            )}
          </Grid>
        </form>
      </Box>

      {fromPopup && <></>}
    </>
  );
};

export const ChannelSearch = (props) => {
  let { lastXDays, lastXHours } = useDateValues({
    fill: DATETIMEVALUES_FILL.ALL,
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation("private", { keyPrefix: "channels" });
  const navigate = useNavigate();
  const { data: dataChannelsGroups, executeGet: executeGetChannelsGroups } =
    useAxiosGet(BUILD_API("channels_groups"), null);

  const form = useForm({
    initialValues: {
      active: G.ifNull(searchParams.get("active"), "yes"),
      decision_initiated: G.ifNull(searchParams.get("decision_initiated"), ""),
      verified: G.ifNull(searchParams.get("verified"), ""),
      channel_group_id: G.ifNull(searchParams.get("channel_group_id"), ""),
      channel_name: G.ifNull(searchParams.get("channel_name"), ""),
      channel_data: G.ifNull(searchParams.get("channel_data"), ""),
      searchterm: G.ifNull(searchParams.get("searchterm"), ""),
      fromD: G.ifNull(searchParams.get("fromD"), ""),
      toD: G.ifNull(searchParams.get("toD"), ""),
      period_hours: G.ifNull(searchParams.get("period_hours"), ""),
      period_days: G.ifNull(searchParams.get("period_days"), ""),
    },
  });
  useEffect(() => {
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
        listDirs={
          props && props.hideGridView
            ? []
            : [
                // { id: 'full', name: t('full', 'Full List') },
                // { id: 'comp1', name: t('copressed', 'listDir') },
                // { id: 'comp2', name: t('copressed_more', 'listDir More') },
                { id: "grid_view", name: t("grid_view", "Grid View") },
                { id: "list_view", name: t("list_view", "List View") },
              ]
        }
        sortBy={[
          {
            id: "channel_name",
            name: t("channel_name", "Name"),
          },
          {
            id: "created_on",
            name: t("channel_age", "Channel Age"),
            asc: t("old_to_new", "Old To New"),
            desc: t("new_to_old", "New To Old"),
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
      >
        <Grid gutter={15}>
          <Grid.Col>
            <ChannelGroups
              dataChannelsGroups={dataChannelsGroups}
              {...form.getInputProps("channel_group_id")}
            />
          </Grid.Col>
          <Grid.Col>
            <Group justify="space-between" gap={4}>
              <Box maw={"calc(50% - 4px)"}>
                <HoursRangeSelect
                {...form.getInputProps("period_hours")}
                  data={lastXHours}
                  
                  zIndex={501}
                  label={t("created_last_hours", "Created last(hours)")}
                  placeholder={t(
                    "created_last_hours",
                    "Created in the last hours"
                  )}
                />
              </Box>
              <Box maw={"calc(50% - 4px)"}>
                <HoursRangeSelect
                {...form.getInputProps("period_days")}
                  data={lastXDays}
                  
                  label={t("created_days", "Created(days)")}
                  placeholder={t(
                    "created_last_days",
                    "Created in the last days"
                  )}
                />
              </Box>
            </Group>
          </Grid.Col>
          <Grid.Col>
            <DateRange
              fromD="fromD"
              toD="toD"
              form={form}
              label={t("creation_date_range", "Creation dates range")}
              placeholder={t("creation_date_range", "Creation dates range")}
            />
          </Grid.Col>
          <Grid.Col>
            <ActiveSelect {...form.getInputProps("active")} />
          </Grid.Col>

          {/* <Grid.Col>
                        <Group justify="space-between" grow>
                            <OwnershipClaimedSelect {...form.getInputProps('owner_')} />
                            <ClaimVisibilitySelect {...form.getInputProps('public_')} />
                        </Group>

                    </Grid.Col> 
                    <Grid.Col>
                        <Group justify="space-between" grow>
                            
                            <DecisionInitSelect {...form.getInputProps('decision_initiated')} />
                            <VerifiedSelect {...form.getInputProps('verified')} />
                        </Group>
                        
                    </Grid.Col> */}

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

export const VerifiedSelect = ({ ...others }) => {
  const { t } = useTranslation("private", { keyPrefix: "channels" });
  let data = [
    {
      value: "no",
      label: t("no", "No"),
    },
    {
      value: "yes",
      label: t("yes", "Yes"),
    },
    {
      value: "both",
      label: t("both", "Both"),
    },
  ];
  return (
    <AppSelect
      searchable
      clearable
      {...others}
      label={t("channel_owner_verified", "Owenership Verified?")}
      placeholder={t("channel_owner_verified", "Owenership Verified?")}
      maxDropdownHeight={300}
      data={data}
    />
  );
};
export const DecisionInitSelect = ({ ...others }) => {
  const { t } = useTranslation("private", { keyPrefix: "channels" });
  let data = [
    {
      value: "no",
      label: t("no", "No"),
    },
    {
      value: "yes",
      label: t("yes", "Yes"),
    },
    {
      value: "both",
      label: t("both", "Both"),
    },
  ];
  return (
    <AppSelect
      searchable
      clearable
      {...others}
      label={t("decision_initated", "Ownshp Decision Initiated?")}
      placeholder={t("decision_iniitated", "Owenership Decision Initiated?")}
      maxDropdownHeight={300}
      data={data}
    />
  );
};
export const OwnershipClaimedSelect = ({ ...others }) => {
  const { t } = useTranslation("private", { keyPrefix: "channels" });
  let data = [
    {
      value: "no",
      label: t("no", "No"),
    },
    {
      value: "yes",
      label: t("yes", "Yes"),
    },
    {
      value: "both",
      label: t("both", "Both"),
    },
  ];
  return (
    <AppSelect
      searchable
      clearable
      {...others}
      label={t("channel_owner_claimed", "Owenership Claimed?")}
      placeholder={t("channel_owner_claimed", "Owenership Claimed?")}
      maxDropdownHeight={300}
      data={data}
    />
  );
};
export const ClaimVisibilitySelect = ({ ...others }) => {
  const { t } = useTranslation("private", { keyPrefix: "channels" });
  let data = [
    {
      value: "no",
      label: t("no", "No"),
    },
    {
      value: "yes",
      label: t("yes", "Yes"),
    },
    {
      value: "both",
      label: t("both", "Both"),
    },
  ];
  return (
    <AppSelect
      searchable
      clearable
      {...others}
      label={t("public_to_users", "Public To Users?")}
      placeholder={t("public_to_users", "Public To Users?")}
      maxDropdownHeight={300}
      data={data}
    />
  );
};
const ChannelsList = ({
  data,
  opengroupurl,
  activate_or_deactivate,
  t,
}: any) => {
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const { classes: classesG } = useGlobalStyl();
  const navigate = useNavigate();
  const [selection] = useState(["1"]);

  const rows = data?.map((item: any) => {
    const selected = selection.includes(item.id);
    // classN a m e={cx({ [classesG.rowSelected]: selected  })}
    return (
      <Table.Tr key={item.id} className={selected ? classesG.rowSelected : ""}>
        <Table.Td>
          <Box
            className={`${classesG.cursorAsPointer}`}
            onClick={() => {
              opengroupurl(item.channel_group_id, item.channel_data);
            }}
          >
            <IconBrands
              brand={item.channel_group_id}
              size={small ? 18 : medium ? 20 : 22}
            />
            <IconExternalLink size={small ? 18 : medium ? 20 : 22} />
          </Box>
        </Table.Td>
        <Table.Td>
          <Box
            className={classesG.titleHref2}
            onClick={() => {
              navigate(`../channel/${item.id}`);
            }}
          >
            <Text
              style={{
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
              td={item.inactive == "X" ? "line-through" : ""}
            >
              {item.channel_name}
            </Text>
          </Box>
        </Table.Td>
        <Table.Td>
          <Text style={{ fontSize: "0.8rem", color: "gray" }}>
            {D.utc_to_local(item.created_on)}
          </Text>
        </Table.Td>

        <Table.Td>
          <Text>
            {D.utc_to_distance(item.last_share_created_on, t("never", "Never"))}
          </Text>
        </Table.Td>
        <Table.Td>
          <Text c="red.5">
            {D.utc_to_distance(item.last_share_expired_on, t("never", "Never"), t("never", "Never"))}
          </Text>
        </Table.Td>

        <Table.Td className={classesG.tableBk1} style={{ textAlign: "right" }}>
          <Box fw="bold" m={0} p={0}>
            <NumericFormat
              decimalScale={0}
              readOnly={true}
              displayType="text"
              value={`${item.nb_shared_last_hr}`}
              thousandSeparator={thousandSep()}
              decimalSeparator={decimalSep()}
            />
          </Box>
        </Table.Td>
        <Table.Td className={classesG.tableBk1} style={{ textAlign: "right" }}>
          <Box fw="bold" m={0} p={0}>
            <NumericFormat
              decimalScale={0}
              readOnly={true}
              displayType="text"
              value={`${item.nb_responses_last_hr}`}
              thousandSeparator={thousandSep()}
              decimalSeparator={decimalSep()}
            />
          </Box>
        </Table.Td>
        <Table.Td style={{ textAlign: "right" }}>
          <Box fw="bold" m={0} p={0} c="orange.6">
            <NumericFormat
              decimalScale={0}
              readOnly={true}
              displayType="text"
              value={`${item.nb_shared_last_24hr}`}
              thousandSeparator={thousandSep()}
              decimalSeparator={decimalSep()}
            />
          </Box>
        </Table.Td>
        <Table.Td style={{ textAlign: "right" }}>
          <Box fw="bold" m={0} p={0} c="orange.6">
            <NumericFormat
              decimalScale={0}
              readOnly={true}
              displayType="text"
              value={`${item.nb_responses_last_24hr}`}
              thousandSeparator={thousandSep()}
              decimalSeparator={decimalSep()}
            />
          </Box>
        </Table.Td>
        <Table.Td className={classesG.tableBk1} style={{ textAlign: "right" }}>
          <Box fw="bold" m={0} p={0}>
            <NumericFormat
              decimalScale={0}
              readOnly={true}
              displayType="text"
              value={`${item.nb_shared}`}
              thousandSeparator={thousandSep()}
              decimalSeparator={decimalSep()}
            />
          </Box>
        </Table.Td>
        <Table.Td className={classesG.tableBk1} style={{ textAlign: "right" }}>
          <Box fw="bold" m={0} p={0}>
            <NumericFormat
              decimalScale={0}
              readOnly={true}
              displayType="text"
              value={`${item.nb_responses}`}
              thousandSeparator={thousandSep()}
              decimalSeparator={decimalSep()}
            />
          </Box>
        </Table.Td>
        <Table.Td>
          <Group justify="right" gap={2}>
            <PopShareStatInfo data={item}>
              <ActionIcon variant="transparent">
                <IconFileAnalytics size={25} />
              </ActionIcon>
            </PopShareStatInfo>

            <Menu position="left-start" offset={0} withinPortal={true}>
              <Menu.Target>
                <ActionIcon size="md" variant="subtle">
                  <IconDots size={25} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconShare size={20} stroke={1.5} />}
                  onClick={() => {
                    navigate(`../share/${item.id}`);
                  }}
                >
                  {t("share", "Share")}
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconGraph size={20} stroke={1.5} />}
                  onClick={() => {
                    navigate(`../board/analytic/chnl/${item.id}`);
                  }}
                >
                  {t("dashboard_chnl_shares_report", "Channel Shares Report")}
                </Menu.Item>
                {item.channel_group_id == "EMAIL" && (
                  <Menu.Item
                    leftSection={<IconMail size={20} stroke={1.5} />}
                    onClick={() => {
                      navigate(`../board/emailsStat/chnl/${item.id}`);
                    }}
                  >
                    {t("dashboard_email_shares_status", "Email Shares Status")}
                  </Menu.Item>
                )}

                <Menu.Divider />
                <Menu.Item
                  leftSection={<IconEdit size={20} stroke={1.5} />}
                  onClick={() => {
                    navigate(`../channel/${item.id}`);
                  }}
                >
                  {t("edit_channel", "Edit Channel")}
                </Menu.Item>
                <Menu.Item
                  c="teal.4"
                  leftSection={<IconPlaylistAdd size={20} stroke={1.5} />}
                  onClick={() => {
                    activate_or_deactivate(item.id, "activate");
                  }}
                >
                  {t("activate_channel", "Activate Channel")}
                </Menu.Item>
                <Menu.Item
                  c="red.5"
                  leftSection={<IconAlertCircle size={20} stroke={1.5} />}
                  onClick={() => {
                    activate_or_deactivate(item.id, "deactivate");
                  }}
                >
                  {t("de_activate_channel", "Deactivate Channel")}
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    // <ScrollArea mt="lg">
    <Table
      verticalSpacing="xs"
      highlightOnHover
      className={`${"TableCss"} ${"TableCss-Channels"}  ${classesG.table}`}
      mt="lg"
    >
      <Table.Thead>
        <Table.Tr>
          <Table.Th>{t("group", "Group")}</Table.Th>
          <Table.Th>{t("name", "Name")}</Table.Th>
          <Table.Th>{t("since", "Since")}</Table.Th>

          <Table.Th>{t("shared", "Shared")}</Table.Th>
          <Table.Th>{t("expire", "Expire")}</Table.Th>

          <Table.Th
            className={`${classesG.tableBk1} ${classesG.help}`}
            colSpan={2}
            style={{ textAlign: "center" }}
          >
            <Tooltip
              label={t("total_shared_1_hr", "Total shared in the last hour")}
            >
              <Text m={0} p={0}>
                1hr
              </Text>
            </Tooltip>
          </Table.Th>
          <Table.Th
            className={`${classesG.help}`}
            colSpan={2}
            style={{ textAlign: "center" }}
          >
            <Tooltip
              label={t(
                "total_shared_24_hrs",
                "Total shared in the last 24 hours"
              )}
            >
              <Text m={0} p={0} c="orange.6">
                24hr
              </Text>
            </Tooltip>
          </Table.Th>
          <Table.Th
            className={`${classesG.tableBk1} ${classesG.help}`}
            colSpan={2}
            style={{ textAlign: "center" }}
          >
            <Tooltip label={t("total_shared", "Total shared")}>
              <Box>
                <IconInfinity />
              </Box>
            </Tooltip>
          </Table.Th>
          <Table.Th></Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
    // </ScrollArea >
  );
};
