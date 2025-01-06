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
  CopyButton,
  Loader,
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
  IconBrandWhatsapp,
  IconAlertTriangleFilled,
  IconAlertTriangle,
  IconRotate2,
  IconArticleOff,
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
import { ChannelGroups } from "../../../global/global-comp/ChannelGroups";
import { ActiveSelect } from "../../../global/global-comp/ActiveSelect";
import { Cell } from "../../../global/Cell";
import { CardIn } from "../../../global/CardIn";
import { YesNoBoth } from "../../../global/global-comp/YesNoBoth";

export const CoAdminCompanies = () => {
  const grid_name = "COADMINCOMPANIES";
  const os = useOs();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchCompanies, setSearchCompanies] = useState<any>();
  const [email, setEmail] = useState("");
  const [sendVerification, setSendVerification] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { error, succeed } = useMessage();
  const { t } = useTranslation("private", { keyPrefix: "co_admin" });
  const layout = () => {
    if (searchCompanies && searchCompanies["listdir"])
      return searchCompanies["listdir"];
    return GridLayOut(grid_name, "", "GET", "grid_view");
  };
  const [listDir, setListDir] = useState<string>(() => {
    return layout();
  });
  const { data, getError, errorMessage, succeeded, isLoading, executeGet } =
    useAxiosGet(BUILD_API("co-admin/companies"), searchCompanies);
  const {
    data: dataPost,
    postError: getErrorPost,
    errorMessage: errorMessagePost,
    succeeded: succeededPost,
    isLoading: isLoadingPost,
    executePost,
  } = useAxiosPost(BUILD_API("co-admin/resend-email-verification"), {
    email: email,
  });
  useEffect(() => {
    if (sendVerification == "" || email == "") return;
    executePost();
  }, [sendVerification]);
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const large = useSelector(selectLarge);
  const xlarge = useSelector(selectxLarge);
  const xlarger = useSelector(selectxLarger);
  const { classes: classesG } = useGlobalStyl();

  useEffect(() => {
    dispatch(changeActive("co-admin"));
  }, []);

  useEffect(() => {
    refresh();
  }, [searchParams]);

  const refresh = () => {
    fit_data_grid_view();
    setSearchCompanies(Object.fromEntries([...searchParams]));
    executeGet();
  };
  useEffect(() => {
    setListDir(() => {
      return layout();
    });
  }, [searchCompanies]);
  useEffect(() => {
    if (errorMessage) error(errorMessage);
  }, [succeeded, errorMessage]);
  const isPhone = () => {
    return os == "ios" || os == "android";
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
  // const data2 = [
  //     { value: 'react'},
  //     { value: 'ng'}
  // ];

  return (
    <>
      {isLoading && <Overlay opacity={1} color="#000" zIndex={5} />}
      {isLoading && (
        <LoadingOverlay
          visible={isLoading}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
      )}

      <AppHeader title={t("channel_title_companies", "Companies")}>
        <Group mt="xs" justify="right" gap="xs">
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
              <CoAdminCompaniesSearch grid={grid_name} />
            </Box>
          </Group>
          <Box style={{ width: "100%" }}></Box>
          <Box>
            {!data ||
              (data.length <= 0 && (
                <NoDataFound
                  title={t("no_companies_found", "No Companies Found!.")}
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
                      l: 1,
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
                          key={element.id}
                          classesG={classesG}
                        >
                          <Group justify="apart" mb="sm">
                            <Stack gap={-5} miw="100%">
                              <Box
                                style={{
                                  overflow: "hidden",
                                  maxWidth: "calc(100% - 100px)",
                                }}
                                className={classesG.titleHref2}
                                onClick={() => {
                                  // navigate(`../company/${element.id}`)
                                  navigate(
                                    `../trades?src=company&co_id=${element.id}`
                                  );
                                }}
                              >
                                <Group justify="left" gap={5}>
                                  {/* <Text>{element.company_name}</Text> */}
                                  <Text>{element?.company_name}</Text>
                                  <Box
                                    className={classesG.reportCoIcon}
                                    onClick={(e) => {
                                      navigate(
                                        `../concern?co_id=` +
                                          element?.id +
                                          `&co_name=` +
                                          element?.company_name
                                      );
                                      e.stopPropagation();
                                    }}
                                  >
                                    <IconAlertTriangle />
                                  </Box>
                                </Group>
                              </Box>
                              <Text mt={-5} lineClamp={1}>
                                {element.first_name}, {element.last_name}
                              </Text>
                            </Stack>

                            <Box
                              style={{ position: "absolute", right: 5, top: 5 }}
                            >
                              <CoCompaniesMenu
                                item={element}
                                t={t}
                                navigate={navigate}
                                classesG={classesG}
                                setEmail={setEmail}
                                setSendVerification={setSendVerification}
                              />
                            </Box>
                          </Group>

                          <Group justify="apart" mb="md">
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
                                  {t("location", "Location")}
                                </Text>
                                <Text fw={600} fz={small ? "sm" : "md"}>
                                  {element.country}{" "}
                                  {element.province_name != "" ? "," : ""}{" "}
                                  {element.province_name}
                                </Text>
                              </Stack>
                            </Stack>
                            <Stack gap={2}>
                              <Text fw="bold" fz="sm" style={{ opacity: 0.7 }}>
                                {" "}
                                {t("since", "Since")}
                              </Text>
                              <Text fw={600} fz={small ? "sm" : "md"}>
                                {" "}
                                {D.utc_to_local(element.created_on)}
                              </Text>
                            </Stack>
                            <Stack gap={2}>
                              <Text fw="bold" fz="sm" style={{ opacity: 0.7 }}>
                                {t("posts", "Posts")}
                              </Text>
                              <Text
                                ta="right"
                                fw={600}
                                fz={small ? "sm" : "md"}
                                className={classesG.titleHref2}
                                onClick={() => {
                                  navigate(
                                    `../trades?src=company&co_id=${element.id}`
                                  );
                                }}
                              >
                                {element.post_count}
                              </Text>
                            </Stack>
                          </Group>
                          <Divider
                            size={1.5}
                            my={2}
                            label={
                              <Text fz={16} style={{ opacity: 0.7 }}>
                                {t("contact", "Contact")}
                              </Text>
                            }
                          />
                          <Grid>
                            <Grid.Col span={6}>
                              <Stack
                                fw="bold"
                                m={0}
                                p={0}
                                justify="flex-end"
                                gap={2}
                              >
                                <Text
                                  ta="left"
                                  fz="sm"
                                  style={{ opacity: 0.7 }}
                                >
                                  {t("email", "Email")}
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
                              </Stack>
                            </Grid.Col>
                            <Grid.Col span={1}>
                              <Divider
                                size={1.5}
                                orientation="vertical"
                                h="100%"
                              />
                            </Grid.Col>
                            <Grid.Col ta="right" span={5}>
                              <Stack
                                fw="bold"
                                m={0}
                                p={0}
                                align="flex-end"
                                justify="flex-end"
                                gap={2}
                                fz="sm"
                                w="100%"
                              >
                                <Text
                                  ta="right"
                                  fz="sm"
                                  style={{ opacity: 0.7 }}
                                >
                                  {t("cell_phone", "Cell Phone")}
                                </Text>
                                <Cell
                                  fz={small ? "sm" : "md"}
                                  cell={element.cell}
                                  verified={element.cell_verified}
                                  message=""
                                  show_op="COPY_OR_SEND"
                                  user=""
                                />
                              </Stack>
                            </Grid.Col>
                          </Grid>
                          <Divider
                            size={1.5}
                            my={2}
                            label={
                              <Text fz={16} style={{ opacity: 0.7 }}>
                                {t("info", "Info")}
                              </Text>
                            }
                          />
                          <Group justify="apart" mb="md">
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
                                  {t("active", "Active?")}
                                </Text>
                                <Text
                                  fw={600}
                                  fz={small ? "sm" : "md"}
                                  style={{ alignItems: "center" }}
                                >
                                  {G.format_dash(element.active)}
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
                                  {t("reported", "Reported?")}
                                </Text>
                                <Text
                                  fw={600}
                                  fz={small ? "sm" : "md"}
                                  style={{ alignItems: "center" }}
                                  c="red.4"
                                >
                                  {G.format_dash(element.reported)}
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
                                  {t("hidden", "Hidden?")}
                                </Text>
                                <Text
                                  fw={600}
                                  fz={small ? "sm" : "md"}
                                  style={{ alignItems: "center" }}
                                >
                                  {G.format_dash(element.hidden)}
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
                                  {t("public", "Public?")}
                                </Text>
                                <Text
                                  fw={600}
                                  fz={small ? "sm" : "md"}
                                  style={{ alignItems: "center" }}
                                >
                                  {G.format_dash(element.public_)}
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
                                  {t("concern", "Concerns")}
                                </Text>
                                <Text
                                  fw={600}
                                  fz={small ? "sm" : "md"}
                                  c="red.4"
                                  style={{ alignItems: "center" }}
                                >
                                  {element.concern_count}x
                                </Text>
                              </Stack>
                            </Stack>
                          </Group>

                          {/* <Group justify="apart" mr={0}>
                                                <Stack fw="bold" m={0} p={0} justify="flex-end" gap={2} fz="sm">
                                                    <Text ta="left" fz="sm" style={{ opacity: 0.7 }}>{t('email', 'Email')}</Text>

                                                    <CopyButton value={element.email}>
                                                        {({ copied, copy }) => (
                                                            <Text  onClick={() => {
                                                                copy();
                                                                succeed(t('email_copied', 'Email copied!.'))
                                                            }} 
                                                            c={copied ? 'indigo.7' : ''}
                                                            >
                                                                <span className={classesG.textToCopy}>
                                                                    {element.email}
                                                                </span>
                                                                
                                                            </Text>
                                                        )}
                                                    </CopyButton>
                                                </Stack>
                                                <Divider size={1.5} orientation="vertical" />
                                                <Stack fw="bold" m={0} p={0} justify="flex-end" gap={2} fz="sm">
                                                    <Text ta="right" fz="sm" style={{ opacity: 0.7 }}>{t('cell_phone', 'Cell Phone')}</Text>
                                                    <Cell fz="sm" cell={element.cell} verified={element.cell_verified} message="" show_op="COPY_OR_SEND" user="" />
                                                </Stack>
                                            </Group> */}

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
                    })}
                  </SimpleGrid>
                )}
                {listDir != "grid_view" && (
                  <CoAdminCompaniesList data={data} t={t} />
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

export const CoAdminCompaniesSearch = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation("private", { keyPrefix: "channels" });
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
      active: G.ifNull(searchParams.get("active"), ""),
      hidden: G.ifNull(searchParams.get("hidden"), ""),
      public: G.ifNull(searchParams.get("public"), ""),
      reported: G.ifNull(searchParams.get("reported"), ""),
      with_concern: G.ifNull(searchParams.get("with_concern"), ""),
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
        listDirs={[
          // { id: 'full', name: t('full', 'Full List') },
          // { id: 'comp1', name: t('copressed', 'listDir') },
          // { id: 'comp2', name: t('copressed_more', 'listDir More') },
          { id: "grid_view", name: t("grid_view", "Grid View") },
          { id: "list_view", name: t("list_view", "List View") },
        ]}
        sortBy={[
          {
            id: "channel_name",
            name: t("channel_name", "Name"),
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
            id: "created_on",
            name: t("channel_age", "Channel Age"),
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
            <ActiveSelect {...form.getInputProps("active")} />
          </Grid.Col>
          <Grid.Col>
            <YesNoBoth
              label={t("is_public", "Public?")}
              placeholder={t("is_public", "Public?")}
              {...form.getInputProps("public")}
            />
          </Grid.Col>
          <Grid.Col>
            <YesNoBoth
              label={t("is_hidden", "Hidden?")}
              placeholder={t("is_hidden", "Hidden?")}
              {...form.getInputProps("hidden")}
            />
          </Grid.Col>
          <Grid.Col>
            <YesNoBoth
              label={t("reported", "Reported?")}
              placeholder={t("reported", "Reported?")}
              {...form.getInputProps("reported")}
            />
          </Grid.Col>
          <Grid.Col>
            <YesNoBoth
              label={t("is_with_concern", "With Concern?")}
              placeholder={t("with_concern", "With Concern?")}
              {...form.getInputProps("with_concern")}
            />
          </Grid.Col>

          {/* <Grid.Col>
                        <Group justify="apart" grow>
                            <OwnershipClaimedSelect {...form.getInputProps('owner_')} />
                            <ClaimVisibilitySelect {...form.getInputProps('public_')} />
                        </Group>

                    </Grid.Col> 
                    <Grid.Col>
                        <Group justify="apart" grow>
                            
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

const CoAdminCompaniesList = ({ data, t }) => {
  const { error, succeed } = useMessage();
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const { classes: classesG } = useGlobalStyl();
  const navigate = useNavigate();
  const [selection, setSelection] = useState(["0"]);

  const rows = data?.map((item) => {
    const selected = selection.includes(item.id);
    return (
      <tr key={item.id} className={selected ? classesG.rowSelected : ""}>
        <td>
          <Box
            className={classesG.titleHref2}
            onClick={() => {
              navigate(`../trades?src=company&co_id=${item.id}`);
            }}
          >
            <Text
              style={{
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              {item.company_name}
            </Text>
          </Box>
        </td>
        <td>
          <Text fw={600} fz={small ? "sm" : "md"} style={{alignItems:"center"}}>
            {G.format_dash(item.active)}
          </Text>
        </td>
        <td>
          <Text fw={600} fz={small ? "sm" : "md"} style={{alignItems:"center"}} c="red.4">
            {G.format_dash(item.reported)}
          </Text>
        </td>
        <td>
          <Text fw={600} fz={small ? "sm" : "md"} style={{alignItems:"center"}}>
            {G.format_dash(item.hidden)}
          </Text>
        </td>
        <td>
          <Text fw={600} fz={small ? "sm" : "md"} style={{alignItems:"center"}}>
            {G.format_dash(item.public_)}
          </Text>
        </td>
        <td>
          <Text fw={600} fz={small ? "sm" : "md"} c="red.4" style={{alignItems:"center"}}>
            {item.concern_count}x
          </Text>
        </td>
        <td>
          <Box
            className={classesG.reportCoIcon}
            onClick={(e) => {
              navigate(
                `../concern?co_id=` +
                  item?.id +
                  `&co_name=` +
                  item?.company_name
              );
              e.stopPropagation();
            }}
          >
            <IconAlertTriangle />{" "}
          </Box>
        </td>
        <td>
          <Text fw={600} fz="md">
            {item.country} {item.province_name != "" ? "," : ""}{" "}
            {item.province_name}
          </Text>
        </td>
        <td>
          <Text style={{ fontSize: "0.8rem", color: "gray" }}>
            {D.utc_to_local(item.created_on)}
          </Text>
        </td>

        <td>
          <Text
            ta="right"
            fw={600}
            fz="md"
            className={classesG.titleHref2}
            onClick={() => {
              navigate(`../trades?src=company&co_id=${item.id}`);
            }}
          >
            {item.post_count}
          </Text>
        </td>

        <td>
          <Text lineClamp={1}>
            {item.first_name}, {item.last_name}
          </Text>
        </td>
        <td>
          <CopyButton value={item.email}>
            {({ copied, copy }) => (
              <Text
                span={true}
                className={classesG.textToCopy}
                onClick={() => {
                  copy();
                  succeed(t("email_copied", "Email copied!."));
                }}
                c={copied ? "indigo.7" : ""}
              >
                {item.email}
              </Text>
            )}
          </CopyButton>
        </td>
        <td style={{ textAlign: "right" }}>
          <Cell
            fz="sm"
            cell={item.cell}
            verified={item.cell_verified}
            message=""
            show_op="COPY_OR_SEND"
            user=""
          />
        </td>
        <td style={{ padding: "0px", width: "0px" }}></td>
      </tr>
    );
  });

  return (
    <ScrollArea mt="lg">
      <Table
        verticalSpacing="xs"
        highlightOnHover
        className={`${"TableCss"} ${"TableCss-Companies"}  ${classesG.table}`}
      >
        <thead>
          <tr>
            <th>{t("company_name", "Company Name")}</th>
            <th>{t("active", "Actv?")}</th>
            <th>{t("reported", "Rep?")}</th>
            <th>{t("hidden", "Hdn?")}</th>
            <th>{t("public", "Pblc?")}</th>
            <th>{t("concern", "Conc")}</th>

            <th></th>
            <th>{t("location", "Location")}</th>
            <th>{t("since", "Since")}</th>

            <th style={{ textAlign: "right" }}>{t("posts", "Posts")}</th>
            <th>{t("contact", "Contact")}</th>
            <th>{t("email", "Email")}</th>
            <th>{t("cell", "Cell")}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
};

const CoCompaniesMenu = ({
  item,
  navigate,
  t,
  classesG,
  setEmail,
  setSendVerification,
}) => {
  return (
    <Group justify="right" gap={1}>
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
              setEmail(item.email);
              setSendVerification(new Date().getTime().toString());
            }}
          >
            {t("resend_email_verification", "Resend Email Verification")}
          </Menu.Item>

          {/* {item.expired == 'X' && <Menu.Item c="teal.4" disabled={item.action == 'processing'} icon={
                        <IconRotate2 size={20} stroke={1.5} />
                    } onClick={() => {
                         
                    }}>
                        {t('renew_post', 'Renew Post')}</Menu.Item>
                    }

                    {item.expired == '' && <Menu.Item c="red.5" disabled={item.action == 'processing'} icon={<IconArticleOff size={20} stroke={1.5} />} onClick={() => {
                        
                    }}>
                        {t('terminate_post', 'Terminate Post')}</Menu.Item>
                    }
                    <Menu.Divider />
                    <Menu.Item icon={<IconFileAnalytics size={20} stroke={1.5} />} onClick={() => {


                    }}>
                        {t('post_stats', 'Post Stats')}</Menu.Item> */}
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
};
