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
  IconGridDots,
  IconOctagonPlus,
  IconClipboardPlus,
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
export const NavItems=(hex_q)=>{
  const { t } = useTranslation("common", { keyPrefix: "navigator" });
  const nav_items = [
    {
      key: "hub4d",
      to: BUILD_PORTAL_URL(""),
      private: "N",
      icon: IconLogout2,
      icon_class: "",
      iconcolor: "red.5",
      label: <div className="acc-nav-item">{t("hub4d", "Hub4d")}</div>,
      description:''
    },
    // {
    //   key: "home",
    //   to: "/app/pub",
    //   private: "N",
    //   icon: IconHome,
    //   icon_class: "",
    //   iconcolor: "",
    //   label: <div className="acc-nav-item">{t("home", "Home")}</div>,
    //   description:''
    // },
    {
      key: "quickaccess",
      to: "quickaccess?src=links",
      private: "N",
      icon: IconGridDots,
      icon_class: "",
      iconcolor: "pink.5",
      label: <div className="acc-nav-item">{t("quick_access", "Quick Access")}</div>,
      description:''
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
      description:t(
        "trading_floor_desc",
        "Browse all active deals and trades available on the Hub4d platform."
      )
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
      description:t(
        "latesttrades_desc",
        "Explore all available deals and trades on the Hub4d platform, sorted by the most recently added."
      )
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
      description:t(
        "company_directory_desc",
        "Explore all businesses on the Hub4d platform, view their profiles, and connect with potential trade partners."
      )
    },

    {
      key: "board",
      to: "board",
      private: "P",
      icon: IconDeviceAnalytics,
      iconcolor: "",
      label: <div className="acc-nav-item">{t("dashboard", "Dashboard")}</div>,
      description:t(
        "dashboard_desc",
        "Dashboard."
      ),
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
          description:t(
            "analytic_desc",
            "Your central hub for monitoring all shares and responses, featuring real-time charts and insights."
          )
        },
        {
          key: "usage",
          to: "board/usage",
          private: "P",
          icon: IconClock24,
          iconcolor: "",
          label: <div className="acc-nav-item">{t("usage", "Usage")}</div>,
          description:t(
            "usage_desc",
            "Your central hub for tracking the usage of your current plan, including key metrics and insights."
          )
        }, 
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
      description:t(
        "my_company_deals_desc",
        "Browse and manage all your deals on the Hub4d platform."
      ),
      linkstocreate:[{
        to: "mydeals#bypasting",
        icon: IconClipboardPlus,
        iconcolor: "indigo.5",
        label: (
          <div className="acc-nav-item">{t("my_company_deals_create_by_pasting", "Create Deals with Pasting")}</div>
        ),
        description:t(
          "my_company_deals_create_by_pasting_desc",
          "Quickly add multiple deals by pasting data from your Excel or Google Sheet in a specific order."
        ),
      },
      {
        to: "mydeals#byai",
        icon: IconOctagonPlus,
        iconcolor: "indigo.5",
        label: (
          <div className="acc-nav-item">{t("my_company_deals_create_by_ai", "Create Deals with AI")}</div>
        ),
        description:t(
          "my_company_deals_create_by_ai_desc",
          "Easily add multiple deals by pasting data into the AI parser, which will automatically extract and organize the deals for you."
        ),
      }]
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
      description:t(
        "my_channels_desc",
        "Browse and manage all your channels on the Hub4d platform. A channel refers to any social media that can be accessed through a link, such as WhatsApp, Facebook, LinkedIn groups, and more."
      )
    },

    {
      key: "shares",
      to: "shares",
      private: "P",
      icon: IconTopologyStar3,
      iconcolor: "",
      label: <div className="acc-nav-item">{t("my_shares", "My Shares")}</div>,
      description:t(
        "my_shares_desc",
        "Browse and manage all your shares across channels. Easily update expiration dates, make adjustments, and track key metrics and insights."
      ),
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
      description:t(
        "report_to_us_desc",
        "Report any technical issues or concerns, and we'll assist you promptly."
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
  return nav_items
}
export const Nav = ({onLinkClicked}) => {
  const { t } = useTranslation("common", { keyPrefix: "navigator" });
  const { userData, islogged, iscoadmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  let hex = G.ifNull(searchParams.get("hex"), "");
  const hex_q = hex && hex != "" && !islogged ? "/?hex=" + hex : "";
  const nav_items = NavItems(hex_q)
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
            if(onLinkClicked)
              onLinkClicked()
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
                onClick={() => {
                  if(onLinkClicked)
                    onLinkClicked()
                }}
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
