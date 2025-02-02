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
  Checkbox,
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
  IconCalendar,
  IconRotateClockwise2,
  IconReplaceFilled,
  IconClockEdit,
  IconGripVertical,
  IconSquare,
  IconMessage2Share,
} from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
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
  shareExpirationPeriodList,
  thousandSep,
} from "../../../global/Misc";
import { NoDataFound } from "../../../global/NoDataFound";
import {
  PopShareVisitedStatInfo,
  ShareLinksDialog,
} from "../../../global/PopUpDialogs";
import { SearchPannel } from "../../../global/SearchPannel";
import { ShareOrShareNOpen } from "../../../global/ShareOrShareNOpen";
import { useGlobalStyl } from "../../../hooks/useTheme";
import { useAxiosGet, useAxiosPost, useAxiosPut } from "../../../hooks/Https";
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
  DATETIMEVALUES_FILL,
  DateRange,
  DaysRangeSelect,
  HoursRangeSelect,
  useDateValues,
} from "../../../hooks/useDateRange";
import { DatePickerInput } from "@mantine/dates";
import { closeModal, modals } from "@mantine/modals";
import { IconSquareCheck } from "@tabler/icons-react";
import { selectMenu, useSelection } from "../../../hooks/useSelection";

import { useDbData } from "../../../global/DbData";
import { IconShare } from "@tabler/icons-react";
import { AppSelect } from "../../../global/global-comp/AppSelect";

export const Shares = () => {
  const grid_name = "SHARES";
  const os = useOs();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchChannles, setSearchChannles] = useState<any>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selected, setSelected] = useState<any>([]);
  const { error } = useMessage();
  const { t } = useTranslation("private", { keyPrefix: "shares" });

  const [forceOpenLinkInfo, setForceOpenLinkInfo] = useState<any>("");
  const [popUpObj, setPopUpObj] = useState<any>("");
  const layout = () => {
    if (searchChannles && searchChannles["listdir"])
      return searchChannles["listdir"];
    return GridLayOut(grid_name, "", "GET", "grid_view");
  };
  const [listDir, setListDir] = useState<string>(() => {
    return layout();
  });

  const {
    data,
    setData,
    getError,
    errorMessage,
    succeeded,
    isLoading,
    executeGet,
  } = useAxiosGet(BUILD_API("shares"), searchChannles);
  const {
    data: dataReport,
    getError: getErrorReport,
    errorMessage: errorMessageError,
    succeeded: succeededReport,
    isLoading: isLoadingReport,
    executeGet: executeGetReport,
  } = useAxiosGet(BUILD_API("shares/report"), {});
  const { openToShareExpire } = useShareExpire({ t });
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const large = useSelector(selectLarge);
  const xlarge = useSelector(selectxLarge);
  const xlarger = useSelector(selectxLarger);
  const { classes: classesG } = useGlobalStyl();
  const { select, selectAll, isAnySelected, selectedIds, isAllSelected } =
    useSelection({ data, setData, fieldID: "id" });
  useEffect(() => {
    refresh();
  }, [searchParams]);

  useEffect(() => {
    dispatch(changeActive("shares"));
  }, []);
  const refresh = () => {
    let expired = searchParams.get("expired");
    if (!expired || expired == "") {
      searchParams.set("expired", "no");
    }
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
    setSelected([]);
  }, [succeeded, errorMessage]);
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
  // const updateSelection = (objectId) => {
  //     const newData = [...data];
  //     const updatedObjectIndex = newData.findIndex(obj => obj.id === objectId)
  //     if (updatedObjectIndex !== -1) {
  //         const updatedObject = { ...newData[updatedObjectIndex] };
  //         updatedObject['isSelected'] = !updatedObject['isSelected'];
  //         newData[updatedObjectIndex] = updatedObject;
  //         setData(newData);
  //     }
  // }
  // const selectAll = (isSelected) => {
  //     const newData = [...data];
  //     newData.map((obj) => {
  //         obj['isSelected'] = isSelected
  //     })
  //     setData(newData);
  // }
  // const leftSearchSectionMenu =
  //     (
  //         <Menu shadow="md" width={200}>
  //             <Menu.Target>
  //                 <Button pr="5px" pl="5px" color="dark.4" variant="default" m={0} radius={0} >
  //                     <IconGripVertical size={20} />
  //                 </Button>
  //             </Menu.Target>
  //             <Menu.Dropdown>
  //                 <Menu.Label>{t('share', 'Share')}</Menu.Label>
  //                 <Menu.Item onClick={() => {
  //                     selectAll(true)
  //                 }} leftSection={<IconSquareCheck size={16} />}>{t('select_all', 'Select all')}</Menu.Item>
  //                 <Menu.Item onClick={() => {
  //                     selectAll(false)
  //                 }} leftSection={<IconSquare size={16} />}>{t('unselect_all', 'Unselect all')}</Menu.Item>
  //             </Menu.Dropdown>
  //         </Menu>
  //     )
  return (
    <>
      {(isLoading || isLoadingReport) && (
        <Overlay opacity={1} color="#000" zIndex={5} />
      )}
      {(isLoading || isLoadingReport) && (
        <LoadingOverlay
          visible={isLoading || isLoadingReport}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
      )}

      <AppHeader title={t("channel_title_shares", "Shares")}>
        <Group justify="right" gap="xs">
          {isAnySelected() && (
            <Button
              variant="outline"
              onClick={(val) => {
                openToShareExpire(selectedIds(), null);
              }}
            >
              <IconReplaceFilled stroke={1} />
            </Button>
          )}

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
              <SharesSearch
                grid={grid_name}
                leftSearchSectionMenu={selectMenu({ t, selectAll })}
              />
            </Box>
          </Group>

          <Box>
            {!data ||
              (data.length <= 0 && (
                <NoDataFound
                  title={t("no_shares_found", "No Shares Found!.")}
                />
              ))}
            <ShareLinksDialog element={popUpObj} forceOpen={forceOpenLinkInfo}>
              <></>
            </ShareLinksDialog>
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
                          isSelected={element.isSelected}
                          shadow="sm"
                          radius="md"
                          withBorder
                          pr={5}
                          pb={0}
                          key={element.id}
                          classesG={classesG}
                          style={{ cursor: "pointer" }}
                          onSelected={() => {
                            select(element.id);
                          }}
                        >
                          <Group justify="space-between" mb="sm">
                            <Box
                              style={{
                                overflow: "hidden",
                                maxWidth: "calc(100% - 100px)",
                              }}
                              className={classesG.titleHref2}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                  `../board/analytic/shr/${element.channel_id}`
                                );
                              }}
                            >
                              <Text
                                td={
                                  element.expired == "X" ? "line-through" : ""
                                }
                              >
                                {element.channel_name}
                              </Text>
                            </Box>
                            <Box>
                              <Group justify="space-between" gap={1}>
                                <Box
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
                                  />
                                </Box>
                                <Box>
                                  <Menu
                                    position="left-start"
                                    offset={0}
                                    withinPortal={true}
                                  >
                                    <Menu.Target>
                                      <ActionIcon
                                        onClick={(e) => {
                                          e.stopPropagation();
                                        }}
                                        size="md"
                                        variant="subtle"
                                      >
                                        <IconDots size={25} />
                                      </ActionIcon>
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                      <Menu.Item
                                        leftSection={
                                          <IconRotateClockwise2 size={20} />
                                        }
                                        onClick={() => {
                                          openToShareExpire(
                                            [element.id],
                                            element.expire_period
                                          );
                                        }}
                                      >
                                        <Box>
                                          {t(
                                            "change_expiration_period",
                                            "Change expiration period"
                                          )}
                                        </Box>
                                      </Menu.Item>

                                      <Menu.Item
                                        leftSection={
                                          <>
                                            {element.expired == "" && (
                                              <Box c="teal.5">
                                                <IconLink size={20} />
                                              </Box>
                                            )}
                                            {element.expired == "X" && (
                                              <Box c="red.5">
                                                <IconLinkOff size={20} />
                                              </Box>
                                            )}
                                          </>
                                        }
                                        onClick={() => {
                                          setPopUpObj(element);
                                          setForceOpenLinkInfo(() => {
                                            return new Date()
                                              .getTime()
                                              .toString();
                                          });
                                        }}
                                      >
                                        <Box
                                          c={
                                            element.expired == "X"
                                              ? "red.5"
                                              : "teal.5"
                                          }
                                        >
                                          {t("shared_link", "Shared Link")}
                                        </Box>
                                      </Menu.Item>

                                      <Menu.Divider />
                                      <Menu.Item
                                        leftSection={
                                          <IconGraph size={20} stroke={1.5} />
                                        }
                                        onClick={(e) => {
                                          navigate(
                                            `../board/analytic/shr/${element.channel_id}`
                                          );
                                          e.stopPropagation();
                                        }}
                                      >
                                        {t(
                                          "dashboard_chnl_share_report",
                                          "Channel Share Report"
                                        )}
                                      </Menu.Item>

                                      {element.channel_group_id == "EMAIL" && (
                                        <Menu.Item
                                          leftSection={
                                            <IconMail size={20} stroke={1.5} />
                                          }
                                          onClick={(e) => {
                                            navigate(
                                              `../board/emailsStat/shr/${element.id}`
                                            );
                                            e.stopPropagation();
                                          }}
                                        >
                                          {t(
                                            "dashboard_email_share_status",
                                            "Email Share Status"
                                          )}
                                        </Menu.Item>
                                      )}
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
                                {t("shared", "Shared")}
                              </Text>
                              <Text fz="sm">
                                {" "}
                                {D.utc_to_distance(element.created_on)}
                              </Text>
                            </Stack>

                            <Stack gap={2} mr="md">
                              <Text fz="sm" style={{ opacity: 0.7 }}>
                                {t("expire", "Expire")}
                              </Text>
                              <Text c="red.5" fz="sm">
                                {D.utc_to_distance(
                                  element.expired_on,
                                  t("never", "Never")
                                )}
                              </Text>
                            </Stack>

                            <Stack gap={2} mr="md">
                              <Text fz="sm" style={{ opacity: 0.7 }}>
                                {t("nb_visited", "Visited")}
                              </Text>
                              <Group
                                justify="right"
                                gap={0}
                                c="blue.5"
                                fw="bolder"
                              >
                                <NumericFormat
                                  decimalScale={0}
                                  readOnly={true}
                                  displayType="text"
                                  value={`${element.nb_visited}`}
                                  thousandSeparator={thousandSep()}
                                  decimalSeparator={decimalSep()}
                                />

                                <Text>x</Text>
                              </Group>
                            </Stack>
                          </Group>
                        </CardIn>
                      );
                    })}
                  </SimpleGrid>
                )}
                {listDir != "grid_view" && (
                  <SharesList
                    data={data}
                    opengroupurl={opengroupurl}
                    setPopUpObj={setPopUpObj}
                    setForceOpenLinkInfo={setForceOpenLinkInfo}
                    t={t}
                    select={select}
                    selectAll={selectAll}
                    isAllSelected={isAllSelected}
                    openToShareExpire={openToShareExpire}
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
export const AddEditShare = () => {
  const { t } = useTranslation("private", { keyPrefix: "shares" });
  const { error, succeed } = useMessage();
  const dispatch = useDispatch();

  let { channel_id } = useParams();
  const [bodyBeforeSave, setBodyBeforeSave] = useState("");
  const navigate = useNavigate();
  const theme_2 = useMantineTheme();
  const { classes: classesG } = useGlobalStyl();
  const [shareableLink, setShareableLink] = useState("");
  const [shareableDeals, setshareableDeals] = useState("");
  const [channel, setChannel] = useState<any>({});

  const [withQuantity, setWithQuantity] = useState(true);
  const [withPrice, setWithPrice] = useState(true);
  const [idhex, setIdhex] = useState(() => {
    return G.uid("s");
  });
  const [urlGroup, setUrlGroup] = useState("");

  const [disableShare, setDisableShare] = useState(false);
  const [isAlsoOpen, setIsAlsoOpen] = useState(false);

  // const { data: dataGet, errorMessage: errorMessagelGet, errorCode: errorCodeGet, succeeded: succeededGet, isLoading: isLoadingGet, executeGet: executeGet } = useAxiosGet(BUILD_API('shares/draft/' + channel_id), null);

  const {
    data: dataGet,
    errorMessage: errorMessagelGet,
    errorCode: errorCodeGet,
    succeeded: succeededGet,
    isLoading: isLoadingGet,
    executeGet: executeGet,
  } = useAxiosGet(BUILD_API("shares/deals-to-share"), null);
  let {
    data: dataPost,
    isLoading: isLoadingPost,
    succeeded: succeededPost,
    errorMessage: errorMessagePost,
    executePost,
  } = useAxiosPost(BUILD_API("shares/" + channel_id), { idhex: idhex });

  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const os = useOs();

  useEffect(() => {
    dispatch(changeActive("shares"));
    executeGet({ url_e: BUILD_API("shares/deals-to-share/" + channel_id) });
    setShareableLink(BUILD_URL(idhex));
  }, []);
  useEffect(() => {
    let errorMsg = errorMessagelGet;
    if (errorMsg) error(errorMsg);

    if (succeededGet && dataGet) {
      setChannel(dataGet["channel"]);
      // setIdhex(dataGet['idlink'])
      // setShareableLink(BUILD_URL(idhex))
      buildUrlGroup(dataGet["channel"]);
      build(dataGet["channel"]);
    }
  }, [errorMessagelGet, succeededGet]);
  const buildUrlGroup = (channel_) => {
    if (!channel_) return;
    let url = channel_.channel_data;
    if (channel_.channel_group_id == "WATS_APP") {
      if (!isPhone()) {
        url = "https://web.whatsapp.com";
      } else url = "whatsapp://";
    }
    setUrlGroup(url);
  };
  useEffect(() => {
    if (succeededPost) {
      setDisableShare(true);
      succeed(dataPost?.message);
      opengroupurl();
    }
    if (errorMessagePost) error(errorMessagePost);
  }, [errorMessagePost, succeededPost]);
  const opengroupurl = () => {
    if (channel.channel_group_id != "EMAIL" && isAlsoOpen) {
      let url = channel.channel_data;
      if (channel.channel_group_id == "WATS_APP") {
        if (!isPhone() && openWhatsappAsWeb()) {
          url = "https://wa.me/?text=" + encodeURIComponent(shareableDeals);
        } else
          url = "whatsapp://send?text=" + encodeURIComponent(shareableDeals);
      }
      window.open(url, channel.channel_group_id);
    }
  };
  const build = (channel_) => {
    if (!dataGet || !dataGet["deals"] || !channel_) return;
    let deals = dataGet["deals"];
    let posts_c = "";
    for (let i = 0; i < deals.length; i++) {
      let deal = deals[i];
      posts_c =
        posts_c +
        buildWTSB(channel_.channel_group_id, deal.wtsb) +
        " " +
        (withQuantity
          ? (+deal.quantity).toFixed(0).toString() +
            " " +
            deal.uom.toString() +
            " "
          : "") +
        deal.title +
        (withPrice
          ? " " +
            (+deal.price).toFixed(0).toString() +
            " " +
            deal.curr_symbol.toString() +
            " "
          : "") +
        "\n";
    }
    // posts_c = posts_c + '\n' + BUILD_URL(dataGet['idlink'])
    setshareableDeals(posts_c);
  };

  // const buildWTSB = (wtsb: string, channel_) => {
  //     if (channel_.channel_group_id == 'WATS_APP')
  //         return `*${wtsb}*`
  //     return wtsb
  // }
  useEffect(() => {
    build(channel);
  }, [withQuantity, withPrice]);
  const isPhone = () => {
    return os == "ios" || os == "android";
  };
  return (
    <>
      <AppHeader
        title={t("post_title_my_posts", "Shares")}
        titleClicked={() => {
          navigate("../shares", { replace: true });
        }}
      >
        <ShareOrShareNOpen
          disableShare={disableShare}
          shareableDeals={shareableDeals + "\n" + BUILD_URL(idhex)}
          disablesharenopen={disableSahreNOpen(
            channel?.channel_group_id,
            channel?.channel_data
          )}
          onShare={(copied) => {
            executePost();
            setIsAlsoOpen(false);
          }}
          onShareNOpen={(copied) => {
            executePost();
            setIsAlsoOpen(true);
          }}
        />
      </AppHeader>
      <Box className={classesG.editMax800}>
        {(isLoadingGet || isLoadingPost) && (
          <Overlay opacity={1} color="#000" zIndex={5} />
        )}
        <LoadingOverlay
          visible={isLoadingGet || isLoadingPost}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        {/* {

                <Button onClick={() => {
                    opengroupurl()
                }}>Open</Button>
            } */}

        <Box mb="lg">
          {!succeededGet && idhex != "" && (
            <>
              {errorCodeGet != "NO_POSTS_TO_SHARE" && (
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  title={t("error", "Error")}
                  color="red"
                >
                  {t(
                    "share_error_message",
                    "Either no posts to share, or you exceeded the shares limit per day or per channel!."
                  )}
                </Alert>
              )}
              {errorCodeGet == "NO_POSTS_TO_SHARE" && (
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  title={t("error", "Error")}
                  color="red"
                >
                  {t(
                    "no_post_to_sahre",
                    "No posts are available for sharing. Please re-post an existing one or add a new post!."
                  )}
                </Alert>
              )}
            </>
          )}

          {succeededGet && succeededPost && (
            <Alert
              icon={<IconCheck size={16} />}
              title={t("succeeded", "Succeeded")}
              color="green"
            >
              <Text>
                {t(
                  "posts_successfully_sahred",
                  "Posts successfuly shared through this channel, also the posts copied to the clipboard!."
                )}
              </Text>
              {isAlsoOpen && (
                <Text>
                  {t(
                    "also_opened",
                    "The channel group open, please publish the posts there!."
                  )}
                </Text>
              )}
              {!isAlsoOpen && (
                <Text>
                  {t(
                    "not_opened",
                    "Please open your target channel, and publish the posts there!."
                  )}
                </Text>
              )}
            </Alert>
          )}
          {succeededGet && succeededPost && (
            <Alert
              icon={<IconEdit size={16} />}
              mt="lg"
              color="green"
              title={t("update_expiration_date", "Update Expiration Date!")}
            >
              <Box style={{ maxWidth: small || medium ? "100%" : "50%" }}>
                <ShareExpirationManip
                  t={t}
                  ids={[dataPost?.id]}
                  expire={dataPost?.expire}
                  withinPortal={true}
                />
              </Box>
            </Alert>
          )}
        </Box>
        {succeededGet && channel && (
          <Grid gutter={small ? 5 : medium ? 10 : 15}>
            <Grid.Col span={{ base: 12 }}>
              <TextInput
                value={channel.channel_name}
                readOnly={true}
                autoComplete="off"
                label={t("channel_name", "Channel Name")}
                placeholder={t("channel_name", "Channel Name")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12 }}>
              <TextInput
                value={shareableLink}
                readOnly={true}
                autoComplete="off"
                label={t("shareable_link", "Shareable Link")}
                placeholder={t("shareable_link", "Shareable Link")}
                description={
                  <Box c="red">
                    {t(
                      "public_access",
                      "Anyone with this link can access your deals list (once shared)!."
                    )}
                  </Box>
                }
                rightSection={
                  <Box style={{ width: "40px" }}>
                    <CopyButton value={shareableLink}>
                      {({ copied, copy }) => (
                        <ActionIcon  variant="transparent"
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
            </Grid.Col>

            <Grid.Col span={{ base: 12 }}>
              <Text className={classesG.textAsLabel}>
                {t("share_options", "Share Options")}
              </Text>
              <Card className={classesG.border}>
                <Group
                  justify="space-between"
                  style={{ maxWidth: "500px" }}
                  mt="md"
                >
                  <Switch
                    disabled={disableShare}
                    checked={withQuantity}
                    onChange={(event) =>
                      setWithQuantity(event.currentTarget.checked)
                    }
                    mt={-12}
                    label={t("share_with_quantity", "With Quantities")}
                  />
                  <Switch
                    disabled={disableShare}
                    checked={withPrice}
                    onChange={(event) =>
                      setWithPrice(event.currentTarget.checked)
                    }
                    mt={-12}
                    label={t("share_with_prices", "With Prices")}
                  />
                </Group>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12 }}>
              <Textarea
                readOnly={disableShare}
                onChange={(e) => {
                  setshareableDeals(e.currentTarget.value);
                }}
                style={{ position: "relative" }}
                defaultValue={shareableDeals}
                value={shareableDeals}
                minRows={10}
                autoComplete="off"
                label={t("shareable_deals", "Shareable Deals")}
                placeholder={t("shareable_deals", "Shareable Deals")}
                description={<Group justify="flex-start" gap={0}>
                <Box>
                  {t(
                    "shareable_deals_msg",
                    "You can still copy the content and paste it into the target channel."
                  )}
                </Box>
                <CopyButton
                      value={shareableDeals + "\n" + BUILD_URL(idhex)}
                    >
                      {({ copied, copy }) => (
                        <ActionIcon variant="transparent"
                          onClick={() => {
                            copy();
                            succeed(t("posts_copied", "Posts copied!."));
                          }}
                          color={copied ? "" : "gray.6"}
                        >
                          <IconCopy size={34} />
                        </ActionIcon>
                      )}
                    </CopyButton>
              </Group>}
                rightSection={
                  <Box style={{ width: "40px", position: "absolute", top: 10 }}>
                    <CopyButton
                      value={shareableDeals + "\n" + BUILD_URL(idhex)}
                    >
                      {({ copied, copy }) => (
                        <ActionIcon variant="transparent"
                          onClick={() => {
                            copy();
                            succeed(t("posts_copied", "Posts copied!."));
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
            </Grid.Col>
            <Grid.Col span={{ base: 12 }}>
              <TextInput
                leftSection={
                  <IconBrands
                    brand={channel.channel_group_id}
                    size={small ? 18 : medium ? 20 : 22}
                  />
                }
                value={urlGroup}
                readOnly={true}
                autoComplete="off"
                label={t("channel_data", "Channel Data")}
                placeholder={t("channel_data", "Channel Data")}
                rightSection={
                  <a href={urlGroup} target={channel.channel_group_id}>
                    <IconExternalLink size={small ? 18 : medium ? 20 : 22} />
                  </a>
                }
              />
            </Grid.Col>
            {channel.channel_group_id == "WATS_APP" && (
              <Grid.Col span={{ base: 12 }}>
                <Text size="xs">
                  {t(
                    "if_whats_app_change_open",
                    "You can change how to open the whatsapp(https://web.whatsapp.com/ or the app itself) from the settings!."
                  )}
                </Text>
              </Grid.Col>
            )}
          </Grid>
        )}
      </Box>
    </>
  );
};

export const SharesSearch = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { t } = useTranslation("private", { keyPrefix: "shares" });
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const navigate = useNavigate();
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
      expired: G.ifNull(searchParams.get("expired"), "no"),
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
        leftSectionMenu={props.leftSearchSectionMenu}
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
            <ExpiredSelect {...form.getInputProps("expired")} />
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

const SharesList = ({
  data,
  opengroupurl,
  setPopUpObj,
  setForceOpenLinkInfo,
  t,
  select,
  selectAll,
  isAllSelected,
  openToShareExpire,
}) => {
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const { classes: classesG } = useGlobalStyl();
  const navigate = useNavigate();
  const [selection, setSelection] = useState(["1"]);

  const rows = data.map((item) => {
    // const selected = true;//selection.includes(item.id);
    return (
      <Table.Tr
        key={item.id}
        className={item.isSelected ? classesG.rowSelected : ""}
      >
        <Table.Td
          style={{ cursor: "pointer !important" }}
          onClick={() => {
            select(item.id);
          }}
        >
          <Checkbox size="md" checked={item.isSelected} onChange={() => {}} />
        </Table.Td>
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
              td={item.expired == "X" ? "line-through" : ""}
            >
              {item.channel_name}
            </Text>
          </Box>
        </Table.Td>
        <Table.Td>
          <Text style={{ fontSize: "0.8rem", color: "gray" }}>
            {D.utc_to_distance(item.created_on)}
          </Text>
        </Table.Td>

        <Table.Td>
          <Text c="red.5">
            {D.utc_to_distance(item.expired_on, t("never", "Never"))}
          </Text>
        </Table.Td>

        <Table.Td>
          <Group justify="right" gap={0} c="blue.5" fw="bolder">
            <NumericFormat
              decimalScale={0}
              readOnly={true}
              displayType="text"
              value={`${item.nb_visited}`}
              thousandSeparator={thousandSep()}
              decimalSeparator={decimalSep()}
            />
            <Text>x</Text>
          </Group>
        </Table.Td>
        <Table.Td>
          <Group justify="right" gap={2}>
            <PopShareVisitedStatInfo data={item}>
              <ActionIcon>
                <IconFileAnalytics size={25} />
              </ActionIcon>
            </PopShareVisitedStatInfo>

            <Menu position="left-start" offset={0} withinPortal={true}>
              <Menu.Target>
                <ActionIcon size="md" variant="subtle">
                  <IconDots size={25} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconRotateClockwise2 size={20} />}
                  onClick={() => {
                    openToShareExpire([item.id], item.expire_period);
                  }}
                >
                  <Box>
                    {t("change_expiration_period", "Change expiration period")}
                  </Box>
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <>
                      {item.expired == "" && (
                        <Box c="teal.5">
                          <IconLink size={20} />
                        </Box>
                      )}
                      {item.expired == "X" && (
                        <Box c="red.5">
                          <IconLinkOff size={20} />
                        </Box>
                      )}
                    </>
                  }
                  onClick={() => {
                    setPopUpObj(item);
                    setForceOpenLinkInfo(() => {
                      return new Date().getTime().toString();
                    });
                  }}
                >
                  <Box c={item.expired == "X" ? "red.5" : "teal.5"}>
                    {t("shared_link", "Shared Link")}
                  </Box>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  leftSection={<IconGraph size={20} stroke={1.5} />}
                  onClick={() => {
                    navigate(`../board/analytic/shr/${item.channel_id}`);
                  }}
                >
                  {t("dashboard_chnl_share_report", "Channel Share Report")}
                </Menu.Item>

                {item.channel_group_id == "EMAIL" && (
                  <Menu.Item
                    leftSection={<IconMail size={20} stroke={1.5} />}
                    onClick={() => {
                      navigate(`../board/emailsStat/shr/${item.id}`);
                    }}
                  >
                    {t("dashboard_emails_stts", "Email Share Status")}
                  </Menu.Item>
                )}
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <ScrollArea mt="lg">
      <Table
        verticalSpacing="xs"
        highlightOnHover
        className={`${"TableCss"} ${"TableCss-Shares"}  ${classesG.table}`}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
              <Checkbox
                size="md"
                checked={isAllSelected()}
                onChange={(e) => {
                  selectAll(e.currentTarget.checked);
                }}
              />
            </Table.Th>
            <Table.Th>{t("group", "Group")}</Table.Th>
            <Table.Th>{t("name", "Name")}</Table.Th>

            <Table.Th>{t("shared", "Shared")}</Table.Th>
            <Table.Th>{t("expire", "Expire")}</Table.Th>

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
export const useShareExpire = ({ t }) => {
  const { classes: classesG } = useGlobalStyl();
  const [ids, setIds] = useState<any>([]);
  const [expire, setExpire] = useState<any>(0);
  const [activeMessage, setActiveMessage] = useState<any>(null);
  const [onSucceeded, setOnSucceeded] = useState<any>(null);
  const [onCloseM, setOnCloseM] = useState<any>(null);
  const [openas, setOpenas] = useState<any>(null);
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const [opened, setOpened] = useState(false);
  useEffect(() => {
    if (opened) openModel();
    else closeModal("message_to_share_expire");
  }, [opened]);
  const openModel = () => {
    modals.open({
      // className: classesG.clipBoardPopUp,
      // centered:true,
      // scrollAreaComponent:<ScrollArea.Autosize />,
      // sx={(theme) => ({ backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] })}
      styles: {
        // root:{backgroundColor:"red !important"},
        // overlay: { backgroundColor: "red !important" },
        // inner: { backgroundColor: "red !important" },
        // content: { backgroundColor: "rgba(0, 0, 0, 0.5) !important" },
      },
      padding: 0,

      // yOffset: 0,
      // xOffset: 0,
      modalId: "message_to_share_expire",
      fullScreen: false,
      withCloseButton: false,

      // style:{backgroundColor:"red !important"},
      withOverlay: true,
      // overlayProps: { className: classesG.clipBoardPopUp },
      // style: { size={ small? "100vw": "80vw" } },
      // onClose:{()=>{}},
      onClose: () => {
        if (onCloseM && onCloseM.onclose) onCloseM.onclose();
        setOpened(false);
      },
      withinPortal: false,

      // size: small || medium ? "100vw" : "400px",
      children: (
        <Stack
          m="0"
          p="md"
          pos="relative"
          mih={200}
          justify="center"
          className={classesG.popUpBackground}
        >
          <Box className={classesG.backgroundCard} p="xs">
            <ShareExpirationManip
              t={t}
              ids={ids}
              expire={expire}
              withinPortal={true}
            />
            <Group justify="right" mt="lg">
              <Button
                onClick={() => {
                  setOpened(false);
                }}
              >
                {t("close", "Close")}
              </Button>
            </Group>
          </Box>
        </Stack>
      ),
    });
  };
  const openToShareExpire = (ids_, expire_) => {
    setIds(ids_);
    setExpire(expire_);
    setOpened(true);
  };
  const closeToShare = () => {
    //  setOpened(false)
  };
  return { openToShareExpire };
};

export const ShareExpirationManip = ({ t, ids, expire, withinPortal }) => {
  const { error, succeed } = useMessage();
  const [shareExpire, setShareExpire] = useState<any>(null);
  const [data, setData] = useState<any>([]);
  let {
    data: dataPut,
    isLoading: isLoadingPut,
    succeeded: succeededPut,
    errorMessage: errorMessagePut,
    executePut,
  } = useAxiosPut(BUILD_API("shares/expire"), { ids, expire: shareExpire });
  useEffect(() => {
    setShareExpire(expire);
  }, [expire]);
  useEffect(() => {
    if (errorMessagePut) error(errorMessagePut);
    if (succeededPut) {
      let succeededMsg = dataPut?.message;
      succeed(succeededMsg);
    }
  }, [succeededPut, errorMessagePut]);
  useEffect(() => {
    setData(shareExpirationPeriodList({ t, is_for: "share", expire: 1 }));
  }, []);
  return (
    <Box pos="relative">
      <LoadingOverlay
        visible={isLoadingPut}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <AppSelect
        style={{ zIndex: 501 }}
        // comboboxProps={{withinPortal:true}}
        withinPortal={withinPortal}
        maxDropdownHeight={300}
        value={shareExpire}
        onChange={(e: any) => {
          setShareExpire(e);
          executePut();
        }}
        label={t("link_expired_in_days.", "Link expired(in days).")}
        placeholder={t("link_expired_in_days.", "Link expired(in days).")}
        description={t(
          "feel_free_to_modify_as_necessary",
          "Feel free to modify as necessary."
        )}
        // limit={6}
        data={data}
        error={errorMessagePut}
      />
    </Box>
  );
};

export const DealsToShare = ({
  t,
  onChange,
  channel_group_id,
  idHx,
  shareCompleted,
  onShare,
  copied,
  onNew,
}) => {
  // const [url, setIdH] = useState(BUILD_URL(G.uid('s')))
  // const [idHx, setIdHx] = useState(BUILD_URL(G.uid('s')))
  // const [idHx, setIdHx] = useState(G.uid('s'))
  const [withQuantity, setWithQuantity] = useState(true);
  const [withPrice, setWithPrice] = useState(true);
  const {
    data: dataGet,
    errorMessage: errorMessagelGet,
    errorCode: errorCodeGet,
    succeeded: succeededGet,
    isLoading: isLoadingGet,
    executeGet: executeGet,
  } = useAxiosGet(BUILD_API("shares/deals-to-share"), null);
  const { error, succeed } = useMessage();
  const [shareableDeals, setshareableDeals] = useState("");
  useEffect(() => {
    executeGet();
  }, []);
  const shareableLink = () => {
    return BUILD_URL(idHx);
  };
  useEffect(() => {
    let errorMsg = errorMessagelGet;
    if (errorMsg) error(errorMsg);

    if (succeededGet) build();
  }, [errorMessagelGet, succeededGet]);
  useEffect(() => {
    build();
  }, [withQuantity, withPrice, channel_group_id]);
  const channel_group = () =>
    (channel_group_id =
      channel_group_id && !!channel_group_id ? channel_group_id : "");
  const build = () => {
    if (!dataGet || !dataGet["deals"] || dataGet["deals"].length <= 0) return;

    let deals = dataGet["deals"];
    let posts_c = "";
    for (let i = 0; i < deals.length; i++) {
      let deal = deals[i];
      posts_c =
        posts_c +
        buildWTSB(channel_group(), deal.wtsb) +
        " " +
        (withQuantity
          ? (+deal.quantity).toFixed(0).toString() +
            " " +
            deal.uom.toString() +
            " "
          : "") +
        deal.title +
        (withPrice
          ? " " +
            (+deal.price).toFixed(0).toString() +
            " " +
            deal.curr_symbol.toString() +
            " "
          : "") +
        "\n";
    }
    // posts_c = posts_c + '\n' + BUILD_URL(idHx)
    onChange({ contain: posts_c, idHx: idHx });
    setshareableDeals(posts_c);
  };

  return (
    <Stack gap="md">
      <Group justify="space-between" style={{ maxWidth: "500px" }} mt="md">
        <Switch
          disabled={shareCompleted}
          checked={withQuantity}
          onChange={(event) => setWithQuantity(event.currentTarget.checked)}
          mt={-12}
          label={t("share_with_quantity", "With Quantities")}
        />
        <Switch
          disabled={shareCompleted}
          checked={withPrice}
          onChange={(event) => setWithPrice(event.currentTarget.checked)}
          mt={-12}
          label={t("share_with_prices", "With Prices")}
        />
      </Group>

      <Textarea
        readOnly={shareCompleted}
        autosize
        onChange={(e) => {
          setshareableDeals(e.currentTarget.value);
        }}
        style={{ position: "relative" }}
        defaultValue={shareableDeals}
        value={shareableDeals}
        minRows={10}
        maxRows={15}
        autoComplete="off"
        label={t("shareable_deals", "Shareable Deals")}
        placeholder={t("shareable_deals", "Shareable Deals")}
        description={
          <Group justify="flex-start" gap={0}>
            <Box>
              {t(
                "shareable_deals_msg",
                "You can still copy the content and paste it into the target channel."
              )}
            </Box>
            <CopyButton  value={shareableDeals + "\n" + shareableLink()}>
              {({ copied, copy }) => (
                <ActionIcon variant="transparent"
                  onClick={() => {
                    copy();
                    succeed(t("posts_copied", "Posts copied!."));
                  }}
                  color={copied ? "" : "gray.6"}
                >
                  <IconCopy size={34} />
                </ActionIcon>
              )}
            </CopyButton>
          </Group>
        }
        rightSection={
          <Box style={{ width: "40px", position: "absolute", top: 10 }}>
            <CopyButton value={shareableDeals + "\n" + shareableLink()}>
              {({ copied, copy }) => (
                <ActionIcon  variant="transparent"
                  onClick={() => {
                    copy();
                    succeed(t("posts_copied", "Posts copied!."));
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
      <TextInput
        value={shareableLink()}
        readOnly={true}
        autoComplete="off"
        label={t("shareable_link", "Shareable Link")}
        placeholder={t("shareable_link", "Shareable Link")}
        description={
          <Box c="red">
            {t(
              "public_access",
              "Anyone with this link can access your deals list (once shared)!"
            )}
          </Box>
        }
        rightSection={
          <Box style={{ width: "40px" }}>
            <CopyButton value={shareableLink()}>
              {({ copied, copy }) => (
                <ActionIcon  variant="transparent"
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

      {channel_group() != "" && (
        <Group mt="xs" justify="right" gap="xs">
          {shareCompleted && !copied && (
            <Button
              onClick={() => {
                onNew();
              }}
            >
              <Box>{t("new", "New")}</Box>
            </Button>
          )}
          {copied && (
            <Button>
              <Box>{t("is_copying", "Copying..")}</Box>
            </Button>
          )}
          {!copied && (
            <Button
              disabled={shareCompleted}
              leftSection={<IconShare size={18} />}
              type="button"
              onClick={() => {
                onShare(true);
              }}
            >
              <Box mr="sm">{t("share_and_open", "Share")}</Box>
              {<IconExternalLink />}
            </Button>
          )}
          {!copied && (
            <Button
              disabled={shareCompleted}
              leftSection={<IconShare size={18} />}
              type="button"
              onClick={() => {
                onShare(false);
              }}
            >
              <Box>{t("share", "Share")}</Box>
            </Button>
          )}
        </Group>
      )}
    </Stack>
  );
};

export const disableSahreNOpen = (channelGroup, ChannelData) => {
  return (
    !channelGroup ||
    channelGroup == "EMAIL" ||
    !ChannelData ||
    !(ChannelData && ChannelData.toString().indexOf("http") == 0)
  );
};
const buildWTSB = (channel_group, wtsb: string) => {
  if (channel_group == "WATS_APP") return `*${wtsb}*`;
  return wtsb;
};
