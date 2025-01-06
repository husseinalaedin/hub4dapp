import {
  ActionIcon,
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
  NavLink,
  Card,
  Stack,
  Indicator,
  Tooltip,
  SimpleGrid,
  Divider,
  Switch,
  Chip,
  rem,
  MultiSelect,
  type SelectProps,
  type ComboboxItem,
  type ComboboxLikeRenderOptionInput,
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
} from "@tabler/icons-react";
import { forwardRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  createSearchParams,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";

import { useOs } from "@mantine/hooks";
import { NumericFormat } from "react-number-format";

import {
  Table,
  Checkbox,
  ScrollArea,
  Avatar,
} from "@mantine/core";
import {
  selectLarge,
  selectMedium,
  selectSmall,
  selectxLarge,
  selectxLarger,
} from "../../../store/features/ScreenStatus";
import { BUILD_API, BUILD_URL, G, useMessage } from "../../../global/G";
import { useAxiosGet, useAxiosPost, useAxiosPut } from "../../../hooks/Https";
import { useGlobalStyl } from "../../../hooks/useTheme";
import { changeActive } from "../../../store/features/ActiveNav";
import {
  decimalSep,
  GridLayOut,
  opengroupurl,
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
import { PopInfo, PopShareStatInfo } from "../../../global/PopUpDialogs";

import { ChannelSearch } from "../channel/Channels";

export const CoAdminChannels = () => {
  const grid_name = "COADMIN_CHANNELS";
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
  const { data, getError, errorMessage, succeeded, isLoading, executeGet } =
    useAxiosGet(BUILD_API("co-admin/channels"), searchChannles);
  let {
    data: dataPut,
    isLoading: isLoadingPut,
    succeeded: succeededPut,
    errorMessage: errorMessagePut,
    executePut,
  } = useAxiosPut(BUILD_API("/channels"), {});

  let {
    data: dataInitDecis,
    isLoading: isLoadingInitDecis,
    succeeded: succeededInitDecis,
    errorMessage: errorMessageInitDecis,
    executePut: executePutInitDecis,
  } = useAxiosPut(BUILD_API("/channels"), {});

  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const large = useSelector(selectLarge);
  const xlarge = useSelector(selectxLarge);
  const xlarger = useSelector(selectxLarger);
  const { classes: classesG } = useGlobalStyl();

  const [forceOpenLinkInfo, setForceOpenLinkInfo] = useState<any>("");
  const [popUpDataInfo, setPopUpDataInfo] = useState<any>(null);

  useEffect(() => {
    dispatch(changeActive("co-admin"));
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

  // const opengroupurl = (channel_group_id, url) => {
  //     if (channel_group_id == 'WATS_APP') {
  //         if (!isPhone() && openWhatsappAsWeb()) {
  //             url = "https://web.whatsapp.com";
  //         }
  //         else
  //             url = "whatsapp://";
  //     }
  //     window.open(url, channel_group_id);
  // }
  useEffect(() => {
    if (succeededPut) {
      succeed(dataPut?.message);
    }
    if (errorMessagePut) error(errorMessagePut);
  }, [errorMessagePut, succeededPut]);

  const approve_or_disapprove = (id, action) => {
    executePut(BUILD_API("co-admin/channels/") + id + "/" + action);
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
  const gotoco = (co_id) => {
    let tm = new Date().getTime().toString();
    // let params: any = []
    // let v = ['co_id', co_id]
    // params.push(v)

    // params.splice(0, 0, (['t', (new Date()).getTime().toString()]))
    // params.splice(0, 0, ['src', 'company'])
    navigate("../trades?src=company&t=" + tm + "&co_id=" + co_id);
  };
  const init_decision = (id, cell, channel_group_id, channel_data, action) => {
    let url = BUILD_API("co-admin/channels/") + id + "/decision/" + action;
    executePutInitDecis(url);
  };
  const _init_decision = (cell, channel_group_id, channel_data, short_link) => {
    let v = BUILD_URL(short_link);
    let data_verify = channel_data;
    data_verify =
      data_verify +
      `\nIn order to verify your group ownership please add this number.. to your above group.`;
    data_verify =
      data_verify + `\nIf the number exists, please remove it and add it back.`;
    data_verify = data_verify + `\nThen click on this link.`;
    data_verify = data_verify + `\n` + v;

    opengroupurls(channel_group_id, data_verify);
  };
  const opengroupurls = (channel_group_id, data) => {
    if (channel_group_id == "WATS_APP") {
      let url = "";
      if (!isPhone() && openWhatsappAsWeb()) {
        url = "https://wa.me/12396890748?text=" + encodeURIComponent(data);
      } else url = "whatsapp://send?text=" + encodeURIComponent(data);
      window.open(url, channel_group_id);
    }
  };
  useEffect(() => {
    if (succeededInitDecis) {
      _init_decision(
        dataInitDecis.cell,
        dataInitDecis.channel_group_id,
        dataInitDecis.channel_data,
        dataInitDecis.short_link
      );
      // succeed(dataInitDecis?.message)
    }
    if (errorMessageInitDecis) error(errorMessageInitDecis);
  }, [errorMessageInitDecis, succeededInitDecis]);
  const goto_decision = (short_link) => {
    navigate("../../" + short_link);
  };
  return (
    <>
      {(isLoading || isLoadingPut || isLoadingInitDecis) && (
        <Overlay opacity={1} color="#000" zIndex={5} />
      )}
      {(isLoading || isLoadingPut || isLoadingInitDecis) && (
        <LoadingOverlay
          visible={isLoading || isLoadingPut || isLoadingInitDecis}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
      )}

      <AppHeader title={t("channel_title_channel", "Channels")}>
        <Group mt="xs" justify="right" gap="xs">
          <Button
            variant="default"
            onClick={(val) => {
              refresh();
            }}
          >
            <IconRefresh />
          </Button>
          <Button
            variant="filled"
            onClick={(val) => {
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
            <PopInfo data={popUpDataInfo} forceOpen={forceOpenLinkInfo}>
              <></>
            </PopInfo>
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
                        <Card
                          shadow="sm"
                          radius="md"
                          withBorder
                          key={element.id}
                        >
                          <Group justify="apart" mb="sm">
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
                                  element.inactive == "X" ? "line-through" : ""
                                }
                              >
                                {element.channel_name}
                              </Text>
                            </Box>
                            <Box>
                              <Group justify="apart" gap={1}>
                                <Box
                                  className={`${classesG.cursorAsPointer}`}
                                  onClick={() => {
                                    opengroupurl(
                                      isPhone,
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
                                  />
                                </Box>
                                <Box>
                                  <Menu position="left-start" offset={0}>
                                    <Menu.Target>
                                      <ActionIcon size="md" variant="subtle">
                                        <IconDots size={25} />
                                      </ActionIcon>
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                      {element.short_link != "" && (
                                        <Menu.Item
                                          c="teal.4"
                                          leftSection={
                                            <IconCircleCheck
                                              size={20}
                                              stroke={1.5}
                                            />
                                          }
                                          onClick={() => {
                                            goto_decision(element.short_link);
                                          }}
                                        >
                                          {t(
                                            "ownership_decision_timeline",
                                            "Ownership Decision Timeline."
                                          )}
                                        </Menu.Item>
                                      )}
                                      {element.short_link != "" && (
                                        <Menu.Divider />
                                      )}
                                      {element.decision_action == "" && (
                                        <Menu.Item
                                          c="teal.4"
                                          leftSection={
                                            <IconCircleCheck
                                              size={20}
                                              stroke={1.5}
                                            />
                                          }
                                          onClick={() => {
                                            setPopUpDataInfo(() => {
                                              return {
                                                title: element.channel_name,
                                                info:
                                                  element.owner_ == ""
                                                    ? t(
                                                        "owner_not_claimed_the_ownership_msg",
                                                        "User has not claimed the ownership.\nPlease ask the user to claim the ownership and then try again."
                                                      )
                                                    : t(
                                                        "ownership_clready_verified_msg",
                                                        "Ownership Already Approved.\nYou can still revoke the approval of the ownership by going to the decision timeline and make such changes."
                                                      ),
                                              };
                                            });
                                            setForceOpenLinkInfo(() => {
                                              return new Date()
                                                .getTime()
                                                .toString();
                                            });
                                          }}
                                        >
                                          {element.owner_ == ""
                                            ? t(
                                                "owner_not_claimed_the_ownership",
                                                "User Has Not Claimed The Ownership."
                                              )
                                            : element.ownership_verified == "X"
                                            ? t(
                                                "ownership_clready_verified",
                                                "Ownership Already Approved."
                                              )
                                            : t(
                                                "ownership_not_claimed",
                                                "Ownership Not Claimed."
                                              )}
                                        </Menu.Item>
                                      )}
                                      {element.decision_action == "INIT" && (
                                        <Menu.Item
                                          c="teal.4"
                                          leftSection={
                                            <IconCircleCheck
                                              size={20}
                                              stroke={1.5}
                                            />
                                          }
                                          onClick={() => {
                                            init_decision(
                                              element.id,
                                              element.cell,
                                              element.channel_group_id,
                                              element.channel_data,
                                              "init"
                                            );
                                          }}
                                        >
                                          {t(
                                            "init_owner_decision",
                                            "Initiate Ownership Decision."
                                          )}
                                        </Menu.Item>
                                      )}

                                      {element.decision_action ==
                                        "REINIT_RESEND" && (
                                        <>
                                          <Menu.Item
                                            c="teal.4"
                                            leftSection={
                                              <IconCircleCheck
                                                size={20}
                                                stroke={1.5}
                                              />
                                            }
                                            onClick={() => {
                                              init_decision(
                                                element.id,
                                                element.cell,
                                                element.channel_group_id,
                                                element.channel_data,
                                                "resend"
                                              );
                                            }}
                                          >
                                            {t(
                                              "resend_owner_decision",
                                              "Resend Ownership Decision."
                                            )}
                                          </Menu.Item>
                                          <Menu.Item
                                            c="orange.4"
                                            leftSection={
                                              <IconCircleCheck
                                                size={20}
                                                stroke={1.5}
                                              />
                                            }
                                            onClick={() => {
                                              init_decision(
                                                element.id,
                                                element.cell,
                                                element.channel_group_id,
                                                element.channel_data,
                                                "reinit"
                                              );
                                            }}
                                          >
                                            {t(
                                              "reinit_owner_decision",
                                              "Re-initiate Ownership Decision."
                                            )}
                                          </Menu.Item>
                                        </>
                                      )}
                                    </Menu.Dropdown>
                                  </Menu>
                                </Box>
                              </Group>
                            </Box>
                          </Group>

                          <Group justify="apart" mb="md">
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
                                {t("ownership_claimed", "Ownership Claimed?")}
                              </Text>
                              {element.owner_ == "X" && (
                                <Box c="teal.7">{t("yes", "Yes")}</Box>
                              )}
                              {element.owner_ == "" && (
                                <Box c="orange.7">{t("no", "No")}</Box>
                              )}
                            </Stack>
                            <Stack gap={2} mr="md">
                              <Text fz="sm" style={{ opacity: 0.7 }}>
                                {t("ownership", "Ownership?")}
                              </Text>
                              {element.ownership_verified == "" && (
                                <Box c="red.5">
                                  {t("NOT_VERIFIED", "Not Verified")}
                                </Box>
                              )}
                              {element.ownership_verified == "X" && (
                                <Box c="teal.9">
                                  {t("VERIFIED", "Verified")}
                                </Box>
                              )}
                            </Stack>
                          </Group>

                          <Divider
                            size={1.5}
                            my={2}
                            label={
                              <Text fz={16} style={{ opacity: 0.7 }}>
                                {t("created_by", "Created By")}
                              </Text>
                            }
                          />

                          <Group justify="apart">
                            <Box
                              fw="bold"
                              m={0}
                              p={0}
                              onClick={() => {
                                gotoco(element.co_id);
                              }}
                              className={classesG.companyDir}
                            >
                              <Text ta="left">{element.company_name}</Text>
                            </Box>

                            <Box fw="bold" m={0} p={0}>
                              <Text ta="right" fz="md" style={{ opacity: 0.7 }}>
                                {element.first_name} {element.last_name}
                              </Text>
                            </Box>
                          </Group>
                          {element.hashtags && element.hashtags.length > 0 && (
                            <ScrollArea.Autosize maw={600} mah={50} mx="auto">
                              <Group mt="md" p={3}>
                                {element.hashtags.map((itm, index) => {
                                  return (
                                    <Paper
                                      variant="outline"
                                      color="gray"
                                      radius="sm"
                                      p={5}
                                    >
                                      <Text>{itm}</Text>
                                    </Paper>
                                  );
                                })}
                              </Group>
                            </ScrollArea.Autosize>
                          )}
                        </Card>
                      );
                    })}
                  </SimpleGrid>
                )}
                {listDir != "grid_view" && (
                  <CoAdminChannelsList
                    data={data}
                    opengroupurl={opengroupurl}
                    goto_decision={goto_decision}
                    setPopUpDataInfo={setPopUpDataInfo}
                    setForceOpenLinkInfo={setForceOpenLinkInfo}
                    init_decision={init_decision}
                    gotoco={gotoco}
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
  const os = useOs();
  const { error, succeed, warning } = useMessage();
  const { t } = useTranslation("private", { keyPrefix: "channels" });
  const { classes: classesG } = useGlobalStyl();
  const dispatch = useDispatch();

  let { id } = useParams();
  // const title = id == 'new' ? t('channel_title_new_channel', 'New Channel') : t('channel_title_channel', 'Channel')
  const [cancelEdit, setCancelEdit] = useState(1);
  const [owner_, setOwner_] = useState(false);
  const [public_, setPublic_] = useState(false);
  const [edit, setEdit] = useState<boolean>(false);

  useEffect(() => {
    dispatch(changeActive("channels"));
  }, []);
  const navigate = useNavigate();
  const buttonSaveTitle = id == "new" ? t("add", "Add") : t("save", "Save");
  const buttonCancelTitle =
    id == "new" ? t("cancel", "Cancel") : t("back", "Back");
  const theme_2 = useMantineTheme();
  const [urlGroup, setUrlGroup] = useState("");
  const [searchValue, onSearchChange] = useState("");

  const validate_data = (value) => {
    if (form.values.channel_group_id == "EMAIL") {
      let emails = value.split(";");
      for (let i = 0; i < emails.length; i++) {}
      // if (value.split(';').length >= 20)
      //     return t('more_than_20_emails', 'You cannot put more than 20 emails in an Email channel')
    }
    return null;
  };
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
    succeeded: succeededChannelsGroups,
    isLoading: isLoadingChannelsGroups,
    executeGet: executeGetChannelsGroups,
  } = useAxiosGet(BUILD_API("channels_groups"), null);
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
  const {
    data: hashGet,
    errorMessage: errorMessageHashGet,
    succeeded: succeededHashGet,
    executeGet: executeHashGet,
  } = useAxiosGet(BUILD_API("hashtags"), { searchterm: searchValue });
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const isPhone = () => {
    return os == "ios" || os == "android";
  };
  const Info = (itm) => {
    let dataa = dataGet && dataGet.length > 0 ? dataGet[0] : {};
    return dataa[itm];
  };
  useEffect(() => {
    if (id != "new") executeGet({ url_e: BUILD_API("channels") + "/" + id });
    else setEdit(true);
    executeGetChannelsGroups();
  }, []);
  useEffect(() => {
    let errorMsg = errorMessagelGet || errorMessageChannelsGroups;
    if (errorMsg) error(errorMsg);

    if (succeededGet && dataGet) {
      form.setValues(dataGet[0]);
      setOwner_(() => {
        return dataGet[0]["owner_"] == "X";
      });
      setPublic_(() => {
        return dataGet[0]["public_"] == "X";
      });
      setData(() => {
        return dataGet[0].hashtags;
      });
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
      if (succeededPost) navigate("../channels", { replace: true });
      form.resetDirty();
      setEdit(false);
    }

    if (errorMsg) error(errorMsg);
  }, [errorMessagePost, succeededPost, errorMessagePut, succeededPut]);
  useEffect(() => {
    let errorMsg = errorMessageHashGet;
    if (errorMsg) error(errorMsg);
    if (succeededHashGet && hashGet) {
      setData(() => {
        if (hashGet) {
          let hashtags = form.values.hashtags;
          if (hashtags && hashtags.length > 0) {
            hashtags?.map((item) => {
              let found = false;
              hashGet?.map((itemS) => {
                if (item == itemS) {
                  found = true;
                  return;
                }
              });
              if (!found) {
                hashGet.push(item);
              }
            });
          }
          return hashGet;
        }

        return [];
      });
    }
  }, [errorMessageHashGet, succeededHashGet]);

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
  const [data, setData] = useState<any>(() => {
    return [];
  });
  return (
    <>
      <AppHeader
        title={t("channels", "Channels")}
        titleClicked={() => {
          navigate("../channels", { replace: true });
        }}
      >
        <EditSave
          setEditCompletedFromPrarent={succeededPost || succeededPut}
          initEdit={id == "new"}
          onSave={(e) => {
            save();
          }}
          onEdit={(e) => {
            setEdit(e);
          }}
        />
      </AppHeader>

      <Box className={classesG.editMax800}>
        <LoadingOverlay
          visible={isLoadingGet || isLoadingPost || isLoadingPut}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <form>
          <Grid gutter={small ? 7 : medium ? 10 : 15}>
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

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Text className={classesG.textAsLabel}>
                    {t("owner", "Owner?")}
                  </Text>
                  <Card className={classesG.border}>
                    <Group justify="apart" style={{ maxWidth: "500px" }}>
                      <Switch
                        disabled={!edit}
                        checked={owner_}
                        onChange={(event) => {
                          setOwner_(event.currentTarget.checked);
                          let val =
                            event.currentTarget.checked === true ? "X" : "";
                          form.setValues({ owner_: val });
                          form.setTouched({ owner_: true });
                          form.setDirty({ owner_: true });
                        }}
                        label={t("yes", "Yes")}
                      />
                    </Group>
                    <Text mt={0} size="sm">
                      {t("do_u_own_the_chnl", "Do you own the channel?")}
                    </Text>
                    {owner_ && (
                      <>
                        {/* {form.values.ownership_verified == '' && <Button size="sm" onClick={verifyPhone}>{t('VERIFY_PHONE', 'Verify')}</Button>} */}
                        {form.values.ownership_verified == "" && (
                          <Alert
                            color="red"
                            icon={<IconExclamationMark size="1rem" />}
                            variant="outline"
                            maw={rem(130)}
                          >
                            <Box c="red">
                              {t("NOT_VERIFIED", "Not Verified")}
                            </Box>{" "}
                          </Alert>
                        )}
                        {form.values.ownership_verified == "X" && (
                          <Alert
                            color="teal.9"
                            icon={<IconCheck size="1rem" />}
                            variant="outline"
                            maw={rem(130)}
                          >
                            {" "}
                            <Box c="teal.9">{t("VERIFIED", "Verified")}</Box>
                          </Alert>
                        )}
                        {/* {form.values.ownership_verified == 'X' && <Chip size="sm" checked radius="md">{t('VERIFIED', 'Verified')}</Chip>} */}
                      </>
                    )}
                  </Card>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }} opacity={owner_ ? 1 : 0.5}>
                  <Text className={classesG.textAsLabel}>
                    {t("public", "Public?")}
                  </Text>
                  <Card className={classesG.border}>
                    <Group justify="apart" style={{ maxWidth: "500px" }}>
                      <Switch
                        disabled={!edit || !owner_}
                        checked={public_}
                        onChange={(event) => {
                          setPublic_(event.currentTarget.checked);
                          let val =
                            event.currentTarget.checked === true ? "X" : "";
                          form.setValues({ public_: val });
                          form.setTouched({ public_: true });
                          form.setDirty({ public_: true });
                        }}
                        label={t("yes", "Yes")}
                      />
                    </Group>
                    <Text mt={0} size="sm">
                      {t(
                        "make_channel_public",
                        "Make the channel public to users?"
                      )}
                    </Text>
                    <Text c="orange.9" mt={0} size="sm">
                      {t(
                        "once_owner_ship_verif_it_be_visibl",
                        "Once your ownership is verified, your channel will be visible to users."
                      )}
                    </Text>
                  </Card>
                </Grid.Col>
                <Grid.Col span={{ base: 12}}>
                  {/* <MultiSelect
                                        // disabled={!edit}
                                        readOnly={!edit}
                                        {...form.getInputProps('hashtags')}
                                        onKeyDown={(event) => {
                                            if (event.code === 'Space') {
                                                event.preventDefault();
                                            }
                                        }}

                                        data={data ? data : []}//{['React', 'Angular', 'Svelte', 'Vue', 'Riot', 'Next.js', 'Blitz.js']}
                                        label="Hashtag#"
                                        placeholder="#"
                                        searchable
                                        searchValue={searchValue}
                                        onSearchChange={(event) => {
                                            executeHashGet()
                                            return onSearchChange(event)
                                        }}
                                        // nothingFound="Nothing found"
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
                                    /> */}
                </Grid.Col>
                <Grid.Col span={{base:12}}>
                  <Textarea
                    autoComplete="off"
                    readOnly={!edit}
                    label={t("channel_note", "Note")}
                    placeholder={t("channel_note", "Note")}
                    {...form.getInputProps("channel_note")}
                  />
                </Grid.Col>
                <Grid.Col span={{base:12}}>
                  <TextInput
                    leftSection={
                      <IconBrands
                        brand={form.values.channel_group_id}
                        size={small ? 18 : medium ? 20 : 22}
                      />
                    }
                    value={urlGroup}
                    readOnly={true}
                    autoComplete="off"
                    label={t("channel_data", "Channel URL")}
                    placeholder={t("channel_data", "Channel URL")}
                    rightSection={
                      <a href={urlGroup} target={form.values.channel_group_id}>
                        <IconExternalLink
                          size={small ? 18 : medium ? 20 : 22}
                        />
                      </a>
                    }
                  />
                </Grid.Col>
                {form.values.channel_group_id == "WATS_APP" && (
                  <Grid.Col span={{base:12}}>
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
                <Grid.Col span={{base:12}}>
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
                    <Grid.Col span={{base:12}}>
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
                    <Grid.Col span={{base:12}}>
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
                    <Grid.Col span={{base:12}}>
                      <Textarea
                        autoComplete="off"
                        readOnly={!edit}
                        label={t("channel_note", "Note")}
                        placeholder={t("channel_note", "Note")}
                        {...form.getInputProps("channel_note")}
                      />
                    </Grid.Col>
                    <Grid.Col span={{base:12}}>
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
          </Grid>
        </form>
      </Box>
    </>
  );
};

 

const renderSelectChannelOption: SelectProps["renderOption"] = (
  item: ComboboxLikeRenderOptionInput<ComboboxItem>
) => (
  <div>
    <Group>
      <IconBrands brand={item.option.value} size={20} />
      <Text>{item.option.label}</Text>
    </Group>
  </div>
);
export const ChannelGroups = ({ dataChannelsGroups, ...others }) => {
  const { t } = useTranslation("private", { keyPrefix: "channels" });
  return (
    <Select
      // dropdownjustify="bottom"
      renderOption={renderSelectChannelOption}
      searchable
      clearable
      {...others}
      label={t("channel_group", "Group")}
      placeholder={t("channel_group", "Group")}
      maxDropdownHeight={400}
      data={dataChannelsGroups?.map((itm) => {
        return {
          value: itm.channel_group_id,
          label: itm.channel_group,
        };
      })}
    />
  );
};

const CoAdminChannelsList = ({
  data,
  opengroupurl,
  goto_decision,
  setPopUpDataInfo,
  setForceOpenLinkInfo,
  init_decision,
  gotoco,
  t,
}) => {
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const { classes: classesG, cx } = useGlobalStyl();
  const navigate = useNavigate();
  const [selection, setSelection] = useState(["1"]);

  const rows = data?.map((item) => {
    const selected = selection.includes(item.id);
    return (
      <tr key={item.id} className={cx({ [classesG.rowSelected]: selected })}>
        <td>
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
        </td>
        <td>
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
        </td>
        <td>
          <Text style={{ fontSize: "0.8rem", color: "gray" }}>
            {D.utc_to_local(item.created_on)}
          </Text>
        </td>

        <td>
          {item.owner_ == "X" && <Box c="teal.7">{t("yes", "Yes")}</Box>}
          {item.owner_ == "" && <Box c="orange.7">{t("no", "No")}</Box>}
        </td>
        <td>
          {item.ownership_verified == "" && (
            <Box c="red.5">{t("NOT_VERIFIED", "Not Verified")}</Box>
          )}
          {item.ownership_verified == "X" && (
            <Box c="teal.9">{t("VERIFIED", "Verified")}</Box>
          )}
        </td>

        <td className={classesG.tableBk1} style={{ textAlign: "right" }}>
          <Group justify="apart">
            <Box
              fw="bold"
              m={0}
              p={0}
              onClick={() => {
                gotoco(item.co_id);
              }}
              className={classesG.companyDir}
            >
              <Text ta="left">{item.company_name}</Text>
            </Box>

            <Box fw="bold" m={0} p={0}>
              <Text ta="right" fz="md" style={{ opacity: 0.7 }}>
                {item.first_name} {item.last_name}
              </Text>
            </Box>
          </Group>
        </td>

        <td>
          <Group justify="right" gap={2}>
            <Menu position="left-start" offset={0} withinPortal={true}>
              <Menu.Target>
                <ActionIcon size="md" variant="subtle">
                  <IconDots size={25} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                {item.short_link != "" && (
                  <Menu.Item
                    c="teal.4"
                    leftSection={<IconCircleCheck size={20} stroke={1.5} />}
                    onClick={() => {
                      goto_decision(item.short_link);
                    }}
                  >
                    {t(
                      "ownership_decision_timeline",
                      "Ownership Decision Timeline."
                    )}
                  </Menu.Item>
                )}
                {item.short_link != "" && <Menu.Divider />}
                {item.decision_action == "" && (
                  <Menu.Item
                    c="teal.4"
                    leftSection={<IconCircleCheck size={20} stroke={1.5} />}
                    onClick={() => {
                      setPopUpDataInfo(() => {
                        return {
                          title: item.channel_name,
                          info:
                            item.owner_ == ""
                              ? t(
                                  "owner_not_claimed_the_ownership_msg",
                                  "User has not claimed the ownership.\nPlease ask the user to claim the ownership and then try again."
                                )
                              : t(
                                  "ownership_clready_verified_msg",
                                  "Ownership Already Approved.\nYou can still revoke the approval of the ownership by going to the decision timeline and make such changes."
                                ),
                        };
                      });
                      setForceOpenLinkInfo(() => {
                        return new Date().getTime().toString();
                      });
                    }}
                  >
                    {item.owner_ == ""
                      ? t(
                          "owner_not_claimed_the_ownership",
                          "User Has Not Claimed The Ownership."
                        )
                      : item.ownership_verified == "X"
                      ? t(
                          "ownership_clready_verified",
                          "Ownership Already Approved."
                        )
                      : t("ownership_not_claimed", "Ownership Not Claimed.")}
                  </Menu.Item>
                )}
                {item.decision_action == "INIT" && (
                  <Menu.Item
                    c="teal.4"
                    leftSection={<IconCircleCheck size={20} stroke={1.5} />}
                    onClick={() => {
                      init_decision(
                        item.id,
                        item.cell,
                        item.channel_group_id,
                        item.channel_data,
                        "init"
                      );
                    }}
                  >
                    {t("init_owner_decision", "Initiate Ownership Decision.")}
                  </Menu.Item>
                )}

                {item.decision_action == "REINIT_RESEND" && (
                  <>
                    <Menu.Item
                      c="teal.4"
                      leftSection={<IconCircleCheck size={20} stroke={1.5} />}
                      onClick={() => {
                        init_decision(
                          item.id,
                          item.cell,
                          item.channel_group_id,
                          item.channel_data,
                          "resend"
                        );
                      }}
                    >
                      {t("resend_owner_decision", "Resend Ownership Decision.")}
                    </Menu.Item>
                    <Menu.Item
                      c="orange.4"
                      leftSection={<IconCircleCheck size={20} stroke={1.5} />}
                      onClick={() => {
                        init_decision(
                          item.id,
                          item.cell,
                          item.channel_group_id,
                          item.channel_data,
                          "reinit"
                        );
                      }}
                    >
                      {t(
                        "reinit_owner_decision",
                        "Re-initiate Ownership Decision."
                      )}
                    </Menu.Item>
                  </>
                )}
              </Menu.Dropdown>
            </Menu>
          </Group>
        </td>
      </tr>
    );
  });

  return (
    <ScrollArea mt="lg">
      <Table
        verticalSpacing="xs"
        highlightOnHover
        className={`${"TableCss"} ${"TableCss-Channels"}  ${classesG.table}`}
      >
        <thead>
          <tr>
            <th>{t("group", "Group")}</th>
            <th>{t("name", "Name")}</th>
            <th>{t("since", "Since")}</th>

            <th>{t("ownership_claimed", "Ownership Claimed?")}</th>
            <th>{t("ownership", "Ownership?")}</th>

            <th
              className={`${classesG.tableBk1} ${classesG.help}`}
              style={{ textAlign: "center" }}
            >
              {t("created_by", "Created By")}
            </th>

            <th></th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
};
