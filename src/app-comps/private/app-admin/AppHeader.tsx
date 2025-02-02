import {
  Burger,
  Button,
  Group,
  Paper,
  useMantineTheme,
  Title,
  Box,
  Card,
  Affix,
  Transition,
  Drawer,
  Notification,
  ActionIcon,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import { useSelector, useDispatch } from "react-redux";
import { IconArrowLeft, IconMenu, IconMenu2, IconX } from "@tabler/icons-react";

import { useTranslation } from "react-i18next";
import {
  selectOpened,
  selectSmall,
  toggle,
  selectMedium,
  selectLarge,
  selectOpenedAi,
  toggleAi,
} from "../../../store/features/ScreenStatus";
import { useGlobalStyl } from "../../../hooks/useTheme";
import { AppNotifications } from "../../../hooks/useAppTheme";
import { notifications, Notifications } from "@mantine/notifications";
import { DemoDrawer } from "../../../global/testDemo";
import { useAppHeaderNdSide } from "../../../hooks/useAppHeaderNdSide";

export const AppHeader = (prop: any) => {
  let child = prop?.children;
  let title = prop?.title;
  let titleClicked = prop?.titleClicked;
  const { setHeaderComponent }: any = useAppHeaderNdSide();
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const large = useSelector(selectLarge);
  const Header = () => {
    return <>{child}</>;
  };
  const TitleC = () => {
    return (
      <>
        {title && title != "" && titleClicked && (
          <Button
            variant="default"
            leftSection={<IconArrowLeft />}
            onClick={titleClicked}
          >
            {title}
          </Button>
        )}
        {title && title != "" && !titleClicked && (
          <Title order={1}>{title}</Title>
        )}
      </>
    );
  };

  useEffect(() => {
    if (!setHeaderComponent) return;
    setHeaderComponent(() => {
      return {
        Header: Header,
        Title: TitleC,
        CoHeader:null
      };
    });
    return () => setHeaderComponent(null); // Cleanup on unmount
  }, [setHeaderComponent,small,medium,large,child]);
  return <></>;
};
export const AppCoHeader = (prop: any) => {
  let child = prop?.children;
  
  const { setHeaderComponent }: any = useAppHeaderNdSide();
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const large = useSelector(selectLarge);
  const CoHeader = () => {
    return <>{child}</>;
  };
  

  useEffect(() => {
    if (!setHeaderComponent) return;
    setHeaderComponent(() => {
      return {
        Header: null,
        Title: null,
        CoHeader:CoHeader
      };
    });
    return () => setHeaderComponent(null); // Cleanup on unmount
  }, [setHeaderComponent,small,medium,large,child]);
  return <></>;
};
export const AppHeader0 = (prop: any) => {
  const { t } = useTranslation("common", { keyPrefix: "tool" });
  const { classes: classesG } = useGlobalStyl();
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const large = useSelector(selectLarge);
  const theme = useMantineTheme();

  const [navClasses, setNavClasses] = useState(() => {
    if (small) return "app-top-nav-small";
    else if (medium) return "app-top-nav-medium";
    else return "app-top-nav";
  });

  const { width } = useViewportSize();

  useEffect(() => {
    // if (width<=10)
    //     return
    if (small) setNavClasses("app-top-nav-small");
    else if (medium) setNavClasses("app-top-nav-medium");
    else setNavClasses("app-top-nav");
  }, [small, medium, large]);
  // useEffect(() => {
  //     dispatch(update_small(width <= smallScreeen))
  //     dispatch(update_medium(width > smallScreeen && width <= mediumScreeen))
  //     dispatch(update_large(width > mediumScreeen))
  //     if (width <= smallScreeen)
  //         setNavClasses('app-top-nav-small')
  //     else
  //         if (width <= mediumScreeen)
  //             setNavClasses('app-top-nav-medium')
  //         else
  //             setNavClasses('app-top-nav')

  // }, [width])

  const opened = useSelector(selectOpened);
  const dispatch = useDispatch();

  return (
    <>
      <Box className={`${navClasses} ${classesG.mainHeader} app-top-nav-any`}>
        <div className={classesG.navTopBorder}></div>
        <Group justify="space-between" align="start">
          {small && (
            <div
              style={{
                width: 50,
                float: "left",
                marginTop: small ? 10 : medium ? -7 : 0,
              }}
            >
              <Burger
                opened={opened}
                onClick={() => {
                  dispatch(toggle());
                }}
                size="md"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </div>
          )}
          {!small && prop.title != "" && (
            <Box style={{ float: "left" }}>
              {prop.titleClicked && (
                <Box
                  mt="xs"
                  onClick={() => {
                    if (prop.titleClicked) {
                      prop.titleClicked();
                    }
                  }}
                >
                  <Button variant="default" leftSection={<IconArrowLeft />}>
                    {prop.title}
                  </Button>
                </Box>
              )}
              {!prop.titleClicked && (
                <Box
                  mt="xs"
                  style={{ float: "left", marginTop: medium ? 10 : 15 }}
                >
                  <Title order={1}>{prop.title}</Title>
                </Box>
              )}
            </Box>
          )}
          <div style={{ alignItems: "center" }}>{prop.children}</div>
        </Group>
      </Box>
      {small && prop.title != "" && (
        <Paper
          shadow="xs"
          radius="xs"
          p="md"
          style={{
            marginTop: "0px",
            marginBottom: "25px",
            marginLeft: 0,
            marginRight: 0,
          }}
          className={classesG.titleForSmall}
        >
          {prop.titleClicked && (
            <Box
              style={{ textAlign: "center" }}
              onClick={() => {
                if (prop.titleClicked) {
                  prop.titleClicked();
                }
              }}
            >
              <Button variant="default" leftSection={<IconArrowLeft />}>
                {prop.title}
              </Button>
            </Box>
          )}
          {!prop.titleClicked && (
            <Box>
              <Title order={1}>{prop.title}</Title>
            </Box>
          )}
        </Paper>
      )}

      {/* {<Affix zIndex={50000000} justify={{ bottom: 20, right: 20 }}>
                <Transition transition="slide-up" mounted={true}>
                    {(transitionStyles) => (
                        <Paper className={classesG.clearmessages}>
                            <Button leftIcon={<IconX />} variant="outline" color="red" onClick={() => {
                                notifications.clean()
                                notifications.cleanQueue()
                                console.log("d")
                                console.log(Notifications)
                                
                            }}>
                                {t('messages', 'Messages')}
                              
                            </Button>
                        </Paper>

                    )}
                </Transition>
            </Affix>
            } */}
    </>
  );
};
export const AppHeaderAI = (prop) => {
  const { t } = useTranslation("common", { keyPrefix: "tool" });
  const { classes: classesG } = useGlobalStyl();
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const large = useSelector(selectLarge);
  const theme = useMantineTheme();
  const [mouseIn, setMouseIn] = useState(false);
  const [navClasses, setNavClasses] = useState(() => {
    if (small) return "app-top-nav-small";
    else if (medium) return "app-top-nav-medium";
    else return "app-top-nav";
  });

  const { width } = useViewportSize();

  useEffect(() => {
    if (small) setNavClasses("app-top-nav-small");
    else if (medium) setNavClasses("app-top-nav-medium");
    else setNavClasses("app-top-nav");
    if (small) {
    }
  }, [small, medium, large]);

  const opened = useSelector(selectOpened);
  const dispatch = useDispatch();

  const [drawerOpened] = useDisclosure(false);
  const enabled = mouseIn || (opened && (small || medium || large));
  useEffect(() => {
    setMouseIn(false);
  }, [drawerOpened]);
  return (
    <>
      <Box
        className={`${navClasses} ${
          enabled ? classesG.mainHeader : ""
        } app-top-nav-any`}
        onMouseEnter={() => {
          if (!drawerOpened) setMouseIn(true);
        }}
        onMouseLeave={() => {
          setMouseIn(false);
        }}
      >
        {mouseIn && <div className={classesG.navTopBorder}></div>}
        <Group justify="space-between" align="start">
          {small && (
            <div
              style={{
                width: 50,
                float: "left",
                marginTop: small ? 10 : medium ? -7 : 0,
              }}
            >
              <Burger
                opacity={enabled ? 1 : 0.4}
                opened={opened}
                onClick={() => {
                  dispatch(toggle());
                }}
                size="md"
                color={theme.colors.gray[6]}
                mr="xl"
              />
              {/* <ActionIcon variant="filled" onClick={
                            () => {
                                dispatch(toggle());
                            }
                        }>
                            <IconMenu2 size="1.5rem" />
                        </ActionIcon> */}
              {/* <Button variant="filled" color="indigo" size="xs" opacity={enabled ? 1 : 0.05} onClick={
                            () => {
                                dispatch(toggle());
                            }
                        } >
                            <IconMenu2 size="1.5rem" />
                        </Button> */}
            </div>
          )}
          {!small && (
            <Box style={{ float: "left" }}>
              {prop.titleClicked && (
                <Box
                  mt="xs"
                  onClick={() => {
                    if (prop.titleClicked) {
                      prop.titleClicked();
                    }
                  }}
                >
                  <Button variant="default" leftSection={<IconArrowLeft />}>
                    {prop.title}
                  </Button>
                </Box>
              )}
              {!prop.titleClicked && (
                <Box
                  mt="xs"
                  style={{ float: "left", marginTop: medium ? 10 : 15 }}
                >
                  <Title order={1}>{prop.title}</Title>
                </Box>
              )}
            </Box>
          )}
          <div style={{ alignItems: "center" }}>
            <Group mt="xs" justify="right" gap="xs">
              {/* <SessionContents
                enabled={enabled}
                drawerOpened={drawerOpened}
                open={() => {
                  open();
                  setMouseIn(false);
                }}
                close={close}
                t={t}
              /> */}
            </Group>
            {/* {prop.children} */}
          </div>
        </Group>
      </Box>
    </>
  );
};

// export const useNavStatus = () => {
//     const dispatch = useDispatch();
//     let smallScreeen = screenBreaks.small
//     let mediumScreeen = screenBreaks.small

//     const { width } = useViewportSize();
//     useEffect(() => {
//         dispatch(update_small(width <= smallScreeen))
//         dispatch(update_medium(width > smallScreeen && width <= mediumScreeen))
//         dispatch(update_large(width > mediumScreeen))
//     }, [width])
// }

// const AppHeaderTitleForSmall = ({ title }) => {
//     const { classes } = useStylesSmall()
//     const small = useSelector(selectSmall);
//     return (
//         <>
//             {
//                 small && title != '' && <Paper shadow="xs" radius="xs" p="xs" style={{ fontSize: "1.5rem", marginTop: "10px" }} className={classes.wrapper}>
//                     <div style={{ textAlign: "center" }}> {title}
//                     </div>
//                 </Paper>
//             }
//         </>
//     )
// }
