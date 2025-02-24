import { useEffect, useImperativeHandle, useState } from "react";
import {
  Drawer,
  Group,
  ActionIcon,
  Avatar,
  Box,
  NavLink,
  useMantineTheme,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconBuilding,
  IconBuildingSkyscraper,
  IconBusinessplan,
  IconCash,
  IconCurrencyDollarSingapore,
  IconHelp,
  IconInfoSquare,
  IconLanguage,
  IconLogin,
  IconLogout,
  IconSelector,
  IconSettings,
  IconSettingsDollar,
  IconUserCircle,
  IconUserPlus,
  IconUsers,
  IconX,
} from "@tabler/icons-react";

import { Link, useLocation } from "react-router";

import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  selectOpened,
  selectSmall,
  toggle,
} from "../../../store/features/ScreenStatus";
import { LanguageSelect } from "../../../global/Language";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { useAuth } from "../../../providers/AuthProvider";
import { UseProfileMenu } from "../acc/UserProfile";
import { ActiveTheme, Themes } from "../../../hooks/useTheme";

import { changeActive } from "../../../store/features/ActiveNav";
export const NavAccItems=()=>{
  const { t } = useTranslation("common", { keyPrefix: "navigator" });
  const navAccItems = [
    {
      key: "profile",
      to: "profile",
      private: "P",
      icon: IconUserCircle,
      label: <div className="acc-nav-item">{t("profile", "Profile")}</div>,
      description:t('profile_desc','Your profile.'),
    },
    {
      key: "company",
      to: "company-profile",
      private: "P",
      icon: IconBuilding,
      label: (
        <div className="acc-nav-item">{t("co_profile", "Company Profile")}</div>
      ),
      description:t('co_profile_desc','Your company profile.'),
    },

    {
      key: "team",
      to: "team",
      private: "P",
      icon: IconUsers,
      label: <div className="acc-nav-item">{t("co_team", "Company Team")}</div>,
      description:t('co_team_desc','Your company team.'),
    },
    {
      key: "settings",
      to: "settings",
      private: "P",
      icon: IconSettings,
      label: <div className="acc-nav-item">{t("settings", "Settings")}</div>,
      description:t('settings_desc','Your settings.')
    },

    {
      key: "plans",
      to: "plans",
      private: "P",
      iconcolor: "violet.5",
      icon: IconCurrencyDollarSingapore,
      label: (
        <div className="acc-nav-item">
          {t("plans_and_pricing", "Plans & Pricing")}
        </div>
      ),
      description:t('plans_and_pricing_desc','Your plan and Plans & Pricing.'),
    },

    {
      key: "signout",
      to: "sign-out",
      private: "P",
      icon: IconLogout,
      iconcolor: "red.5",
      label: <div className="acc-nav-item">{t("sign_out", "Sign Out")}</div>,
      description:t('sign_out_desc','Sign Out.'),
    },
    {
      key: "line",
      to: "",
      private: "P",
      icon: IconLogout,
      label: <div className="acc-nav-item">line</div>,
    },

    // {
    //   key: "help",
    //   to: "",
    //   private: "N",
    //   icon: IconHelp,
    //   label: <div className="acc-nav-item">{t("help", "Help")}</div>,
    // },
    // {
    //   key: "about",
    //   to: "",
    //   private: "N",
    //   icon: IconInfoSquare,
    //   label: <div className="acc-nav-item">{t("about", "About")}</div>,
    // },
    {
      key: "singup",
      to: "../app/pub/sign-up",
      private: "C",
      icon: IconUserPlus,
      label: <div className="acc-nav-item">{t("sign_up", "Sign Up")}</div>,
    },
    {
      key: "singin",
      to: "../app/pub/sign-in",
      private: "C",
      icon: IconLogin,
      label: <div className="acc-nav-item">{t("sign_in", "Sign In")}</div>,
    },
    {
      key: "theme",
      to: "",
      private: "N",
      icon: ActiveTheme(),
      label: <Themes />,
      keepDrawerOpen: true,
      description:t('theme_desc','Theme.')
    },
    {
      key: "lang",
      to: "",
      private: "N",
      icon: IconLanguage,
      label: <LanguageSelect />,
      keepDrawerOpen: true,
      description:t('language_desc','Language.')
    },
  ];
  return navAccItems
}
const NavAccItemsComp = (props: any) => {
  const { t } = useTranslation("common", { keyPrefix: "navigator" });
  const navAccItems = NavAccItems()
  const dispatch = useDispatch();
  const opened2 = useSelector(selectOpened);
  const small2 = useSelector(selectSmall);
  let path = useLocation().pathname;
  const [active, setActive] = useState(() => {
    for (let i = 0; i < navAccItems.length; i++) {
      if (path.indexOf("/" + navAccItems[i].key) >= 0) return i;
    }
    return -1;
  });
  let [upd, setUpd] = useState(0);
  let { theme } = useAppTheme();
  const { onLogout, islogged } = useAuth();
  useEffect(() => {
    navAccItems[7].icon = ActiveTheme();
    setUpd((prop) => {
      return ++prop;
    });
  }, [theme]);
  const itemClicked = (index: number) => {
    dispatch(changeActive("any"));
    // if (navAccItems[index].key == 'signout') {
    //     onLogout();
    //     return
    // }

    setActive(index);
    if (!navAccItems[index].keepDrawerOpen && props && props.andCloseDrawer) {
      if(props.onLinkClicked){
        props.onLinkClicked()
      }
      props.andCloseDrawer();
      if (small2 && opened2) {
        dispatch(toggle());
      }
    }
  };
  const items = (
    <>
      {navAccItems.map((item, index) => {
        if (
          item.private == "N" ||
          (item.private == "C" && !islogged) ||
          (item.private == "P" && islogged)
        ) {
          switch (item.key) {
            case "line":
              return <Box key={item.key} className="acc-nav-line" mb="md" mt="lg"></Box>;
            case "theme":
              return (
                <NavLink
                  key={item.key}
                  leftSection={<item.icon size={22} stroke={1.5} />}
                  label={item.label}
                />
              );
            case "plans":
              return (
                <NavLink
                  component={Link}
                  to={item.to}
                  key={item.key}
                  active={index === active}
                  label={item.label}
                  leftSection={
                    <Box c="violet.5">
                      {" "}
                      <item.icon size={22} stroke={1.5} />
                    </Box>
                  }
                  onClick={() => itemClicked(index)}
                />
              );
            case "lang":
              return (
                <NavLink
                  key={item.key}
                  leftSection={<item.icon size={22} stroke={1.5} />}
                  label={item.label}
                />
              );
          }
          return (
            <NavLink
              component={Link}
              to={item.to}
              key={item.key}
              active={index === active}
              label={item.label}
              leftSection={<item.icon size={22} stroke={1.5} />}
              onClick={() => itemClicked(index)}
            />
          );
        }
      })}
    </>
  );

  return <Box w="100%">{items} </Box>;
};
export const NavAcc = (props: any) => {
  const { t } = useTranslation("common", { keyPrefix: "navigator" });
  const [opened, setOpened] = useState(false);
  const is_openeds: boolean = opened;
  const theme = useMantineTheme();

  const small = useSelector(selectSmall);
  const { userData, islogged } = useAuth();
  useEffect(() => {
    let us = userData;
    console.log(us);
  }, []);
  useImperativeHandle(props.ref, () => {
    const is_opened = () => {
      return opened;
    };
  });
  const initials = () => {
    if (!islogged) return t("guest_initials", "GA");
    let inits = "";
    if (userData?.first_name != "")
      inits = userData?.first_name[0].toUpperCase();
    if (userData?.last_name != "")
      inits = inits + userData?.last_name[0].toUpperCase();
    return inits != "" ? inits : t("guest_initials", "GA");
  };
  return (
    <>
      <Box
        onClick={() => {
          setOpened((prop) => (prop = !prop));
        }}
      >
        <UseProfileMenu
          initials={
            initials()
            // islogged
            //   ? userData?.first_name[0].toUpperCase() +
            //     userData?.last_name[0].toUpperCase()
            //   : t("guest_initials", "GA")
          }
          image=""
          company={islogged ? userData?.company_name : t("guest", "Guest")}
          name={
            islogged
              ? userData?.first_name + " " + userData?.last_name
              : t("guest_access", "Guest Access")
          }
          icon={<IconSelector size={14} stroke={1.5} />}
        />
      </Box>

      <Drawer
        opened={opened}
        onClose={() => {
          if (props && props.state_changed) props.state_changed(false);
          setOpened(false);
        }}
        // size="lg"
        position="left"
        withCloseButton={false}
      >
        <Group justify={small ? "right" : "left"}>
          <ActionIcon
            onClick={() => {
              if (props && props.state_changed) props.state_changed(false);
              setOpened(false);
            }}
          >
            {<IconArrowLeft size={30} />}
          </ActionIcon>
        </Group>
        <NavAccItemsComp
          onLinkClicked={props.onLinkClicked}
          andCloseDrawer={() => {
            if (props && props.state_changed) props.state_changed(false);
            setOpened(false);
          }}
        />
      </Drawer>
      <div
        style={{ cursor: "pointer" }}
        onClick={() => {
          if (props && props.state_changed) props.state_changed(true);
          setOpened(true);
        }}
      >
        {" "}
        {props.children}
      </div>
    </>
  );
};
