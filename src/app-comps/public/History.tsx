import { Box, Button, Grid, Group, Paper, Text, Title } from "@mantine/core";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { D } from "../../global/Date";
import { HIST } from "../../global/G";
import { NoDataFound } from "../../global/NoDataFound";
import { changeActive } from "../../store/features/ActiveNav";
import { selectMedium, selectSmall } from "../../store/features/ScreenStatus";
import { AppHeader } from "../private/app-admin/AppHeader";
import { useGlobalStyl } from "../../hooks/useTheme";

export const History = () => {
  const { t } = useTranslation("public", { keyPrefix: "history" });
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const dispatch = useDispatch();
  const { classes: classesG } = useGlobalStyl();
  useEffect(() => {
    dispatch(changeActive("history"));
  }, []);

  const [data, setData] = useState(HIST.history);
  useEffect(() => {
    const handleStorageChange = () => {
      setData(HIST.history);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  // useEffect(() => {
  //   setData(HIST.history);
  // }, [HIST.history]);

  return (
    <>
      <AppHeader title={t("history", "Histories")}>
        <Group justify="right" gap="xs">
          <Button
            variant="outline"
            c="red"
            onClick={() => {
              HIST.clear();
            }}
          >
            {t("clear_history", "Clear History")}
          </Button>
        </Group>
      </AppHeader>

      <Box style={{ width: "100%" }}>
        <Paper
          radius={0}
          p={small ? 15 : medium ? 25 : 35}
          pb={15}
          pt={15}
          mb={0}
          className={`${classesG.subHeader} ${classesG.transparentBottomBorder}`}
          style={{
            // paddingRight: 45,
            width: "100%",
            marginBottom: 0,
            position: "relative",
            fontWeight: "bold",
          }}
        >
          {small && <>{t("channel_info", "Channels information")}</>}
          {!small && (
            <Grid gutter="md" pb={0} mb={0}>
              <Grid.Col span={{ base: 12 }}>
                <Text>{t("link", "Link")}</Text>
              </Grid.Col>
              {/* <Grid.Col xs={12} sm={6} md={4}>
                            <Text>
                                {t('company', 'Company')}
                            </Text>
                        </Grid.Col> */}
            </Grid>
          )}
        </Paper>
        {!data ||
          (data.length <= 0 && (
            <NoDataFound title={t("no_history_found", "No History Found!.")} />
          ))}
        {data?.map((element, index) => {
          return (
            <Paper
              key={index}
              radius={0}
              p={small ? 10 : medium ? 10 : 15}
              className={
                `${classesG.paper} ` +
                (index != data.length - 1
                  ? `${classesG.transparentBottomBorder} `
                  : "")
              }
              style={{
                // paddingRight: 45,
                marginTop: 0, //? 50 : 0, width: "100%",
                marginBottom: 0,
                position: "relative",
              }}
            >
              <Grid gutter={2}>
                <Grid.Col span={{ base: 12 }}>
                  <Box></Box>
                  <Box
                    className={classesG.titleHref}
                    onClick={() => {
                      window.location.href = element.val + `/?hist='X'`;
                      return null;
                    }}
                  >
                    <Title order={3}>{element.val}</Title>
                  </Box>
                  <Text style={{ fontSize: "0.8rem" }}>
                    {t("first_visit", "First Visit")}{" "}
                    {D.utc_to_distance(element.created_on)}
                  </Text>
                  <Text style={{ fontSize: "0.8rem" }}>
                    {element.nb} {t("visits", "Visit(s)")}
                  </Text>
                </Grid.Col>
                {/* <Grid.Col xs={12} span={{base:12}} >
                                    <Box style={{ marginTop: small ? "10px" : "" }}>
                                        {element.co}
                                    </Box>

                                </Grid.Col> */}
              </Grid>
            </Paper>
          );
        })}
      </Box>
    </>
  );
};
