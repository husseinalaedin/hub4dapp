import { useEffect, useRef, useState } from "react";
import { BUILD_API, BUILD_URL, G, useMessage } from "../../../global/G";
import { useSelector } from "react-redux";
import { selectAdvSearchStatus } from "../../../store/features/AdvSearchStatus";
import { useClickOutside, useOs } from "@mantine/hooks";
import { useClipBoard } from "../../../hooks/useClipboard";
import {
  selectLarge,
  selectMedium,
  selectSmall,
  selectxLarge,
  selectxLarger,
} from "../../../store/features/ScreenStatus";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { GridLayOut, openChannel, openChannel2 } from "../../../global/Misc";
import { useGlobalStyl } from "../../../hooks/useTheme";
import { useAxiosGet, useAxiosPost } from "../../../hooks/Https";
import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Center,
  CopyButton,
  Group,
  LoadingOverlay,
  Menu,
  Modal,
  ScrollArea,
  SimpleGrid,
  Stack,
  Tabs,
  Text,
  TextInput,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconArticle,
  IconCheck,
  IconCircleFilled,
  IconEdit,
  IconExclamationCircle,
  IconGrain,
  IconMessageShare,
  IconPlus,
  IconShare,
} from "@tabler/icons-react";
import {
  DealsToShare,
  disableSahreNOpen,
  ShareExpirationManip,
} from "./Shares";
import { IconExternalLink } from "@tabler/icons-react";
import { IconBrands } from "../../../global/IconBrands";
import { IconCopy } from "@tabler/icons-react";
import { IconTopologyStarRing3 } from "@tabler/icons-react";
import { IconX } from "@tabler/icons-react";
import { AppDiv } from "../../../global/AppDiv";
import { IconBulb } from "@tabler/icons-react";
import { NoDataFound } from "../../../global/NoDataFound";
import { Pages } from "../../../hooks/usePage";
import { AddEditChannelMain, ChannelSearch } from "../channel/Channels";
import { IconShare3 } from "@tabler/icons-react";
import { D } from "../../../global/Date";
import { CardIn } from "../../../global/CardIn";
import { IconShare2 } from "@tabler/icons-react";
import { IconPencilShare } from "@tabler/icons-react";
import { SHARES_TYPE } from "../posts/Deals";
export const useDealToShareMain = () => {
  const navigate = useNavigate();
  // const location = useLocation();
  const [queryParams, setQueryParams] = useState({});

  // const handleClearQuery = () => {
  //   const pathWithoutQuery = location.pathname;
  //   navigate(pathWithoutQuery, { replace: true });
  // };
  const [searchParams, setSearchParams] = useSearchParams();
  const [onSucceeded, setOnSucceeded] = useState<any>(null);
  const [onCloseM, setOnCloseM] = useState<any>(null);
  const [openas, setOpenas] = useState<any>(null);

  const [opened, setOpened] = useState(false);

  const openToShare = () => {
    setOpened(true);
  };
  const closeToShare = () => {
    setOpened(false);
  };
  useEffect(() => {
    if (opened) {
      const searchParams0 = new URLSearchParams(location.search);
      const params = {};
      for (let [key, value] of searchParams0.entries()) {
        params[key] = value;
      }
      setQueryParams(params);
      const pathWithoutQuery = location.pathname;
      navigate(pathWithoutQuery, { replace: true });
    } else {
      const searchParams1 = new URLSearchParams(location.search);
      const params1 = {};
      let ignore = false;
      let hash =window.location.hash.substring(1);
      for (let [key, value] of searchParams1.entries()) {
        params1[key] = value;
        if (key == "src" && value == "navigator") ignore = true;
      }
      if (!ignore && (hash == "bypasting"||hash == "byai")) ignore = true;
      
      if (!ignore) {
        const searchParams = new URLSearchParams(queryParams).toString();
        navigate(`?${searchParams}`, { replace: true });
      }
    }
  }, [opened]);
  return {
    opened,
    openToShare,
    closeToShare,
    setOnSucceeded,
    openas,
    setOpenas,
    setOnCloseM,
  };
};
export const DealToShareComMain = ({ t, opened, openas, closeToShare }) => {
  const { classes: classesG } = useGlobalStyl();

  return (
    <Modal
      closeOnEscape={false}
      padding={"5px"}
      size="auto"
      className={classesG.PopUpShareBackGRound}
      fullScreen
      withCloseButton={false}
      opened={opened}
      onClose={() => {
        closeToShare();
      }}
    >
      {opened && (
        <Box>
          <DealToShareCom t={t} openas={openas} closeToShare={closeToShare} />
        </Box>
      )}
    </Modal>
  );
};
const DealToShareCom = ({ t, openas, closeToShare }) => {
  const uniqueShort = () => {
    return G.uid("s");
  };
  // let toShareRef = useRef<any>(null);
  const [toShareComp, setSoShareComp] = useState<HTMLDivElement | null>(null);
  const [donotClose, setDonotClose] = useState(false);
  const searchIsOpen = useSelector(selectAdvSearchStatus);
  const [newChannel, setNewChannel] = useState(true);
  const [currentUrlToOpen, setCurrentUrlToOpen] = useState("");
  const [toShareContain, setToShareContain] = useState<any>(null);
  const [shareCompleted, setShareCompleted] = useState(false);
  const [openUrl, setOpenUrl] = useState(false);
  // shareCompleted, onShare
  useClickOutside(
    () => {
      if (!searchIsOpen && !donotClose) closeToShare();
    },
    null,
    [toShareComp]
  );
  const grid_name = "CHANNELS_POPUP";
  let clipboard = useClipBoard({ timeout: 750, timeouthtml: 10000 });
  const [searchChannles, setSearchChannles] = useState<any>();
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const large = useSelector(selectLarge);
  const xlarge = useSelector(selectxLarge);
  const xlarger = useSelector(selectxLarger);

  const { error, succeed } = useMessage();

  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => {
    if (openas && openas != "") return openas;
    return "to_share";
  });

  const [initiated, setInitiated] = useState(false);
  const [sharingChannel, setSharingChannel] = useState<any>(null);
  const [shareDoc, setShareDoc] = useState<any>({});
  const [sharedOpened, setSharedOpened] = useState(false);

  const [shareableIdex, setShareableIdex] = useState(() => {
    return uniqueShort();
  });
  const os = useOs();
  const layout = () => {
    if (searchChannles && searchChannles["listdir"])
      return searchChannles["listdir"];
    return GridLayOut(grid_name, "", "GET", "grid_view");
  };
  const [listDir, setListDir] = useState<string>(() => {
    return layout();
  });
  const { classes: classesG } = useGlobalStyl();
  const {
    data: dataDefault,
    getError: getErrorDefault,
    errorMessage: errorMessageDefault,
    succeeded: succeededDefault,
    isLoading: isLoadingDefault,
    executeGet: executeGetDefault,
  } = useAxiosGet(BUILD_API("channels/d/default"), searchChannles);

  const { data, getError, errorMessage, succeeded, isLoading, executeGet } =
    useAxiosGet(BUILD_API("channels"), searchChannles);
  let {
    data: dataPost,
    isLoading: isLoadingPost,
    succeeded: succeededPost,
    errorMessage: errorMessagePost,
    executePost,
  } = useAxiosPost(
    BUILD_API(
      "shares/" + (sharingChannel && sharingChannel.id ? sharingChannel.id : "")
    ),
    shareDoc
  );

  const close = () => {
    closeToShare();
  };
  useEffect(() => {
    if (activeTab !== SHARES_TYPE.SHARE_BY_CHANNEL) return;
    refresh();
  }, [searchParams]);
  useEffect(() => {
    if (errorMessage) error(errorMessage);
    if (succeeded) setInitiated(true);
  }, [succeeded, errorMessage]);

  useEffect(() => {
    if (errorMessageDefault) error(errorMessageDefault);
  }, [errorMessageDefault]);

  const refresh = () => {
    fit_data_grid_view();
    setSearchChannles(Object.fromEntries([...searchParams]));
    executeGetDefault();
    executeGet();
  };
  useEffect(() => {
    executeGetDefault();
  }, []);
  useEffect(() => {
    if (initiated || activeTab !== SHARES_TYPE.SHARE_BY_CHANNEL) return;
    refresh();
  }, [initiated, activeTab]);

  const url = () => {
    return BUILD_URL(shareableIdex);
  };

  const share = (channel, editbefore_sharing, openUrl_) => {
    //dataDefault, editbefore_sharing
    // let toShareCopy = toShareRef?.current?.editorObject?.currentContent
    setActiveTab("to_share");
    if (editbefore_sharing) {
      // setActiveTab('to_share')
      return;
    }
    goShare(channel, openUrl_);
  };
  const goShare = (channel, open) => {
    setOpenUrl(open);
    if (!toShareContain) return;
    setShareCompleted(true);
    setShareDoc({
      idhex: shareableIdex,
    });
    executePost({ url_e: BUILD_API("shares/" + channel.id) });
  };
  useEffect(() => {
    if (errorMessagePost) {
      error(errorMessagePost);
    }

    if (succeededPost) {
      setCurrentUrlToOpen("");
      setTimeout(async () => {
        await clipboard.copy(toShareContain?.contain + "\n" + url());
        setSharedOpened(true);
        setDonotClose(true);
        let url_open = openChannel(isPhone, sharingChannel, openUrl);
        setCurrentUrlToOpen(url_open);
      }, 10);
    }
  }, [succeededPost, errorMessagePost]);
  const fit_data_grid_view = () => {
    if (small || medium) {
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
  const closeSharedPopUp = () => {
    setSharedOpened(false);
    setDonotClose(false);
  };
  const isPhone = () => {
    return os == "ios" || os == "android";
  };
  const newShare = () => {
    setOpenUrl(false);
    setShareableIdex(uniqueShort());
    setShareCompleted(false);
    setSharingChannel(null);
  };
  const opengroupurl0 = (open) => {
    return openChannel2(
      isPhone,
      sharingChannel.channel_group_id,
      sharingChannel.channel_data,
      open
    );
  };
  return (
    <>
      <Center mah={"calc(100vh - 20px)"} mt="10px" mb="10px">
        <Box
          ref={setSoShareComp}
          mih="50vh"
          mah={"100%"}
          p={small || medium ? "0px" : "10px"}
          pt={0}
          w={small || medium ? "100%" : "65vw"}
          style={{ borderRadius: "10px", height: "100%" }}
          className={classesG.popUpBackground}
        >
          <Modal
            closeOnEscape={false}
            zIndex={100000000}
            opened={sharedOpened}
            onClose={() => {
              // setShareableIdex(uniqueShort())
              closeSharedPopUp();
            }}
            title={t("share", "Share")}
            closeOnClickOutside={false}
          >
            {sharedOpened && (
              <Stack>
                <Alert
                  icon={<IconCheck size={16} />}
                  title={t("succeeded", "Succeeded")}
                  color="green"
                >
                  <Text>
                    {t(
                      "successfully_sahred",
                      "Message successfully recorded as shared via this channel and also copied to the clipboard!"
                    )}
                  </Text>
                  {currentUrlToOpen != "" && (
                    <Text>
                      {t(
                        "channel_opened_so_publish",
                        "The channel opened, please publish the shared message there!."
                      )}
                    </Text>
                  )}
                  {currentUrlToOpen == "" && (
                    <Text>
                      {t(
                        "open_channel_to_publish",
                        "Channel has no URL,So please open the channel you want to share the message with!."
                      )}
                    </Text>
                  )}
                </Alert>
                <ShareExpirationManip
                  t={t}
                  ids={[dataPost?.id]}
                  expire={dataPost?.expire}
                  withinPortal={false}
                />
                <TextInput
                  value={sharingChannel?.channel_name}
                  readOnly={true}
                  autoComplete="off"
                  label={t("channel_name", "Channel Name")}
                  placeholder={t("channel_name", "Channel Name")}
                />
                <TextInput
                  disabled={opengroupurl0(false) === ""}
                  leftSection={
                    <IconBrands
                      brand={sharingChannel?.channel_group_id}
                      size={small ? 18 : medium ? 20 : 22}
                    />
                  }
                  value={opengroupurl0(false)}
                  readOnly={true}
                  autoComplete="off"
                  label={t("channel_data", "Channel Data")}
                  placeholder={t("channel_data", "Channel Data")}
                  rightSection={
                    opengroupurl0(false) !== "" && (
                      <a
                        href={opengroupurl0(false)}
                        target={sharingChannel?.channel_group_id}
                      >
                        <IconExternalLink
                          size={small ? 18 : medium ? 20 : 22}
                        />
                      </a>
                    )
                  }
                />
                <TextInput
                  value={url()}
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
                      <CopyButton value={url()}>
                        {({ copied, copy }) => (
                          <ActionIcon
                            variant="transparent"
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
                <Alert
                  icon={<IconExclamationCircle size={16} />}
                  title={t("warning", "Warning")}
                  color="yellow"
                >
                  <Text>
                    {t(
                      "attention_sharing_is_not_auto",
                      "Please be advised that the message is not published automatically to the channel; you must manually paste the copied message into the target channel!"
                    )}
                  </Text>
                </Alert>
              </Stack>
            )}
            <Group justify="right" mt="lg">
              <Button
                onClick={() => {
                  // setShareableIdex(uniqueShort())
                  closeSharedPopUp();
                }}
              >
                {t("close", "Close")}
              </Button>
            </Group>
          </Modal>

          <LoadingOverlay
            visible={isLoadingPost}
            overlayProps={{ radius: "sm", blur: 2 }}
            opacity={0.8}
          />

          <Box maw={900} ml={"auto"} mr={"auto"} p={small ? "5px" : "md"}>
            {/* <ScrollArea.Autosize mah="60vh" mx="auto">
                            <AppDiv contRef={null} html={contentToCopy} />
                        </ScrollArea.Autosize> */}
            <Tabs defaultValue={openas} value={activeTab}>
              <Tabs.List>
                {/* <Tabs.Tab value="edit_message" onClick={() => {
                                    setActiveTab('edit_message')
                                }} icon={<IconEdit size="0.8rem" />}>{t('edit_message', 'Edit')}</Tabs.Tab> */}
                <Tabs.Tab
                  value="to_share"
                  onMouseDown={() => {
                    setActiveTab("to_share");
                  }}
                  leftSection={<IconArticle size="0.8rem" />}
                >
                  {t("to_share", "To Share")}
                </Tabs.Tab>

                <Tabs.Tab
                  value={SHARES_TYPE.SHARE_BY_DEFAULT}
                  disabled={shareCompleted}
                  onMouseDown={() => {
                    setActiveTab(SHARES_TYPE.SHARE_BY_DEFAULT);
                  }}
                  leftSection={<IconCircleFilled size="0.8rem" />}
                >
                  {t("by_default", "Default Chnl")}
                </Tabs.Tab>

                <Tabs.Tab
                  value={SHARES_TYPE.SHARE_BY_CHANNEL}
                  disabled={shareCompleted}
                  onMouseDown={() => {
                    setActiveTab(SHARES_TYPE.SHARE_BY_CHANNEL);
                  }}
                  leftSection={<IconTopologyStarRing3 size="0.8rem" />}
                >
                  {t("by_channel", "Channels")}
                </Tabs.Tab>
                <Tabs.Tab
                  value="new_channel"
                  onMouseDown={() => {
                    setActiveTab("new_channel");
                  }}
                >
                  {/* {t('channel', '')} */}
                  <ActionIcon
                    color="primary"
                    variant="filled"
                    onClick={() => {}}
                  >
                    <IconPlus size="1.2rem" stroke={2} />
                  </ActionIcon>
                </Tabs.Tab>
                <Tabs.Tab value="account" ml="auto" p={0}>
                  <ActionIcon
                    color="red"
                    variant="light"
                    onClick={() => {
                      close();
                    }}
                  >
                    <IconX size={"1.5rem"} />
                  </ActionIcon>
                </Tabs.Tab>
              </Tabs.List>

              {/* <Tabs.Panel value="edit_message" pt="xs">
                                <Box className={classesG.PopUpShareBg} p={small ? "xs" : "md"}>

                                     
                                </Box>
                            </Tabs.Panel> */}

              <Tabs.Panel value="to_share" pt="xs">
                <DealsToShare
                  t={t}
                  onChange={(val) => {
                    setToShareContain(val);
                  }}
                  channel_group_id={sharingChannel?.channel_group_id}
                  idHx={shareableIdex}
                  shareCompleted={shareCompleted}
                  onShare={(open) => {
                    goShare(sharingChannel, open);
                  }}
                  copied={clipboard.copied}
                  onNew={newShare}
                  channel_data={sharingChannel?.channel_data}
                />
                {/* <Box className={classesG.PopUpShareBg} p={small ? "xs" : "md"}>
                                    <ScrollArea.Autosize mah="60vh" mx="auto">
                                        <AppDiv contRef={null} html={contentToCopy} />
                                    </ScrollArea.Autosize>
                                </Box> */}
              </Tabs.Panel>
              <Tabs.Panel value={SHARES_TYPE.SHARE_BY_DEFAULT} pt="xs">
                <Box
                  pos="relative"
                  className={classesG.PopUpShareBg}
                  p={small ? "xs" : "md"}
                >
                  {isLoadingDefault && (
                    <LoadingOverlay
                      visible={isLoadingDefault}
                      overlayProps={{ radius: "sm", blur: 2 }}
                    />
                  )}
                  <Box maw={500}>
                    {!(dataDefault && dataDefault.id > 0) && (
                      <Text fz="lg">
                        {t("default_not_exists", "Default channel not exist!")}
                      </Text>
                    )}
                    {dataDefault && dataDefault.id > 0 && (
                      <ShareChannelComp
                        onShareClicked={(
                          dataDefault,
                          editbefore_sharing,
                          openUrl_
                        ) => {
                          setSharingChannel(dataDefault);
                          share(dataDefault, editbefore_sharing, openUrl_);
                        }}
                        channel={dataDefault}
                        t={t}
                        classesG={classesG}
                        setDonotClose={setDonotClose}
                        alwaysIn={true}
                      />
                    )}
                    <Alert
                      mt="lg"
                      icon={<IconAlertCircle size="1.2rem" />}
                      title={t("alert", "Alert")}
                      color="red"
                    >
                      <Box fz="md">
                        {t(
                          "public_access_for_msg",
                          "For better board analysis it is recommanded to use"
                        )}
                        <span
                          className={classesG.titleHref}
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setActiveTab(SHARES_TYPE.SHARE_BY_CHANNEL);
                          }}
                        >
                          {t("sahre_by_channel", " Share by channel!")}
                        </span>
                      </Box>
                    </Alert>
                    <Alert
                      mt="lg"
                      icon={<IconBulb size="1.2rem" />}
                      title={t("new_channle", "New channel")}
                      color="green"
                    >
                      <Box fz="md">
                        {t(
                          "you_may_consoder_adding_a",
                          "You may also consider adding a"
                        )}
                        <span
                          className={classesG.titleHref}
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setActiveTab("new_channel");
                          }}
                        >
                          {t("new_channel", " new channel.")}
                        </span>
                      </Box>
                    </Alert>
                  </Box>
                </Box>
              </Tabs.Panel>
              <Tabs.Panel value={SHARES_TYPE.SHARE_BY_CHANNEL} pt="xs">
                <Box
                  pos="relative"
                  className={classesG.PopUpShareBg}
                  p={small ? "xs" : "md"}
                >
                  {isLoading && (
                    <LoadingOverlay
                      visible={isLoading}
                      overlayProps={{ radius: "sm", blur: 2 }}
                    />
                  )}

                  <Box>
                    <ChannelSearch grid={grid_name} hideGridView={true} />
                  </Box>
                  {!data ||
                    (data.length <= 0 && (
                      <Box mb="xl">
                        <NoDataFound
                          title={t("no_channel_found", "No Channels Found!.")}
                        />
                      </Box>
                    ))}

                  {!(!data || data.length <= 0) && (
                    <>
                      <ScrollArea.Autosize mah="60vh" mx="auto">
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
                                <ShareChannelComp
                                  onShareClicked={(
                                    channel,
                                    editbefore_sharing,
                                    openUrl_
                                  ) => {
                                    setSharingChannel(channel);
                                    share(
                                      channel,
                                      editbefore_sharing,
                                      openUrl_
                                    );
                                  }}
                                  channel={element}
                                  t={t}
                                  classesG={classesG}
                                  setDonotClose={setDonotClose}
                                  alwaysIn={false}
                                />
                              );
                            })}
                          </SimpleGrid>
                        )}
                      </ScrollArea.Autosize>
                      <Pages data={data} small={small} />
                    </>
                  )}
                </Box>
              </Tabs.Panel>
              <Tabs.Panel
                value="new_channel"
                pt="xs"
                onClick={() => {
                  setNewChannel(true);
                }}
              >
                <Box
                  pos="relative"
                  className={classesG.PopUpShareBg}
                  p={small ? "xs" : "md"}
                >
                  {isLoading && (
                    <LoadingOverlay
                      visible={isLoading}
                      overlayProps={{ radius: "sm", blur: 2 }}
                    />
                  )}

                  <ScrollArea.Autosize mah="80vh">
                    {newChannel && (
                      <AddEditChannelMain
                        fromPopup={true}
                        onSaved={(msg) => {
                          setNewChannel(false);
                        }}
                      />
                    )}

                    {!newChannel && (
                      <Button
                        fullWidth
                        onClick={() => {
                          setNewChannel(true);
                        }}
                      >
                        {t("new", "New Channel")}
                      </Button>
                    )}
                  </ScrollArea.Autosize>
                </Box>
              </Tabs.Panel>
            </Tabs>
          </Box>
        </Box>
      </Center>
    </>
  );
};

const ShareChannelComp = ({
  channel,
  onShareClicked: onShareClickedComp,
  classesG,
  t,
  setDonotClose,
  alwaysIn,
}) => {
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const [mouseIn, setMouseIn] = useState(alwaysIn);
  // const [menuOpened, setMenuOpened] = useState(false)
  const onShareClicked = (editbefore_sharing, openUrl) => {
    if (onShareClickedComp)
      onShareClickedComp(channel, editbefore_sharing, openUrl);
    // setMenuOpened(false)
    setDonotClose(false);
    setMouseIn(alwaysIn);
  };
  return (
    <CardIn
      shadow="sm"
      radius="md"
      withBorder
      key={channel.id}
      classesG={classesG}
      OnInOut={(inoutval) => {
        if (!alwaysIn) setMouseIn(inoutval);
        // if (!inoutval)
        //     setMenuOpened(false)
      }}
      style={{ cursor: "pointer", paddingBottom: "5px" }}
      // onClick={() => {
      //     setSharingChannel(channel)
      // }}
    >
      <Stack gap={"0.8rem"} justify="space-between">
        <Group gap={2}>
          <IconBrands
            brand={channel.channel_group_id}
            size={small ? 18 : medium ? 20 : 22}
          />
          <Text
            lineClamp={1}
            td={channel.inactive == "X" ? "line-through" : ""}
          >
            {channel.channel_name}
          </Text>
        </Group>
        <Group justify="space-between">
          <Text fz={"xs"} opacity={mouseIn ? 0.9 : 0.5}>
            {t("shared", "Shared")}{" "}
            {D.utc_to_distance(
              channel.last_share_created_on,
              t("never", "Never")
            )}
          </Text>
          <Group
            justify="right"
            gap={5}
            opacity={mouseIn ? 0.9 : small || medium ? 0.1 : 0}
          >
            <Button
              variant="outline"
              color="primary"
              w={50}
              size="sm"
              p={5}
              title={t(
                "edit_before_sharing",
                "Edit your deals list before sharing!"
              )}
              onClick={() => onShareClicked(true, false)}
            >
              <IconPencilShare stroke={1.5} size="1rem" />
            </Button>
            <Button
              variant="light"
              size="sm"
              p={5}
              w={50}
              title={t("share_the_deals_list", "Share the deals list!")}
              onClick={() => onShareClicked(false, false)}
            >
              <IconShare stroke={1.5} size="1rem" />
            </Button>
            <Button
              disabled={disableSahreNOpen(
                channel.channel_group_id,
                channel.channel_data
              )}
              variant="filled"
              color="primary"
              size="sm"
              p={5}
              w={50}
              title={t(
                "share_the_deals_list_n_open_url",
                "Share the deals list and open the external URL!"
              )}
              onClick={() => onShareClicked(false, true)}
            >
              <Group justify="space-between" gap={2}>
                <Box>
                  <IconShare stroke={1.5} size="1rem" />
                </Box>
                <Box>
                  <IconExternalLink stroke={1.5} size="1rem" />
                </Box>
              </Group>
            </Button>
          </Group>
        </Group>
      </Stack>
    </CardIn>
  );
};
