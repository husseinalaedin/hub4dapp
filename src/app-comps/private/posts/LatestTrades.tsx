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
} from "@mantine/core";

import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import {
  IconAdjustmentsOff,
  IconAt,
  IconCircleArrowDownFilled,
  IconCopy,
  IconDeviceMobile,
  IconExternalLink,
  IconMessage2Down,
  IconMessage2Plus,
  IconMessage2Up,
  IconMessage2X,
  IconRefresh,
  IconUserCircle,
} from "@tabler/icons-react";
import {
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
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";
import { D } from "../../../global/Date";
import { BUILD_API, BUILD_URL, G, useMessage } from "../../../global/G";
import { NoDataFound } from "../../../global/NoDataFound";
import { SearchPannel } from "../../../global/SearchPannel";
import { useGlobalStyl } from "../../../hooks/useTheme";
import { WtsWtbDropV } from "../../../global/WtsWtbDropV";
import { useAxiosGet } from "../../../hooks/Https";
import { Pages } from "../../../hooks/usePage";
import { useAuth } from "../../../providers/AuthProvider";
import { changeActive } from "../../../store/features/ActiveNav";
import {
  selectMedium,
  selectSmall,
} from "../../../store/features/ScreenStatus";
import { AppHeader } from "../app-admin/AppHeader";

import { WTSBTheme } from "./Deals";
import { IconBrands } from "../../../global/IconBrands";
import { useDisclosure, useOs } from "@mantine/hooks";
import { Cell } from "../../../global/Cell";
import { UserCard } from "../../../global/UserCard";
import { TradesSearch } from "./Trades";
import { TradeHashTagsPop } from "./Hashtags";
import { ClearButton, ClearButton1 } from "../../../global/ClearButton";

export const LatestTrades = () => {
  const grid_name = "LATESTTRADES";
  const { islogged } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTrades, setSearchTrades] = useState<any>();
  const [selectedIDS, setSelectedIDS] = useState<any>([]);
  const [showMessage, setShowMessage] = useState<any>(false);
  const [message, setMessage] = useState<any>("");
  const [updateMessage, setUpdateMessage] = useState<any>("");
  let tm = searchParams.get("t");

  // let data: any = []
  // let dataCoInfo: any = {}
  // let dataSahreInfo: any = {}
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
  } = useAxiosGet(BUILD_API("latest-trades"), searchTrades);

  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const { classes: classesG } = useGlobalStyl();
  const [clearAction, setClearAction] = useState<any>("");
  // let selectedIDS: any = []
  let hex = G.ifNull(searchParams.get("hex"), "");
  useEffect(() => {
    dispatch(changeActive("latest-trades"));
  }, []);

  useEffect(() => {
    refresh();
  }, [tm]);

  const refresh = () => {
    // data = []
    // dataCoInfo = {}
    // dataSahreInfo = {}
    // setDataCoInfo({})
    // setDataSahreInfo('')
    // setData([])
    setShowMessage(false);
    setSelectedIDS([]);
    setMessage(() => {
      return "";
    });
    setSearchTrades(Object.fromEntries([...searchParams]));
    executeGet();
  };

  useEffect(() => {
    if (succeeded) {
      setShowMessage(() => {
        return (
          dataGet["co_data"] &&
          dataGet["co_data"].company &&
          dataGet["co_data"].company.company_name != ""
        );
      });
      // data = dataGet['trades']
      // dataCoInfo = dataGet['co_data']
      // dataSahreInfo = dataGet['shareidhex']
      // setData(() => {
      //     return dataGet['trades']
      // })
      // setDataCoInfo(() => { return dataGet['co_data'] })
      // setDataSahreInfo(() => { return dataGet['shareidhex'] })
    }
    if (errorMessage) error(errorMessage);
  }, [succeeded, errorMessage]);
  // const search = (co_id) => {

  //     let params: any = []
  //     let v = ['co_id', co_id]
  //     params.push(v)

  //     params.splice(0, 0, (['t', (new Date()).getTime().toString()]))
  //     params.splice(0, 0, ['src', 'company'])
  //     navigate({
  //         search: createSearchParams(params).toString()
  //     });

  // }
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
    setUpdateMessage(() => {
      return new Date().getTime().toString();
    });
  };
  const clear_message = () => {
    setSelectedIDS(() => {
      return [];
    });
    setUpdateMessage(() => {
      return new Date().getTime().toString();
    });
  };
  useEffect(() => {
    setMessage(() => {
      if (!selectedIDS || selectedIDS.length <= 0) return "";
      let trades_data = dataGet["trades"];
      let msg = "";
      if (trades_data && trades_data.length > 0)
        for (let i = 0; i < trades_data.length; i++) {
          for (let j = 0; j < selectedIDS.length; j++) {
            if (trades_data[i].id == selectedIDS[j]) {
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
  return (
    <>
      {isLoading && <Overlay opacity={1} color="#000" zIndex={5} />}
      {isLoading && (
        <LoadingOverlay
          visible={isLoading}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
      )}

      <AppHeader title={t("latest_trades_title", "Latest Trades")}>
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
            <TradeHashTagsPop src="LATESTTRADES" />
            {/* <Button size="sm" variant="outline" leftIcon={<IconAdjustmentsOff style={{ transform: 'rotate(90deg)' }} />} type="button" onClick={() => {
                        
                       if(hex && hex!=''){
                           let params: any = []

                           params.splice(0, 0, (['t', (new Date()).getTime().toString()]))
                           params.splice(0, 0, ['src', 'clear'])
                           navigate({
                               search: createSearchParams(params).toString()
                           });
                        return 
                       }
                        setClearAction(() => {
                            return 'CLEAR' + (new Date()).getTime().toString()
                        })

                    }}>
                        {t('clear_filters', 'Clear Filters')}

                    </Button> */}
            {hex && hex != "" && (
              <ClearButton1
                t={t}
                small={small}
                onClear={() => {
                  if (hex && hex != "") {
                    let params: any = [];

                    params.splice(0, 0, ["t", new Date().getTime().toString()]);
                    params.splice(0, 0, ["src", "clear"]);
                    navigate({
                      search: createSearchParams(params).toString(),
                    });
                    return;
                  }
                  setClearAction(() => {
                    return "CLEAR" + new Date().getTime().toString();
                  });
                }}
              />
            )}
          </Group>
        )}
      </AppHeader>

      <Box style={{ width: "100%", position: "relative" }}>
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
                  action={clearAction}
                  grid={grid_name}
                  src="LATESTTRADES"
                />
              </Box>
            </Group>
          )}
          <Box mt="lg">
            {!dataGet ||
              !dataGet["trades"] ||
              (dataGet["trades"].length <= 0 && (
                <NoDataFound title={t("no_deals_found", "No Deals Found!.")} />
              ))}
            {dataGet["trades"]?.map((element, index) => {
              return (
                <Paper
                  key={element.id}
                  radius={0}
                  p={2}
                  pl={15}
                  pr={15}
                  className={
                    (show(element.id, "R")
                      ? `${classesG.paperSelected} `
                      : `${classesG.paper} `) +
                    (index != dataGet["trades"].length - 1
                      ? `${classesG.transparentBottomBorder} `
                      : "") +
                    (index % 2 == 0 ? `${classesG.listZibra2} ` : "")
                  }
                  style={{
                    // paddingRight: 45,
                    marginTop: 0, //? 50 : 0, width: "100%",
                    marginBottom: 0,
                    position: "relative",
                  }}
                >
                  <Box
                    style={{
                      display: small ? "block" : "flex",
                      alignItems: "stretch",
                    }}
                  >
                    <Group
                      style={{ flex: 1 }}
                      ml={0}
                      gap={5}
                      c={element.deal_dir == "I" ? "red.5" : ""}
                      className={classesG.titleHref}
                      onClick={() => {
                        navigate(
                          `../trades/l/c/${element.id}` +
                            (hex && hex != "" ? "/?hex=" + hex : "")
                        );
                      }}
                    >
                      <Title ml={0} order={3}>
                        <Highlight
                          highlight={[
                            searchTrades && searchTrades.title
                              ? searchTrades.title
                              : "",
                            searchTrades && searchTrades.searchterm
                              ? searchTrades.searchterm
                              : "",
                          ]}
                          highlightStyles={(theme) => {
                            return WTSBTheme(theme, "", element.deal_dir);
                          }}
                        >
                          {`${element.wtsb} ${element.title}`}
                        </Highlight>
                      </Title>
                    </Group>
                    <Group justify="right" gap={2} fs="oblique">
                      <Text
                        mr="lg"
                        onClick={() =>
                          navigate(
                            `../trades/l/c?src=company&co_id=${element.co_id}` +
                              (hex && hex != "" ? "&hex=" + hex : "")
                          )
                        }
                        className={classesG.companyDir}
                      >
                        {t("by", "By")} {element.company_name}
                      </Text>
                      <Text opacity={0.5}>
                        {D.utc_to_distance(element.last_posted_on)}
                      </Text>
                    </Group>
                  </Box>
                </Paper>
              );
            })}
            <Pages data={dataGet["trades"]} small={small} />
          </Box>
        </Stack>
      </Box>
    </>
  );
};

export const TradesSearch0 = ({ action }) => {
  // const [action, setAction] = useState('')
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation("private", { keyPrefix: "trades" });
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const navigate = useNavigate();
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
      wtsb: G.ifNull(searchParams.get("wtsb"), ""),
      searchterm: G.ifNull(searchParams.get("searchterm"), ""),
    },
  });
  useEffect(() => {
    executeGetWTSB();
  }, []);
  useEffect(() => {
    let trm = searchParams.get("searchterm");
    if (trm != form.values.searchterm) form.setValues({ searchterm: trm });
  }, [searchParams]);

  const search0 = () => {
    G.updateParamsFromForm(searchParams, form);
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
  useEffect(() => {
    if (!action || action == "") return;
    if (action.toUpperCase().indexOf("CLEAR") >= 0) clear();
  }, [action]);

  return (
    <>
      <SearchPannel
        action={action}
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
            <MultiSelect
              // itemComponent={WtsWtbDropV}
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
            />
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
