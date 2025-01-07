import {
  IconListDetails,
  IconDeviceAnalytics,
  IconChartHistogram,
  IconList,
  IconHome,
  IconTopologyStar3,
  IconTopologyStarRing3,
  IconHistory,
  IconMail,
  IconSquareRoot2,
  IconCertificate,
  IconCommand,
  IconArrowBigDownLines,
  IconMessageReport,
  IconBrain,
  IconInputAi,
  IconPrompt,
  IconArrowNarrowDown,
  IconArrowDownRhombus,
  IconSlash,
  IconTerminal2,
  IconLogout2,
  IconClock24,
} from "@tabler/icons-react";
import { Box, Group, NavLink } from "@mantine/core";
import { Link, matchPath, useLocation, useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";

import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../../providers/AuthProvider";
import { changeNav, selectActive } from "../../../store/features/ActiveNav";
import { useEffect, useState } from "react";
import {
  toggle,
  close as closeMenu,
} from "../../../store/features/ScreenStatus";
import { BUILD_PORTAL_URL, G } from "../../../global/G";
import { NavAcc } from "./NavAcc";

export const Nav = () => {
  const { t } = useTranslation("common", { keyPrefix: "navigator" });
  const { userData, islogged, iscoadmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  let hex = G.ifNull(searchParams.get("hex"), "");
  const hex_q = hex && hex != "" && !islogged ? "/?hex=" + hex : "";
  const nav_items = [
    {
      key: "hub4d",
      to: BUILD_PORTAL_URL("back"),
      private: "N",
      icon: IconLogout2,
      icon_class: "",
      iconcolor: "red.5",
      label: <div className="acc-nav-item">{t("hub4d", "Hub4d")}</div>,
    },
    {
      key: "home",
      to: "/pub",
      private: "N",
      icon: IconHome,
      icon_class: "",
      iconcolor: "",
      label: <div className="acc-nav-item">{t("home", "Home")}</div>,
    },
    // { key: 'ai', to: "ai", private: 'N', icon: IconTerminal2, icon_class: "rotating-ai-icon", iconcolor: "orange.9", label: <div className='acc-nav-item'>{t('ai', 'AI')}</div> },
    {
      key: "trades",
      to: "trades/t/a" + hex_q,
      private: "t",
      icon: IconListDetails,
      iconcolor: "violet.5",
      label: (
        <div className="acc-nav-item">
          {t("trading_floor", "Trading Floor")}
        </div>
      ),
    },
    {
      key: "latest-trades",
      to: "latest-trades" + hex_q,
      private: "t",
      icon: IconArrowBigDownLines,
      iconcolor: "violet.5",
      label: (
        <div className="acc-nav-item">{t("latesttrades", "Latest Trades")}</div>
      ),
    },

    {
      key: "companies",
      to: "companies",
      private: "P",
      icon: IconCommand,
      iconcolor: "violet.5",
      label: (
        <div className="acc-nav-item">
          {t("company_directory", "Company Directory")}
        </div>
      ),
    },

    {
      key: "board",
      to: "board",
      private: "P",
      icon: IconDeviceAnalytics,
      iconcolor: "",
      label: <div className="acc-nav-item">{t("dashboard", "Dashboard")}</div>,
      links: [
        {
          key: "analytic",
          to: "board/analytic",
          private: "P",
          icon: IconChartHistogram,
          iconcolor: "",
          label: (
            <div className="acc-nav-item">
              {t("dashboard_analytic", "Analytic")}
            </div>
          ),
        },
        {
          key: "usage",
          to: "board/usage",
          private: "P",
          icon: IconClock24,
          iconcolor: "",
          label: <div className="acc-nav-item">{t("usage", "Usage")}</div>,
        },
        // {
        //   key: "emailsStat",
        //   to: "board/emailsStat/co/-1",
        //   private: "P",
        //   icon: IconMail,
        //   iconcolor: "",
        //   label: (
        //     <div className="acc-nav-item">
        //       {t("dashboard_emails_stts", "Email Share Status")}
        //     </div>
        //   ),
        // },
      ],
    },
    {
      key: "mydeals",
      to: "mydeals",
      private: "P",
      icon: IconList,
      iconcolor: "",
      label: (
        <div className="acc-nav-item">{t("my_company_deals", "My Deals")}</div>
      ),
    },
    {
      key: "channels",
      to: "channels",
      private: "P",
      icon: IconTopologyStarRing3,
      iconcolor: "",
      label: (
        <div className="acc-nav-item">{t("my_channels", "My Channels")}</div>
      ),
    },

    {
      key: "shares",
      to: "shares",
      private: "P",
      icon: IconTopologyStar3,
      iconcolor: "",
      label: <div className="acc-nav-item">{t("my_shares", "My Shares")}</div>,
    },

    {
      key: "decisionnoted",
      to: "decision-noted",
      private: "c",
      icon: IconCertificate,
      iconcolor: "green.5",
      label: (
        <div className="acc-nav-item">
          {t("channeldecision", "Channel Decision")}
        </div>
      ),
    },
    {
      key: "concern",
      to: "concern",
      private: "P",
      icon: IconMessageReport,
      iconcolor: "red.5",
      label: (
        <div className="acc-nav-item">{t("report_to_us", "Report To Us")}</div>
      ),
    },

    {
      key: "history",
      to: "history" + hex_q,
      private: "N",
      icon: IconHistory,
      iconcolor: "",
      label: <div className="acc-nav-item">{t("history", "History")}</div>,
    },
    {
      key: "co-admin",
      to: "co-admin",
      private: "A",
      icon: IconSquareRoot2,
      iconcolor: "",
      label: <div className="acc-nav-item">{t("co-admin", "Co-Admin")}</div>,
    },
  ];
  const { hidden } = useAuth();

  // const [active, setActive] = useState(0);
  // selectActive
  const active = useSelector(selectActive);
  // const dispatch = useDispatch();
  const dispatch = useDispatch();
  const showTrades = () => {
    const pathsToMatch = ["app/trades/*", "app/history/*"];
    return (
      islogged ||
      pathsToMatch.some((path) => matchPath(path, location.pathname))
    );
  };
 
  // location.pathname.indexOf('app/trades') >= 0 || location.pathname.indexOf('app/latest-trades') >= 0 || location.pathname.indexOf('app/history') >= 0 || islogged
  const items = nav_items.map((item, index) => {
    if (
      (item.private == "P" && islogged) ||
      item.private == "N" ||
      (item.private == "c" &&
        location.pathname.indexOf("decision-noted") >= 0) ||
      (item.private == "t" && showTrades()) ||
      (item.private == "A" && islogged && iscoadmin)
    )
      return (
        <NavLink
          defaultOpened={true}
          component={Link}
          to={item.to}
          key={item.key}
          active={item.key == active}
          label={item.label}
          leftSection={
            <Group
              className={item.icon_class ? item.icon_class : ""}
              c={item.iconcolor}
            >
              <item.icon size={22} stroke={1.5} />
            </Group>
          }
          onClick={() => {
            dispatch(closeMenu());
          }}
        >
          {item.links?.map((item2, index2) => {
            return (
              <NavLink
                component={Link}
                to={item2.to}
                key={item2.key}
                active={item2.key == active}
                label={item2.label}
                leftSection={
                  <Group c={item2.iconcolor}>
                    <item2.icon size={22} stroke={1.5} />
                  </Group>
                }
              />
            );
          })}
          {/* */}
        </NavLink>
      );
  });

  return (
    <>
       
      <Box w="100%">{items}</Box>
    </>
  );
};
