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
  NumberInput,
  Flex,
  NativeSelect,
  Card,
  Highlight,
  MultiSelect,
  Stack,
  Table,
  Chip,
  CopyButton,
  ScrollArea,
  rem,
  Accordion,
  Dialog,
  Divider,
  Checkbox,
  Image,
  Center,
} from "@mantine/core";

import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import {
  IconAdjustmentsOff,
  IconAlertTriangle,
  IconAlertTriangleFilled,
  IconArrowLeft,
  IconAt,
  IconCheck,
  IconChevronsDown,
  IconChevronsUp,
  IconCircleArrowDownFilled,
  IconCopy,
  IconDeviceMobile,
  IconExternalLink,
  IconFocusCentered,
  IconGripVertical,
  IconHash,
  IconListDetails,
  IconMessage,
  IconMessage2Down,
  IconMessage2Plus,
  IconMessage2Up,
  IconMessage2X,
  IconMessageForward,
  IconMessageReport,
  IconMinus,
  IconPlaylistAdd,
  IconPlus,
  IconRefresh,
  IconTallymark1,
  IconTallymark2,
  IconTallymark4,
  IconUserCircle,
  IconViewfinderOff,
} from "@tabler/icons-react";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { NumericFormat } from "react-number-format";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";
import { D } from "../../../global/Date";
import {
  BUILD_API,
  BUILD_URL,
  CLOUDFARE_IMAGE_URL1,
  G,
  useMessage,
} from "../../../global/G";
import { GridLayOut, decimalSep, thousandSep } from "../../../global/Misc";
import { NoDataFound } from "../../../global/NoDataFound";
import { SearchPannel } from "../../../global/SearchPannel";
import { useGlobalStyl } from "../../../hooks/useTheme";
import { WtsWtbDropV } from "../../../global/WtsWtbDropV";
import { useAxiosGet } from "../../../hooks/Https";
import { Pages } from "../../../hooks/usePage";
import { useAuth } from "../../../providers/AuthProvider";
import { changeActive } from "../../../store/features/ActiveNav";
import {
  selectLarge,
  selectMedium,
  selectSmall,
} from "../../../store/features/ScreenStatus";
import { AppHeader } from "../app-admin/AppHeader";

import { WTSBTheme } from "./Deals";
import { IconBrands } from "../../../global/IconBrands";
import { useDisclosure, useOs } from "@mantine/hooks";
import { Cell } from "../../../global/Cell";
import { UserCard } from "../../../global/UserCard";
import { AppDiv } from "../../../global/AppDiv";
import { IconBuilding } from "@tabler/icons-react";
import { HashValue4Boardd2 } from "../../../global/global-comp/Hashtags";
import { TradeHashTagsPop } from "./Hashtags";
import { GENERIC_TRADE_IMAGE, ImagesZoneTrades } from "./ImagesZoneTrades";
import { IconList } from "@tabler/icons-react";
import { IconTallymark3 } from "@tabler/icons-react";
import { ClearButton1 } from "../../../global/ClearButton";
const ITEM_ACTIONS = {
  CLEAR: "CLEAR",
  SWITCH: "SWITCH",
  ADD_IF_MISSED: "ADD_IF_MISSED",
  SELECT_ALL: "SELECT_ALL",
};
const FOCUS_ON = {
  CO_N_MESSAGE: "CO_N_MESSAGE",
  MESSAGE: "MESSAGE",
  TRADE_LIST: "TRADE_LIST",
  LIST_N_MESSAGE: "LIST_N_MESSAGE",
  CO_N_LIST: "CO_N_LIST",
  CO: "CO",
};
const FOCUS_OBJ = {
  MESSAGE: "MESSAGE",
  CO: "CO",
  TRADE_LIST: "TRADE_LIST",
};
export const Trades = () => {
  const grid_name = "TRADES";
  let { source, traderpage } = useParams();
  const { islogged } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTrades, setSearchTrades] = useState<any>();
  const [selectedIDS, setSelectedIDS] = useState<any>([]);
  const [showMessage, setShowMessage] = useState<any>(false);
  const [message, setMessage] = useState<any>("");
  const [updateMessage, setUpdateMessage] = useState<any>("");
  let tm = searchParams.get("t");
  const [expendedIDs, setExpandedIDs] = useState<any>([]);
  const [collapse, setCollapse] = useState("");
  let co_id2: any = searchParams.get("co_id");
  let isTraderPage =
    traderpage === "c" || (co_id2 && co_id2 != "" && +co_id2 > 0);
  // const { isTraderPage } = useAppLoc();
  const expandID = (id, expand) => {
    let expandedids = [...expendedIDs];
    let foundidx = -1;
    for (let i = 0; i < expandedids.length; i++) {
      if (expandedids[i] == id) {
        foundidx = i;
        break;
      }
    }
    if (expand && foundidx == -1) {
      expandedids.push(id);
    }
    if (!expand && foundidx != -1) {
      expandedids.splice(foundidx, 1);
    }
    setExpandedIDs(expandedids);
  };
  const [searchAction, setSearchAction] = useState<any>("");
  const getCompress = () => {
    let svd_lyout = GridLayOut(grid_name, "", "GET", "grid_view");
    let lst =
      searchTrades && searchTrades["listdir"]
        ? searchTrades["listdir"]
        : svd_lyout;
    if (
      lst == "full" &&
      GridLayOut(grid_name, lst, "GET", "grid_view") != "full"
    ) {
      GridLayOut(grid_name, lst, "SET", "grid_view");
      setTimeout(() => {
        setSearchAction(() => {
          let srch = "UPDATELISTDIR" + new Date().getTime().toString();
          return srch;
        });
      }, 1000);
    }
    return lst;
  };
  const [compressed, setCompressed] = useState<string>(() => {
    let lst = getCompress();
    return lst;
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { error } = useMessage();
  const { t } = useTranslation("private", { keyPrefix: "trades" });
  const {
    data: dataGet,
    getError,
    errorMessage,
    succeeded,
    isLoading,
    executeGet,
  } = useAxiosGet(BUILD_API("trades"), searchTrades);

  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const large = useSelector(selectLarge);
  const { classes: classesG } = useGlobalStyl();
  // let selectedIDS: any = []
  let hex = G.ifNull(searchParams.get("hex"), "");
  useEffect(() => {
    dispatch(changeActive("trades"));
  }, []);

  useEffect(() => {
    let tmm = tm;
    // if (onGetData) onGetData(null);
    refresh();
  }, [tm]);

  const refresh = () => {
    setShowMessage(false);
    setSelectedIDS([]);
    setMessage(() => {
      return "";
    });
    setSearchTrades(Object.fromEntries([...searchParams]));
    executeGet();
  };

  useEffect(() => {
    setCompressed(() => {
      let lst = getCompress();
      return lst;
    });
  }, [searchTrades]);

  useEffect(() => {
    setExpandedIDs([]);
    if (succeeded) {
      let co_data =
        dataGet["co_data"] &&
        dataGet["co_data"].company &&
        dataGet["co_data"].company.company_name &&
        dataGet["co_data"].company.company_name != ""
          ? dataGet["co_data"]
          : null;
      // if (onGetData) onGetData(co_data);
      let l_isTraderPage = co_data ? true : false;

      setShowMessage(() => {
        return l_isTraderPage;
      });
    }
    if (errorMessage) error(errorMessage);
  }, [succeeded, errorMessage]);
  const coData =
    dataGet["co_data"] &&
    dataGet["co_data"].company &&
    dataGet["co_data"].company.company_name &&
    dataGet["co_data"].company.company_name != ""
      ? dataGet["co_data"]
      : null;
  const search = (co_id) => {
    let params: any = [];
    let v = ["co_id", co_id];
    params.push(v);

    params.splice(0, 0, ["t", new Date().getTime().toString()]);
    params.splice(0, 0, ["src", "company"]);

    let listdir = searchParams.get("listdir");
    if (listdir && listdir != "") {
      params.splice(0, 0, ["listdir", listdir]);
    }
    navigate({
      pathname: `/app/trades/${source}/c`, // Update the `traderpage` param
      search: createSearchParams(params).toString(),
    });
    // navigate({
    //   search: createSearchParams(params).toString(),
    // });
  };
  const add_remove = (id) => {
    let idx = -1;
    for (let i = 0; i < selectedIDS.length; i++) {
      if (selectedIDS[i] == id) {
        idx = i;
        break;
      }
    }
    if (idx >= 0) {
      const new_ids = selectedIDS.filter((saved_id) => saved_id !== id);
      setSelectedIDS(new_ids);
    } else {
      setSelectedIDS([...selectedIDS, id]);
    }
    formulateMessage();
  };
  const formulateMessage = () => {
    setUpdateMessage(() => {
      return new Date().getTime().toString();
    });
  };

  const clear_message = () => {
    setSelectedIDS(() => {
      return [];
    });

    formulateMessage();
  };
  useEffect(() => {
    setMessage(() => {
      let trades_data = dataGet["trades"];
      let msg = "";
      let found = false;
      if (trades_data && trades_data.length > 0)
        for (let i = 0; i < trades_data.length; i++) {
          found = false;
          for (let j = 0; j < selectedIDS.length; j++) {
            if (trades_data[i].id == selectedIDS[j]) {
              found = true;
              msg =
                msg + trades_data[i].wtsb + `:` + trades_data[i].title + "\r\n";
            }
          }
        }
      return msg;
    });
  }, [updateMessage]);
  const show = (id, dir) => {
    let idx = -1;
    for (let i = 0; i < selectedIDS.length; i++) {
      if (selectedIDS[i] == id) {
        idx = i;
        break;
      }
    }
    if (idx >= 0) {
      if (dir == "A") return false;
      return true;
    }
    if (dir == "R") return false;
    return true;
  };

  const layoutGo = (comp) => {
    GridLayOut(grid_name, comp, "SAVE", "");
    searchParams.set("t", new Date().getTime().toString());
    searchParams.set("src", "sort");
    searchParams.set("listdir", comp);

    setSearchParams(searchParams);
    navigate({
      search: searchParams.toString(),
    });
  };
  return (
    <>
      {isLoading && <Overlay opacity={1} color="#000" zIndex={5} />}
      {isLoading && (
        <LoadingOverlay
          visible={isLoading}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
      )}

      {!isTraderPage && (
        <AppHeader
          title={
            source === "t"
              ? t("trading_floor", "Trading Floor")
              : t("latest_trades", "Latest Trades")
          }
          titleClicked={
            source === "t"
              ? null
              : () => {
                  if (source === "t")
                    navigate(
                      "../trades/t" +
                        (hex && hex != "" ? "/c/?hex=" + hex : "/a"),
                      { replace: true }
                    );
                  else
                    navigate(
                      "../latest-trades" +
                        (hex && hex != "" ? "/?hex=" + hex : ""),
                      { replace: true }
                    );
                }
          }
        >
          {islogged && (
            <Group justify="right" gap="xs">
              <Button
                variant="default"
                onClick={(val) => {
                  refresh();
                }}
              >
                <IconRefresh />
              </Button>
              <TradeHashTagsPop src="TRADES" />
              {hex && hex != "" && (
                <ClearButton1
                  t={t}
                  small={small}
                  onClear={() => {
                    if (hex && hex != "") {
                      let params: any = [];

                      params.splice(0, 0, [
                        "t",
                        new Date().getTime().toString(),
                      ]);
                      params.splice(0, 0, ["src", "clear"]);
                      navigate({
                        search: createSearchParams(params).toString(),
                      });
                      return;
                    }
                    setSearchAction(() => {
                      return "CLEAR" + new Date().getTime().toString();
                    });
                  }}
                />
              )}
            </Group>
          )}
        </AppHeader>
      )}
      {isTraderPage && (
        <>
          <TraderInfo coData={coData} />
          <MessageToSend
            coData={coData}
            message={message}
            clear_message={clear_message}
          />
        </>
      )}
      <Box style={{ width: "100%", position: "relative" }}>
        {dataGet && dataGet["shareidhex"] && dataGet["shareidhex"] != "" && (
          <Group justify="right" mt={-15}>
            <Stack mb={-0}>
              <Alert color="orange" p={5}>
                <Box fs="italic" fz="sm" mb={0}>
                  {t(
                    "accessed_from_outside",
                    `You've reached these company's deals through a shared link!.`
                  )}
                </Box>
              </Alert>
              {!islogged && (
                <Alert color="red" p={5} mt={-10} mb={5}>
                  <Box
                    fs="italic"
                    fz="sm"
                    className={classesG.titleHref}
                    onClick={() => {
                      window.location.href = BUILD_URL("pub/sign-up");
                      return null;
                    }}
                  >
                    {t(
                      "please_sign_up",
                      "Please sign up to access the full trading floor!."
                    )}
                  </Box>
                </Alert>
              )}
            </Stack>
          </Group>
        )}

        <Stack justify="flex-start" gap={0}>
          {hex == "" && (
            <Group style={{ width: "100%" }}>
              <Box
                p={0}
                m={0}
                className={`${classesG.searchHandle}`}
                style={{
                  width: "100%",
                }}
              >
                <TradesSearch
                  action={searchAction}
                  grid={grid_name}
                  src="TRADES"
                />
              </Box>
            </Group>
          )}

          <Box mt="lg">
            <Paper
              radius={0}
              p={5}
              pt={4}
              pb={4}
              className={`${classesG.subHeader} ${classesG.transparentBottomBorder}`}
              style={{
                // paddingRight: 0,
                width: "100%",
                marginBottom: 0,
                position: "relative",
                fontWeight: "bold",
              }}
            >
              <Group justify={expendedIDs.length > 0 ? "apart" : "right"}>
                {expendedIDs.length > 0 && (
                  <ActionIcon
                    ml={"5px"}
                    radius={5}
                    variant="subtle"
                    c="red"
                    onClick={() => {
                      setExpandedIDs([]);
                      setCollapse(new Date().getTime().toString());
                    }}
                  >
                    <IconMinus size="20" />
                  </ActionIcon>
                )}
                <Group justify="right" gap={2}>
                  <ActionIcon
                    variant="transparent"
                    m={0}
                    radius={0}
                    size="lg"
                    opacity={compressed == "comp3" ? 1 : 0.5}
                    onClick={() => {
                      layoutGo("comp3");
                    }}
                  >
                    <IconTallymark1
                      size={22}
                      style={{ transform: "rotate(90deg)" }}
                    />
                  </ActionIcon>
                  <ActionIcon
                    variant="transparent"
                    m={0}
                    radius={0}
                    size="lg"
                    opacity={compressed == "comp2" ? 1 : 0.5}
                    onClick={() => {
                      layoutGo("comp2");
                    }}
                  >
                    <IconTallymark2
                      size={22}
                      style={{ transform: "rotate(90deg)" }}
                    />
                  </ActionIcon>
                  <ActionIcon
                    variant="transparent"
                    m={0}
                    radius={0}
                    size="lg"
                    opacity={compressed == "comp1" ? 1 : 0.5}
                    onClick={() => {
                      layoutGo("comp1");
                    }}
                  >
                    <IconTallymark3
                      size={22}
                      style={{ transform: "rotate(90deg)" }}
                    />
                  </ActionIcon>
                  <ActionIcon
                    variant="transparent"
                    m={0}
                    radius={0}
                    size="lg"
                    opacity={compressed == "full" ? 1 : 0.5}
                    onClick={() => {
                      layoutGo("full");
                    }}
                  >
                    <IconTallymark4
                      size={22}
                      style={{ transform: "rotate(90deg)" }}
                    />
                  </ActionIcon>
                </Group>
              </Group>
            </Paper>

            {!dataGet ||
              !dataGet["trades"] ||
              (dataGet["trades"].length <= 0 && (
                <NoDataFound title={t("no_deals_found", "No Deals Found!.")} />
              ))}

            {dataGet["trades"]?.map((element, index) => {
              return (
                <Trade
                  t={t}
                  showMessage={showMessage}
                  element={element}
                  add_remove={add_remove}
                  show={show}
                  navigate={navigate}
                  searchTrades={searchTrades}
                  classesG={classesG}
                  search={search}
                  compressed={compressed}
                  small={small}
                  medium={medium}
                  islogged={islogged}
                  index={index}
                  expandID={expandID}
                  collapse={collapse}
                />
              );
            })}
            <Pages data={dataGet["trades"]} small={small} />
          </Box>
        </Stack>
      </Box>
    </>
  );
};

export const TradesSearch = ({ action, grid, src }) => {
  const { error, succeed, info } = useMessage();
  // const [action, setAction] = useState('')
  let { source, traderpage } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation("private", { keyPrefix: "trades" });
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const navigate = useNavigate();
  let hex = G.ifNull(searchParams.get("hex"), "");
  // const { data: dataUOMS, errorMessage: errorMessageUOMS, succeeded: succeededUOMS, isLoading: isLoadingUOMS, executeGet: executeGetUOMS } = useAxiosGet(BUILD_API('channels_groups'), null);
  const {
    data: dataWTSB,
    errorMessage: errorMessageWTSB,
    succeeded: succeededWTSB,
    isLoading: isLoadingWTSB,
    executeGet: executeGetWTSB,
  } = useAxiosGet(BUILD_API("util/wtsb"), null);

  const form = useForm({
    initialValues: {
      title: G.ifNull(searchParams.get("title"), ""),
      wtsb: G.paramToArr(searchParams.get("wtsb")),
      searchterm: G.ifNull(searchParams.get("searchterm"), ""),
      company_name: G.ifNull(searchParams.get("company_name"), ""),
      hashtags_and: G.paramToArr(searchParams.get("hashtags_and")),
      hashtags_or: G.paramToArr(searchParams.get("hashtags_or")),
    },
  });
  useEffect(() => {
    executeGetWTSB();
  }, []);
  const search0 = () => {
    G.updateParamsFromForm(searchParams, form);
    searchParams.set("t", new Date().getTime().toString());
    searchParams.set("src", "search");
    let v = form.values.hashtags_and;
    setSearchParams(searchParams);
    navigate({
      search: searchParams.toString(),
    });
  };
  const beforeClear = () => {
    GridLayOut(grid, "full", "SET", "grid_view");
  };
  const clear = () => {
    G.clearForm(form);
    Clear(source, navigate, hex);
    // let params: any = [];
    // params.splice(0, 0, ["t", new Date().getTime().toString()]);
    // navigate({
    //   search: createSearchParams(params).toString(),
    // });
  };

  const initForm = () => {
    G.clearForm(form);
  };

  const [searchValue, onSearchChange] = useState("");
  const [searchValue2, onSearch2Change] = useState("");
  const [hashData, setHashData] = useState<any>(() => {
    // console.log(searchParams.get('hashtags_and'))
    return G.paramToArr(searchParams.get("hashtags_and"));
  });

  const [hashData2, setHash2Data] = useState<any>(() => {
    return G.paramToArr(searchParams.get("hashtags_or"));
  });
  useEffect(() => {
    let trm = searchParams.get("searchterm");
    let hashtags_and = G.paramToArr(searchParams.get("hashtags_and"));
    let hashtags_or = G.paramToArr(searchParams.get("hashtags_or"));
    // if (trm != form.values.searchterm)

    setHashData(hashtags_and);
    setHash2Data(hashtags_or);
    form.setValues({
      searchterm: trm,
      hashtags_and: hashtags_and,
      hashtags_or: hashtags_or,
    });
  }, [searchParams]);
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
        action={action}
        grid={grid}
        sortBy={
          src == "TRADES"
            ? [
                {
                  id: "title",
                  name: t("deal_title", "Deal Title"),
                },
                {
                  id: "last_posted_on",
                  name: "Trade Age",
                  asc: t("old_to_new", "Old To New"),
                  desc: t("new_to_p;d", "New To Old"),
                },
              ]
            : []
        }
        onBeforeClear={() => {
          beforeClear();
        }}
        onClear={() => {
          clear();
        }}
        onApply={() => {
          search0();
        }}
        onSearchTerm={() => {
          initForm();
        }}
      >
        <Grid gutter={15}>
          <Grid.Col>
            {"create multiselect"}
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
              label={t("deal_title_only", "Deal Title Only")}
              placeholder={t("deal_title_only", "Deal Title Only")}
              {...form.getInputProps("title")}
            />
          </Grid.Col>
          <Grid.Col>
            {"create multi select"}
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
            {"create multi select"}
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
            <TextInput
              autoComplete="off"
              label={t("company_name", "Company Name")}
              placeholder={t("company_name", "Company Name")}
              {...form.getInputProps("company_name")}
            />
          </Grid.Col>
        </Grid>
      </SearchPannel>
    </>
  );
};
const CoInfo = ({ data, message, clear_message, focusOn }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [coinfoDet, setCoinfoDet] = useState<any>(() => {
    let ky = searchParams.get("codet");
    return ky && ky != "" ? ky : "coinfo";
  });
  const [messageDet, setMessageDet] = useState<any>(() => {
    let ky = searchParams.get("msgdet");
    return ky && ky != "" ? ky : "msginfo";
  });
  const { t } = useTranslation("private", { keyPrefix: "trades" });
  const os = useOs();
  let co_info = data["company"];
  let users = data["users"];
  let channels = data["channels"];
  const { classes: classesG } = useGlobalStyl();
  const { error, succeed } = useMessage();
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (ref && ref.current) ref.current.innerHTML = message;
  }, [message]);
  const isPhone = () => {
    return os == "ios" || os == "android";
  };
  return (
    <>
      {data && data["company"] && (
        <Stack m={0} p={0}>
          {/* <Accordion
            className={`${
              notFocusOn(FOCUS_OBJ.CO, focusOn) ? classesG.hideVisibility : ""
            }`}
            styles={small ? { content: { padding: "5px" } } : {}}
            m={0}
            p={0}
            variant="filled"
            defaultValue={coinfoDet}
            onChange={() => {
              let u: any = window.location;
              const url = new URL(u);
              let ky = url.searchParams.get("codet");
              let v: any = ky;
              if (!ky) v = "c";
              else {
                if (ky == "c") v = "coinfo";
                else v = "c";
              }
              setCoinfoDet(() => {
                return v;
              });
              searchParams.set("codet", v);
              setSearchParams(searchParams);
            }}
          >
            <Accordion.Item value="coinfo" m={0} p={0} bg="red">
              <Accordion.Control
                className={classesG.accordionControl}
                bg="violet"
              >
                <Group justify="left" gap={5}>
                  <Title order={small ? 3 : 1}>{co_info?.company_name}</Title>
                  <Box
                    className={classesG.reportCoIcon}
                    onClick={(e) => {
                      navigate(
                        `../concern?co_id=` +
                          co_info?.id +
                          `&co_name=` +
                          co_info?.company_name
                      );
                      e.stopPropagation();
                    }}
                  >
                    <IconAlertTriangle />{" "}
                  </Box>
                </Group>
                <Text>{co_info?.url}</Text>
                <Text>
                  {co_info?.city}, {co_info?.province_name}, {co_info?.country}{" "}
                </Text>
              </Accordion.Control>
              <Accordion.Panel
                className={`${classesG.accordionPannel} ${classesG.mainBodyTradeNavig}`}
              >
                <Grid gutter={small ? 5 : medium ? 7 : 9} mb="lg">
                  <Grid.Col xs={12} sm={12} md={12}>
                    <Card
                      radius="sm"
                      p="md"
                      pt="xs"
                      withBorder
                      className={classesG.backgroundCard}
                    >
                      <div
                        dangerouslySetInnerHTML={{ __html: co_info?.about }}
                        style={{ whiteSpace: "pre-line" }}
                      ></div>
                    </Card>
                  </Grid.Col>
                  {users?.map((usr) => {
                    return (
                      <Grid.Col xs={12} sm={12} md={12} lg={6}>
                        <UserCard usr={usr} />
                      </Grid.Col>
                    );
                  })}
                </Grid>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion> */}

          <Accordion
            className={`${
              notFocusOn(FOCUS_OBJ.MESSAGE, focusOn)
                ? classesG.hideVisibility
                : ""
            }`}
            variant="filled"
            defaultValue={messageDet}
            onChange={() => {
              let u: any = window.location;
              const url = new URL(u);
              let ky = url.searchParams.get("msgdet");
              let v: any = ky;
              if (!ky) v = "c";
              else {
                if (ky == "c") v = "msginfo";
                else v = "c";
              }
              setMessageDet(() => {
                return v;
              });
              searchParams.set("msgdet", v);
              setSearchParams(searchParams);
            }}
          >
            <Accordion.Item value="msginfo">
              <Accordion.Control className={classesG.accordionControl}>
                <Title order={small ? 3 : 1}>
                  {t("message_to_send", "Message To Send")}
                </Title>
              </Accordion.Control>
              <Accordion.Panel className={classesG.accordionPannel}>
                <Textarea
                  ref={ref}
                  minRows={5}
                  maxRows={5}
                  placeholder={t(
                    "kindly_choose_trades",
                    "Kindly choose the trades you are interested in from the list below!."
                  )}
                  label={t("your_selected_trades", "Your Selected Trades")}
                ></Textarea>
                <Group opacity={message != "" ? 1 : 0.2} justify="left">
                  <CopyButton value={message}>
                    {({ copied, copy }) => (
                      <Group
                        gap={2}
                        justify="left"
                        className={
                          message != ""
                            ? classesG.textToCopy
                            : classesG.cursorNoDrop
                        }
                        onClick={() => {
                          if (message == "") return;
                          copy();
                          succeed(t("message_copied", "Message copied!."));
                        }}
                        c={copied ? "indigo.7" : ""}
                      >
                        <Box>{t("copy_message", "Copy Message")}</Box>
                        <IconCopy size={small ? 18 : medium ? 20 : 22} />
                      </Group>
                    )}
                  </CopyButton>
                  <Group
                    gap={2}
                    c="red.6"
                    justify="left"
                    className={
                      message != ""
                        ? classesG.textToCopy
                        : classesG.cursorNoDrop
                    }
                    onClick={() => {
                      if (clear_message) clear_message();
                    }}
                  >
                    {clear_message && (
                      <>
                        <Box>{t("clear_message", "Clear Message")}</Box>
                        <IconMessage2X size={small ? 18 : medium ? 20 : 22} />
                      </>
                    )}
                  </Group>
                </Group>

                <Box mt="md">
                  <Grid gutter={small ? 10 : medium ? 15 : 20}>
                    {" "}
                    {users?.map((usr) => {
                      return (
                        <>
                          {usr.cell && usr.cell != "" && (
                            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                              <Cell
                                fz={rem("1rem")}
                                cell={usr.cell}
                                verified={usr.cell_verified}
                                message={message}
                                show_op="SEND"
                                user={usr.first_name + ", " + usr.last_name}
                              />
                            </Grid.Col>
                          )}
                        </>
                      );
                    })}
                  </Grid>
                  <Box fz={"0.7rem"}>
                    {"*"}
                    {t(
                      "click_to_copy_n_send_whatsapp_msg",
                      "Click on the contact above to copy the message and open WhatsApp."
                    )}
                  </Box>
                  <Box fz={"0.7rem"}>
                    {"*"}
                    {t(
                      "past_auto_or_manually_whatsapp_msg",
                      "Usually, the message will be pasted automatically into the input field. If not, please paste it manually"
                    )}
                  </Box>
                </Box>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Stack>
      )}
    </>
  );
};

const Trade = ({
  t,
  showMessage,
  element,
  add_remove,
  show,
  search,
  compressed,
  navigate,
  searchTrades,
  small,
  medium,
  classesG,
  islogged,
  index,
  expandID,
  collapse,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  let hex = G.ifNull(searchParams.get("hex"), "");
  const { error, succeed, warning } = useMessage();
  const { data, getError, errorMessage, succeeded, isLoading, executeGet } =
    useAxiosGet(BUILD_API("trade-body") + "/" + element.id, {});
  useEffect(() => {
    if (errorMessage) error(errorMessage);
    if (succeeded && data && data.items && data.items.length > 0) {
      console.log("");
    }
  }, [errorMessage, succeeded]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (expanded && (!data || (data && data.length <= 0)))
      // onExpanded()
      executeGet({ url_e: BUILD_API("trade-body") + "/" + element.id });
  }, [expanded]);

  useEffect(() => {
    if (!collapse || collapse == "" || !expanded) return;
    setExpanded(false);
  }, [collapse]);

  return (
    <Paper
      key={element.id}
      radius={0}
      p={0}
      className={
        (show(element.id, "R")
          ? `${classesG.paperSelected} `
          : `${classesG.paper} `) +
        (index % 2 == 0 ? `${classesG.listZibra2} ` : "")
      }
      style={{
        // paddingRight: 45,
        marginTop: 0, //? 50 : 0, width: "100%",
        marginBottom: 0,
        position: "relative",
      }}
    >
      <Box style={{ display: small ? "block" : "flex", alignItems: "stretch" }}>
        {compressed == "full" && (
          <Center w={small ? "100%" : "140px"} style={{ overflow: "hidden" }}>
            <Box
              w={small ? "200px" : "140px"}
              onClick={() => {
                navigate(
                  `../trades/t/${element.id}` +
                    (hex && hex != "" ? "/?hex=" + hex : "")
                );
              }}
              style={{ cursor: "pointer !important", position: "relative" }}
            >
              <TradeImage
                src={`${CLOUDFARE_IMAGE_URL1}${element.main_pic}/public`}
                alt=""
                onClick={() => {}}
              />
            </Box>
          </Center>
        )}
        <Stack
          style={{ flex: 1 }}
          justify="space-between"
          p={10}
          pb={compressed == "comp3" || compressed == "comp2" ? 10 : 15}
          gap={3}
        >
          <Flex
            justify="flex-start"
            align="flex-start"
            direction={small || medium ? "column" : "row"}
            // direction={"column"}
            wrap="nowrap"
            p={0}
            pos="relative"
          >
            {showMessage && (
              <ActionIcon
                mr="2px"
                onClick={() => {
                  add_remove(element.id);
                }}
              >
                {show(element.id, "A") && <IconMessage2Plus size="2rem" />}
                {show(element.id, "R") && (
                  <IconMessage2X color="red" size="2rem" />
                )}
              </ActionIcon>
            )}
            <Title ml={0} order={3} mr={20}>
              <Highlight
                c={element.deal_dir == "I" ? "red.5" : ""}
                style={{
                  display: "contents",
                  margin: 0,
                  wordWrap: "break-word",
                }}
                className={classesG.titleHref}
                highlight={[
                  searchTrades && searchTrades.title ? searchTrades.title : "",
                  searchTrades && searchTrades.searchterm
                    ? searchTrades.searchterm
                    : "",
                ]}
                highlightStyles={(theme) => {
                  return WTSBTheme(theme, "", element.deal_dir);
                }}
                onClick={() => {
                  navigate(
                    `../trades/t/c/${element.id}` +
                      (hex && hex != "" ? "/?hex=" + hex : "")
                  );
                }}
              >
                {`${element.wtsb} ${element.title}`}
              </Highlight>
              <Box style={{ display: "inline-block" }}>
                <ActionIcon
                  ml={"5px"}
                  radius={5}
                  variant="subtle"
                  onClick={() => {
                    expandID(element.id, !expanded);
                    setExpanded((prev) => !prev);
                  }}
                >
                  {!expanded && <IconPlus size="16" />}
                  {expanded && (
                    <Box c="red">
                      <IconMinus size="16" />
                    </Box>
                  )}
                </ActionIcon>
              </Box>
            </Title>

            <Group
              justify={small || medium ? "apart" : "right"}
              gap={5}
              mb={10}
              style={{ flex: 1, alignItems: "baseline" }}
            >
              <Box
                onClick={() => {
                  if (islogged) search(element.co_id);
                }}
                className={classesG.companyDir}
                pb="5px"
              >
                <Text
                  fz={small ? "1em" : "1.2em"}
                  style={{
                    maxWidth: 200,
                    overflow: "hidden",
                    maxHeight: 20,
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {element.company_name}
                </Text>
              </Box>

              <Title fs="italic" fz="xs" opacity={0.5}>
                {D.utc_to_distance(element.last_posted_on)}
              </Title>
            </Group>
          </Flex>

          {(compressed == "full" ||
            compressed == "comp1" ||
            compressed == "comp2" ||
            expanded) && (
            <Group
              justify={compressed == "full" ? "apart" : "apart"}
              ml={0}
              mb="5px"
            >
              <Group
                justify="space-between"
                fz={small ? "1em" : "1.2em"}
                fw={small ? "bold" : "bolder"}
                style={{
                  textAlign: "left",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <Box fw="bold" m={0} p={0}>
                  <NumericFormat
                    decimalScale={0}
                    readOnly={true}
                    displayType="text"
                    value={`${element.quantity}`}
                    thousandSeparator={thousandSep()}
                    decimalSeparator={decimalSep()}
                  />
                  {element.uom}
                </Box>
                <Box fw="bold" m={0} p={0}>
                  <NumericFormat
                    decimalScale={0}
                    readOnly={true}
                    displayType="text"
                    value={`${element.price}`}
                    thousandSeparator={thousandSep()}
                    decimalSeparator={decimalSep()}
                  />
                  {element.curr}
                </Box>
              </Group>
            </Group>
          )}
          {element.hashtags &&
            element.hashtags != "" &&
            (compressed == "full" || compressed == "comp1" || expanded) && (
              <Box>
                <ScrollArea.Autosize
                  mah={50}
                  type="auto"
                  style={{ lineHeight: 2 }}
                >
                  {element.hashtags.split(" ").map((hash) => {
                    return (
                      <Box
                        style={{ display: "inline-block", marginRight: "5px" }}
                        className={classesG.hashGo}
                        onClick={() => {
                          let hash0 = encodeURIComponent(hash);
                          close();
                          let src = "TRADES";
                          let url =
                            src == "TRADES" ? "trades/t" : "latest-trades";
                          navigate(
                            `../${url}?hashtags_and=` +
                              hash0 +
                              `&t=` +
                              new Date().getTime().toString()
                          );
                        }}
                      >
                        {hash}
                      </Box>
                    );
                  })}
                </ScrollArea.Autosize>
              </Box>
            )}
        </Stack>
      </Box>
      {expanded && (
        <Box pos="relative" mih={40}>
          <LoadingOverlay
            visible={isLoading}
            overlayProps={{ radius: "sm", blur: 2 }}
          />

          <Box p="xs">
            <AppDiv contRef={null} html={data?.body} />
          </Box>
        </Box>
      )}
    </Paper>
  );
};

const MessageSwitcher = ({ focusOn, setFocusOn, t }) => {
  return (
    <>
      <Menu shadow="md" width={250} trigger="hover">
        <Menu.Target>
          <Button
            pr="5px"
            pl="5px"
            color="dark.4"
            variant="default"
            m={0}
            radius={0}
          >
            <IconFocusCentered size={20} />
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>{t("focus_on", "Focus On")}</Menu.Label>

          <Menu.Item
            c={focusOn == FOCUS_ON.TRADE_LIST ? "orange" : ""}
            leftSection={<IconPlaylistAdd size={18} />}
            onClick={() => {
              setFocusOn(FOCUS_ON.TRADE_LIST);
            }}
          >
            {t("trade_list", "Trade List")}
          </Menu.Item>

          <Menu.Item
            c={focusOn == FOCUS_ON.MESSAGE ? "orange" : ""}
            leftSection={<IconMessage size={18} />}
            onClick={() => {
              setFocusOn(FOCUS_ON.MESSAGE);
            }}
          >
            {t("message", "Message")}
          </Menu.Item>

          <Menu.Item
            c={focusOn == FOCUS_ON.CO ? "orange" : ""}
            leftSection={<IconBuilding size={18} />}
            onClick={() => {
              setFocusOn(FOCUS_ON.CO);
            }}
          >
            {t("company", "Company")}
          </Menu.Item>
          <Menu.Divider />

          <Menu.Item
            c={focusOn == FOCUS_ON.LIST_N_MESSAGE ? "orange" : ""}
            leftSection={
              <>
                <IconPlaylistAdd size={18} />
                <IconMessage size={18} />
              </>
            }
            onClick={() => {
              setFocusOn(FOCUS_ON.LIST_N_MESSAGE);
            }}
          >
            {t("list_n_message", "List And Message")}
          </Menu.Item>

          <Menu.Item
            c={focusOn == FOCUS_ON.CO_N_LIST ? "orange" : ""}
            leftSection={
              <>
                <IconPlaylistAdd size={18} />
                <IconBuilding size={18} />
              </>
            }
            onClick={() => {
              setFocusOn(FOCUS_ON.CO_N_LIST);
            }}
          >
            {t("list_n_company", "List And Company")}
          </Menu.Item>

          <Menu.Item
            c={focusOn == FOCUS_ON.CO_N_MESSAGE ? "orange" : ""}
            leftSection={
              <>
                <IconBuilding size={18} />
                <IconMessage size={18} />
              </>
            }
            onClick={() => {
              setFocusOn(FOCUS_ON.CO_N_MESSAGE);
            }}
          >
            {t("company_n_message", "Company And Message")}
          </Menu.Item>

          <Menu.Divider />
          <Menu.Item
            c="red"
            leftSection={<IconViewfinderOff size={16} />}
            onClick={() => {
              setFocusOn("");
            }}
          >
            {t("clear", "Clear")}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};
const notFocusOn = (obj, focus) => {
  if (focus === "") return false;
  switch (obj) {
    case FOCUS_OBJ.MESSAGE:
      return !(
        focus == FOCUS_ON.CO_N_MESSAGE ||
        focus == FOCUS_ON.MESSAGE ||
        focus == FOCUS_ON.LIST_N_MESSAGE
      );
    case FOCUS_OBJ.CO:
      return !(
        focus == FOCUS_ON.CO ||
        focus == FOCUS_ON.CO_N_MESSAGE ||
        focus == FOCUS_ON.CO_N_LIST
      );
    case FOCUS_OBJ.TRADE_LIST:
      return !(
        focus == FOCUS_ON.TRADE_LIST ||
        focus == FOCUS_ON.LIST_N_MESSAGE ||
        focus == FOCUS_ON.CO_N_LIST
      );
  }
  return false;
};

export const TradeImage = ({ src, alt, onClick }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const small = useSelector(selectSmall);
  const thumbnailStyle = {
    width: small ? "100%" : "140px",
    height: "auto", // Maintains aspect ratio
    maxHeight: small ? "" : "150px",
    cursor: onClick ? "pointer" : "default",
    borderRadius: "5px", // Optional for rounded corners
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)", // Optional for a shadow effect
  };
  const handleError = () => {
    setImgSrc(`${CLOUDFARE_IMAGE_URL1}${GENERIC_TRADE_IMAGE}/public`); // Replace with fallback image
  };
  return (
    <img
      src={imgSrc}
      style={thumbnailStyle}
      onError={handleError}
      alt={alt}
      onClick={() => {
        if (onClick) onClick();
      }}
    />
  );
};

export const ImageWithAspectRatio = ({ src, alt, height, fit, onClick }) => {
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const large = useSelector(selectLarge);
  const { classes: classesG } = useGlobalStyl();
  const [imgSrc, setImgSrc] = useState(src);
  const handleError = () => {
    setImgSrc(`${CLOUDFARE_IMAGE_URL1}${GENERIC_TRADE_IMAGE}/public`); // Replace with fallback image
  };
  return (
    <div
      className={classesG.ImageThumbContainer}
      style={{ height: height, cursor: onClick ? "pointer" : "default" }}
      onClick={() => {
        if (onClick) onClick();
      }}
    >
      <div
        style={{
          width: `100%`,
          height: `100%`,
          overflow: "hidden",
          position: "relative",
          display: "inline-block",
        }}
      >
        <img
          onError={handleError}
          src={imgSrc}
          alt={alt}
          className={classesG.ImageThumb}
          style={{ objectFit: fit }}
        />
      </div>
    </div>
  );
};
export const TradeDetails = () => {
  const [message, setMessage] = useState<any>("");
  const [updateMessage, setUpdateMessage] = useState<any>("");
  const [selectedItemIDS, setSelectedItemIDS] = useState<any>([]);
  const [expanded, setExpanded] = useState(true);

  const { t } = useTranslation("private", { keyPrefix: "channels" });
  const { error, succeed } = useMessage();
  const dispatch = useDispatch();

  const { islogged } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTrades, setSearchTrades] = useState<any>();
  const [data, setData] = useState<any>({});
  const [items, setItems] = useState<any>([]);
  const [dataCoInfo, setDataCoInfo] = useState<any>({});
  const [dataSahreInfo, setDataSahreInfo] = useState<any>("");
  let { id, source, traderpage } = useParams();
  let hex = G.ifNull(searchParams.get("hex"), "");
  const navigate = useNavigate();
  const { classes: classesG } = useGlobalStyl();
  const [focusOn, setFocusOn] = useState("");
  let co_id2: any = searchParams.get("co_id");
  let isTraderPage =
    traderpage === "c" || (co_id2 && co_id2 != "" && +co_id2 > 0);

  useEffect(() => {
    dispatch(changeActive("trades"));
  }, []);

  const {
    data: dataGet,
    getError,
    errorMessage,
    succeeded,
    isLoading,
    executeGet,
  } = useAxiosGet(BUILD_API("trades"), null);

  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);

  const Info = (itm) => {
    let dataa = dataGet && dataGet.length > 0 ? dataGet[0] : {};
    return dataa[itm];
  };
  useEffect(() => {
    refresh();
  }, []);
  const refresh = () => {
    setData({});
    setDataCoInfo({});
    clear_message();
    executeGet({
      url_e:
        BUILD_API("trades") +
        "/" +
        id +
        (hex && hex != "" ? "/?hex=" + hex : ""),
    });
  };
  const getAtribute = (attributes, nb) => {
    let val = "";
    let count = 0;
    try {
      for (let [key, value] of Object.entries(attributes)) {
        if (value && value !== "") {
          val = "," + val + value;
          count++;
          if (count >= nb) return val;
        }
      }
    } catch (error) {}
    return val;
  };
  useEffect(() => {
    setMessage(() => {
      let msg = data?.wtsb + ":" + data?.title + "\r\n";
      if (!selectedItemIDS || selectedItemIDS.length <= 0) return msg;
      if (items && items.length > 0)
        for (let i = 0; i < items.length; i++) {
          for (let j = 0; j < selectedItemIDS.length; j++) {
            if (items[i].id == selectedItemIDS[j]) {
              msg =
                msg +
                "\t" +
                items[i].item +
                `:` +
                G.ifNullFromat(items[i].quantity, ",%", "") +
                G.ifNullFromat(items[i].price, ",%", "") +
                getAtribute(items[i].item_attributes, 3) +
                "\r\n";
            }
          }
        }
      return msg;
    });
  }, [updateMessage]);

  useEffect(() => {
    // setDataCoInfo({})
    setDataSahreInfo("");
    // setData({})

    if (errorMessage) error(errorMessage);

    if (succeeded && dataGet && dataGet["trades"].length > 0) {
      dataGet["trades"][0]["quantity"] = +dataGet["trades"][0]["quantity"];
      dataGet["trades"][0]["price"] = +dataGet["trades"][0]["price"];
      setData(dataGet["trades"][0]);
      setDataCoInfo(dataGet["co_data"]);
      setItems(dataGet["items"]);
      formulateMessage();
    }
  }, [errorMessage, succeeded]);
  const clear_message = () => {
    setSelectedItemIDS(() => {
      return [];
    });
    formulateMessage();
  };
  const add_remove = (items_to_add, action) => {
    if (action == ITEM_ACTIONS.SELECT_ALL) {
      selectAllItems();
      return;
    }
    if (action == ITEM_ACTIONS.CLEAR) {
      clear_message();
      return;
    }
    let idx = -1;
    let id = items_to_add.length > 0 ? items_to_add[0]["itemid"] : 0;
    for (let i = 0; i < selectedItemIDS.length; i++) {
      if (selectedItemIDS[i] == id) {
        idx = i;
        break;
      }
    }

    if (idx >= 0) {
      if (action == ITEM_ACTIONS.SWITCH) {
        const new_ids = selectedItemIDS.filter((saved_id) => saved_id !== id);
        setSelectedItemIDS(new_ids);
      }
    } else {
      setSelectedItemIDS([...selectedItemIDS, id]);
    }
    formulateMessage();
  };
  const selectAllItems = () => {
    let ids: any = [];
    for (let i = 0; i < items.length; i++) ids.push(items[i].id);
    setSelectedItemIDS(ids);
    formulateMessage();
  };
  const formulateMessage = () => {
    setUpdateMessage(() => {
      return new Date().getTime().toString();
    });
  };
  const show = (id, dir) => {
    let idx = -1;
    for (let i = 0; i < selectedItemIDS.length; i++) {
      if (selectedItemIDS[i] == id) {
        idx = i;
        break;
      }
    }
    if (idx >= 0) {
      if (dir == "A") return false;
      return true;
    }
    if (dir == "R") return false;
    return true;
  };
  const allItemSelected =
    selectedItemIDS.length === (items && items.length ? items.length : -1);
  const someItemSelected = selectedItemIDS.length > 0;
  useEffect(() => {
    if (isLoading) setFocusOn("");
  }, [isLoading]);
  const coData =
    dataGet["co_data"] &&
    dataGet["co_data"].company &&
    dataGet["co_data"].company.company_name &&
    dataGet["co_data"].company.company_name != ""
      ? dataGet["co_data"]
      : null;
  return (
    <>
      {/* <AppHeader
        title={
          source === "t"
            ? t("trading_floor", "Trading Floor")
            : t("latest_trades", "Latest Trades")
        }
        titleClicked={() => {
          if (source === "t")
            navigate("../trades/t" + (hex && hex != "" ? "/?hex=" + hex : ""), {
              replace: true,
            });
          else
            navigate(
              "../latest-trades" + (hex && hex != "" ? "/?hex=" + hex : ""),
              { replace: true }
            );
        }}
      >
        <Group mt="xs" justify="right" gap="xs">
          <MessageSwitcher focusOn={focusOn} setFocusOn={setFocusOn} t={t} />
          <Button
            variant="default"
            onClick={(val) => {
              refresh();
            }}
          >
            <IconRefresh />
          </Button>
          <Button
            size="sm"
            variant="outline"
            type="button"
            onClick={() => {
              navigate(
                "../trades/t" + (hex && hex != "" ? "/?hex=" + hex : ""),
                { replace: true }
              );
            }}
          >
            <Group justify="space-between">
              <IconAdjustmentsOff style={{ transform: "rotate(90deg)" }} />
              {!small && <>{t("clear_filters", "Clear Filters")}</>}
            </Group>
          </Button>
        </Group>
      </AppHeader> */}
      <LoadingOverlay
        visible={isLoading}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <TraderInfo coData={coData} />
      <Box w="100%" className={`${classesG.cmpanyTradeLeftRigthPadding}`}>
        <Grid gutter={small ? 5 : medium ? 10 : 15}>
          <Grid.Col span={{ base: 12 }}>
            <Card
              radius="sm"
              p={small ? "xs" : medium ? "sm" : "md"}
              // p="0px" pt="xs"
              withBorder
            >
              <Flex
                justify="flex-start"
                align="flex-start"
                direction="row"
                wrap="nowrap"
              >
                {/* <ActionIcon variant="outline" mr="5px" radius={5}
                                    onClick={() => {
                                        setExpanded(prev => !prev)
                                    }}
                                >
                                    {!expanded && <IconPlus size="16" />}
                                    {expanded && <IconMinus size="16" />}
                                </ActionIcon> */}
                <Title
                  order={1}
                  c={data?.deal_dir == "I" ? "red.5" : ""}
                  className={classesG.titleWTSB}
                >
                  {data?.wtsb} {data?.title}
                </Title>
              </Flex>
            </Card>
          </Grid.Col>

          {/* <Grid.Col sm={12} md={12}>

                        <Card radius="sm" p={small ? "xs" : medium ? "sm" : "md"} pt="xs" withBorder>
                            {expanded && <TradeItem classesG={classesG} t={t} itemData={items} showMessage={true} add_remove={add_remove} show={show} allItemSelected={allItemSelected} someItemSelected={someItemSelected} selectAll={selectAllItems

                            } />}
                        </Card>


                    </Grid.Col> */}

          {data && data.hashtags != "" && (
            <Grid.Col span={{ base: 12 }}>
              <Card radius="sm" p="0" pt="0" pl={5} pr={5} withBorder>
                {data.hashtags && data.hashtags != "" && (
                  <Box className={`${classesG.hashtagboardContainer2}`}>
                    {data.hashtags.split(" ").map((hash) => {
                      return (
                        <Box
                          className={`${"hash-parent"}  ${
                            classesG.hashtagboardElem
                          }`}
                          onClick={() => {
                            let hash0 = encodeURIComponent(hash);
                            close();
                            let src = "TRADES";
                            let url =
                              src == "TRADES" ? "trades/t" : "latest-trades";
                            navigate(
                              `../${url}?hashtags_and=` +
                                hash0 +
                                `&t=` +
                                new Date().getTime().toString()
                            );
                          }}
                        >
                          <HashValue4Boardd2 label={hash} />
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Card>
            </Grid.Col>
          )}
          {data && data.pictures != "" && (
            <Grid.Col span={{ base: 12 }}>
              <ImagesZoneTrades pictures={data.pictures} />
              {/* <Card radius="sm" p="md" pt="xs" withBorder>
                            

                        </Card> */}
            </Grid.Col>
          )}

          {data && data.body != "" && (
            <Grid.Col span={{ base: 12 }}>
              <Card radius="sm" p="md" pt="xs" withBorder>
                <div dangerouslySetInnerHTML={{ __html: data?.body }}></div>
              </Card>
            </Grid.Col>
          )}
        </Grid>
        <Box className={classesG.seperator2} mt="md" mb="md" />
      </Box>
      <MessageToSend
        coData={coData}
        message={message}
        clear_message={clear_message}
      />
      {/* <CoInfo
        data={dataCoInfo}
        message={message}
        clear_message={() => {
          clear_message();
        }}
        focusOn={focusOn}
      /> */}
    </>
  );
};

const TraderInfo = ({ coData }) => {
  let { source } = useParams();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation("private", { keyPrefix: "trades" });
  // const [coData, setCoData] = useState<any>(null);
  const [showAbout, setAhowAbout] = useState(() => {
    let ky = searchParams.get("about");
    return ky && ky != "" ? ky : "";
  });
  const [showContact, setShowContact] = useState(() => {
    let ky = searchParams.get("contact");
    return ky && ky != "" ? ky : "";
  });
  useEffect(() => {
    let ky = searchParams.get("about");
    setAhowAbout(ky && ky != "" ? ky : "");
    ky = searchParams.get("contact");
    setShowContact(ky && ky != "" ? ky : "");
  }, [location.pathname, searchParams]);
  const navigate = useNavigate();
  let hex = G.ifNull(searchParams.get("hex"), "");
  let co_info = coData && coData.company ? coData["company"] : {};
  let users = coData && coData.users ? coData["users"] : [];
  const { classes: classesG } = useGlobalStyl();
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const show_deals = () => {
    if (!co_info) return;
    let co_id = co_info.id;
    let params: any = [];
    let v = ["co_id", co_id];
    params.push(v);

    params.splice(0, 0, ["t", new Date().getTime().toString()]);
    params.splice(0, 0, ["src", "company"]);
    params.splice(0, 0, ["msgdet", "c"]);

    let listdir = searchParams.get("listdir");
    if (listdir && listdir != "") {
      params.splice(0, 0, ["listdir", listdir]);
    }
    navigate({
      pathname: `/app/trades/${source}/c`, // Update the `traderpage` param
      search: createSearchParams(params).toString(),
    });
    // navigate({
    //   search: createSearchParams(params).toString(),
    // });
  };
  return (
    <>
      {coData && (
        <Group w="100%" mb="lg" justify="center" gap={0}>
          <Group
            w="100%"
            className={`${classesG.cmpanyTrade} ${classesG.cmpanyTradePadding}`}
          >
            <Box className={classesG.mainBodyTradeNavigHeader}>
              <Group justify="left" gap={5}>
                {/* <Title fw="bolder" order={small ? 3 : 1}>
                  {co_info?.company_name}
                </Title> */}
                <Box fw="bolder" fz={small ? "24px" : medium ? "32px" : "34px"}>
                  {co_info?.company_name}
                </Box>
                <Box
                  className={classesG.reportCoIcon}
                  onClick={(e) => {
                    navigate(
                      `../concern?co_id=` +
                        co_info?.id +
                        `&co_name=` +
                        co_info?.company_name
                    );
                    e.stopPropagation();
                  }}
                >
                  <IconAlertTriangle />{" "}
                </Box>
              </Group>
              <Text>{co_info?.url}</Text>
              <Text>
                {co_info?.city}, {co_info?.province_name}, {co_info?.country}{" "}
              </Text>
              <Group justify="left" gap={2} mt="xs">
                <Button
                  size="compact-xs"
                  variant="default"
                  onClick={() => {
                    if (source === "t")
                      navigate(
                        "../trades/t" +
                          (hex && hex != ""
                            ? "/c/?hex=" + hex
                            : "/a/?t=" + new Date().getTime().toString()),
                        { replace: true }
                      );
                    else
                      navigate(
                        "../latest-trades" +
                          (hex && hex != "" ? "/?hex=" + hex : ""),
                        { replace: true }
                      );
                  }}
                >
                  <Group justify="space-between" gap={2}>
                    <IconArrowLeft size={18} />
                    <Box>{t("back", "Back")}</Box>
                  </Group>
                </Button>

                <Button
                  size="compact-xs"
                  variant="default"
                  onClick={() => {
                    let v = showAbout == "" ? "X" : "";
                    searchParams.set("about", v);
                    setSearchParams(searchParams);
                    setAhowAbout(v);
                  }}
                >
                  <Group justify="space-between" gap={2}>
                    <Box>{t("about", "About")}</Box>
                    {showAbout == "" && <IconChevronsDown size={18} />}
                    {showAbout == "X" && <IconChevronsUp size={18} />}
                  </Group>
                </Button>
                <Button
                  size="compact-xs"
                  variant="default"
                  onClick={() => {
                    let v = showContact == "" ? "X" : "";
                    searchParams.set("contact", v);
                    setSearchParams(searchParams);
                    setShowContact(v);
                  }}
                >
                  <Group justify="space-between" gap={2}>
                    <Box> {t("contacts", "Contacts")}</Box>
                    {showContact == "" && <IconChevronsDown size={18} />}
                    {showContact == "X" && <IconChevronsUp size={18} />}
                  </Group>
                </Button>

                <Button
                  size="compact-xs"
                  variant="default"
                  onClick={show_deals}
                >
                  <Group justify="space-between" gap={2} c="violet.5">
                    <Box>
                      <IconListDetails size={18} />
                    </Box>
                    <Box>{t("deals", "Deals")}</Box>
                  </Group>
                </Button>

                <Button
                  leftSection={
                    <Box c="red.5">
                      <IconAlertTriangle size={18} />
                    </Box>
                  }
                  size="compact-xs"
                  variant="default"
                  color="red.5"
                  onClick={(e) => {
                    navigate(
                      `../concern?co_id=` +
                        co_info?.id +
                        `&co_name=` +
                        co_info?.company_name
                    );
                    e.stopPropagation();
                  }}
                >
                  <Box c="red.5"> {t("report", "Report")}</Box>
                </Button>
              </Group>
            </Box>
          </Group>
          <Group w="100%" pt="0" className={`${classesG.cmpanyTrade}`}>
            {showAbout == "X" && (
              <Grid
                gutter={0}
                //  p={0}
                w="100%"
                // bg="red"
                className={`${classesG.mainBodyTradeNavigHeader} ${classesG.cmpanyTradePadding}`}
                style={{ marginBottom: "0px !imprtant" }}
              >
                <Grid.Col span={{ base: 12 }}>
                  <Box>
                    <div
                      dangerouslySetInnerHTML={{ __html: co_info?.about }}
                      style={{ whiteSpace: "pre-line" }}
                    ></div>
                  </Box>
                </Grid.Col>
              </Grid>
            )}
            {showContact == "X" && showAbout == "X" && (
              <Box h={1} w="100%" className={classesG.cmpanyTradeSep} />
            )}
            {showContact == "X" && (
              <Grid
                gutter={small ? 5 : medium ? 7 : 9}
                mb="lg"
                w="100%"
                // bg="red"
                className={`${classesG.cmpanyTradePadding}`}
              >
                {showContact == "X" &&
                  users?.map((usr) => {
                    return (
                      <Grid.Col span={{ base: 12, lg: 6 }}>
                        <Box className={classesG.cmpanyTradeUser}>
                          <UserCard usr={usr} />
                        </Box>
                      </Grid.Col>
                    );
                  })}
              </Grid>
            )}
          </Group>
        </Group>
      )}
      {/* <TradesComp
        onGetData={(codta) => {
          setCoData(codta);
        }}
      /> */}
    </>
  );
};

const MessageToSend = ({ coData, message, clear_message }) => {
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation("private", { keyPrefix: "trades" });
  const { classes: classesG } = useGlobalStyl();
  const ref = useRef<HTMLTextAreaElement>(null);
  const [messageDet, setMessageDet] = useState<any>(() => {
    let ky = searchParams.get("msgdet");
    return ky && ky != "" ? ky : "msginfo";
  });
  const { error, succeed } = useMessage();
  let users = coData && coData.users ? coData["users"] : [];
  useEffect(() => {
    if (ref && ref.current) ref.current.innerHTML = message;
  }, [message]);
  return (
    <Box w="100%" className={`${classesG.cmpanyTradeLeftRigthPadding}`}>
      <Accordion
        // className={`${
        //   notFocusOn(FOCUS_OBJ.MESSAGE, focusOn) ? classesG.hideVisibility : ""
        // }`}
        variant="filled"
        defaultValue={messageDet}
        onChange={() => {
          let u: any = window.location;
          const url = new URL(u);
          let ky = url.searchParams.get("msgdet");
          let v: any = ky;
          if (!ky) v = "c";
          else {
            if (ky == "c") v = "msginfo";
            else v = "c";
          }
          setMessageDet(() => {
            return v;
          });
          searchParams.set("msgdet", v);
          setSearchParams(searchParams);
        }}
      >
        <Accordion.Item value="msginfo">
          <Accordion.Control className={classesG.accordionControl}>
            <Title order={small ? 3 : 1}>
              {t("message_to_send", "Message To Send")}
            </Title>
          </Accordion.Control>
          <Accordion.Panel className={classesG.accordionPannel}>
            <Textarea
              ref={ref}
              minRows={5}
              maxRows={5}
              placeholder={t(
                "kindly_choose_trades",
                "Kindly choose the trades you are interested in from the list below!."
              )}
              label={t("your_selected_trades", "Your Selected Trades")}
            ></Textarea>
            <Group opacity={message != "" ? 1 : 0.2} justify="left">
              <CopyButton value={message}>
                {({ copied, copy }) => (
                  <Group
                    gap={2}
                    justify="left"
                    className={
                      message != ""
                        ? classesG.textToCopy
                        : classesG.cursorNoDrop
                    }
                    onClick={() => {
                      if (message == "") return;
                      copy();
                      succeed(t("message_copied", "Message copied!."));
                    }}
                    c={copied ? "indigo.7" : ""}
                  >
                    <Box>{t("copy_message", "Copy Message")}</Box>
                    <IconCopy size={small ? 18 : medium ? 20 : 22} />
                  </Group>
                )}
              </CopyButton>
              <Group
                gap={2}
                c="red.6"
                justify="left"
                className={
                  message != "" ? classesG.textToCopy : classesG.cursorNoDrop
                }
                onClick={() => {
                  if (clear_message) clear_message();
                }}
              >
                {clear_message && (
                  <>
                    <Box>{t("clear_message", "Clear Message")}</Box>
                    <IconMessage2X size={small ? 18 : medium ? 20 : 22} />
                  </>
                )}
              </Group>
            </Group>

            <Box mt="md">
              <Grid gutter={small ? 10 : medium ? 15 : 20}>
                {users?.map((usr) => {
                  return (
                    <>
                      {usr.cell && usr.cell != "" && (
                        <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                          <Cell
                            fz={rem("1rem")}
                            cell={usr.cell}
                            verified={usr.cell_verified}
                            message={message}
                            show_op="SEND"
                            user={usr.first_name + ", " + usr.last_name}
                          />
                        </Grid.Col>
                      )}
                    </>
                  );
                })}
              </Grid>
              <Box fz={"0.7rem"}>
                {"*"}
                {t(
                  "click_to_copy_n_send_whatsapp_msg",
                  "Click on the contact above to copy the message and open WhatsApp."
                )}
              </Box>
              <Box fz={"0.7rem"}>
                {"*"}
                {t(
                  "past_auto_or_manually_whatsapp_msg",
                  "Usually, the message will be pasted automatically into the input field. If not, please paste it manually"
                )}
              </Box>
            </Box>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Box>
  );
};

const Clear = (source, navigate, hex) => {
  if (source === "t")
    navigate("../trades/t" + (hex && hex != "" ? "/c/?hex=" + hex : "/a"), {
      replace: true,
    });
  else
    navigate("../latest-trades" + (hex && hex != "" ? "/?hex=" + hex : ""), {
      replace: true,
    });
};
