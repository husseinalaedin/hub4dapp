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
  Textarea,
  Alert,
  Card,
  Highlight,
  MultiSelect,
  Stack,
  Loader,
  rem,
  ScrollArea,
  SimpleGrid,
  Divider,
  Table,
  Tooltip,
  Radio,
} from "@mantine/core";

import { useForm } from "@mantine/form";
import {
  IconAlertCircle,
  IconTimeDurationOff,
  IconDots,
  IconEdit,
  IconFileAnalytics,
  IconInfinity,
  IconPlus,
  IconShare,
  IconRotate2,
  IconInfoSquareRoundedFilled,
  IconMessageCircleShare,
} from "@tabler/icons-react";
import {
  forwardRef,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  createSearchParams,
  useNavigate,
  useParams,
  useSearchParams,
  useBlocker,
} from "react-router";

import { NumericFormat } from "react-number-format";
import {
  selectLarge,
  selectMedium,
  selectSmall,
  selectxLarge,
  selectxLarger,
} from "../../../store/features/ScreenStatus";
import {
  BUILD_API,
  CLOUDFARE_IMAGE_URL1,
  G,
  useMessage,
} from "../../../global/G";
import {
  axios_put,
  useAxiosGet,
  useAxiosPost,
  useAxiosPut,
} from "../../../hooks/Https";
import { useGlobalStyl } from "../../../hooks/useTheme";
import { changeActive } from "../../../store/features/ActiveNav";
import { AppHeader } from "../app-admin/AppHeader";
import { NoDataFound } from "../../../global/NoDataFound";
import { ConfirmUnsaved, PopDealStatInfo } from "../../../global/PopUpDialogs";
import { decimalSep, GridLayOut, thousandSep } from "../../../global/Misc";
import { D } from "../../../global/Date";
import { Pages } from "../../../hooks/usePage";
import { SearchPannel } from "../../../global/SearchPannel";

import {
  renderWtsWtbDropVOption,
  WtsWtbDropV,
} from "../../../global/WtsWtbDropV";
import { ExpiredSelect } from "../../../global/ExpiredSelect";
import { useHover } from "@mantine/hooks";
import { CardIn } from "../../../global/CardIn";
import {
  DATETIMEVALUES_FILL,
  DateRange,
  HoursRangeSelect,
  useDateValues,
} from "../../../hooks/useDateRange";

import { useDbData } from "../../../global/DbData";
import { MemoEditorApp } from "../../../global/AppEditor";
import { HashValue4Boardd2 } from "../../../global/global-comp/Hashtags";
import {
  ImagesZoneDeals,
  MAX_NB_IMAGES,
  DealImageCarousel,
} from "./ImagesZoneDeals";
import { IconPhotoOff } from "@tabler/icons-react";
import { DealToShareComMain, useDealToShareMain } from "../shares/SahresPopUp";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { ClearButton } from "../../../global/ClearButton";
import { useAuth } from "../../../providers/AuthProvider";
import { closeModal, modals } from "@mantine/modals";
import { AppSelect } from "../../../global/global-comp/AppSelect";
import {
  AppMultiSelect,
  useAppMultiSelectToAddMissedSearchVal,
} from "../../../global/global-comp/AppMultiSelect";
import { ArrayToAppSelect } from "../../../global/Hashtags";
import { DealsSpreadSheet } from "./DealsSpreadSheet";

export const SHARES_TYPE = {
  SHARE_BY_DEFAULT: "share_by_default",
  SHARE_BY_CHANNEL: "share_by_channel",
};
export const WTSBTheme = (theme, wtsb, dir) => {
  let wtB = theme.fn.linearGradient(
    45,
    theme.colors.green[9],
    theme.colors.green[9]
  );
  let wtS = theme.fn.linearGradient(
    45,
    theme.colors.green[9],
    theme.colors.green[9]
  );
  let req = theme.fn.linearGradient(
    45,
    theme.colors.green[9],
    theme.colors.green[9]
  );
  let ofr = theme.fn.linearGradient(
    45,
    theme.colors.green[9],
    theme.colors.green[9]
  );
  if (theme.colorScheme === "dark") {
    wtB = theme.fn.linearGradient(
      45,
      theme.colors.indigo[5],
      theme.colors.indigo[5]
    );
    wtS = theme.fn.linearGradient(
      45,
      theme.colors.indigo[5],
      theme.colors.indigo[5]
    );
  }

  return {
    backgroundImage: dir == "O" ? wtB : wtS,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontStyle: "italic",
  };
};

export const CompanyDeals = () => {
  const grid_name = "MYDEALS";
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchMyDeals, setSearchMyDeals] = useState<any>();
  const { hidden } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const [showImage,setShowImage]=useState(false)
  const { error, succeed } = useMessage();
  const [searchAction, setSearchAction] = useState<any>("");
  const { t } = useTranslation("private", { keyPrefix: "deals" });
  const layout = () => {
    if (searchMyDeals && searchMyDeals["listdir"])
      return searchMyDeals["listdir"];
    return GridLayOut(grid_name, "", "GET", "grid_view");
  };
  const [listDir, setListDir] = useState<string>(() => {
    return layout();
  });
  let { theme } = useAppTheme();
  const [popUpObj, setPopUpObj] = useState<any>("");
  const [forceOpenLinkInfo, setForceOpenLinkInfo] = useState<any>("");
  const {
    data,
    setData: setDataGet,

    errorMessage,
    succeeded,
    isLoading,
    executeGet,
  } = useAxiosGet(BUILD_API("deals/company"), searchMyDeals);
  let {
    data: dataPut,
    isLoading: isLoadingPut,
    succeeded: succeededPut,
    errorMessage: errorMessagePut,
  } = useAxiosPut(BUILD_API("deals/company"), {});
  let {
    openToShare: openToShare_share,
    opened: opened_share,
    openas: openas_share,
    closeToShare,
    setOnCloseM,
    setOpenas,
  } = useDealToShareMain({ t: t });

  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const large = useSelector(selectLarge);
  const xlarge = useSelector(selectxLarge);
  const xlarger = useSelector(selectxLarger);
  const { classes: classesG } = useGlobalStyl();
  const [objectUpdated, setObjectUpdated] = useState<any>({});
  const [showHiddenMsg, setShowHiddenMsg] = useState(true);
  // const [isBusy,setIsBusy]=useState(false)
  useEffect(() => {
    dispatch(changeActive("mydeals"));
  }, []);

  useEffect(() => {
    if (!opened_share) refresh();
  }, [searchParams]);

  const refresh = () => {
    fit_data_grid_view();
    let expired = searchParams.get("expired");
    if (!expired || expired == "") {
      searchParams.set("expired", "no");
    }

    setSearchMyDeals(Object.fromEntries([...searchParams]));
    executeGet();
  };
  useEffect(() => {
    setListDir(() => {
      return layout();
    });
  }, [searchMyDeals]);
  useEffect(() => {
    if (errorMessage) error(errorMessage);
  }, [succeeded, errorMessage]);
  useEffect(() => {
    if (succeededPut) {
      // succeed(dataPut?.message)
      if (dataPut && dataPut.info && dataPut.info.id) {
        // updated(dataPut.info.id, dataPut.info.action)
      }
    }
    if (errorMessagePut) error(errorMessagePut);
  }, [errorMessagePut, succeededPut]);

  const renew_or_terminate = (id, action) => {
    // console.log('@@',objectUpdated)
    // setObjectUpdated(() => {
    //     return { tm: (new Date()).getTime().toString()+'-'+id, id, action: 'processing' }
    // })
    updated2(id, "processing");
    axios_put(
      BUILD_API("deals/company/") + id + "/" + action,
      {},
      (actionData) => {
        if (actionData) {
          succeed(actionData.data.message);
          // setObjectUpdated(() => {
          //     return { tm: (new Date()).getTime() + '-' + id, id, action }
          // })
          updated2(id, action);
        }
      },
      (err) => {
        error(err.message);
        updated2(id, "");
        // setObjectUpdated(() => {
        //     return { tm: (new Date()).getTime() + '-' + id, id, action: '' }
        // })
      }
    );
  };
  useEffect(() => {
    fit_data_grid_view();
  }, [small, medium, large, xlarge, xlarger]);
  const fit_data_grid_view = () => {
    if (small || medium) {
      // searchParams.set('listdir', 'grid_view')
      setListDir((prev) => {
        if (prev == "img_grid_view") return prev;
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
  const updated = async (id, action) => {
    if (!data || data.length <= 0) return;
    const updatedData = data.map((item) => {
      if (item.id === id) {
        if (action == "processing") return { ...item, action: action };
        return {
          ...item,
          expired: action == "renew" ? "" : "X",
          action: action,
        };
      } else return item;
    });
    setDataGet(updatedData);
  };
  const updated2 = (id, action) => {
    // Update the specific row's loadStatus and action properties
    setDataGet((prevData) =>
      prevData.map((item) =>
        item.id === id
          ? {
              ...item,
              action: action,
              expired: action === "renew" ? "" : "X",
            }
          : item
      )
    );
  };
  useEffect(() => {
    if (!objectUpdated.id || objectUpdated.id == "") return;
    console.log("UPDATED:", objectUpdated.id, objectUpdated.action);
    updated(objectUpdated.id, objectUpdated.action);
  }, [objectUpdated.tm]);
  // const imageShoHideGo = () => {
  //     setIsBusy(true)
  //     let shoimg = !showImage
  //     // if (shoimg) {
  //         GridLayOut(grid_name, 'grid_view', 'SAVE', '')
  //         searchParams.set('t', (new Date()).getTime().toString())
  //         searchParams.set('src', 'sort')
  //         searchParams.set('listdir', 'grid_view')
  //     searchParams.set('showimage', shoimg ? 'X' : '')
  //         setSearchParams(searchParams);
  //         navigate({
  //             search: searchParams.toString()
  //         });

  //     // }
  //     setShowImage((prev) => !prev)
  //     setTimeout(() => {
  //         setIsBusy(false)
  //     }, 10);

  // }
  const showImageC = () => {
    return listDir == "img_grid_view";
  };
  return (
    <>
      {isLoading && <Overlay opacity={1} color="#000" zIndex={5} />}
      {(isLoading || isLoadingPut) && (
        <LoadingOverlay
          visible={isLoading || isLoadingPut}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
      )}

      {/* {(isLoadingPut) && <LoadingOverlay visible={isLoading || isLoadingPut} overlayBlur={0.7} />} */}

      <AppHeader title={t("my_deal_title", "My Deals")}>
        <Group justify="right" gap="xs">
          <Tooltip
            label={t("share_by_default_channel", "Share by default channel.")}
          >
            <Button
              variant="light"
              color={theme == "dark" || theme == "dim" ? "orange" : "orange"}
              onClick={() => {
                setOpenas(SHARES_TYPE.SHARE_BY_DEFAULT);
                setOnCloseM({
                  onclose: () => {
                    let params: any = [];
                    navigate({
                      search: createSearchParams(params).toString(),
                    });
                  },
                });
                openToShare_share();
              }}
            >
              <IconMessageCircleShare />
            </Button>
          </Tooltip>
          <Tooltip
            label={t("share_by_selected_channel", "Share by selected channel.")}
          >
            <Button
              variant="filled"
              color={theme == "dark" || theme == "dim" ? "orange" : "orange"}
              onMouseDown={() => {
                setOpenas(SHARES_TYPE.SHARE_BY_CHANNEL);
                setOnCloseM({
                  onclose: () => {
                    let params: any = [];
                    navigate({
                      search: createSearchParams(params).toString(),
                    });
                  },
                });
                openToShare_share();
              }}
            >
              <IconShare />
            </Button>
          </Tooltip>
          <Tooltip label={t("add_new_deal", "Add new deal.")}>
            <Button
              variant="filled"
              color={theme == "dark" || theme == "dim" ? "teal.9" : "indigo.9"}
              onMouseDown={(val) => {
                navigate("../mydeals/new");
              }}
            >
              <IconPlus />
            </Button>
          </Tooltip>
        </Group>
      </AppHeader>
      <DealToShareComMain
        t={t}
        opened={opened_share}
        openas={openas_share}
        closeToShare={closeToShare}
      />
      <PopDealStatInfo dataDeal={popUpObj} forceOpen={forceOpenLinkInfo}>
        <></>
      </PopDealStatInfo>
      {hidden && showHiddenMsg && (
        <Alert
          fs="sm"
          color="orange.9"
          mb="xs"
          p="xs"
          withCloseButton={true}
          title={t("profile_is_hidden", "Hidden Profile")}
          icon={<IconAlertCircle />}
          onClose={() => {
            setShowHiddenMsg(false);
          }}
        >
          <Box>
            {t(
              "hidden_co_profile",
              "Your company deal list and profile will remain private and invisible to others, except for users with a valid and unexpired sharing deal link."
            )}
          </Box>
          <Box
            style={{
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={() => {
              navigate(`../company-profile`);
            }}
            // sx={(theme) => ({
            //   transition: "text-decoration 0.2s, color 0.2s",
            //   color: theme.colors.blue[6], // Default color
            //   "&:hover": {
            //     textDecoration: "underline",
            //     color: theme.colors.blue[8], // Hover color
            //   },
            // })}
          >
            {t(
              "change_visibility_profile",
              "You can adjust visibility from the company profile!"
            )}
          </Box>
        </Alert>
      )}
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
              <DealSearch grid={grid_name} action={searchAction} />
            </Box>
          </Group>
          <Box>
            {(!data || data.length <= 0) && (
              <NoDataFound title={t("no_deals_found", "No Deals Found!.")} />
            )}
            {!(!data || data.length <= 0) && (
              <Box>
                {(listDir == "grid_view" || listDir == "img_grid_view") && (
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
                          classNameForce={
                            element.action == "renew"
                              ? classesG.cardRenew
                              : element.action == "terminate"
                              ? classesG.cardTerminate
                              : ""
                          }
                        >
                          <Stack gap={0} justify="space-between" h={"100%"}>
                            <Group justify="space-between" mb="sm">
                              <Group
                                justify="left"
                                mr={75}
                                gap={5}
                                c={
                                  element.deal_dir === "I" ||
                                  element.wtsb === "OFR"
                                    ? "red.5"
                                    : ""
                                }
                                className={`${
                                  element.deal_dir === "I" ||
                                  element.wtsb === "OFR"
                                    ? classesG.titleDealsWTB
                                    : classesG.titleHref2
                                }`}
                                onClick={() => {
                                  navigate(`../mydeals/${element.id}`);
                                }}
                              >
                                <Group justify="left" fz={12} gap={3} fw={700}>
                                  <Text>
                                    <Highlight
                                      span={true}
                                      td={
                                        element.expired == "X"
                                          ? "line-through"
                                          : ""
                                      }
                                      highlight={[
                                        searchMyDeals && searchMyDeals.title
                                          ? searchMyDeals.title
                                          : "",
                                        searchMyDeals &&
                                        searchMyDeals.searchterm
                                          ? searchMyDeals.searchterm
                                          : "",
                                      ]}
                                      highlightStyles={(theme) => {
                                        return WTSBTheme(
                                          theme,
                                          "",
                                          element.deal_dir
                                        );
                                      }}
                                    >
                                      {`${element.wtsb} ${element.title} `}
                                    </Highlight>
                                    <Text
                                      span={true}
                                      className={classesG.expired_in}
                                    >
                                      {" "}
                                      / {t("expire", "Expire")}{" "}
                                      {D.utc_to_distance(element.expired_on)}
                                    </Text>
                                  </Text>
                                </Group>
                              </Group>

                              <Box
                                style={{
                                  position: "absolute",
                                  right: 5,
                                  top: 5,
                                }}
                              >
                                <DealMenu
                                  item={element}
                                  t={t}
                                  renew_or_terminate={renew_or_terminate}
                                  setPopUpObj={setPopUpObj}
                                  navigate={navigate}
                                  setForceOpenLinkInfo={setForceOpenLinkInfo}
                                  classesG={classesG}
                                />
                              </Box>
                            </Group>

                            {!showImageC() && (
                              <>
                                <Group justify="space-between" mb="md">
                                  <Stack gap={2}>
                                    <Text fz="sm" style={{ opacity: 0.7 }}>
                                      {" "}
                                      {t("posted", "Posted")}
                                    </Text>
                                    <Text fz="sm">
                                      {" "}
                                      {D.utc_to_distance(
                                        element.last_posted_on
                                      )}
                                    </Text>
                                  </Stack>
                                  <Stack gap={2}>
                                    <Text fz="sm" style={{ opacity: 0.7 }}>
                                      {" "}
                                      {t("renewed", "Renewed")}
                                    </Text>
                                    <Group
                                      justify="right"
                                      gap={0}
                                      c="blue.5"
                                      fw="bolder"
                                    >
                                      <NumericFormat
                                        decimalScale={0}
                                        displayType="text"
                                        value={`${element.renewed_count}`}
                                        thousandSeparator={thousandSep()}
                                        decimalSeparator={decimalSep()}
                                      />

                                      <Text>x</Text>
                                    </Group>
                                  </Stack>
                                  <Stack gap={2} mr="md">
                                    <Text fz="sm" style={{ opacity: 0.7 }}>
                                      {t("privacy", "Privacy")}
                                    </Text>
                                    <Group justify="right">
                                      <Text
                                        ml={-12}
                                        c={
                                          element.privacy_id == "P"
                                            ? "blue"
                                            : "red"
                                        }
                                      >
                                        {element.privacy}
                                      </Text>
                                    </Group>
                                  </Stack>
                                  <Stack gap={2}>
                                    <Text fz="sm" style={{ opacity: 0.7 }}>
                                      {t("quantity", "Quantity")}
                                    </Text>
                                    <Group
                                      justify={
                                        small || medium ? "left" : "right"
                                      }
                                    >
                                      <NumericFormat
                                        decimalScale={0}
                                        readOnly={true}
                                        displayType="text"
                                        value={`${element.quantity}`}
                                        thousandSeparator={thousandSep()}
                                        decimalSeparator={decimalSep()}
                                      />
                                      <Text ml={-12}>{element.uom}</Text>
                                    </Group>
                                  </Stack>
                                  <Stack gap={2} mr="md">
                                    <Text fz="sm" style={{ opacity: 0.7 }}>
                                      {t("price", "Price")}
                                    </Text>
                                    <Group justify="right">
                                      <NumericFormat
                                        decimalScale={1}
                                        displayType="text"
                                        value={`${element.price}`}
                                        thousandSeparator={thousandSep()}
                                        decimalSeparator={decimalSep()}
                                      />
                                      <Text ml={-12}>
                                        {element.curr_symbol}
                                      </Text>
                                    </Group>
                                  </Stack>
                                </Group>
                                <Box>
                                  <Divider
                                    size={1.5}
                                    my={2}
                                    label={
                                      <Text fz={16} style={{ opacity: 0.7 }}>
                                        {t(
                                          "reached_by_sharing_n_search",
                                          "Reached Through Sharing And Search"
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
                                          value={`${element.reached_by_search_count_last_hr}`}
                                          thousandSeparator={thousandSep()}
                                          decimalSeparator={decimalSep()}
                                        />
                                        <NumericFormat
                                          decimalScale={0}
                                          readOnly={true}
                                          displayType="text"
                                          value={`${element.reached_by_share_count_last_hr}`}
                                          thousandSeparator={thousandSep()}
                                          decimalSeparator={decimalSep()}
                                        />
                                      </Stack>
                                    </Stack>
                                    <Divider
                                      size={1.5}
                                      orientation="vertical"
                                    />
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
                                          value={`${element.reached_by_search_count_last_24hr}`}
                                          thousandSeparator={thousandSep()}
                                          decimalSeparator={decimalSep()}
                                        />
                                        <NumericFormat
                                          decimalScale={0}
                                          readOnly={true}
                                          displayType="text"
                                          value={`${element.reached_by_share_count_last_24hr}`}
                                          thousandSeparator={thousandSep()}
                                          decimalSeparator={decimalSep()}
                                        />
                                      </Stack>
                                    </Stack>
                                    <Divider
                                      size={1.5}
                                      orientation="vertical"
                                    />
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
                                          value={`${element.reached_by_search_count}`}
                                          thousandSeparator={thousandSep()}
                                          decimalSeparator={decimalSep()}
                                        />
                                        <NumericFormat
                                          decimalScale={0}
                                          readOnly={true}
                                          displayType="text"
                                          value={`${element.reached_by_share_count}`}
                                          thousandSeparator={thousandSep()}
                                          decimalSeparator={decimalSep()}
                                        />
                                      </Stack>
                                    </Stack>
                                  </Group>
                                </Box>
                              </>
                            )}
                            {showImageC() && (
                              <Box
                                style={{ flex: 1 }}
                                //style={{ height: element.pictures && element.pictures!=''? "500px":'200px'}}
                              >
                                {/* <img  src={`${CLOUDFARE_IMAGE_URL1}${element.main_pic}/public`}>
                                                    </img> */}
                                <DealImageCarousel
                                  t={t}
                                  main_pic={element.main_pic}
                                  pictures={element.pictures}
                                />
                              </Box>
                            )}
                          </Stack>
                        </CardIn>
                      );
                    })}
                  </SimpleGrid>
                )}
                {listDir != "grid_view" &&
                  listDir != "img_grid_view" &&
                  listDir != "spread" && (
                    <DealsList
                      data={data}
                      searchMyDeals={searchMyDeals}
                      renew_or_terminate={renew_or_terminate}
                      t={t}
                    />
                  )}
                {listDir == "spread" && (
                  <DealsSpreadSheet
                    data={data}
                    searchMyDeals={searchMyDeals}
                    renew_or_terminate={renew_or_terminate}
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
export const AddEditDeal = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(changeActive("mydeals"));
  }, []);
  return <AddEditDeal0 />;
};
export const AddEditDeal0 = () => {
  const { t } = useTranslation("private", { keyPrefix: "deals" });
  const { error, succeed, info } = useMessage();
  const dispatch = useDispatch();

  let { id } = useParams();
  const [bodyBeforeSave, setBodyBeforeSave] = useState("");
  const navigate = useNavigate();
  const theme_2 = useMantineTheme();
  const { classes: classesG } = useGlobalStyl();
  const [dealAlert, setDealAlert] = useState(false);
  const [disableSave, setDisableSave] = useState(false);
  const [initQty, setInitQty] = useState<any>(null);
  const [initPrice, setInitPrice] = useState<any>(null);
  const [searchValue, onSearchChange] = useState("");
  const [searchValue2, onSearch2Change] = useState("");
  const bodyRef = useRef<any>(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [images, setImages] = useState<any>(() => {
    let imgs: any = [];
    for (let i = 0; i < MAX_NB_IMAGES; i++) imgs.push({});
    return imgs;
  });
  const [pictures, setPictures] = useState([]);
  const [main_pic, setMain_pic] = useState("");
  const [initBody, setInitBody] = useState("");
  useEffect(() => {
    dispatch(changeActive("mydeals"));
  }, []);
  const form = useForm({
    // initialValues: { wtsb: '', title: '', quantity: '', uom: '', price: '', curr: '', body: '', hashtags: []

    //  },
    initialValues: {
      wtsb: "",
      title: "",
      hashtags: [],
      body: "",
      pictures: [],
      main_pic: "",
      quantity: "",
      uom: "",
      price: "",
      curr: "",
      is_draft: "X",
    },
    validate: {
      wtsb: (value) =>
        !value || value.length < 1
          ? t("deal_type_cannot_be_blank", "Deal type cannot be blank")
          : null,
      title: (value) =>
        value.length < 1
          ? t("deal_title_cannot_be_blank", "Deal title cannot be blank")
          : value.length > 150
          ? t(
              "deal_title_cannot_exceed_xchars",
              "Title cannot exceed 150 characters"
            )
          : null,
      quantity: (value) =>
        value.length < 1
          ? t("deal_qty_cannot_be_blank", "Deal quantity cannot be blank")
          : null,
      uom: (value) =>
        value.length < 1
          ? t("uom_cannot_be_blank", "UOM cannot be blank")
          : null,
      price: (value) =>
        value.length < 1
          ? t("deal_price_cannot_be_blank", "Deal price cannot be blank")
          : null,
      //curr: (value) => (value.length < 1 ? t('currency_cannot_be_blank', 'Currency cannot be blank') : null),
      hashtags: (value) =>
        value.length < 1
          ? t("hashtags_cannot_be_blank", "Hashtags cannot be blank")
          : null,
    },
  });
  const onApply = (data) => {
    form.reset();
    if (!data) return;
    let wtsb = data.type == "WTS" || data.type == "WTB" ? data.type : "";
    let hastags =
      data.hashtags && data.hashtags.length > 0 ? data.hashtags : [];
    form.setValues({
      wtsb: wtsb,
      title: data.title,
      hashtags: hastags,
    });
    setInitBody(data.details ? data.details : "");
    setHashData(() => {
      return hastags;
    });
    console.log(data);
  };
  let { open: openAI } = useAiParser(onApply);
  const {
    data: dataGet,
    errorMessage: errorMessageGet,
    succeeded: succeededGet,
    isLoading: isLoadingGet,
    executeGet: executeGet,
  } = useAxiosGet(BUILD_API("deals/company"), null);
  const {
    data: dataUOMS,
    errorMessage: errorMessageUOMS,
    succeeded: succeededUOMS,
    isLoading: isLoadingUOMS,
    executeGet: executeGetUOMS,
  } = useAxiosGet(BUILD_API("util/uoms"), null);
  const {
    data: dataCURR,
    errorMessage: errorMessageCURR,
    succeeded: succeededCURR,
    isLoading: isLoadingCURR,
    executeGet: executeGetCURR,
  } = useAxiosGet(BUILD_API("util/currencies"), null);
  const {
    data: dataWTSB,
    errorMessage: errorMessageWTSB,
    succeeded: succeededWTSB,
    isLoading: isLoadingWTSB,
    executeGet: executeGetWTSB,
  } = useAxiosGet(BUILD_API("util/wtsb"), null);

  let {
    data: dataDeal,
    isLoading: isLoadingDeal,
    succeeded: succeededDeal,
    errorMessage: errorMessageDeal,
    executePost,
  } = useAxiosPost(BUILD_API("deals/company"), form.values);
  let {
    data: dataPut,
    isLoading: isLoadingPut,
    succeeded: succeededPut,
    errorMessage: errorMessagePut,
    executePut,
  } = useAxiosPut(BUILD_API("deals/company"), form.values);

  const {
    data: hashGet,
    errorMessage: errorMessageHashGet,
    succeeded: succeededHashGet,
    executeGet: executeHashGet,
  } = useAxiosGet(BUILD_API("hashtags"), { searchterm: searchValue });

  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);

  const Info = (itm) => {
    let dataa = dataGet && dataGet.length > 0 ? dataGet[0] : {};
    return dataa[itm];
  };
  useEffect(() => {
    if (id != "new")
      executeGet({ url_e: BUILD_API("deals/company") + "/" + id });
    executeGetUOMS();
    executeGetCURR();
    executeGetWTSB();
  }, []);
  useEffect(() => {
    let errorMsg = errorMessageGet;
    if (errorMsg) error(errorMsg);

    if (succeededGet && dataGet) {
      let notchangable = !(
        !dataGet ||
        (dataGet && dataGet[0] && dataGet[0]["can_edit"] == "X")
      );
      setDealAlert(notchangable);
      setDisableSave(notchangable);

      if (dataGet[0].hashtags && dataGet[0].hashtags != "")
        dataGet[0].hashtags = dataGet[0].hashtags.split(" ");
      else dataGet[0].hashtags = [];

      if (dataGet[0].pictures && dataGet[0].pictures != "")
        dataGet[0].pictures = dataGet[0].pictures.split(" ");
      else dataGet[0].pictures = [];

      form.setValues(dataGet[0]);
      setInitBody(dataGet[0].body);
      setInitQty(dataGet[0]["quantity"]);
      setInitPrice(dataGet[0]["price"]);
      setHashData(() => {
        return dataGet[0].hashtags;
      });
      setPictures(() => {
        return dataGet[0].pictures;
      });
      setMain_pic(dataGet[0].main_pic);
      form.resetDirty();
    }
  }, [errorMessageGet, succeededGet]);

  useEffect(() => {
    let errorMsg = errorMessageDeal || errorMessagePut;

    if (succeededDeal || succeededPut) {
      form.resetDirty();
      let succeededMsg = dataDeal?.message || dataPut?.message;
      succeed(succeededMsg);
      if (succeededDeal) navigate("../mydeals", { replace: true });
    }

    if (errorMsg) error(errorMsg);
  }, [errorMessageDeal, succeededDeal, errorMessagePut, succeededPut]);

  useEffect(() => {
    let errorMsg = errorMessageHashGet;
    if (errorMsg) error(errorMsg);
    if (succeededHashGet && hashGet) {
      setHashData(() => {
        if (hashGet) {
          let hashtags = form.values.hashtags;
          if (hashtags && hashtags.length > 0) {
            hashtags.map((item) => {
              let found = false;
              hashGet.map((itemS) => {
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

  const updatePicturesFromImages = () => {
    let pics: any = [];
    for (let i = 0; i < images.length; i++) {
      let img = images[i];
      if (
        img.uploaded &&
        img.image_upload_data &&
        img.image_upload_data.id &&
        img.image_upload_data.id != ""
      )
        pics.push(img.image_upload_data.id);
    }
    return pics;
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && unsavedChanges) {
        console.log("Saving state due to tab change...");
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [unsavedChanges]);

  const save = () => {
    let body = bodyRef?.current?.editorObject?.currentContent;
    form.setValues({
      body: body,
      main_pic: main_pic,
      pictures: updatePicturesFromImages(),
      // is_draft
    });

    form.validate();
    if (!form.isValid()) {
      info(t("some_fields_blank", "Some fields must be filled!"));
      return;
    }

    if (id == "new") executePost();
    else executePut(BUILD_API("deals/company") + "/" + id);
  };
  const [hashData, setHashData] = useState<any>(() => {
    return [];
  });
  let handlnotfound = useAppMultiSelectToAddMissedSearchVal<any>(setHashData);
  // const [currentHash, setCurrentHash] = useState<any>('')
  // const [searchValue, onSearchChange] = useState<any>('');
  let blocker = useBlocker(
    ({ currentLocation, nextLocation }: any) =>
      !!form.isDirty() && currentLocation.pathname !== nextLocation.pathname
  );
  const is_draft = () => {
    return form.values.is_draft == "X";
  };
  return (
    <>
      <AppHeader
        title={t("deal_title_my_deals", "My Deals")}
        titleClicked={() => {
          navigate("../mydeals", { replace: true });
        }}
      >
        <Group justify="right" gap="xs">
          <Button
            variant="gradient"
            gradient={{ from: "teal", to: "blue", deg: 60 }}
            disabled={disableSave}
            type="button"
            style={{ width: 100 }}
            onClick={() => {
              openAI();
            }}
          >
            {t("ai_parse", "By AI")}
          </Button>
          <Button
            disabled={disableSave}
            type="button"
            style={{ width: 100 }}
            onClick={() => {
              save();
            }}
          >
            {t("save", "Save")}
          </Button>
        </Group>
      </AppHeader>
      <ConfirmUnsaved blocker={blocker} />

      <Box
        className={classesG.editMax800}
        opacity={blocker.state === "blocked" ? 0.1 : 1}
        style={{
          pointerEvents: blocker.state === "blocked" ? "none" : "inherit",
        }}
      >
        {dealAlert && (
          <Alert
            onClose={() => {
              setDealAlert(false);
            }}
            mb="md"
            icon={<IconAlertCircle size={22} />}
            color="red"
            withCloseButton
          >
            {t(
              "deal_cannot_be_changed",
              "This deal cannot be changed. Once a deal created, it can only be modified within an hour."
            )}
          </Alert>
        )}
        <LoadingOverlay
          visible={isLoadingGet || isLoadingDeal || isLoadingPut}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <form>
          <ImagesZoneDeals
            images={images}
            setImages={setImages}
            pictures={pictures}
            main_pic={main_pic}
            setMain_pic={setMain_pic}
            onChange={() => {}}
          />
          <Grid gutter={small ? 5 : medium ? 10 : 15}>
            {
              <Grid.Col span={{ base: 12 }}>
                <Group justify="flex-start" gap="md" mt="md">
                  <Radio
                    disabled={id != "new"}
                    style={{ cursor: "pointer" }}
                    checked={is_draft()}
                    onChange={() => {
                      form.setValues({ is_draft: "X" });
                    }}
                    label={
                      <Box style={{ cursor: "pointer" }}>
                        {t("draft", "Draft")}
                      </Box>
                    }
                  />
                  <Radio
                    disabled={id != "new"}
                    style={{ cursor: "pointer" }}
                    checked={!is_draft()}
                    onChange={() => {
                      form.setValues({ is_draft: "" });
                    }}
                    label={
                      <Box style={{ cursor: "pointer" }}>
                        {t("final", "Final")}
                      </Box>
                    }
                  />
                </Group>
              </Grid.Col>
            }
            <Grid.Col span={{ base: 12, md: 6 }}>
              <AppSelect
                {...form.getInputProps("wtsb")}
                onBlur={() => form.validateField("wtsb")}
                readOnly={disableSave}
                renderOption={renderWtsWtbDropVOption}
                searchable
                withAsterisk
                clearable
                label={t("deal_type", "Deal Type")}
                placeholder={t("deal_type", "Deal Type")}
                limit={8}
                maxDropdownHeight={500}
                data={dataWTSB?.map((itm) => {
                  return {
                    value: itm.wtsb,
                    label: itm.wtsb_desc,
                    dir: itm.dir,
                  };
                })}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12 }}>
              <TextInput
                c="green"
                withAsterisk
                autoComplete="off"
                label={t("deal_title", "Title")}
                placeholder={t("deal_title", "Title")}
                {...form.getInputProps("title")}
                readOnly={disableSave}
              />
              <Text fz="xs">
                {150 - form.values.title.length}{" "}
                {t("characters_left", "Characters left")}
              </Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12 }}>
              <AppMultiSelect
                readOnly={disableSave}
                {...form.getInputProps("hashtags")}
                // onKeyDown={(event) => {
                //   if (event.code === "Space") {
                //     event.preventDefault();
                //   }
                // }}
                required
                withAsterisk
                data={ArrayToAppSelect(
                  hashData && hashData.length > 0 ? hashData : []
                )}
                label="Hashtag#"
                placeholder="#"
                searchable
                searchValue={searchValue}
                onSearchChange={(event) => {
                  onSearchChange(event);
                  executeHashGet();
                }}
                clearable
                maxDropdownHeight={250}
                // valueComponent={HashValue}
                // itemComponent={HashItem}
                limit={20}
                // nothingFoundMessage={(query) => `+ Create ${query}`}
                // onCreate={(query) => {
                //   const item = { value: query, label: query };
                //   setHashData((current) => [...current, item]);
                //   return item;
                // }}

                createOnNotFound={async (val) => {
                  return await handlnotfound({ value: val, label: val });
                }}
                description={t(
                  "hashtags_infor_message",
                  "Add hashtags that best fit your deal, as they will help improve its visibility in searches."
                )}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12 }}>
              <Group gap={0} justify="left">
                <NumericEntry
                  initVal={initQty}
                  formKey="quantity"
                  form={form}
                  mr="sm"
                  withAsterisk
                  autoComplete="off"
                  label={t("deal_quantity", "Quantity")}
                  placeholder={t("deal_quantity", "Quantity")}
                />
                <AppSelect
                  withAsterisk
                  {...form.getInputProps("uom")}
                  onBlur={() => form.validateField("uom")}
                  label={t("uom", "UOM")}
                  placeholder={t("uom", "UOM")}
                  limit={8}
                  maxDropdownHeight={500}
                  data={dataUOMS?.map((itm) => {
                    return {
                      value: itm.uom,
                      label: itm.uom_desc,
                    };
                  })}
                />
              </Group>
              <Tooltip
                label={t(
                  "zero_allowed_message",
                  "The quantity will show as N/A in the Trading Floor!."
                ).toString()}
              >
                <Group justify="left" gap={0} style={{ cursor: "help" }}>
                  <Text fz="xs">
                    {t("zero_cases_allowed", "Zero allowed.")}
                  </Text>
                  <IconInfoSquareRoundedFilled size={16} />
                </Group>
              </Tooltip>
            </Grid.Col>
            <Grid.Col span={{ base: 12 }}>
              <Group gap={0} justify="left">
                <NumericEntry
                  initVal={initPrice}
                  formKey="price"
                  form={form}
                  mr="sm"
                  withAsterisk
                  autoComplete="off"
                  label={t("deal_price", "Price")}
                  placeholder={t("deal_price", "Price")}
                />

                <AppSelect
                  withAsterisk
                  {...form.getInputProps("curr")}
                  onBlur={() => form.validateField("curr")}
                  label={t("currency", "Currency")}
                  placeholder={t("currency", "Currency")}
                  limit={8}
                  maxDropdownHeight={500}
                  data={dataCURR?.map((itm) => {
                    return {
                      value: itm.curr,
                      label: itm.curr_symbol,
                    };
                  })}
                />
              </Group>
              <Tooltip
                label={t(
                  "zero_allowed_message",
                  "The price will show as N/A in the Trading Floor!."
                ).toString()}
              >
                <Group justify="left" gap={0} style={{ cursor: "help" }}>
                  <Text fz="xs">
                    {t("zero_cases_allowed", "Zero allowed.")}
                  </Text>
                  <IconInfoSquareRoundedFilled size={16} />
                </Group>
              </Tooltip>
            </Grid.Col>

            <Grid.Col span={{ base: 12 }}>
              {
                <>
                  <Text className={`${classesG.textAsLabel}`}>
                    {t("deal_details", "Deal details")}
                  </Text>
                  <Text size="xs">
                    {t(
                      "deal_desc",
                      "Please provide information as much as possible about your products, the details will be showing in the details screen when the user clicks on the title!."
                    )}
                  </Text>
                  <MemoEditorApp
                    ref={bodyRef}
                    content={initBody ? initBody : ""}
                    edit={!disableSave}
                  />
                </>
              }
            </Grid.Col>
          </Grid>
        </form>
      </Box>
    </>
  );
};
export const DealSearch = (props) => {
  const { error, succeed, info } = useMessage();
  let { lastXDays, lastXHours } = useDateValues({
    fill: DATETIMEVALUES_FILL.ALL,
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation("private", { keyPrefix: "deals" });
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const navigate = useNavigate();
  let {
    checks: checkDbData,
    curr: dataCURR,
    wtsb: dataWTSB,
    privacy: dataPrivacies,
  } = useDbData();

  useEffect(() => {
    checkDbData();
  }, []);
  const form = useForm({
    initialValues: {
      expired: G.ifNull(searchParams.get("expired"), "no"),
      expired_in_hours: G.ifNull(searchParams.get("expired_in_hours"), ""),
      title: G.ifNull(searchParams.get("title"), ""),
      wtsb: G.anyToArr(searchParams.get("wtsb")),
      privacy: G.ifNull(searchParams.get("privacy"), ""),
      searchterm: G.ifNull(searchParams.get("searchterm"), ""),
      fromD: G.ifNull(searchParams.get("fromD"), ""),
      toD: G.ifNull(searchParams.get("toD"), ""),
      period_hours: G.ifNull(searchParams.get("period_hours"), ""),
      period_days: G.ifNull(searchParams.get("period_days"), ""),
      hashtags_and: G.anyToArr(searchParams.get("hashtags_and")),
      hashtags_or: G.anyToArr(searchParams.get("hashtags_or")),
    },
  });

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

  const [searchValue, onSearchChange] = useState("");
  const [searchValue2, onSearch2Change] = useState("");
  const [hashData, setHashData] = useState<any>(() => {
    return G.anyToArr(searchParams.get("hashtags_and"));
  });
  const [hashData2, setHash2Data] = useState<any>(() => {
    return G.anyToArr(searchParams.get("hashtags_or"));
  });
  const {
    data: hashGet,
    errorMessage: errorMessageHashGet,
    succeeded: succeededHashGet,
    executeGet: executeHashGet,
  } = useAxiosGet(BUILD_API("hashtags"), { searchterm: searchValue });
  const {
    data: hashGet2,
    errorMessage: errorMessageHashGet2,
    succeeded: succeededHashGet2,
    executeGet: executeHashGet2,
  } = useAxiosGet(BUILD_API("hashtags"), { searchterm: searchValue2 });

  useEffect(() => {
    let errorMsg = errorMessageHashGet;
    if (errorMsg) error(errorMsg);
    if (succeededHashGet && hashGet) {
      setHashData(() => {
        if (hashGet) {
          let hashtags = form.values.hashtags_and;
          if (hashtags && hashtags.length > 0) {
            hashtags.map((item) => {
              let found = false;
              hashGet.map((itemS) => {
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
  useEffect(() => {
    let errorMsg = errorMessageHashGet2;
    if (errorMsg) error(errorMsg);
    if (succeededHashGet2 && hashGet2) {
      setHash2Data(() => {
        if (hashGet2) {
          let hashtags = form.values.hashtags_or;
          if (hashtags && hashtags.length > 0) {
            hashtags.map((item) => {
              let found = false;
              hashGet2.map((itemS) => {
                if (item == itemS) {
                  found = true;
                  return;
                }
              });
              if (!found) {
                hashGet2.push(item);
              }
            });
          }
          return hashGet2;
        }
        return [];
      });
    }
  }, [errorMessageHashGet2, succeededHashGet2]);
  return (
    <>
      <SearchPannel
        action={props.action}
        searchterm={t("deal_searchterm", "Search")}
        grid={props.grid}
        listDirs={[
          // { id: 'full', name: t('full', 'Full List') },
          // { id: 'comp1', name: t('copressed', 'Compressed') },
          // { id: 'comp2', name: t('copressed_more', 'Compressed More') }
          { id: "grid_view", name: t("grid_view", "Grid View") },
          { id: "list_view", name: t("list_view", "List View") },
          { id: "img_grid_view", name: t("img_grid_view", "Image Grid View") },
          { id: "spread", name: t("spread", "Spreadsheet(Edit Multiple)") },
        ]}
        sortBy={[
          {
            id: "title",
            name: t("deal_title", "Deal Title"),
          },
          {
            id: "time_in_hours_to_expire",
            name: t("expired_in_hours", "Expired In Hours"),
          },
          {
            id: "reached_by_search_count_last_hr",
            name: t(
              "reached_by_search_count_last_hr",
              "Reached by search in the last hour"
            ),
            asc: t("min_to_max", "Min To Max"),
            desc: t("max_to_min", "Max To Min"),
          },
          {
            id: "reached_by_share_count_last_hr",
            name: t(
              "reached_by_share_count_last_hr",
              "Reached by sharing in the last hour"
            ),
            asc: t("min_to_max", "Min To Max"),
            desc: t("max_to_min", "Max To Min"),
          },
          {
            id: "reached_by_search_count_last_24hr",
            name: t(
              "reached_by_search_count_last_24hr",
              "Reached by search in the last 24 hours"
            ),
            asc: t("min_to_max", "Min To Max"),
            desc: t("max_to_min", "Max To Min"),
          },
          {
            id: "reached_by_share_count_last_24hr",
            name: t(
              "reached_by_share_count_last_24hr",
              "Reached by sharing in the last 24 hours"
            ),
            asc: t("min_to_max", "Min To Max"),
            desc: t("max_to_min", "Max To Min"),
          },
          {
            id: "last_posted_on",
            name: "Deal Age",
            asc: t("old_to_new", "Old To New"),
            desc: t("new_to_p;d", "New To Old"),
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
            {"create multiselect WTSWTB"}
            {/* <MultiSelect
              itemComponent={WtsWtbDropV}
              {...form.getInputProps("wtsb")}
              searchable
              clearable
              label={t("deal_type", "Deal Type")}
              placeholder={t("deal_type", "Deal Type")}
              data={dataWTSB?.map((itm) => {
                return {
                  value: itm.wtsb,
                  label: itm.wtsb_desc,
                  dir: itm.dir,
                };
              })}
            /> */}
          </Grid.Col>
          <Grid.Col>
            <TextInput
              autoComplete="off"
              label={t("deal_title_only", "Search Deal Title Only")}
              placeholder={t("search", "Search")}
              {...form.getInputProps("title")}
            />
          </Grid.Col>
          <Grid.Col>
            {"create multi hashtags"}
            {/* <MultiSelect
              {...form.getInputProps("hashtags_and")}
              onKeyDown={(event) => {
                if (event.code === "Space") {
                  event.preventDefault();
                }
              }}
              required
              data={hashData}
              label="Hashtag(All)#"
              placeholder="#"
              searchable
              searchValue={searchValue}
              onSearchChange={(event) => {
                executeHashGet();
                return onSearchChange(event);
              }}
              clearable
              maxDropdownHeight={250}
              valueComponent={HashValue}
              itemComponent={HashItem}
              limit={20}
              onCreate={(query) => {
                const item = { value: query, label: query };
                setHashData((current) => [...current, item]);
                return item;
              }}
            /> */}
          </Grid.Col>
          <Grid.Col>
            {"create multi select hastags"}
            {/* <MultiSelect
              {...form.getInputProps("hashtags_or")}
              onKeyDown={(event) => {
                if (event.code === "Space") {
                  event.preventDefault();
                }
              }}
              required
              data={hashData2}
              label="Hashtag(Any)#"
              placeholder="#"
              searchable
              searchValue={searchValue2}
              onSearchChange={(event) => {
                executeHashGet2();
                return onSearch2Change(event);
              }}
              clearable 
              maxDropdownHeight={250}
              valueComponent={HashValue}
              itemComponent={HashItem}
              limit={20}
              onCreate={(query) => {
                const item = { value: query, label: query };
                setHash2Data((current) => [...current, item]);
                return item;
              }}
            /> */}
          </Grid.Col>
          <Grid.Col>
            <HoursRangeSelect
              data={lastXHours}
              {...form.getInputProps("expired_in_hours")}
              label={t("share_expired_in_option", "Expired In")}
              placeholder={t("share_expired_in_option", "Expired In")}
            />
          </Grid.Col>

          <Grid.Col>
            <ExpiredSelect
              disabled={form.values.expired_in_hours != ""}
              {...form.getInputProps("expired")}
            />
          </Grid.Col>

          {/* <Grid.Col>
                        <TextInput autoComplete="off" label={t('searchterm', "Search")} placeholder={t('searchterm', "Search")} {...form.getInputProps('searchterm')} />
                    </Grid.Col> */}

          <Grid.Col>
            <Group justify="space-between" gap={4}>
              <Box maw={"calc(50% - 4px)"}>
                <HoursRangeSelect
                  zIndex={501}
                  data={lastXHours}
                  {...form.getInputProps("period_hours")}
                  label={t("posted_last_hours", "Posted in the last(hours)")}
                  placeholder={t(
                    "posted_last_hours",
                    "Posted in the last hours"
                  )}
                />
              </Box>
              <Box maw={"calc(50% - 4px)"}>
                <HoursRangeSelect
                  data={lastXDays}
                  {...form.getInputProps("period_days")}
                  label={t("posted_days", "Posted(days)")}
                  placeholder={t("posted_days", "Posted in the last days")}
                />
              </Box>
            </Group>
          </Grid.Col>
          <Grid.Col>
            <DateRange
              fromD="fromD"
              toD="toD"
              form={form}
              label={t("posted_in_date_range", "Posted In Date range")}
              placeholder={t("posted_in_date_range", "Posted In Date range")}
            />
          </Grid.Col>
        </Grid>
      </SearchPannel>
    </>
  );
};

export const NumericEntry = ({ initVal, form, formKey, ...others }) => {
  return (
    <NumericFormat
      value={initVal}
      customInput={TextInput}
      thousandSeparator={thousandSep()}
      decimalSeparator={decimalSep()}
      onBlur={(e) => {
        let val = e.currentTarget.value
          .replace(thousandSep(), "")
          .replace(decimalSep(), ".");
        form.values[formKey] = val;
        form.setTouched(form.getInputProps(formKey));
        form.setDirty(form.getInputProps(formKey));
      }}
      {...others}
    />
  );
};

const DealsList = ({ data, searchMyDeals, renew_or_terminate, t }) => {
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const { classes: classesG, cx } = useGlobalStyl();
  const navigate = useNavigate();

  const [selection, setSelection] = useState(["1"]);

  const [popUpObj, setPopUpObj] = useState<any>("");
  const [forceOpenLinkInfo, setForceOpenLinkInfo] = useState<any>("");

  const rows = data.map((item) => {
    const selected = selection.includes(item.id);
    return (
      <Table.Tr
        key={item.id}
        className={
          selected
            ? classesG.rowSelected
            : "" + item.action == "renew"
            ? classesG.tableRenew
            : item.action == "terminate"
            ? classesG.tableTerminate
            : ""
        }
      >
        <Table.Td>
          <Box
            className={`${
              item.deal_dir === "I"
                ? classesG.titleDealsWTB
                : classesG.titleHref2
            }`}
            onClick={() => {
              navigate(`../mydeals/${item.id}`);
            }}
          >
            {/* <Text style={{ whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }} td={item.inactive == 'X' ? "line-through" : ""}>{`${item.wtsb} ${item.title}`}</Text> */}

            <Text fw={700} td={item.expired == "X" ? "line-through" : ""}>
              <Highlight
                style={{
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
                highlight={[
                  searchMyDeals && searchMyDeals.title
                    ? searchMyDeals.title
                    : "",
                  searchMyDeals && searchMyDeals.searchterm
                    ? searchMyDeals.searchterm
                    : "",
                ]}
                highlightStyles={(theme) => {
                  return WTSBTheme(theme, "", item.deal_dir);
                }}
              >
                {`${item.id} ${item.wtsb} ${item.title}`}
              </Highlight>
            </Text>
          </Box>
        </Table.Td>
        <Table.Td>
          <Text style={{ fontSize: "0.8rem", color: "gray" }}>
            {D.utc_to_distance(item.last_posted_on)}
          </Text>
        </Table.Td>
        <Table.Td>
          <Text
            style={{ fontSize: "0.8rem" }}
            c={item.expired == "X" ? "red" : "gray.6"}
          >
            {D.utc_to_distance(item.expired_on)}
          </Text>
          {/* {item.expired =='' && <Text style={{ fontSize: "0.8rem", color: "gray" }}>{D.utc_to_distance(item.expired_on)}</Text>} */}
          {/* {item.expired == 'X' && <Text style={{ fontSize: "0.8rem" }} c="red">{t('expired', 'Expired')}</Text>} */}
          {/* {item.time_in_hours_to_expire >= 0 && <Text span={true} className={classesG.expired_in} >
                        {item.time_in_hours_to_expire} {t('hrs', 'hrs')}
                    </Text>
                    }
                    {item.time_in_hours_to_expire < 0 && <Text span={true} className={classesG.expired_in} >
                        {t('expired', 'Expired')}
                    </Text>
                    } */}
        </Table.Td>
        <Table.Td>
          <Group justify="right" gap={0} c="blue.5" fw="bolder">
            <NumericFormat
              decimalScale={0}
              readOnly={true}
              displayType="text"
              value={`${item.renewed_count}`}
              thousandSeparator={thousandSep()}
              decimalSeparator={decimalSep()}
            />
            <Text>x</Text>
          </Group>
        </Table.Td>
        {/* <Table.Td style={{ paddingRight: "2px" }}>
                    <Group justify='right' gap={0}>
                       
                        <NumericFormat decimalScale={0} readOnly={true} displayType="text" value={`${item.quantity}`} thousandSeparator={thousandSep()} decimalSeparator={decimalSep()} />

                    </Group>
                </Table.Td> */}
        {/* <Table.Td style={{ padding: "0px", margin: "0px", width: "0px" }}>
                    {item.uom}
                </Table.Td> */}
        {/* <Table.Td style={{ paddingRight: "2px" }}>
                    <Group justify='right' gap={0}>
                        
                        <NumericFormat decimalScale={1} readOnly={true} displayType="text" value={`${item.price}`} thousandSeparator={thousandSep()} decimalSeparator={decimalSep()} />

                    </Group>
                </Table.Td> */}
        {/* <Table.Td style={{ padding: "0px", margin: "0px", paddingRight: "5px", width: "0px" }}>
                    {item.curr_symbol}
                </Table.Td> */}
        <Table.Td>
          <Text c={item.privacy_id == "P" ? "blue" : "red"}>
            {item.privacy}
          </Text>
        </Table.Td>
        <Table.Td className={classesG.tableBk1} style={{ textAlign: "right" }}>
          <Box fw="bold" m={0} p={0}>
            <NumericFormat
              decimalScale={0}
              readOnly={true}
              displayType="text"
              value={`${item.reached_by_search_count_last_hr}`}
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
              value={`${item.reached_by_share_count_last_hr}`}
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
              value={`${item.reached_by_search_count_last_24hr}`}
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
              value={`${item.reached_by_share_count_last_24hr}`}
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
              value={`${item.reached_by_search_count}`}
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
              value={`${item.reached_by_share_count}`}
              thousandSeparator={thousandSep()}
              decimalSeparator={decimalSep()}
            />
          </Box>
        </Table.Td>
        <Table.Td>
          <DealMenu
            item={item}
            t={t}
            renew_or_terminate={renew_or_terminate}
            setPopUpObj={setPopUpObj}
            navigate={navigate}
            setForceOpenLinkInfo={setForceOpenLinkInfo}
            classesG={classesG}
          />
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <>
      <PopDealStatInfo dataDeal={popUpObj} forceOpen={forceOpenLinkInfo}>
        <></>
      </PopDealStatInfo>

      <ScrollArea mt="lg">
        <Table
          verticalSpacing="xs"
          highlightOnHover
          className={`${"TableCss"} ${"TableCss-Deals"}  ${classesG.table}  `}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{t("name", "Name")}</Table.Th>
              <Table.Th>{t("posted", "Posted")}</Table.Th>

              <Table.Th>{t("expire", "Expire")}</Table.Th>
              <Table.Th style={{ textAlign: "right" }}>
                {t("renewed", "Renewed")}
              </Table.Th>
              <Table.Th>{t("privacy", "Privacy")}</Table.Th>
              {/* <Table.Th style={{ textAlign: "right" }}>{t('quantity', 'Quantity')}</Table.Th>
                            <Table.Th></Table.Th>
                            <Table.Th style={{ textAlign: "right" }}>{t('price', 'Price')}</Table.Th>
                            <Table.Th></Table.Th> */}
              <Table.Th
                className={`${classesG.tableBk1} ${classesG.help}`}
                colSpan={2}
                style={{ textAlign: "center" }}
              >
                <Tooltip
                  label={t(
                    "reached_by_sharing_n_search_1hr",
                    "Reached through sharing and search in the last hour"
                  )}
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
                    "reached_by_sharing_n_search_24_hrs",
                    "Reached through sharing and search in the last 24 hours"
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
                <Tooltip
                  label={t(
                    "reached_by_sharing_n_search_any_time",
                    "Total reached through sharing and search"
                  )}
                >
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
      </ScrollArea>
    </>
  );
};
const DealMenu = ({
  item,
  renew_or_terminate,
  navigate,
  setPopUpObj,
  setForceOpenLinkInfo,
  t,
  classesG,
}) => {
  return (
    <Group justify="right" gap={1}>
      {item.action == "processing" && <Loader size={25} variant="oval" />}
      {item.action != "processing" && (
        <>
          {item.expired == "X" && (
            <Tooltip label={t("renew", "Renew")}>
              <ActionIcon
                className={classesG.renewIcon}
                size="md"
                variant="subtle"
                onClick={() => {
                  renew_or_terminate(item.id, "renew");
                }}
              >
                <IconRotate2 size={25} />
              </ActionIcon>
            </Tooltip>
          )}
          {item.expired == "" && (
            <Tooltip label={t("terminate", "Terminate")}>
              <ActionIcon
                className={classesG.terminateIcon}
                size="md"
                variant="subtle"
                onClick={() => {
                  renew_or_terminate(item.id, "terminate");
                }}
              >
                <IconTimeDurationOff size={25} />
              </ActionIcon>
            </Tooltip>
          )}
        </>
      )}
      <Menu position="left-start" offset={0} withinPortal={true}>
        <Menu.Target>
          <ActionIcon size="md" variant="subtle">
            <IconDots size={25} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            leftSection={<IconEdit size={20} stroke={1.5} />}
            onClick={() => {
              navigate(`../mydeals/${item.id}`);
            }}
          >
            {t("edit_deal", "Edit Deal")}
          </Menu.Item>

          {item.expired == "X" && (
            <Menu.Item
              c="teal.4"
              disabled={item.action == "processing"}
              leftSection={<IconRotate2 size={20} stroke={1.5} />}
              onClick={() => {
                renew_or_terminate(item.id, "renew");
              }}
            >
              {t("renew_deal", "Renew Deal")}
            </Menu.Item>
          )}

          {item.expired == "" && (
            <Menu.Item
              c="red.5"
              disabled={item.action == "processing"}
              leftSection={<IconTimeDurationOff size={20} stroke={1.5} />}
              onClick={() => {
                renew_or_terminate(item.id, "terminate");
              }}
            >
              {t("terminate_deal", "Terminate Deal")}
            </Menu.Item>
          )}
          <Menu.Divider />
          <Menu.Item
            leftSection={<IconFileAnalytics size={20} stroke={1.5} />}
            onClick={() => {
              setPopUpObj(item);
              setForceOpenLinkInfo(() => {
                return new Date().getTime().toString();
              });
            }}
          >
            {t("deal_stats", "Deal Stats")}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
};

const ParseDeal = ({ onApply }) => {
  const small = useSelector(selectSmall);
  const { t } = useTranslation("private", { keyPrefix: "deals" });
  const [value, setValue] = useState("");
  const { classes: classesG } = useGlobalStyl();
  const { data, isLoading, errorMessage, succeeded, executePost } =
    useAxiosPost(BUILD_API("ai-parse-deal"), { deal: value });
  useEffect(() => {
    if (succeeded) {
    }
  }, []);
  const parse = () => {
    executePost();
  };
  return (
    <>
      <LoadingOverlay
        visible={isLoading}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <Box p="lg">
        <Textarea
          placeholder={t("deal_to_patse", "Deal To parse")}
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          autosize
          minRows={5}
          maxRows={10}
        />
        <Group p="md" justify="right">
          <Button
            variant="light"
            onClick={() => {
              closeModal("ai_parser_pop_up");
            }}
          >
            {t("close", "Close")}
          </Button>
          <Button
            onClick={parse}
            variant="gradient"
            gradient={{ from: "teal", to: "blue", deg: 60 }}
          >
            {t("parse", "Parse")}
          </Button>
        </Group>
        <Box className={classesG.seperator2} />
        <Stack mt="xs">
          <TextInput
            label={t("deal_type", "Deal Type")}
            placeholder={t("deal_type", "Deal Type")}
            readOnly
            value={
              data?.type == "WTS"
                ? t("wts", "Want to sale")
                : data?.type == "WTB"
                ? t("wtb", "Want to buy")
                : t("wtbs_not_clear", "Want to sale/buy is not clear")
            }
          />
          <TextInput
            label={t("parsed_title", "Parsed Title")}
            placeholder={t("parsed_title", "Parsed Title")}
            readOnly
            value={data?.title}
          />
          <Card radius="sm" p="0" pt="0" pl={5} pr={5} withBorder>
            {data?.hashtags && (
              <Box className={`${classesG.hashtagboardContainer2}`}>
                {data.hashtags.map((hash) => {
                  return (
                    <Box
                      className={`${"hash-parent"}  ${
                        classesG.hashtagboardElem
                      }`}
                    >
                      <HashValue4Boardd2 label={hash} />
                    </Box>
                  );
                })}
              </Box>
            )}
          </Card>
          <Card radius="sm" p="md" pt="xs" withBorder>
            <div
              dangerouslySetInnerHTML={{
                __html: data?.details?.replace(/\n/g, "<br>"),
              }}
            ></div>
          </Card>
          <Group p="md" justify="right">
            <Button
              variant="filled"
              onClick={() => {
                if (onApply) onApply(data);
                closeModal("ai_parser_pop_up");
              }}
            >
              {t("apply", "Apply")}
            </Button>
          </Group>
        </Stack>
      </Box>
    </>
  );
};

const useAiParser = (onApply) => {
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);

  const open = () => {
    modals.open({
      // styles: {
      //   content: { backgroundColor: "rgba(0, 0, 0, 0.5) !important" },
      // },
      padding: 0,
      yOffset: 0,
      xOffset: 0,
      modalId: "ai_parser_pop_up",
      fullScreen: small || medium ? true : false,
      withCloseButton: true,
      withOverlay: true,
      withinPortal: true,
      size: small || medium ? "100%" : "65vw",
      onClose: () => {
        closeModal("ai_parser_pop_up");
      },
      children: <ParseDeal onApply={onApply} />,
    });
  };
  return { open };
};
