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
  IconAdjustmentsOff,
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

import { Table, Checkbox, ScrollArea, Avatar } from "@mantine/core";
import {
  selectLarge,
  selectMedium,
  selectSmall,
  selectxLarge,
  selectxLarger,
} from "../../../store/features/ScreenStatus";
import { BUILD_API, G, useMessage } from "../../../global/G";
import { useAxiosGet } from "../../../hooks/Https";
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
import { PopShareStatInfo } from "../../../global/PopUpDialogs";
import { ChannelGroups } from "../../../global/global-comp/ChannelGroups";
import { ActiveSelect } from "../../../global/global-comp/ActiveSelect";
import { Cell } from "../../../global/Cell";
import { CardIn } from "../../../global/CardIn";
import { ClearButton } from "../../../global/ClearButton";

export const Companies = () => {
  const grid_name = "COMPANIES";
  const os = useOs();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchCompanies, setSearchCompanies] = useState<any>();
  const [searchAction, setSearchAction] = useState<any>("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { error, succeed } = useMessage();
  const { t } = useTranslation("private", { keyPrefix: "companies" });
  const layout = () => {
    if (searchCompanies && searchCompanies["listdir"])
      return searchCompanies["listdir"];
    return GridLayOut(grid_name, "", "GET", "grid_view");
  };
  const [listDir, setListDir] = useState<string>(() => {
    return layout();
  });
  const { data, getError, errorMessage, succeeded, isLoading, executeGet } =
    useAxiosGet(BUILD_API("companies"), searchCompanies);
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const large = useSelector(selectLarge);
  const xlarge = useSelector(selectxLarge);
  const xlarger = useSelector(selectxLarger);
  const { classes: classesG } = useGlobalStyl();

  useEffect(() => {
    dispatch(changeActive("companies"));
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

      <AppHeader
        title={t("channel_title_company_directory", "Company Directory")}
      >
        {/* <Group mt="xs" justify="right" gap="xs" >
                    <Button variant="default" onClick={(val) => {
                        refresh()
                    }}>
                        <IconRefresh />
                    </Button>

                </Group> */}
        {/* <Group mt="xs" justify="right" gap="xs" >
                    <Button size="sm" variant="light" type="button" color="red.9" onClick={() => {
                        setSearchAction(() => {
                            return 'CLEAR' + (new Date()).getTime().toString()
                        })
                    }}>
                        <Group justify="space-between">
                            <IconAdjustmentsOff style={{ transform: 'rotate(90deg)' }} />
                            {!small && <>{t('clear_filters', 'Clear Filters')}</>}
                        </Group>let hex = G.ifNull(searchParams.get("hex"), "");
                    </Button>
                </Group> */}
        {/* <Group mt="xs" justify="right" gap="xs" >
                    <ClearButton t={t} small={small} onClear={() => {
                        setSearchAction(() => {
                            return 'CLEAR' + (new Date()).getTime().toString()
                        })
                    }} />
                </Group> */}
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
              <CompaniesSearch action={searchAction} grid={grid_name} />
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
                          <Group justify="space-between" mb="sm">
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
                                    `../trades/l/c?src=company&co_id=${element.id}`
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
                                    <IconAlertTriangle />{" "}
                                  </Box>
                                </Group>
                              </Box>
                              <Text mt={-5} lineClamp={1}>
                                {element.first_name}, {element.last_name}
                              </Text>
                            </Stack>

                            {/* <Box>
                                                    <Group justify="space-between" gap={1}>

                                                        <Box>

                                                        </Box>
                                                    </Group>
                                                </Box> */}
                          </Group>

                          <Group justify="space-between" mb="md">
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
                                {t("deals", "Deals")}
                              </Text>
                              <Text
                                ta="right"
                                fw={600}
                                fz={small ? "sm" : "md"}
                                className={classesG.titleHref2}
                                onClick={() => {
                                  navigate(
                                    `../trades/t/c/?src=company&co_id=${element.id}`
                                  );
                                }}
                              >
                                {element.deal_count}
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
                          {/* <Group justify="space-between" mr={0}>
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
                {listDir != "grid_view" && <CompaniesList data={data} t={t} />}
                <Pages data={data} small={small} />
              </Box>
            )}
          </Box>
        </Stack>
      </Box>
    </>
  );
};

export const CompaniesSearch = ({ action, grid }) => {
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
      searchterm: G.ifNull(searchParams.get("searchterm"), ""),
      company_name: G.ifNull(searchParams.get("company_name"), ""),
      email: G.ifNull(searchParams.get("email"), ""),
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
        searchterm={t("company_search", "Company Or Company About")}
        grid={grid}
        action={action}
        listDirs={[
          // { id: 'full', name: t('full', 'Full List') },
          // { id: 'comp1', name: t('copressed', 'listDir') },
          // { id: 'comp2', name: t('copressed_more', 'listDir More') },
          { id: "grid_view", name: t("grid_view", "Grid View") },
          { id: "list_view", name: t("list_view", "List View") },
        ]}
        sortBy={[
          {
            id: "company_name",
            name: t("company_name", "Company Name"),
          },
          {
            id: "created_on",
            name: t("join_date", "Join Date"),
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
              label={t("company_name", "Company Name")}
              placeholder={t("company_name", "Company Name")}
              {...form.getInputProps("company_name")}
            />
          </Grid.Col>

          <Grid.Col>
            <TextInput
              autoComplete="off"
              label={t("email", "Email")}
              placeholder={t("email", "Email")}
              {...form.getInputProps("email")}
            />
          </Grid.Col>
        </Grid>
      </SearchPannel>
    </>
  );
};

const CompaniesList = ({ data, t }) => {
  const { error, succeed } = useMessage();
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const { classes: classesG } = useGlobalStyl();
  const navigate = useNavigate();
  const [selection, setSelection] = useState(["0"]);

  const rows = data?.map((item) => {
    const selected = selection.includes(item.id);
    return (
      <Table.Tr
        key={item.id}
        className={
          // {cx({ [classesG.rowSelected]: selected })}
          selected ? classesG.rowSelected : ""
        }
      >
        <Table.Td>
          <Box
            className={classesG.titleHref2}
            onClick={() => {
              navigate(`../trades/t/c/?src=company&co_id=${item.id}`);
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
        </Table.Td>
        <Table.Td>
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
        </Table.Td>
        <Table.Td>
          <Text fw={600} fz="md">
            {item.country} {item.province_name != "" ? "," : ""}{" "}
            {item.province_name}
          </Text>
        </Table.Td>
        <Table.Td>
          <Text style={{ fontSize: "0.8rem", color: "gray" }}>
            {D.utc_to_local(item.created_on)}
          </Text>
        </Table.Td>

        <Table.Td>
          <Text
            ta="right"
            fw={600}
            fz="md"
            className={classesG.titleHref2}
            onClick={() => {
              navigate(`../trades/t/c/?src=company&co_id=${item.id}`);
            }}
          >
            {item.deal_count}
          </Text>
        </Table.Td>

        <Table.Td>
          <Text lineClamp={1}>
            {item.first_name}, {item.last_name}
          </Text>
        </Table.Td>
        <Table.Td>
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
        </Table.Td>
        <Table.Td style={{ textAlign: "right" }}>
          <Cell
            fz="sm"
            cell={item.cell}
            verified={item.cell_verified}
            message=""
            show_op="COPY_OR_SEND"
            user=""
          />
        </Table.Td>
        <Table.Td></Table.Td>
      </Table.Tr>
    );
  });

  return (
    <ScrollArea mt="lg">
      <Table
        verticalSpacing="xs"
        highlightOnHover
        className={`${"TableCss"} ${"TableCss-Companies"}  ${classesG.table}`}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{t("company_name", "Company Name")}</Table.Th>
            <Table.Th></Table.Th>
            <Table.Th>{t("location", "Location")}</Table.Th>
            <Table.Th>{t("since", "Since")}</Table.Th>

            <Table.Th style={{ textAlign: "right" }}>
              {t("deals", "Deals")}
            </Table.Th>
            <Table.Th>{t("contact", "Contact")}</Table.Th>
            <Table.Th>{t("email", "Email")}</Table.Th>
            <Table.Th>{t("cell", "Cell")}</Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
  );
};
