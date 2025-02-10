import {
  Badge,
  Box,
  Button,
  Card,
  Group,
  Image,
  SimpleGrid,
  Switch,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { changeActive } from "../../../store/features/ActiveNav";
import { useDispatch } from "react-redux";
import { IconListDetails } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { NavItems } from "./Nav";
import { AppHeader } from "./AppHeader";
import { NavAccItems } from "./NavAcc";

export const QuickAccess = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation("common", { keyPrefix: "navigator" });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let src = searchParams.get("src");
  let titleOly = searchParams.get("titleOnly");
  const [showSiteLinks, setShowSiteLinks] = useState(src == "links");
  const [titleOnly, setTitleOnly] = useState(!!(titleOly && titleOly == "X"));
  useEffect(() => {
    dispatch(changeActive("quickaccess"));
  }, [dispatch]);
  useEffect(() => {
    setShowSiteLinks(src == "links");
  }, [src]);
  useEffect(() => {
    setTitleOnly(!!(titleOly && titleOly == "X"));
  }, [titleOly]);
  const NavCard = ({ nav }) => {
    return (
      <UnstyledButton
        variant="transparent"
        onMouseDown={() => {
          if (nav.to != "") navigate(`../` + nav.to);
        }}
      >
        <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
          <Group justify="flex-start">
            <Box c={nav.iconcolor && nav.iconcolor != "" ? nav.iconcolor : ""}>
              <nav.icon />
            </Box>
            <Text fw={700} fz="h3">
              {nav.label}
            </Text>
          </Group>
          {!titleOnly && (
            <Text size="md" c="dimmed" mt="xs">
              {nav.description}
            </Text>
          )}
        </Card>
      </UnstyledButton>
    );
  };
  const navItems = NavItems("")
    ?.filter((nav) => nav.description && nav.description !== "") // Ensure no empty descriptions
    .map((nav, idx) => {
      return (
        <>
          {!nav.links && <NavCard key={idx} nav={nav} />}
          {nav.links &&
            Array.isArray(nav.links) &&
            nav.links.length > 0 &&
            nav.links
              .filter((nav2) => nav2.description && nav2.description !== "") // Ensure no empty descriptions
              .map((nav3, idx3) => <NavCard key={idx3} nav={nav3} />)}
          {nav.linkstocreate &&
            Array.isArray(nav.linkstocreate) &&
            nav.linkstocreate.length > 0 &&
            nav.linkstocreate
              .filter((nav4) => nav4.description && nav4.description !== "") // Ensure no empty descriptions
              .map((nav5, idx5) => <NavCard key={idx5} nav={nav5} />)}
        </>
      );
    });
  const navAccItems = NavAccItems()
    ?.filter((nav) => nav.description && nav.description !== "") // Ensure no empty descriptions
    .map((nav, idx) => {
      return (
        <>
          <NavCard key={idx} nav={nav} />
        </>
      );
    });

  return (
    <>
      <AppHeader title={t("quick_access", "Quick Access")}>
        <Group justify="left" gap="xs">
          <Button
            fw="normal"
            variant={showSiteLinks ? "filled" : "outline"}
            onClick={() => {
              // setShowSiteLinks(true);
              navigate(
                "../quickaccess?src=links&titleOnly=" + (titleOnly ? "X" : "")
              );
            }}
          >
            {t("show_access_links", "Show Quick Access Links")}
          </Button>
          <Button
            fw="normal"
            variant={!showSiteLinks ? "filled" : "outline"}
            onClick={() => {
              // setShowSiteLinks(false);
              navigate(
                "../quickaccess?src=preferences&titleOnly=" +
                  (titleOnly ? "X" : "")
              );
            }}
          >
            {t("show_preferences_links", "Show Preferences Links")}
          </Button>
        </Group>
      </AppHeader>
      <Box mb="lg" style={{ cursor: "pointer" }}>
        <Switch
          checked={titleOnly}
          label={t("title_only", "Title Only")}
          onClick={() => {
            navigate(
              "../quickaccess?src=" +
                src +
                "&titleOnly=" +
                (!titleOnly ? "X" : "")
            );
          }}
        />
      </Box>

      <SimpleGrid
        cols={{ base: 1, sm: 2, lg: 3 }}
        spacing={{ base: 10, sm: "xl" }}
        verticalSpacing={{ base: "md", sm: "xl" }}
      >
        {showSiteLinks && <>{navItems}</>}
        {!showSiteLinks && <>{navAccItems}</>}
      </SimpleGrid>
    </>
  );
};
