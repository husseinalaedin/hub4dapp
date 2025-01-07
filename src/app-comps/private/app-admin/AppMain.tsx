import React, { useState, useEffect, useRef, createRef } from "react";
import {
  Text,
  AppShell,
  ScrollArea,
  Group,
  Alert,
  Box,
  Accordion,
  Burger,
  Flex,
  Center,
} from "@mantine/core";

import { IconX } from "@tabler/icons-react";
import {
  matchPath,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";
// import { useLocation } from 'react-router';

import { NavAcc } from "./NavAcc";
import { Nav } from "./Nav";

import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../providers/AuthProvider";
import { useAxiosPost } from "../../../hooks/Https";
import { BUILD_API } from "../../../global/G";
import {
  selectMedium,
  selectOpened,
  selectSmall,
} from "../../../store/features/ScreenStatus";
import { useDisclosure } from "@mantine/hooks";
import { DemoDrawer } from "../../../global/testDemo";
import {
  changeActive,
  changeNav,
  navIsAI,
  navIsMain,
} from "../../../store/features/ActiveNav";
import { useGlobalStyl } from "../../../hooks/useTheme";
import { Analytic } from "../dashboard/Analytic";
import { useAppHeader } from "../../../hooks/useAppHeader";

const scaleY = {
  in: { opacity: 1, transform: "scaleY(1)" },
  out: { opacity: 0, transform: "scaleY(0)" },
  common: { transformOrigin: "top" },
  transitionProperty: "transform, opacity",
};

export const AppMain0 = () => {
  let { source, traderpage } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { classes: classesG } = useGlobalStyl();
  const { t } = useTranslation("private", { keyPrefix: "main" });
  let now_ = new Date().getTime();
  const [refreshToken, setRefreshToken] = useState<number>(now_);
  const { onLogin, onLogout, hidden } = useAuth();
  const [hideHideText, setHideHideText] = useState(false);
  let jwt = localStorage.getItem("jwt");
  //  const { isTraderPage, setIsTraderPage } = useAppLoc();
  const dispatch = useDispatch();
  const {
    data,
    postError,
    isLoading,
    succeeded,
    errorMessage,
    errorCode,
    executePost,
  } = useAxiosPost(BUILD_API("refresh_token"), { jwt: jwt });
  const location = useLocation();

  let interval: any = null;
  // useEffect(() => {
  //     let href = window.location.href
  //     if (href.toUpperCase().includes('APP/AI'))
  //         dispatch(changeNav('AI'))
  //     else
  //         dispatch(changeNav('MAIN'))
  // }, [])
  // const showTrades = () => {
  //       const pathsToMatch = ["app/trades/*", "app/history/*"];
  //       return pathsToMatch.some((path) => matchPath(path, location.pathname));
  //     };
  useEffect(() => {
    // let href = location.pathname
    if (matchPath("sign-out", location.pathname)) return;

    // if (href.toLocaleLowerCase().indexOf("sign-out") >= 0) {
    //   return;
    // }
    if (matchPath("APP/AI", location.pathname)) dispatch(changeNav("AI"));
    else dispatch(changeNav("MAIN"));
    // if (href.toUpperCase().includes('APP/AI'))
    //     dispatch(changeNav('AI'))
    // else
    //     dispatch(changeNav('MAIN'))
  }, [location.pathname]);
  useEffect(() => {
    if (jwt && jwt != "") executePost();
  }, [refreshToken]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      let diff = new Date().getTime() - refreshToken;
      console.log("new diff token:", diff);
      if (diff >= 1000 * 5) {
        console.log("refresh:", diff);
        jwt = localStorage.getItem("jwt");
        let now_2 = new Date().getTime();
        setRefreshToken(now_2);
      }
    }, 1000 * 60 * 60 * 7 * 1);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {}, []);
  useEffect(() => {
    if (succeeded) onLogin(data, postError);
    if (errorMessage) onLogout();
    if (errorCode == "UNKNOWN_ERROR") {
      showNotification({
        id: "token_renew_UNKNOWN_ERROR",
        withCloseButton: false,
        autoClose: 15000,
        title: t("renew_token_failed", "Renew token failed!."),
        message: errorMessage,
        color: "red", // theme_2.colors.red[9],
        icon: <IconX />,
        loading: false,
      });
    }
  }, [succeeded, errorCode, errorMessage]);

  const opened = useSelector(selectOpened);
  const small = useSelector(selectSmall);

  const nav_is_main = useSelector(navIsMain);
  const navigate = useNavigate();
  let co_id2: any = searchParams.get("co_id");
  let isTraderPage =
    traderpage === "c" || (co_id2 && co_id2 != "" && +co_id2 > 0);
  const mainContClass = !isTraderPage
    ? small
      ? "app-main-small"
      : "app-main"
    : small
    ? "app-main-trade-small"
    : "app-main-trade";

  return (
    <>
      {/* <div
        className={`${small ? "app-left-nav-small" : "app-left-nav"}`}
        style={{ display: (small && opened) || !small ? "" : "none" }}
      > */}
      <AppShell navbar={{ width: 48, breakpoint: "sm" }}>
        <AppShell.Navbar
          h={"100%"}
          w={{ base: "100%" }}
          style={{ paddingLeft: "5px", paddingRight: "5px" }}
          className={`${classesG.navLeft}`}
        >
          <AppShell.Section>
            <Box>
              <NavAcc />
            </Box>
          </AppShell.Section>
          <AppShell.Section grow mt="md" component={ScrollArea}>
            {nav_is_main && <Nav />}
            {/* <AiSessions /> */}
          </AppShell.Section>
          <AppShell.Section>
            {/* <div>bottom</div> */}
            <Box>
              {hidden && (
                <Accordion variant="contained">
                  <Accordion.Item value="hiddenprofile">
                    <Accordion.Control>
                      <Text c="red">
                        {t("profile_is_hidden", "Hidden Profile")}
                      </Text>
                    </Accordion.Control>
                    <Accordion.Panel p={0}>
                      <Alert color="red">
                        <Text mt="xs" size="sm">
                          {t(
                            "hidden_profile_info2",
                            "Your company deal list and profile will remain private and invisible to others, except for users with a valid and unexpired sharing deal link."
                          )}
                        </Text>

                        <Text
                          bg="red.5"
                          mt="xs"
                          size="sm"
                          style={{
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            navigate(`../company-profile`);
                          }}
                        >
                          {t(
                            "change_visibility_profile",
                            "You can adjust visibility from the company profile!"
                          )}
                        </Text>
                      </Alert>
                    </Accordion.Panel>
                  </Accordion.Item>
                </Accordion>
              )}
            </Box>
          </AppShell.Section>
        </AppShell.Navbar>
      </AppShell>
      {/* </div> */}

      <div className={mainContClass}>
        <div style={{ height: 1, marginTop: -1 }}></div>
        <Group justify="space-between" style={{ width: "100%" }}>
          <Box
            className={
              !isTraderPage ? classesG.mainBody : classesG.mainBodyTradeNavig
            }
          >
            <Outlet />
          </Box>
          <Box className={classesG.rightMainBody}></Box>
        </Group>
        <div style={{ height: 1 }}></div>
      </div>
    </>
  );
};
export const AppMain = () => {
  const [opened, { toggle }] = useDisclosure();
  const { HeaderComponent }: any = useAppHeader();
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const padng = small ? "sm" : medium ? "md" : "lg";
  const { classes: classesG } = useGlobalStyl();
  return (
    <AppShell
      header={{ height: small ? 60 : 66 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding={padng}
    >
      <AppShell.Header className={`${classesG.mainHeader}`}>
        <Box style={{ display: "flex" }}>
          <Group
            justify="space-between"
            style={{ flex: small ? (opened? "1":"0 0 auto") : "0 0 auto" }}
          >
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
              // pl={padng}
            />
            {(opened || !small) && (
              <Box w={small ? "" : "300px"} className={classesG.userBorder}>
                <NavAcc />
              </Box>
            )}
          </Group>

          {(!opened || !small) && (
            <Group justify="space-between" style={{ flex: "1" }}>
              <Box style={{ flexShrink: 0 }} p="sm">
                <Box visibleFrom="md">
                  {HeaderComponent && HeaderComponent.Title && (
                    <HeaderComponent.Title />
                  )}
                </Box>
              </Box>
              <Box p="sm" pr={padng}>
                {HeaderComponent && HeaderComponent.Header && (
                  <HeaderComponent.Header />
                )}
              </Box>
            </Group>
          )}
        </Box>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Nav />
      </AppShell.Navbar>

      <AppShell.Main>
        {HeaderComponent && HeaderComponent.Title && (
          <Center hiddenFrom="md" mb="xl">
            <Box
              maw={"250px"}
              miw={"150px"}
              p="xs"
              className={classesG.SmallTitle}
            >
              <Center>
                <HeaderComponent.Title />
              </Center>
            </Box>
          </Center>
        )}
        <Box pos="relative">
          <Outlet />
        </Box>
        
      </AppShell.Main>
    </AppShell>
  );
};
export const AppMain2 = () => {
  // const dispatch = useDispatch();
  // useEffect(() => {
  //     dispatch(changeActive('home'))
  // }, [])
  return (
    <Analytic />
    // <Box>
    //     {"home"}
    // </Box>
  );
};
