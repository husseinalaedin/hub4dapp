import { useEffect, useState } from "react";
import { BUILD_API } from "../../../global/G";
import { useAxiosGet } from "../../../hooks/Https";
import {
  Alert,
  Box,
  Button,
  Card,
  Center,
  Grid,
  Group,
  List,
  LoadingOverlay,
  MultiSelect,
  Overlay,
} from "@mantine/core";
import { AppHeader } from "../app-admin/AppHeader";
import {
  IconAlertCircle,
  IconCircleCheck,
  IconRefresh,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { changeActive } from "../../../store/features/ActiveNav";
import { useDispatch, useSelector } from "react-redux";
import { useGlobalStyl } from "../../../hooks/useTheme";
import { D } from "../../../global/Date";
import { useAuth } from "../../../providers/AuthProvider";
import { useNavigate } from "react-router";
import {
  AppMultiSelect,
  useAppMultiSelectToAddMissedSearchVal,
} from "../../../global/global-comp/AppMultiSelect";
import { AppSelect } from "../../../global/global-comp/AppSelect";
import { useForm } from "@mantine/form";
import { ArrayToAppSelect } from "../../../global/Hashtags";
export const Usage = () => {
  const { t } = useTranslation("private", { keyPrefix: "usage" });
  const { hidden } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { classes: classesG } = useGlobalStyl();
  const {
    data: data,
    getError: getError,
    errorMessage: errorMessage,
    succeeded: succeeded,
    isLoading: isLoading,
    executeGet: executeGet,
  } = useAxiosGet(BUILD_API("usage"), {});
  useEffect(() => {
    executeGet();
  }, []);
  useEffect(() => {
    dispatch(changeActive("usage"));
  }, []);
  return (
    <>
      {isLoading && <Overlay opacity={1} color="#000" zIndex={5} />}
      {isLoading && (
        <LoadingOverlay
          visible={isLoading}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
      )}
      <AppHeader title={t("plan_usage", "Plan Usage")}>
        <Group justify="right" gap="xs">
          <Button
            variant="default"
            onClick={(val) => {
              executeGet();
            }}
          >
            <IconRefresh />
          </Button>
        </Group>
      </AppHeader>
      {/* <Group p="0px" m="0px" justify="center" w="100%"> */}
      <Box className={classesG.max400} pos="relative" w="100%">
        {data && !isLoading && succeeded && (
          <>
            {hidden && (
              <Alert
                fs="sm"
                color="orange.9"
                mb="xs"
                p="xs"
                title={t("profile_is_hidden", "Hidden Profile")}
                icon={<IconAlertCircle />}
              >
                <Box>
                  {t(
                    "hidden_co_profile",
                    "Your company deal list and profile will remain private and invisible to others, except for users with a valid and unexpired sharing deal link."
                  )}
                </Box>
                <Box
                  style={{
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    navigate(`../company-profile`);
                  }}
                  // sx={(theme) => ({
                  //   transition: "text-decoration 0.2s, color 0.2s",
                  //   color: theme.colors.blue[6],
                  //   "&:hover": {
                  //     textDecoration: "underline",
                  //     color: theme.colors.blue[8],
                  //   },
                  // })}
                >
                  {t(
                    "change_visibility_profile",
                    "You can adjust visibility from the company profile!"
                  )}
                </Box>
              </Alert>
            )}
            <Card m={0} shadow="md" mt="md" withBorder>
              <Group
                gap="4px"
                justify="space-between"
                style={{ width: "100%" }}
              >
                <Group gap="4px" justify="left">
                  {/* <IconCircleCheck size="1rem" /> */}
                  <Box opacity="0.75">
                    {t("you_have_used", "You've posted")}
                  </Box>{" "}
                  <Box c="orange">
                    <strong>
                      {`${data.active_deals_count}`} {t("deals", "Deals")}
                    </strong>{" "}
                  </Box>
                  <Box opacity="0.75"> {t("out_of", "out of")} </Box>
                  <Box c="violet">
                    <strong>
                      {`${data.deal_count}`} {t("deals", "Deals")}
                    </strong>{" "}
                  </Box>
                </Group>
                <Group justify="right" gap={2} maw="50px">
                  <Box c="orange">
                    <strong>{`${data.active_deals_count}`}</strong>
                  </Box>
                  <Box opacity="0.75"> {"/"} </Box>
                  <Box c="violet">
                    <strong>{`${data.deal_count}`}</strong>
                  </Box>
                </Group>
              </Group>
              <Group justify="space-between">
                <Box opacity="0.75">
                  {t("you_can_post_deals", "You can still post deals — up to")}
                </Box>
                <Box c="violet">
                  <strong>{`${data.remaining_deals_count}`}</strong>
                </Box>
              </Group>
            </Card>

            <Card mt="lg" shadow="md" withBorder>
              <Group
                gap="4px"
                justify="space-between"
                style={{ width: "100%" }}
              >
                <Group gap="4px" justify="left">
                  {/* <IconCircleCheck size="1rem" /> */}
                  <Box opacity="0.75">
                    {t("you_have_used", "You've used")}
                  </Box>{" "}
                  <Box c="orange">
                    <strong>
                      {`${data.parsing_attempts_completed}`}{" "}
                      {t("post_by_ai", "Posts By AI")}
                    </strong>{" "}
                  </Box>
                  <Box opacity="0.75"> {t("out_of", "out of")} </Box>
                  <Box c="violet">
                    <strong>
                      ~{`${data.parse_count_left+data.parsing_attempts_completed}`} {t("post_by_ai", "Posts By Ai")}
                    </strong>{" "}
                  </Box>
                </Group>
                <Group justify="right" gap={2} maw="50px">
                  <Box c="orange">
                    <strong>{`${data.parsing_attempts_completed}`}</strong>
                  </Box>
                  <Box opacity="0.75"> {"/"} </Box>
                  <Box c="violet">
                    <strong>{`${data.parse_count_left+data.parsing_attempts_completed}`}</strong>
                  </Box>
                </Group>
              </Group>
              <Group justify="space-between">
                <Box opacity="0.75">
                  {t(
                    "you_can_use_posts_by_ai",
                    "You can still use posts by AI — up to"
                  )}
                </Box>
                <Box c="violet">
                  <strong>{`${data.parse_count_left}`}</strong>
                </Box>
              </Group>
            </Card>

            <Card mt="lg" shadow="md" withBorder>
              <Group
                gap="4px"
                justify="space-between"
                style={{ width: "100%" }}
              >
                <Group gap="4px" justify="left">
                  {/* <IconCircleCheck size="1rem" /> */}
                  <Box opacity="0.75">
                    {t("you_have_used", "You've used")}
                  </Box>{" "}
                  <Box c="orange">
                    <strong>
                      {`${data.channel_shared_count}`}{" "}
                      {t("channels", "Channels")}
                    </strong>{" "}
                  </Box>
                  <Box opacity="0.75"> {t("out_of", "out of")} </Box>
                  <Box c="violet">
                    <strong>
                      {`${data.channel_count}`} {t("channels", "Channels")}
                    </strong>{" "}
                  </Box>
                </Group>
                <Group justify="right" gap={2} maw="50px">
                  <Box c="orange">
                    <strong>{`${data.channel_shared_count}`}</strong>
                  </Box>
                  <Box opacity="0.75"> {"/"} </Box>
                  <Box c="violet">
                    <strong>{`${data.channel_count}`}</strong>
                  </Box>
                </Group>
              </Group>
              <Group justify="space-between">
                <Box opacity="0.75">
                  {t(
                    "you_can_use_channels",
                    "You can still use channels — up to"
                  )}
                </Box>
                <Box c="violet">
                  <strong>{`${data.remaining_channel_count}`}</strong>
                </Box>
              </Group>
            </Card>

            <Card mt="lg" shadow="md" withBorder>
              <Group
                gap="4px"
                justify="space-between"
                style={{ width: "100%" }}
              >
                <Group gap="4px" justify="left">
                  {/* <IconCircleCheck size="1rem" /> */}
                  <Box opacity="0.75">
                    {t("you_have_used", "You have used")}
                  </Box>{" "}
                  <Box c="orange">
                    <strong>
                      {`${data.shared_count}`} {t("shares", "Shares")}
                    </strong>{" "}
                  </Box>
                  <Box opacity="0.75"> {t("out_of", "out of")} </Box>
                  <Box c="violet">
                    <strong>
                      {`${data.share_count}`} {t("shares", "Shares")}
                    </strong>{" "}
                  </Box>
                </Group>
                <Group justify="right" gap={2} maw="50px">
                  <Box c="orange">
                    <strong>{`${data.shared_count}`}</strong>
                  </Box>
                  <Box opacity="0.75"> {"/"} </Box>
                  <Box c="violet">
                    <strong>{`${data.share_count}`}</strong>
                  </Box>
                </Group>
              </Group>
              <Group justify="space-between">
                <Box opacity="0.75">
                  {t("you_can_share", "You can still share — up to")}
                </Box>
                <Box c="violet">
                  <strong>{`${data.remaining_share_count}`}</strong>
                </Box>
              </Group>
            </Card>
            <Card mt="lg" shadow="md" withBorder>
              <Group justify="space-between">
                <Box opacity="0.75">
                  {t(
                    "dash_performance_analytics",
                    "Dashboard Performance Analytics — up to"
                  )}
                </Box>
                <Group justify="right" gap={2}>
                  <Box c="violet">
                    <strong>{`${data.dashboard_performance_days}`}</strong>
                  </Box>
                  <Box opacity="0.75">{t("days", "Days")}</Box>
                </Group>
              </Group>
              <Group justify="space-between">
                <Box opacity="0.75">{t("starting_on", "Starting On")}</Box>
                <Box c="violet">
                  <strong>{`${D.utc_to_local(
                    data.dashboard_performance_start_on
                  )}`}</strong>
                </Box>
              </Group>
            </Card>
          </>
        )}
      </Box>
      {/* </Group> */}
    </>
  );
};
