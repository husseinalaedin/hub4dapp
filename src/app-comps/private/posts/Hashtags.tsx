import { useEffect, useRef, useState } from "react";
import { BUILD_API, useMessage } from "../../../global/G";
import { useAxiosGet } from "../../../hooks/Https";
import {
  HashtagsAlert,
  HashtagSearchShowOptionAlert,
  HashTagsInput,
  HashValue4Boardd,
} from "../../../global/global-comp/Hashtags";
import {
  ActionIcon,
  Box,
  Button,
  Card,
  CloseButton,
  Grid,
  Group,
  LoadingOverlay,
  Modal,
  MultiSelect,
  Overlay,
  Radio,
  ScrollArea,
  Select,
  SimpleGrid,
  Stack,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useGlobalStyl } from "../../../hooks/useTheme";
import {
  IconAdjustmentsHorizontal,
  IconArrowLeft,
  IconClearAll,
  IconHash,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import {
  selectLarge,
  selectMedium,
  selectSmall,
} from "../../../store/features/ScreenStatus";
import { useSelector } from "react-redux";
import {
  renderWtsWtbDropVOption,
  WtsWtbDropV,
} from "../../../global/WtsWtbDropV";
import { useForm } from "@mantine/form";
import { IconAdjustmentsOff } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { NoDataFound } from "../../../global/NoDataFound";
import { useNavigate } from "react-router";
import { AppSelect } from "../../../global/global-comp/AppSelect";
export const TradeHashTagsPop = ({ src }) => {
  const { t } = useTranslation("private", { keyPrefix: "trades" });
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal
        padding={0}
        yOffset={0}
        opened={opened}
        onClose={close}
        // title="This is a fullscreen modal"
        fullScreen
        withCloseButton={false}
        transitionProps={{ transition: "fade", duration: 200 }}
      >
        <Box p="5px">
          <Box maw={1000} style={{ margin: "0 auto" }}>
            <Group justify="right">
              <ActionIcon onClick={close} variant="light" size="lg" color="red">
                {<IconX size={35} />}
              </ActionIcon>
              {/* <Button leftIcon={<IconX size={30} />} onClick={close} variant="light" color="red">
                            {t('close', 'Close')}
                        </Button> */}
            </Group>
            <Box mt="sm">
              <TradeHashTags close={close} src={src} />
            </Box>
          </Box>
        </Box>
      </Modal>

      <Group justify="center">
        <Tooltip
          label={t(
            "click_to_search_available_hashes",
            "Click to search available hashes!"
          )}
          withinPortal
        >
          <Button onClick={open}>
            <Group justify="center">{<IconHash size={25} />}</Group>
          </Button>
        </Tooltip>
      </Group>
    </>
  );
};
export const TradeHashTags = ({ close, src }) => {
  const navigate = useNavigate();
  const { error, succeed, info } = useMessage();
  const [data, setData] = useState<any>([]);
  const [showHash, setShowHash] = useState<any>("both");
  const { classes: classesG } = useGlobalStyl();
  const { t } = useTranslation("private", { keyPrefix: "trades" });
  const [searchValue, onSearchChange] = useState("");

  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const large = useSelector(selectLarge);
  const refPostType = useRef<HTMLInputElement>(null);

  const [hashData, setHashData] = useState<any>(() => {
    return [];
  });
  const [hashValue, setHashValue] = useState<any>(() => {
    return [];
  });
  const form = useForm({
    initialValues: { wtsb: [], hashtags: [], showhash: "both" },
  });
  const {
    data: dataWTSB,
    errorMessage: errorMessageWTSB,
    succeeded: succeededWTSB,
    isLoading: isLoadingWTSB,
    executeGet: executeGetWTSB,
  } = useAxiosGet(BUILD_API("util/wtsb"), null);
  const {
    data: hashGet,
    errorMessage: errorMessageHashGet,
    succeeded: succeededHashGet,
    isLoading,
    executeGet: executeHashGet,
  } = useAxiosGet(BUILD_API("active-trades-hashtags"), {
    wtsb: form.getInputProps("wtsb").value,
    hashtags: form.getInputProps("hashtags").value, //hashValue && hashValue.length > 0 ? hashValue.join(",") : "",
    showhash: form.getInputProps("showhash").value,
  });
  useEffect(() => {
    executeGetWTSB();
    search();
  }, []);
  useEffect(() => {
    let errorMsg = errorMessageHashGet;
    if (errorMsg) error(errorMsg);
    if (succeededHashGet && hashGet) {
      let dta: any = [];
      generate(dta, "", "");
      setData(dta);
    }
  }, [errorMessageHashGet, succeededHashGet]);
  const generate = (data_a, postfix, v) => {
    hashGet.forEach((itemS) => {
      data_a.push({
        hashtag: itemS.hashtag, //+ "_" + postfix,
        dealcount: itemS.dealcount + v,
      });
    });
  };
  const search = () => {
    executeHashGet();
  };
  const clearsearch = () => {
    form.setValues({ wtsb: [], hashtags: [], showhash: "both" });
    setHashValue([]);
    setHashData([]);
    executeHashGet();
  };
  const onRemove2 = (val) => {
    setHashValue((prevItems) => prevItems.filter((item) => item !== val));
    setHashData((prevItems) => prevItems.filter((item) => item.value !== val));
  };
  const hashOpt = () => {
    let dta: any = [];
    dta.push({ value: "double", label: t("double", "Double#") });
    dta.push({ value: "single", label: t("single", "Single#") });
    dta.push({ value: "both", label: t("both", "Both") });

    return dta;
  };
  const wtsbOpt = () => {
    let dta: any = [];
    if (!dataWTSB || !dataWTSB.length || dataWTSB.length == 0) return [];
    dta.push({ value: "", label: t("all", "All"), dir: "" });
    dataWTSB.map((wts) => {
      dta.push({ value: wts.wtsb, label: wts.wtsb_desc_short, dir: wts.dir });
    });
    return dta;
  };
  return (
    <>
      {/* <MultiSelect 
            size="xl"
                data={data}
                // defaultValue={['#a']}
                value={default0}
                label="Available"
                placeholder="Available"
                maxDropdownHeight={250}
                valueComponent={HashValue4Board}
                itemComponent={HashItem}
                limit={200}
                // postcount={200}
            /> */}

      <Box>
        <Grid gutter={5}>
          <Grid.Col span={small ? 12 : large || medium ? 3 : 2}>
            <AppSelect
              // withinPortal={true}
              label={t("in_want_to", "In Want To")}
              clearable
              {...form.getInputProps("wtsb")}
              defaultValue={""}
              fz="lg"
              size="md"
              placeholder={t("e_g_All", "e.g All")}
              data={wtsbOpt()}
              renderOption={renderWtsWtbDropVOption}
              maxDropdownHeight={500}
            />
          </Grid.Col>
          <Grid.Col span={small ? 12 : large || medium ? 9 : 6}>
            <Box mt="4px">
              <HashTagsInput
                size="md"
                label={t("hash_tag", "Hashtags")}
                addOnNotFound={true}
                withAsterisk={false}
                {...form.getInputProps("hashtags")}
                withinPortal={true}
                placeholder={"e.g iphone grade a or ipho or grad or grade a"}
                w="100%"
                readOnly={false}
              />
            </Box>
          </Grid.Col>
          <Grid.Col span={small ? 5 : large || medium ? 3 : 2}>
            <Group gap={0} justify="left">
               
              <AppSelect
              maw={"85%"}
                label={t("show_hash", "Show Hash")}
                {...form.getInputProps("showhash")}
                defaultValue={"both"}
                fz="lg"
                size="md"
                placeholder={t("e_g_both", "e.g Both")}
                data={hashOpt()}
                maxDropdownHeight={500}
              />
              <Box maw={"15%"}>
                
              <HashtagSearchShowOptionAlert withinPortal={true} />
              </Box>
            </Group>
          </Grid.Col>
          <Grid.Col span={small ? 7 : large || medium ? 9 : 2}>
            <Group gap={3} justify="left" mt="25px">
              <Tooltip label={t("search", "Search")} withinPortal>
                <Button onClick={search} size="md">
                  <IconSearch />
                  {/* {t('search','Search')} */}
                </Button>
              </Tooltip>
              <Tooltip label={t("clear", "Clear")} withinPortal>
                <Button
                  color="red"
                  onClick={clearsearch}
                  size="md"
                  variant="outline"
                >
                  <IconAdjustmentsOff />
                  {/* {t('search','Search')} */}
                </Button>
              </Tooltip>
            </Group>
          </Grid.Col>
          {/* <Grid.Col span={small ? 3 : large || medium ? 3 : 3}>

                        
                    </Grid.Col> */}
        </Grid>
      </Box>
      <Box style={{ width: "100%", position: "relative", minHeight: "150px" }}>
        {isLoading && <Overlay opacity={1} color="#000" zIndex={5} />}
        {isLoading && (
          <LoadingOverlay
            visible={isLoading}
            overlayProps={{ radius: "sm", blur: 2 }}
          />
        )}
        {!hashGet ||
          (hashGet.length <= 0 && (
            <NoDataFound title={t("no_hash_found", "No Hash Tags Found!.")} />
          ))}
        {hashGet && hashGet.length > 0 && data && data.length > 0 && (
          <Box className={`${classesG.hashtagboardContainer}`}>
            {data.map((hash) => {
              return (
                <Box
                  className={`${"hash-parent"} ${classesG.hashtagboardElem}`}
                  onClick={() => {
                    let hash0 = encodeURIComponent(hash.hashtag.split(" & "));
                    close();
                    let url = src == "TRADES" ? "trades/t/a" : "latest-trades";
                    navigate(
                      `../app/${url}?hashtags_and=` +
                        hash0 +
                        `&t=` +
                        new Date().getTime().toString()
                    );
                  }}
                >
                  <HashValue4Boardd
                    label={hash.hashtag}
                    postcount={hash.dealcount}
                  />
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </>
  );
};
