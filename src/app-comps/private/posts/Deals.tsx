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
  Center,
  Flex,
  Modal,
  Tabs,
  Checkbox,
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
  IconTrashFilled,
  IconCircleChevronsLeft,
  IconStackPop,
  IconOctagonPlus,
  IconRefresh,
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
  data,
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
import appClasses from "../../../app.module.css";

import {
  renderWtsWtbDropVOption,
  WtsWtbDropV,
} from "../../../global/WtsWtbDropV";
import { ExpiredSelect } from "../../../global/ExpiredSelect";
import { useDisclosure, useHover } from "@mantine/hooks";
import { CardIn } from "../../../global/CardIn";
import {
  DATETIMEVALUES_FILL,
  DateRange,
  HoursRangeSelect,
  useDateValues,
} from "../../../hooks/useDateRange";

import { useDbData } from "../../../global/DbData";
import { MemoEditorApp } from "../../../global/AppEditor";
import {
  HashtagsAlert,
  HashTagsInput,
  HashValue4Boardd2,
  SplitHashtags,
} from "../../../global/global-comp/Hashtags";
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
import { WtsbMulti } from "../../../global/global-comp/Wtsb";
import { AddByPaste } from "../../../global/global-comp/Spreadsheet/Table";
import { MassDealEntry } from "./DealsEntryMass";

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
  } = useDealToShareMain();

  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const large = useSelector(selectLarge);
  const xlarge = useSelector(selectxLarge);
  const xlarger = useSelector(selectxLarger);
  const { classes: classesG } = useGlobalStyl();
  const [objectUpdated, setObjectUpdated] = useState<any>({});
  const [showHiddenMsg, setShowHiddenMsg] = useState(true);
  let { open: openAI } = useAiParser(() => {}, small || medium);
  // const [isBusy,setIsBusy]=useState(false)
  useEffect(() => {
    dispatch(changeActive("mydeals"));
  }, []);

  useEffect(() => {
    if (!opened_share) refresh(); //okokok
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
      setListDir((prev) => {
        if (prev == "img_grid_view" || prev=='spread') return prev;
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
        <Group justify="right" gap={small || medium ? "2px" : "xs"}>
          <Tooltip
            label={t("share_by_default_chanel", "Share by default channel.")}
          >
            <Button
              variant="light"
              color={theme == "dark" || theme == "dim" ? "orange" : "orange"}
              onClick={() => {
                //okokok
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
                //okokok
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

          <AddByPaste isIcon={false} />
          <Tooltip label={t("add_new_deal_by_ai", "Add new deals by AI.")}>
            <Button
              variant="gradient"
              gradient={{ from: "teal", to: "blue", deg: 60 }}
              type="button"
              style={{ width: small || medium ? "auto" : 120 }}
              onClick={() => {
                openAI();
              }} 
            >
              <Group>
                <IconOctagonPlus />
                {!(small || medium) && <Box>{t("by_ai", "By AI")}</Box>}
              </Group>
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
            {(!data || data.length <= 0)  && listDir != "spread" && (
              <NoDataFound title={t("no_deals_found", "No Deals Found!.")} />
            )}
            {(!(!data || data.length <= 0)  || listDir == "spread") && (
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
                {listDir == "spread" && !isLoading && (
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
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
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
  };
  let { open: openAI } = useAiParser(() => {}, small || medium);
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

  let {
    data: dataAction,
    isLoading: isLoadingAction,
    succeeded: succeededAction,
    errorMessage: errorMessageAction,
    executePut: executAction,
  } = useAxiosPut(BUILD_API("deals/company"), {});
  // BUILD_API("deals/company/") + id + "/" + action,

  const renew_or_terminate = (action) => {
    executAction(BUILD_API("deals/company/") + id + "/" + action);
  };
  useEffect(() => {
    if (errorMessageAction) error(errorMessageAction);
    if (succeededAction) {
      let succeededMsg = dataAction?.message;
      succeed(succeededMsg);
    }
  }, [succeededAction, errorMessageAction]);
  const Info = (itm) => {
    let dataa = dataGet && dataGet.length > 0 ? dataGet[0] : {};
    return dataa[itm];
  };
  useEffect(() => {
    refresh();
    executeGetUOMS();
    executeGetCURR();
    executeGetWTSB();
  }, []);
  const refresh = () => {
    if (id != "new")
      executeGet({ url_e: BUILD_API("deals/company") + "/" + id });
  };
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
        dataGet[0].hashtags = dataGet[0].hashtags.split(",");
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

  return (
    <>
      <AppHeader
        title={t("deal_title_my_deals", "My Deals")}
        titleClicked={() => {
          navigate("../mydeals", { replace: true });
        }}
      >
        <Group justify="right" gap="xs">
           
          <Tooltip label={t("refresh", "Refresh")}>
            <Button
              variant="default"
              onClick={() => {
                refresh();
              }}
            >
              <IconRefresh />
            </Button>
          </Tooltip>
          {/* <AddByPaste isIcon={false} />
          <Tooltip label={t("add_new_deal_by_ai", "Add new deals by AI.")}>
            <Button
              variant="gradient"
              gradient={{ from: "teal", to: "blue", deg: 60 }}
              type="button"
              style={{ width: small || medium ? "auto" : 120 }}
              onClick={() => {
                openAI();
              }} 
            >
              <Group>
                <IconOctagonPlus />
                {!(small || medium) && <Box>{t("by_ai", "By AI")}</Box>}
              </Group>
            </Button>
          </Tooltip> */}
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
              <Grid.Col
                span={{ base: 12, md: 6 }}
                style={{ display: "flex", flexWrap: "nowrap" }}
              >
                {/* <Group justify="flex-start" gap="md" mt="md"> */}
                {/* <Radio
                    color="silver"
                    readOnly={id != "new"}
                    style={{ cursor: "pointer" }}
                    checked={is_draft()}
                    onChange={() => {
                      if (id != "new") return;
                      form.setValues({ is_draft: "X" });
                    }}
                    label={
                      <Box style={{ cursor: "pointer" }}>
                        {t("draft", "Draft")}
                      </Box>
                    }
                  /> */}
                <Radio.Group
                  value={form.values.is_draft}
                  withAsterisk
                  label={t(
                    "please_select_the_deal_v",
                    "Please select the deal version"
                  )}
                  description={t(
                    "draft_version_is",
                    "The draft version will not be published unless you renew it."
                  )}
                  w={"100%"}
                >
                  <Group justify="space-between" gap="sm" w={"100%"} grow>
                    <Box>
                      <Radio.Card
                        className={appClasses.RadioRoot}
                        radius="md"
                        value={"X"}
                        key={"X"}
                        onClick={() => {
                          if (id != "new") return;
                          form.setValues({ is_draft: "X" });
                        }}
                        w={"100%"}
                      >
                        <Group align="flex-start">
                          <Radio.Indicator disabled={id != "new"} />
                          <div>
                            <Text className={classesG.RadioLabel}>
                              {t("draft", "Draft")}
                            </Text>
                            <Text className={classesG.RadioDescription}>
                              {t("draft", "Draft")}
                            </Text>
                          </div>
                        </Group>
                      </Radio.Card>
                    </Box>
                    <Box>
                      <Radio.Card
                        className={appClasses.RadioRoot}
                        radius="md"
                        value={""}
                        key={"F"}
                        onClick={() => {
                          if (id != "new") return;
                          form.setValues({ is_draft: "" });
                        }}
                        w={"100%"}
                      >
                        <Group wrap="nowrap" align="flex-start">
                          <Radio.Indicator disabled={id != "new"} />
                          <div>
                            <Text className={classesG.RadioLabel}>
                              {t("final", "Final")}
                            </Text>
                            <Text className={classesG.RadioDescription}>
                              {t("final", "Final")}
                            </Text>
                          </div>
                        </Group>
                      </Radio.Card>
                    </Box>
                  </Group>
                </Radio.Group>

                {/* <Radio
                    readOnly={id != "new"}
                    style={{ cursor: "pointer" }}
                    checked={!is_draft()}
                    onChange={() => {
                      if (id != "new") return;
                      form.setValues({ is_draft: "" });
                    }}
                    label={
                      <Box style={{ cursor: "pointer" }}>
                        {t("final", "Final")}
                      </Box>
                    }
                  /> */}
                {/* </Group> */}
                {/* {id != "new" && (
                  <Box fz="sm" opacity={0.5} c="red">
                    {t("read_only", "Read Only")}
                  </Box>
                )}
                {id != "new" && is_draft() && (
                  <Box opacity={0.7}>
                    {t(
                      "to_switch_the_del",
                      "To switch the deal from draft please renew"
                    )}
                  </Box>
                )} */}
              </Grid.Col>
            }
            <Grid.Col span={{ base: 12, md: 6 }}>
              {id != "new" && dataGet && dataGet.length > 0 && (
                <Flex
                  h="100%"
                  w="100%"
                  justify={small || medium ? "flex-start" : "flex-end"}
                  align="center"
                  direction="row"
                  wrap="wrap"
                  pos="relative"
                  gap={"5px"}
                >
                  <LoadingOverlay
                    visible={isLoadingAction}
                    overlayProps={{ radius: "sm", blur: 2 }}
                  />
                  {(dataGet[0].is_draft == "X" ||
                    dataGet[0].expired == "X") && (
                    <Tooltip
                      label={
                        dataGet[0].is_draft == ""
                          ? t("post", "Post")
                          : t("renew", "Renew")
                      }
                    >
                      <Button
                        // className={classesG.renewIcon}
                        size="xl"
                        variant="filled"
                        onClick={() => {
                          // renew_or_terminate(item.id, "renew");
                          renew_or_terminate("renew");
                        }}
                        leftSection={<IconRotate2 size={25} />}
                      >
                        {t("renew", "Renew")}
                      </Button>
                    </Tooltip>
                  )}
                  {dataGet[0].is_draft == "" && dataGet[0].expired == "" && (
                    <Tooltip label={t("terminate", "Terminate")}>
                      <Button
                        // className={classesG.terminateIcon}
                        size="xl"
                        variant="filled"
                        color="red"
                        onClick={() => {
                          // renew_or_terminate(item.id, "terminate");
                          renew_or_terminate("terminate");
                        }}
                        leftSection={<IconTimeDurationOff size={25} />}
                      >
                        {t("terminate", "Terminate")}
                      </Button>
                    </Tooltip>
                  )}
                  {dataGet[0].is_draft == "X" && (
                    // <Tooltip label={t("delete", "Delete")}>
                    //   <Button
                    //     size="xl"
                    //     variant="filled"
                    //     color="red"
                    //     onClick={() => {
                    //       renew_or_terminate("delete");
                    //     }}
                    //     leftSection={<IconTrashFilled size={25} />}
                    //   >
                    //     {t("delete", "Delete")}
                    //   </Button>
                    // </Tooltip>
                    <ConfirmDeleteDraft
                      t={t}
                      onConfirm={() => {
                        renew_or_terminate("delete");
                      }}
                    />
                  )}
                </Flex>
              )}
            </Grid.Col>
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
                withAsterisk={true}
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
  const [forceClose, setForceClose] = useState("");
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
      hashtags_and: SplitHashtags(searchParams.get("hashtags_and")), // G.anyToArr(searchParams.get("hashtags_and")),
      hashtags_or: SplitHashtags(searchParams.get("hashtags_or")), //G.anyToArr(searchParams.get("hashtags_or")),
      doc_status: G.ifNull(searchParams.get("doc_status"), "B"),
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
  const onDateClick = (dt, doc_status) => {
    form.reset();
    G.updateParamsFromForm(searchParams, form);
    searchParams.set("page", "1");
    searchParams.set("t", new Date().getTime().toString());
    searchParams.set("src", "date");
    searchParams.set("created_on", dt);
    searchParams.set("doc_status", doc_status);
    form.setValues({ doc_status: doc_status });
    navigate({
      search: searchParams.toString(),
    });
    setForceClose(new Date().getTime().toString());
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
        forceClose={forceClose}
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
            <CreatedTree onDateClick={onDateClick} />
          </Grid.Col>
          <Grid.Col>
            <AppSelect
              {...form.getInputProps("doc_status")}
              label={t("doc_status", "Document Status")}
              placeholder={t("doc_status", "Document Status")}
              limit={8}
              maxDropdownHeight={500}
              data={[
                { value: "B", label: "Both" },
                { value: "D", label: "Draft" },
                { value: "F", label: "Final" },
              ]}
            />
          </Grid.Col>
          <Grid.Col>
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
            <WtsbMulti {...form.getInputProps("wtsb")} />
            {/* <AppSelect
              {...form.getInputProps("wtsb")}
              onBlur={() => form.validateField("wtsb")}
              readOnly={true}
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
            <HashTagsInput
              // zIndex={30000000}
              addOnNotFound={false}
              withAsterisk={false}
              label={
                <Group justify="flex-start" gap={0}>
                  <Box>{t("hashtag_all", "Hashtag(All)#")}</Box>
                  <HashtagsAlert withinPortal={false} />
                </Group>
              }
              {...form.getInputProps("hashtags_and")}
              withinPortal={true}
              placeholder={t("enter_hashtags", "Please Enter#")}
              w="100%"
              readOnly={false}
            />
          </Grid.Col>
          <Grid.Col>
            <HashTagsInput
              // zIndex={30000000}
              addOnNotFound={false}
              withAsterisk={false}
              label={
                <Group justify="flex-start" gap={0}>
                  <Box>{t("hashtag_any", "Hashtag(Any)#")}</Box>
                  <HashtagsAlert withinPortal={false} />
                </Group>
              }
              {...form.getInputProps("hashtags_or")}
              withinPortal={true}
              placeholder={t("enter_hashtags", "Please Enter#")}
              w="100%"
              readOnly={false}
            />
          </Grid.Col>
          {/* <Grid.Col>
            
          </Grid.Col> */}

          <Grid.Col>
            <Group justify="space-between" gap={4}>
              <Box  maw={"calc(50% - 4px)"}>
                <HoursRangeSelect
                  data={lastXHours}
                  {...form.getInputProps("expired_in_hours")}
                  label={t("share_expired_in_option", "Expired In")}
                  placeholder={t("share_expired_in_option", "Expired In")}
                />
              </Box>
              <Box maw={"calc(50% - 4px)"}>
                <ExpiredSelect
                  disabled={
                    form.values.expired_in_hours &&
                    form.values.expired_in_hours != ""
                  }
                  {...form.getInputProps("expired")}
                />
              </Box>
            </Group>
          </Grid.Col>

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
  const { t } = useTranslation("private", { keyPrefix: "deals" });
  const [value, setValue] = useState("");
  const [dealCount, setDealCount] = useState<string | null>("");
  const [dealDataCount, setDealDataCount] = useState([]);
  const [activeTab, setActiveTab] = useState<string | null>("input");
  
  const [selectAll0, SetSelectAll0] = useState(false);
  const [intermidiate0, setIntermidiate0] = useState(false);
  const [dataToPut, setDataToPut] = useState([]);
  const { error, succeed, info } = useMessage();
  const navigate = useNavigate();
  let { getCurrFromSymbol } = useDbData();
   
  const {
    data: dataSet,
    isLoading,
    errorMessage,
    succeeded,
    executePost,
    setData,
  } = useAxiosPost(BUILD_API("ai-parse-deal"), {
    deal: value,
    count: dealCount,
  });
  const {
    data: dataPlanInfo,
    isLoading: isLoadingPlanInfo,
    errorMessage: errorMessagePlanInfo,
    succeeded: succeededPlanInfo,
    executeGet: executeGetPlanInfo,
  } = useAxiosGet(BUILD_API("util/plan-info-combined"), {});
  let {
    data: dataPut,
    isLoading: isLoadingPut,
    succeeded: succeededPut,
    errorMessage: errorMessagePut,
    executePut,
  } = useAxiosPut(BUILD_API("deals/company/mass"), {
    changed: dataToPut,
    deleted: [],
  });
  useEffect(() => {
    executeGetPlanInfo();
  }, []);
  const dataDealCount =
    dataPlanInfo && dataPlanInfo.deal_count
      ? dataPlanInfo && dataPlanInfo.deal_count
      : 0;
  const parseLeft =
    dataPlanInfo && dataPlanInfo.ai_info && dataPlanInfo && dataPlanInfo.ai_info
      ? dataPlanInfo.ai_info.parse_count_left
      : 0;
  const parsingAttemptCompleted =
    dataPlanInfo && dataPlanInfo.ai_info && dataPlanInfo && dataPlanInfo.ai_info
      ? dataPlanInfo.ai_info.parsing_attempts_completed
      : 0;
  useEffect(() => {
    if (errorMessagePlanInfo) error("Plan Info Error:" + errorMessagePlanInfo);
    if (succeededPlanInfo) {
      let cnt: any = [];
      if (dataDealCount && +dataDealCount > 0) {
        for (let i = 1; i <= +dataDealCount; i++) {
          cnt.push(i.toString());
        }
      }
      setDealDataCount(cnt);
    }
  }, [succeededPlanInfo, errorMessagePlanInfo]);
  const parse = () => {
    executePost();
  };
  useEffect(() => {
    if (errorMessage) error(errorMessage);
    if (succeeded) {
      setActiveTab("output");
      setDealCount(null);
      SetSelectAll0(true);
      selectAll(true);
      executeGetPlanInfo();
    }
  }, [errorMessage, succeeded]);
  const selectAll = (val) => {
    setData((prevData) =>
      prevData.map((item) => ({
        ...item, // Keep other properties unchanged
        selected: val, // Update the 'selected' field
      }))
    );
  };
  const recheckAllCheck = () => {
    let checked = 0;
    let notcheked = 0;

    for (let i = 0; i < dataSet?.length; i++) {
      if (dataSet[i].selected) checked++;
      else notcheked++;
    }
    if (checked > 0 && notcheked > 0) {
      setIntermidiate0(true);
      SetSelectAll0(false);
    } else {
      if (checked > 0 || notcheked == 0) {
        setIntermidiate0(false);
        SetSelectAll0(true);
      } else {
        setIntermidiate0(false);
        SetSelectAll0(false);
      }
    }
  };
  useEffect(() => {
    recheckAllCheck();
  }, [dataSet]);
  const anySelect = () => {
    for (let i = 0; i < dataSet?.length; i++) {
      if (dataSet[i].selected) return true;
    }
    return false;
  };
  const formulate_object = (item, is_draft) => {
    let quantity = G.parseNumberAndString(item.quantity);
    let price = G.parseNumberAndString(item.price);

    return {
      id: "new",
      main_pic: "",
      title: item.title,
      pictures: [],
      wtsb: item.type,
      quantity: quantity.number,
      uom: quantity.text,
      price: price.number,
      curr: getCurrFromSymbol(price.text),
      hashtags: item.hashtags,
      body: item.details,
      ref: "",
      is_draft: is_draft,
    };
  };
  const createDraft = (is_draft) => {
    let dta: any = [];
    for (let i = 0; i < dataSet?.length; i++) {
      if (dataSet[i].selected) dta.push(formulate_object(dataSet[i], is_draft));
    }
    setDataToPut(dta);
    if (dta.length > 0) {
      executePut();
    }
  };
  useEffect(() => {
    let errorMsg = errorMessagePut;
    if (errorMsg) error(errorMsg);
    if (succeededPut) {
      let created_on = dataPut?.info?.created_on;
      goToSpread(created_on);
    }
  }, [errorMessagePut, succeededPut]);
  const goToSpread = (dt) => {
    closeModal("ai_parser_pop_up");
    navigate("../app/mydeals?src=navigator&created_on=" + dt);
    // searchParams.set("page", "1");
    // searchParams.set("t", new Date().getTime().toString());
    // searchParams.set("src", "date");
    // searchParams.set("created_on", dt);
    // navigate({
    //   search: searchParams.toString(),
    // });
  };
  const data = dataSet && dataSet.length > 0 ? dataSet : [];
  const close=()=>{
    closeModal("ai_parser_pop_up");
  }
  const placeholderAI =
    t("type_or_paste_your_deals", "Type or paste your deals e.g") +
    `
  Fully Tested HSO BATTERY 80%+ 	
Pack Boxes	
	Ready
	Grade A-
  34pcs - 	13 128GB $310

	Grade A/A-
320pcs - 	XR 64GB $140
	
	Mon-Tue
	Grade A-
  40pcs - 	13 128GB $310
`;
  return (
    <Box>
      <LoadingOverlay
        visible={isLoading || isLoadingPlanInfo || isLoadingPut}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <Box p="lg">
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="input">{t("input", "Input")}</Tabs.Tab>
            <Tabs.Tab value="output">
              {t("output_deals", "Output Deal(s)")}
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="input" pt="lg">
            <Group justify="space-between" gap={5} mb="xs">
              <Select
                withAsterisk
                maw={350}
                value={dealCount}
                onChange={setDealCount}
                label={t(
                  "nb_deal_to_extract",
                  "The number of deals that can be pulled from the text"
                )}
                placeholder={t("select_value", "Select Value")}
                data={dealDataCount}
                description={t(
                  "that_helps_ai",
                  "That helps AI to generate a better results."
                )}
              />
              <Group justify="right">
                <Button
                  variant="light"
                  onClick={() => {
                    closeModal("ai_parser_pop_up");
                  }}
                >
                  {t("close", "Close")}
                </Button>
                <Button
                  disabled={
                    !value || value == "" || !dealCount || dealCount == ""
                  }
                  onClick={parse}
                  variant="gradient"
                  gradient={{ from: "teal", to: "blue", deg: 60 }}
                >
                  {t("parse", "Parse")}
                </Button>
              </Group>
            </Group>

            <Textarea
             autosize={true}
              placeholder={placeholderAI}
              value={value}
              onChange={(event) => setValue(event.currentTarget.value)}
              label={
                <Box fz="sm" c="orange">
                  {t("you_still_have", "You still have") +
                    " ~" +
                    parseLeft +
                    " " +
                    t("our_of", "out of") +
                    " " +
                    (+parsingAttemptCompleted + parseLeft) +
                    " " +
                    t(
                      "parsing_attempts_remaining",
                      "parsing attempts remaining in your current cycle plan."
                    ) +
                    "***"}
                </Box>
              }
             minRows={15}
             maxRows={15}
            />
            <Box opacity={0.9}>
              <Box fz="sm" c="orange" mt="md">
                {t(
                  "ai_limitation_note1",
                  `We use OpenAI (ChatGPT's owner) to convert the text into a list of deals. However, the parsing may not be entirely accurate. Please review the results and make any necessary changes before publishing.`
                )}
              </Box>
              <Box fz="sm" c="orange">
                {t(
                  "ai_limitation_note2",
                  `It is recommended to create a draft first, make any necessary changes, and then publish the deals.`
                )}
              </Box>
              <Box fz="sm" c="red" mt="5px">
                {t(
                  "ai_limitation_note3",
                  `You can only parse up to the limit of your 'active deals' plan.`
                )}
              </Box>
              <Box fz="sm" c="red" mt="5px">
                {"***" +
                  t(
                    "note_approximate_parse_left_value",
                    `Note: This is an approximate value, as each attempt has its own cost..`
                  )}
              </Box>
            </Box>
          </Tabs.Panel>
          <Tabs.Panel value="output" pt="lg">
            {/* <Group justify="right" mb="xs">
              <Button
                variant="light"
                onClick={() => {
                  closeModal("ai_parser_pop_up");
                }}
              >
                {t("close", "Close")}
              </Button>
              <Button
                disabled={!(dataSet && dataSet.length > 0) || !anySelect()}
                onClick={() => {
                  createDraft("X");
                }}
                variant="gradient"
                gradient={{ from: "teal", to: "blue", deg: 60 }}
              >
                {t("create_draft", "Create Draft")}
              </Button>
              <Button
                disabled={!(dataSet && dataSet.length > 0) || !anySelect()}
                onClick={() => {
                  createDraft("");
                }}
                variant="gradient"
                gradient={{ from: "orange", to: "blue", deg: 60 }}
              >
                {t("create_final", "Create Final")}
              </Button>
            </Group> */}
            <MassDealEntry
              dataSet={data}
              setData={setData}
              onClose={close}
              onSucceed={(dt) => {
                close();
                navigate("../app/mydeals?src=navigator&created_on=" + dt);
              }}
              selectAll0={selectAll0}
              SetSelectAll0={SetSelectAll0}
              intermidiate0={intermidiate0}
              setIntermidiate0={setIntermidiate0}
              selectAll={selectAll}
            /> 
            <Box c="orange" mt="xs">
              {data.length} {t("deals_extracted", "Deals extracted")}
            </Box>
          </Tabs.Panel>
        </Tabs>
      </Box>
    </Box>
  );
};

const useAiParser = (onApply, isFull) => {
  // const small0 = useSelector(selectSmall);
  // const medium0 = useSelector(selectMedium);
  //  const [isFull,setIsFull]=useState(isFull0)
  const [forceOpen, setForceOpen] = useState("");
  // useEffect(()=>{
  //   alert(isFull0+'00')
  // setIsFull(isFull0)
  // },[isFull0])
  useEffect(() => {
    if (forceOpen == "") return;
    // alert(isFull)
    modals.open({
      keepMounted: false,
      padding: 0,
      yOffset: 0,
      xOffset: 0,
      h: isFull ? "auto" : "100vh",
      modalId: "ai_parser_pop_up",
      fullScreen: isFull ? true : false,
      withCloseButton: false,
      withOverlay: true,
      withinPortal: true,
      size: isFull ? "100%" : "65vw",
      onClose: () => {
        closeModal("ai_parser_pop_up");
      },
      children: <ParseDeal onApply={onApply} />,
    });
  }, [forceOpen]);
  // useEffect(()=>{
  // setIsFull(small0||medium0)
  // },[small0,medium0])
  const open = () => {
    setForceOpen(new Date().getTime().toString());
    //  const small0 = useSelector(selectSmall);
    // const medium0 = useSelector(selectMedium);
  };
  return { open };
};

function ConfirmDeleteDraft({ t, onConfirm }) {
  const [opened, { close, open }] = useDisclosure(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        size="auto"
        withCloseButton={true}
        title={t("delete_confirmation", "Delete Confirmation..")}
      >
        <Text>
          {" "}
          {t(
            "are_you_sure_you_want_to_delete_draft",
            "Are you sure you want to delete the deal draft?."
          )}
        </Text>

        <Group mt="xl" justify="right" gap="md">
          <Button variant="light" onClick={close}>
            {t("no", "No")}
          </Button>
          <Button
            variant="filled"
            color="red"
            onClick={() => {
              onConfirm("delete");
              close();
            }}
          >
            {t("yes", "Yes")}
          </Button>
        </Group>
      </Modal>
      <Tooltip label={t("delete", "Delete")}>
        <Button
          // className={classesG.terminateIcon}
          size="xl"
          variant="filled"
          color="red"
          onClick={open}
          leftSection={<IconTrashFilled size={25} />}
        >
          {t("delete", "Delete")}
        </Button>
      </Tooltip>
    </>
  );
}

const CreatedTree = ({ onDateClick }) => {
  const { classes: classesG } = useGlobalStyl();
  const { error, succeed, info } = useMessage();
  const { t } = useTranslation("private", { keyPrefix: "deals" });
  const [opened, { open, close }] = useDisclosure(false);
  const [value, setValue] = useState("B");
  const {
    data: dataGet,
    errorMessage: errorMessageGet,
    succeeded: succeededGet,
    isLoading: isLoadingGet,
    executeGet: executeGet,
  } = useAxiosGet(BUILD_API("deals/company/creation-list"), {
    doc_status: value,
  });
  useEffect(() => {
    if (opened) {
      executeGet();
    }
  }, [opened, value]);
  // useEffect(()=>{

  // },[value])
  useEffect(() => {
    let errorMsg = errorMessageGet;
    if (errorMsg) error(errorMsg);
    if (succeededGet) {
    }
  }, [errorMessageGet, succeededGet]);
  const header = (
    <Group m="md" p="xs" mr="lg" ml="lg" grow>
      {/* <Group justify="flex-start" > */}
      <Group justify="space-between" gap={2}>
        <Box>{t("total", "Total")}</Box>
        <Divider size={1} orientation="vertical" />
        <Box>{t("draft", "Draft")}</Box>
        <Divider size={1} orientation="vertical" />
        <Box>{t("final", "Final")}</Box>
        <Divider size={1} orientation="vertical" />
      </Group>
      {/* </Group> */}
      <Group justify="center">{t("created_on", "Created On")}</Group>
    </Group>
  );
  const rows = dataGet.map((item) => {
    return (
      <Group
        m="md"
        p="xs"
        mr="lg"
        ml="lg"
        className={classesG.titleHrefDashed}
        onClick={() => {
          onDateClick(item.created_on_int, value);
          close();
        }}
        grow
      >
        {/* <Group justify="flex-start" > */}
        <Group justify="space-between" gap={2}>
          <Box>{item.deals_count}</Box>
          <Divider size={1} orientation="vertical" />
          <Box>{item.draft_deals_count}</Box>
          <Divider size={1} orientation="vertical" />
          <Box>{item.final_deals_count}</Box>
          <Divider size={1} orientation="vertical" />
        </Group>
        {/* </Group> */}

        <Group justify="flex-end">
          {D.utc_to_local_with_time(item.created_on)}
        </Group>
      </Group>
    );
  });
  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        title={t("deal_creation_on_n_at", "Deal creation date and time.")}
        position="right"
        zIndex={100000000000000}
        // classNames={{body:classesG.drawerBody}}
        // styles={{body:{height: 'calc(100vh - 100px) !important'}}}
      >
        <Box pos="relative" style={{ overflow: "auto" }}>
          <LoadingOverlay
            visible={isLoadingGet}
            overlayProps={{ radius: "sm", blur: 2 }}
          />
          <AppSelect
            value={value}
            onChange={setValue}
            label={t("doc_status", "Document Status")}
            placeholder={t("doc_status", "Document Status")}
            limit={8}
            maxDropdownHeight={500}
            data={[
              { value: "B", label: "Both" },
              { value: "D", label: "Draft" },
              { value: "F", label: "Final" },
            ]}
          />
          {header}
          {rows}
        </Box>
      </Drawer>

      <Button
        variant="light"
        onClick={open}
        leftSection={<IconStackPop size="1.2rem" />}
      >
        {t(
          "created_on_filter",
          "Creation Date Filter(Suitable for deals added in bulk)"
        )}
      </Button>
    </>
  );
};
