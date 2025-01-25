import {
  ActionIcon,
  Box,
  Button,
  Drawer,
  Grid,
  Group,
  Menu,
  Paper,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import {
  IconAdjustmentsHorizontal,
  IconAdjustmentsOff,
  IconArrowsSort,
  IconGripVertical,
  IconList,
  IconListDetails,
  IconSearch,
  IconSortAscending,
  IconSortAscendingLetters,
  IconSortDescending,
  IconSortDescendingLetters,
  IconSquare,
  IconSquareCheck,
  IconX,
} from "@tabler/icons-react";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { createSearchParams, useNavigate, useSearchParams } from "react-router";

import { G } from "./G";
import { getHotkeyHandler, useDisclosure } from "@mantine/hooks";
import { useAuth } from "../providers/AuthProvider";
import { selectMedium, selectSmall } from "../store/features/ScreenStatus";
import { DemoDrawer } from "./testDemo";
import { GridLayOut } from "./Misc";
import { changeAdvSearchStatus } from "../store/features/AdvSearchStatus";
import { useGlobalStyl } from "../hooks/useTheme";
import { ClearButton, ClearButton1, ClearButton2 } from "./ClearButton";

export const SearchPannel = (props) => {
  // const actionA = props.action
  const [ignoreSearch, setIgnoreSearch] = useState("");
  const dispatch = useDispatch();
  const [isInited, setIsInited] = useState(false);
  const { islogged } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  // const [opened, setOpened] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [sortById, setSortById] = useState<any>(() => {
    return G.ifNull(searchParams.get("sortby"), "");
  });
  const [sortDir, setSortDir] = useState<any>(() => {
    return G.ifNull(searchParams.get("sortdir"), "");
  });

  const [listDir, setListDir] = useState<any>(() => {
    let defaultlistdir = "";
    defaultlistdir = GridLayOut(props.grid, "", "GET", "grid_view");
    if (defaultlistdir == "") defaultlistdir = "grid_view";
    return G.ifNull(searchParams.get("listdir"), defaultlistdir);
  });
  const [searchterm, setSearchTerm] = useState<any>(() => {
    return G.ifNull(searchParams.get("searchterm"), "");
  });

  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const { t } = useTranslation("common", { keyPrefix: "tool" });
  const { sortBy, listDirs } = props;
  const { classes: classesG } = useGlobalStyl();
  useEffect(() => {
    if (!isInited) {
      setIsInited(true);
      return;
    }
    search_go();
  }, [sortById, sortDir, listDir]);
  const search_go = () => {
    if (ignoreSearch != "") {
      setIgnoreSearch("");
      return;
    }
    let codet = searchParams.get("codet");
    searchParams.set("t", new Date().getTime().toString());
    searchParams.set("src", "sort");
    searchParams.set("sortby", sortById);
    searchParams.set("sortdir", sortDir);
    searchParams.set("listdir", listDir);

    setSearchParams(searchParams);
    navigate({
      search: searchParams.toString(),
    });
  };
  const search_term_go = (trms, force) => {
    let trm = G.ifNull(searchParams.get("searchterm"), "");

    if (trm == searchterm && !force) return;

    if (props.onSearchTerm) props.onSearchTerm();
    let params: any = [];

    params.splice(0, 0, ["t", new Date().getTime().toString()]);
    params.splice(0, 0, ["src", "search"]);
    params.splice(0, 0, ["searchterm", trms]);

    params.splice(0, 0, ["sortby", sortById]);
    params.splice(0, 0, ["sortdir", sortDir]);
    params.splice(0, 0, ["listdir", listDir]);

    navigate({
      search: createSearchParams(params).toString(),
    });
  };
  const search_term_go2 = () => {
    search_term_go(searchterm, false);
  };
  const clear = () => {
    if (props.onBeforeClear) props.onBeforeClear();
    updateDefaultListDir();
    setSortById("");

    setSearchTerm("");
    if (props.onClear) props.onClear();
  };
  useEffect(() => {
    let { action } = props;
    if (!action || action == "") return;
    if (action.toUpperCase().indexOf("CLEAR") >= 0) {
      clear();
    }
    if (action.toUpperCase().indexOf("UPDATELISTDIR") >= 0) {
      setIgnoreSearch(action);
    }
  }, [props.action]);
  useEffect(() => {
    if (ignoreSearch == "") return;
    if (ignoreSearch.toUpperCase().indexOf("UPDATELISTDIR") >= 0) {
      updateDefaultListDir();
    }
  }, [ignoreSearch]);
  const updateDefaultListDir = () => {
    let defaultlistdir = "";
    defaultlistdir = GridLayOut(props.grid, "", "GET", "grid_view");
    if (defaultlistdir == "") defaultlistdir = "grid_view";
    setListDir(defaultlistdir);
  };
  useEffect(() => {
    dispatch(changeAdvSearchStatus(opened));
  }, [opened]);
  useEffect(() => {
    if (props && props.forceClose != "") close();
  }, [props?.forceClose]);
  return (
    <>
      {/* <Box className="flex-stretch-parent">
                <Box className="flex-stretch-child1" ml="xs">
                    <Group gap={0} justify="right">
                        {props.leftSectionMenu}
                        <ClearButton1 small={small} t={t} onClear={() => {
                            if (props.onClear1)
                                props.onClear1()
                            else
                                clear()
                        }} />
                        {listDirs && listDirs.length > 0 &&
                            <>
                                <Menu justify="bottom-end" offset={0}>
                                    <Menu.Target>
                                        <Button color="dark.3" variant="default" m={0} radius={0}>
                                            <IconList size={20} />
                                        </Button>
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        <Menu.Label>{t('layout', 'Layout')}</Menu.Label>
                                        {
                                            listDirs.map(
                                                (itm) => {
                                                    return (
                                                        <div key={itm.id}>
                                                            <Menu.Item
                                                                className={listDir == itm.id ? classesG.selectedSort : ''}
                                                                onClick={() => {
                                                                    setListDir(() => {
                                                                        GridLayOut(props.grid, itm.id, 'SAVE', '')
                                                                        return itm.id
                                                                    })
                                                                    if (props.onSearcgNgo)
                                                                        props.onSearcgNgo()
                                                                    if (props.onList)
                                                                        props.onList(itm.id)
                                                                }}>{itm.name}</Menu.Item>
                                                        </div>)
                                                })}
                                    </Menu.Dropdown>
                                </Menu>
                            </>
                        }
                        {sortBy && sortBy.length > 0 &&
                            <Menu justify="bottom-end" offset={0}>
                                <Menu.Target>
                                    <Button color="dark.3" variant="default" m={0} radius={0} mr={-1}>
                                        <IconArrowsSort size={20} />
                                    </Button>
                                </Menu.Target>
                                <Menu.Dropdown>
                                    <Menu.Label>{t('sort_by', 'Sort By')}</Menu.Label>
                                    {

                                        sortBy.map(
                                            (itm) => {
                                                return (
                                                    <div key={itm.id}>
                                                        <Menu.Item >
                                                            <Grid gutter={0} style={{ width: "300px" }}>
                                                                <Grid.Col xs={8} sm={8} md={8} style={{ margin: "auto" }} >
                                                                    <Text>{itm.name}</Text>
                                                                </Grid.Col>
                                                                <Grid.Col xs={2} sm={2} md={2} style={{ margin: "auto" }} >
                                                                    <ActionIcon className={sortById == itm.id && sortDir == 'asc' ? classesG.selectedSort : ''} onClick={
                                                                        () => {
                                                                            setSortById(itm.id)
                                                                            setSortDir('asc')

                                                                            if (props.onSearcgNgo)
                                                                                props.onSearcgNgo()

                                                                            if (props.onSort)
                                                                                props.onSort(itm.id, 'asc')
                                                                        }
                                                                    }>
                                                                        <IconSortAscending size={22} />
                                                                    </ActionIcon>
                                                                </Grid.Col>
                                                                <Grid.Col xs={2} sm={2} md={2} style={{ margin: "auto" }} >
                                                                    <ActionIcon className={sortById == itm.id && sortDir == 'desc' ? classesG.selectedSort : ''}>
                                                                        <IconSortDescending size={22} onClick={
                                                                            () => {
                                                                                setSortById(itm.id)
                                                                                setSortDir('desc')
                                                                                if (props.onSearcgNgo)
                                                                                    props.onSearcgNgo()
                                                                                if (props.onSort)
                                                                                    props.onSort(itm.id, 'desc')
                                                                            }
                                                                        } />
                                                                    </ActionIcon>
                                                                </Grid.Col>
                                                            </Grid>
                                                        </Menu.Item>
                                                    </div>
                                                )
                                            }
                                        )
                                    }
                                </Menu.Dropdown>
                            </Menu>

                        }
                        <Button color="dark.4" variant="default" m={0} radius={0} onClick={open}>
                            <IconAdjustmentsHorizontal size={20} />
                        </Button>
                    </Group>
                </Box>
                <Box className="flex-stretch-child2" w="100%">
                    <TextInput
                        onKeyDown={getHotkeyHandler([
                            ['Enter', search_term_go2]
                        ])}
                        value={searchterm} onChange={(event) => setSearchTerm(event.currentTarget.value)}
                        placeholder={props.searchterm && props.searchterm != '' ? props.searchterm : t('searchterm', "Search")}
                        onBlur={
                            (e) => {
                                search_term_go(e.currentTarget.value, false)
                            }}
                        rightSection={
                            <ActionIcon onClick={() => {
                                search_term_go(searchterm, true)
                            }}>
                                {<IconSearch size={22} />}
                            </ActionIcon>
                        }
                    />
                </Box>
            </Box> */}
      <Box style={{ display: small ? "block" : "flex", alignItems: "stretch" }}>
        <Box style={{ flex: 1 }} mb={small ? "xs" : "0px"}>
          <TextInput
            onKeyDown={getHotkeyHandler([["Enter", search_term_go2]])}
            value={searchterm}
            onChange={(event) => setSearchTerm(event.currentTarget.value)}
            placeholder={
              props.searchterm && props.searchterm != ""
                ? props.searchterm
                : t("searchterm", "Search")
            }
            onBlur={(e) => {
              search_term_go(e.currentTarget.value, false);
            }}
            rightSection={
              <ActionIcon
                onClick={() => {
                  search_term_go(searchterm, true);
                }}
              >
                {<IconSearch size={22} />}
              </ActionIcon>
            }
          />
        </Box>
        <Box ml="xs">
          <Group gap={0} justify="right">
            {props.leftSectionMenu}
            <ClearButton1
              small={small}
              t={t}
              onClear={() => {
                if (props.onClear1) props.onClear1();
                else clear();
              }}
            />
            {listDirs && listDirs.length > 0 && (
              <>
                <Menu position="bottom-end" offset={0}>
                  <Menu.Target>
                    <Button color="dark.3" variant="default" m={0} radius={0}>
                      <IconList size={20} />
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>{t("layout", "Layout")}</Menu.Label>
                    {listDirs.map((itm) => {
                      return (
                        <div key={itm.id}>
                          <Menu.Item
                            className={
                              listDir == itm.id ? classesG.selectedSort : ""
                            }
                            onClick={() => {
                              setListDir(() => {
                                GridLayOut(props.grid, itm.id, "SAVE", "");
                                return itm.id;
                              });
                              if (props.onSearcgNgo) props.onSearcgNgo();
                              if (props.onList) props.onList(itm.id);
                            }}
                          >
                            {itm.name}
                          </Menu.Item>
                        </div>
                      );
                    })}
                  </Menu.Dropdown>
                </Menu>
              </>
            )}
            {sortBy && sortBy.length > 0 && (
              <Menu position="bottom-end" offset={0}>
                <Menu.Target>
                  <Button
                    color="dark.3"
                    variant="default"
                    m={0}
                    radius={0}
                    mr={-1}
                  >
                    <IconArrowsSort size={20} />
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>{t("sort_by", "Sort By")}</Menu.Label>
                  {sortBy.map((itm) => {
                    return (
                      <div key={itm.id}>
                        <Menu.Item>
                          <Grid gutter={0} style={{ width: "300px" }}>
                            <Grid.Col
                              span={{ base: 8 }}
                              style={{ margin: "auto" }}
                            >
                              <Text>{itm.name}</Text>
                            </Grid.Col>
                            <Grid.Col
                              span={{ base: 2 }}
                              style={{ margin: "auto" }}
                            >
                              <ActionIcon
                                variant="light"
                                color={
                                  sortById == itm.id && sortDir == "asc"
                                    ? "orange"
                                    : ""
                                }
                                // className={
                                //   sortById == itm.id && sortDir == "asc"
                                //     ? classesG.selectedSort
                                //     : ""
                                // }
                                onClick={() => {
                                  setSortById(itm.id);
                                  setSortDir("asc");

                                  if (props.onSearcgNgo) props.onSearcgNgo();

                                  if (props.onSort) props.onSort(itm.id, "asc");
                                }}
                              >
                                <IconSortAscending size={22} />
                              </ActionIcon>
                            </Grid.Col>
                            <Grid.Col
                              span={{ base: 2 }}
                              style={{ margin: "auto" }}
                            >
                              <ActionIcon
                                variant="light"
                                color={
                                  sortById == itm.id && sortDir == "desc"
                                    ? "orange"
                                    : ""
                                }
                                // className={
                                //   sortById == itm.id && sortDir == "desc"
                                //     ? classesG.selectedSort
                                //     : ""
                                // }
                              >
                                <IconSortDescending
                                  size={22}
                                  onClick={() => {
                                    setSortById(itm.id);
                                    setSortDir("desc");
                                    if (props.onSearcgNgo) props.onSearcgNgo();
                                    if (props.onSort)
                                      props.onSort(itm.id, "desc");
                                  }}
                                />
                              </ActionIcon>
                            </Grid.Col>
                          </Grid>
                        </Menu.Item>
                      </div>
                    );
                  })}
                </Menu.Dropdown>
              </Menu>
            )}
            <Button
              color="dark.4"
              variant="default"
              m={0}
              radius={0}
              onClick={open}
            >
              <IconAdjustmentsHorizontal size={20} />
            </Button>
          </Group>
        </Box>
      </Box>
      <Drawer
        zIndex={500}
        opened={opened}
        onClose={() => {
          if (props.state_changed) props.state_changed(false);
          close();
        }}
        position="right"
        withCloseButton={false}
      >
        <Group justify="space-between" m="md" mb="xl" mt="md">
          <ActionIcon onClick={close} variant="subtle">
            {<IconX size={30} color="red" />}
          </ActionIcon>
          {/* <Button mr="md" size="sm" variant="outline" leftIcon={<IconAdjustmentsOff style={{ transform: 'rotate(90deg)' }} />} type="button" onClick={() => {
                        clear()
                        close()
                    }}>
                        {t('clear_filters', 'Clear Filters')}
                    </Button> */}
          <ClearButton2
            small={small}
            t={t}
            onClear={() => {
              clear();
              close();
            }}
          />
        </Group>
        <Box m="md">
          {props.children}
          <Group justify="right" mt="lg">
            <Button
              type="button"
              variant="default"
              style={{ width: 100 }}
              onClick={() => {
                close();
              }}
            >
              {t("cancel", "Cancel")}
            </Button>
            <Button
              type="button"
              style={{ width: 100 }}
              onClick={() => {
                close();
                if (props.onApply) props.onApply();
              }}
            >
              {t("apply", "Apply")}
            </Button>
          </Group>
        </Box>
        {props.footer}
      </Drawer>
    </>
  );
};
