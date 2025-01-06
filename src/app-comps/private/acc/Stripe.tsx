import {
  Alert,
  Box,
  Button,
  Card,
  Center,
  CheckIcon,
  Divider,
  Group,
  List,
  LoadingOverlay,
  NumberInput,
  SegmentedControl,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Table,
  Tabs,
  Text,
  Title,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useGlobalStyl } from "../../../hooks/useTheme";
import { useAxiosGet, useAxiosPost } from "../../../hooks/Https";
import { BUILD_API, useMessage } from "../../../global/G";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  selectMedium,
  selectSmall,
} from "../../../store/features/ScreenStatus";
import {
  IconAlertCircle,
  IconArrowRight,
  IconCircleCheck,
  IconFileDollar,
  IconMessage2Dollar,
  IconMessageCircle,
  IconMessageCirclePlus,
  IconPhoto,
  IconSquare,
} from "@tabler/icons-react";
import { AppHeader } from "../app-admin/AppHeader";
import { D } from "../../../global/Date";
import { isOwner } from "../../../global/Misc";

export const StripePricingTable = () => {
  const { classes: classesG, cx } = useGlobalStyl();
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const { t } = useTranslation("public", { keyPrefix: "plans" });
  const { error, succeed, warning } = useMessage();
  const [activePlan, setActivePlan] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<any>({});
  const [freePlan, setFreePlan] = useState<any>(null);
  const {
    data: stripe_info,
    errorMessage: stripe_info_errorMessage,
    getError: stripe_info_getError,
    succeeded: stripe_info_succeeded,
    isLoading: stripe_info_isLoading,
    executeGet: stripe_info_executeGet,
  } = useAxiosGet(BUILD_API("stripe/info"), {});
  const {
    data: plans_data,
    errorMessage: plans_errorMessage,
    getError: plans_getError,
    succeeded: plans_succeeded,
    isLoading: plans_isLoading,
    executeGet: plans_executeGet,
  } = useAxiosGet(BUILD_API("util/plans"), {});
  useEffect(() => {
    stripe_info_executeGet();
    plans_executeGet();
  }, []);

  useEffect(() => {
    if (stripe_info) {
      setActivePlan(stripe_info.activePlan);
      if (stripe_info.currents) {
        setCurrentPlan(stripe_info.currents.plan);
        if (
          !stripe_info.currents.plan.id ||
          stripe_info.currents.plan.id != "FREE"
        ) {
          for (let i = 0; i < plans_data.plans.length; i++)
            if (plans_data.plans[i].id == "FREE") {
              setFreePlan(plans_data.plans[i]);
              break;
            }
        }
      }
    }

    if (stripe_info_errorMessage) error(stripe_info_errorMessage);
    if (plans_errorMessage) error(plans_errorMessage);
  }, [
    stripe_info_succeeded,
    stripe_info_errorMessage,
    plans_errorMessage,
    plans_data,
  ]);

  return (
    <>
      <AppHeader title={t("plans_n_pricing", "Plans And Pricing")}></AppHeader>
      <Box className={classesG.editMax800}>
        <Tabs defaultValue="current" variant="outline">
          <Tabs.List justify="flex-start">
            <Tabs.Tab
              value="current"
              leftSection={<IconSquare size="2rem" />}
              fz="lg"
            >
              {t("current_plan", "Current Plan")}
            </Tabs.Tab>
            <Tabs.Tab
              value="pricing"
              leftSection={<IconMessage2Dollar size="2rem" />}
              fz="lg"
            >
              {t("pricing", "Pricing")}
            </Tabs.Tab>
            {freePlan && (
              <Tabs.Tab
                value="free"
                leftSection={<IconMessage2Dollar size="2rem" />}
                fz="lg"
              >
                {t("free", "Free")}
              </Tabs.Tab>
            )}
          </Tabs.List>
          <Tabs.Panel value="current" pt="xs">
            <Box pos="relative">
              <CurrentPlan
                currentPlan={currentPlan}
                activePlan={activePlan}
                errorStripeInfo={stripe_info_errorMessage}
                stripeInfoIsLoading={stripe_info_isLoading}
                stripeInfo={stripe_info}
              />
            </Box>
          </Tabs.Panel>
          <Tabs.Panel value="pricing" pt="xs">
            <Box pos="relative">
              <LoadingOverlay
                visible={plans_isLoading}
                overlayProps={{ radius: "sm", blur: 2 }}
                opacity={0.8}
              />
              <StripePricingTable_n
                stripeInfo={stripe_info}
                errorStripeInfo={stripe_info_errorMessage}
                stripeInfoIsLoading={stripe_info_isLoading}
                activePlan={activePlan}
                plans_data={plans_data}
              />
            </Box>
          </Tabs.Panel>
          {freePlan && (
            <Tabs.Panel value="free" pt="xs">
              <Box pos="relative">
                <FreePlan
                  freePlan={freePlan}
                  activePlan={activePlan}
                  stripeInfo={stripe_info}
                  errorStripeInfo={stripe_info_errorMessage}
                  stripeInfoIsLoading={stripe_info_isLoading}
                />
              </Box>
            </Tabs.Panel>
          )}
        </Tabs>
        <Card fs="italic" mt="md">
          <Box>
            *
            {t(
              "channels_meaning",
              "A channel refers to any social media groups, pages, or platforms where you can share your deals list, such as WhatsApp, Facebook, and LinkedIn."
            )}
          </Box>

          <Box>
            **
            {t(
              "but_shared_link_msg",
              "The shared link for a channel remains valid as long as its expiration date has not passed."
            )}
          </Box>
          <Box mt="md">
            ***
            {t(
              "hidden_profile_msg",
              "You can hide your company profile, and only your deal list will be accessible through non-expired shared links."
            )}
          </Box>
        </Card>
        <Alert
          mt="md"
          icon={<IconAlertCircle size="1rem" />}
          title={t("please_note", "Please Note")}
          color="indigo"
        >
          <div>
            {t(
              "note1",
              "That you can upgrade your membership at any time. You can also downgrade your membership at any time;"
            )}
          </div>
          <div>
            {t(
              "note2",
              "however, the downgrade will take effect at the end of your current billing cycle."
            )}
          </div>
        </Alert>
      </Box>
    </>
  );
};

export const StripePricingTable_n = ({
  stripeInfo,
  errorStripeInfo,
  stripeInfoIsLoading,
  activePlan,
  plans_data,
}: any) => {
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const [withChat, setWithChat] = useState(false);
  const [period, setPeriod] = useState("1");
  const { t } = useTranslation("public", { keyPrefix: "plans" });
  const { error, succeed, warning } = useMessage();
  const [price_id, setPrice_id] = useState("");

  const {
    data: checkout_data,
    errorMessage,
    postError: checkout_postError,
    succeeded: checkout_succeeded,
    isLoading: checkout_isLoading,
    executePost: checkout_executePost,
  } = useAxiosPost(BUILD_API("stripe/init-checkout"), {
    price_id: price_id,
    mode: "subscription",
  });

  const plansData = plans_data?.plans?.filter(
    (plan: { period_mo: string }) => plan.period_mo == period
  );

  useEffect(() => {
    if (
      checkout_succeeded &&
      checkout_data &&
      checkout_data.checkout_url &&
      checkout_data.checkout_url != ""
    ) {
      window.open(checkout_data.checkout_url, "_self");
    }
    if (errorMessage) error(errorMessage);
  }, [checkout_succeeded, errorMessage]);
  return (
    <Box pos="relative">
      <Card withBorder mb="lg">
        <Group justify="center">
          <SegmentedControl
            w={550}
            size="md"
            color="teal"
            defaultValue="1"
            onChange={(val) => {
              setPeriod(val);
            }}
            data={[
              { label: t("monthly", "Monthly"), value: "1" },
              { label: t("every_3_month", "Every 3 months"), value: "3" },
            ]}
          />
        </Group>
      </Card>

      {period != "0" && (
        <>
          <Box pos="relative" mih={50}>
            <LoadingOverlay
              visible={checkout_isLoading}
              overlayProps={{ radius: "sm", blur: 2 }}
              opacity={0.8}
            />
            <SimpleGrid cols={small || medium ? 1 : 2} mt="lg" mb="lg">
              {plansData?.map((plan: unknown, idx: any) => {
                return (
                  <Plan
                    stripeInfo={stripeInfo}
                    errorStripeInfo={errorStripeInfo}
                    stripeInfoIsLoading={stripeInfoIsLoading}
                    data={plan}
                    activePlan={activePlan}
                    onSubscribe={(vprice_id: React.SetStateAction<string>) => {
                      setPrice_id(vprice_id);
                      checkout_executePost();
                    }}
                  />
                );
              })}
            </SimpleGrid>
          </Box>
        </>
      )}
    </Box>
  );
};
const Plan = ({
  data,
  onSubscribe,
  errorStripeInfo,
  stripeInfoIsLoading,
  activePlan,
  stripeInfo,
}: any) => {
  const { t } = useTranslation("public", { keyPrefix: "plans" });
  return (
    <Card withBorder>
      <PlanDetails data={data} t={t} />

      {!errorStripeInfo &&
        !stripeInfoIsLoading &&
        !activePlan &&
        !!onSubscribe && (
          <Center>
            <Button
              w={200}
              size="md"
              mt="md"
              onClick={() => {
                onSubscribe(data.price_id);
              }}
            >
              <Box fz="1.1rem">{t("subscribe", "Subscribe")}</Box>
            </Button>
          </Center>
        )}
      {errorStripeInfo && (
        <Button size="md" mt="md" color="orange.9" onClick={() => {}}>
          {t("call_us", "Something goes wrong,Please Call Us")}
        </Button>
      )}
      {!errorStripeInfo && activePlan && (
        <SessionPortalButton
          stripeInfo={stripeInfo}
          stripeInfoIsLoading={stripeInfoIsLoading}
          errorStripeInfo={errorStripeInfo}
          activePlan={activePlan}
        />
      )}
    </Card>
  );
};
const PlanDetails = ({ data, t }) => {
  return (
    <>
      {data && (
        <>
          <Center>
            <Title order={2} mb="0px">
              {data?.service}
            </Title>
          </Center>
          {/* <Center> */}
          <Group justify="center" gap={5} pl="50px">
            {data?.total_amount > 0 && (
              <Box fw="1000" fz="2.5rem">
                ${data?.total_amount}
              </Box>
            )}
            <Box
              fw="normal"
              fz="0.8rem"
              w={50}
              style={{ lineHeight: "1" }}
              mt={-15}
            >
              {data.period_mo == 1
                ? t("per_month", "Per month")
                : data.period_mo > 0
                ? t("every_3_month", "Every 3 months")
                : ""}
            </Box>
          </Group>
          {/* </Center> */}
          <Divider my="sm" />
          <List
            spacing="xs"
            p="md"
            icon={
              <Box c="teal">
                {" "}
                <IconCircleCheck size="1rem" />
              </Box>
            }
          >
            {data.id == "FREE" && (
              <List.Item>
                <Group gap={"4px"}>
                  {" "}
                  <Box opacity="0.75">{t("up_to", "Up to")}</Box>{" "}
                  <strong>
                    {`${data.deal_count}`} {t("deals", "Deals")}
                  </strong>{" "}
                  <Box opacity="0.75"> {t("per_day", "per day")} </Box>
                </Group>
              </List.Item>
            )}
            {data.id !== "FREE" && (
              <List.Item>
                <Group gap={"4px"}>
                  <Box opacity="0.75">{t("up_to", "Up to")}</Box>{" "}
                  <strong>
                    {`${data.deal_count}`} {t("active_deals", "Active Deals")}
                  </strong>{" "}
                  <Box opacity="0.75">{t("at_any_time", "at any time")}</Box>
                </Group>
              </List.Item>
            )}

            <List.Item>
              <Group gap={"4px"}>
                <Box opacity="0.75">{t("up_to", "Up to")}</Box>{" "}
                <strong>
                  {`${data.channel_count}`} {t("channels", "Channels")}
                </strong>{" "}
                <Box opacity="0.75">
                  {" "}
                  {t(
                    "can_be_used_to_shares",
                    "can be used to share deals per day"
                  )}{" "}
                </Box>
                <span>*</span>
              </Group>
            </List.Item>
            <List.Item>
              <Group gap={"4px"}>
                <Box opacity="0.75">{t("up_to", "Up to")}</Box>{" "}
                <strong>
                  {`${data.share_count}`} {t("shares", "Shares")}
                </strong>{" "}
                <Box opacity="0.75">{t("per_day", "per day")}</Box>{" "}
                <span>**</span>
              </Group>
            </List.Item>

            {data.nb_active_users_allowed >= 1 && (
              <List.Item>
                <Group gap={"4px"}>
                  <Box opacity="0.75">{t("up_to", "Up to")}</Box>{" "}
                  <strong>
                    {`${data.nb_active_users_allowed}`}{" "}
                    {`${
                      data.nb_active_users_allowed == 1
                        ? t("additional_user", "Additional User")
                        : t("additional_users", "Additional Users")
                    }`}{" "}
                  </strong>{" "}
                  <Box opacity="0.75">{t("per_company", "per company.")}</Box>
                </Group>
              </List.Item>
            )}
            <List.Item>
              <Group gap={"4px"}>
                <strong>
                  {`${data.dashboard_performance_days}`}{" "}
                  {t("days_analytics", "Days Analytics")}
                </strong>{" "}
                {":"}
                {t("dashboard_performance", "Dashboard Performance")}
              </Group>
            </List.Item>

            <List.Item>
              <strong>{t("auto_post", "Auto-post")}</strong>
              {":"}
              {data.id != "FREE" && (
                <span className="italic">
                  {t(
                    "deal_stays_active_until",
                    "The deal stays live unless you terminate it or your membership expires."
                  )}
                </span>
              )}
              {data.id == "FREE" && (
                <span className="italic">
                  {t(
                    "deal_expired_daily",
                    "Deals expire daily and need to be activated each day."
                  )}
                </span>
              )}
            </List.Item>
            <List.Item>
              <strong>
                {t(
                  "hidden_prfl_n_prvt_access",
                  "Hidden-profile and Private-Access ***"
                )}
              </strong>
            </List.Item>
          </List>
        </>
      )}
    </>
  );
};
const SessionPortalButton = ({
  stripeInfo,
  stripeInfoIsLoading,
  errorStripeInfo,
  activePlan,
}) => {
  const { error, succeed, warning } = useMessage();
  const {
    data: sessionportal_data,
    errorMessage,
    getError: sessionportal_getError,
    succeeded: sessionportal_succeeded,
    isLoading: sessionportal_isLoading,
    executeGet: sessionportal_executeGet,
  } = useAxiosGet(BUILD_API("stripe/init-session-portal"), {});
  const { t } = useTranslation("public", { keyPrefix: "stripe" });
  useEffect(() => {
    if (
      sessionportal_succeeded &&
      sessionportal_data &&
      sessionportal_data.session_portal_url &&
      sessionportal_data.session_portal_url != ""
    ) {
      window.open(sessionportal_data.session_portal_url, "_self");
    }
    if (errorMessage) error(errorMessage);
  }, [sessionportal_succeeded, errorMessage]);
  return (
    <>
      {!errorStripeInfo && activePlan && isOwner() && (
        <Box pos="relative">
          <LoadingOverlay
            visible={sessionportal_isLoading}
            overlayProps={{ radius: "sm", blur: 2 }}
            opacity={0.8}
          />
          <Center>
            <Button
              w={200}
              size="md"
              mt="md"
              rightSection={<IconArrowRight />}
              onClick={() => {
                sessionportal_executeGet();
              }}
            >
              <Box fz="1.1rem">{t("manage_plans", "Manage Plan")}</Box>
            </Button>
          </Center>
        </Box>
      )}
      {stripeInfoIsLoading && (
        <Box pos="relative" mih={50}>
          <LoadingOverlay
            visible={stripeInfoIsLoading}
            overlayProps={{ radius: "sm", blur: 2 }}
            opacity={0.6}
          />
          {t("retrieve_portal", "Retrieve Portal")}
        </Box>
      )}
      {!isOwner() && (
        <Alert
          title={t("warning", "Warning!")}
          color="grape"
          icon={<IconAlertCircle size="1rem" />}
        >
          {t(
            "plant_should_be_managed_by_ownr",
            "Plan should be managed by the company's owner"
          )}
        </Alert>
      )}
      {errorStripeInfo && <ErrorCallUsButton />}
    </>
  );
};

const ErrorCallUsButton = () => {
  const { t } = useTranslation("public", { keyPrefix: "stripe" });
  return (
    <Button size="md" mt="md" color="orange.9" onClick={() => {}}>
      {t("call_us", "Something goes wrong,Please Call Us")}
    </Button>
  );
};
const CurrentPlan = ({
  currentPlan,
  activePlan,
  errorStripeInfo,
  stripeInfoIsLoading,
  stripeInfo,
}) => {
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const { error, succeed, warning } = useMessage();
  const { t } = useTranslation("public", { keyPrefix: "stripe" });
  const [extraCS, setExtraCS] = useState<any>("1");
  const [showCurrent, setShowCurrent] = useState(true);
  const {
    data: checkout_data,
    errorMessage,
    postError: checkout_postError,
    succeeded: checkout_succeeded,
    isLoading: checkout_isLoading,
    executePost: checkout_executePost,
  } = useAxiosPost(BUILD_API("stripe/init-checkout"), {
    quantity: extraCS,
    mode: "payment",
  });
  const [currentPeriod, setCurrentPeriod] = useState<any>([
    { label: t("monthly", "Monthly"), value: "1" },
  ]);
  useEffect(() => {
    if (
      checkout_succeeded &&
      checkout_data &&
      checkout_data.checkout_url &&
      checkout_data.checkout_url != ""
    ) {
      window.open(checkout_data.checkout_url, "_self");
    }
    if (errorMessage) error(errorMessage);
  }, [checkout_succeeded, errorMessage]);
  useEffect(() => {
    if (currentPlan && currentPlan.period_mo == 1)
      setCurrentPeriod([{ label: t("monthly", "Monthly"), value: "1" }]);
    if (currentPlan && currentPlan.period_mo == 3)
      setCurrentPeriod([
        { label: t("every_3_month", "Every 3 months"), value: "3" },
      ]);
  }, [currentPlan]);
  return (
    <>
      <Card withBorder mb="lg">
        {currentPeriod && currentPeriod.length > 0 && (
          <SimpleGrid cols={small || medium ? 2 : 2} mt="lg" mb="lg">
            <Title order={3} c="primary">
              {currentPeriod[0].label}
            </Title>
          </SimpleGrid>
        )}
      </Card>
      <SimpleGrid cols={small || medium ? 1 : 2} mt="lg" mb="lg">
        {showCurrent && (
          <Plan
            stripeInfo={stripeInfo}
            errorStripeInfo={errorStripeInfo}
            stripeInfoIsLoading={stripeInfoIsLoading}
            data={currentPlan}
            activePlan={activePlan}
            onSubscribe={null}
          />
        )}
      </SimpleGrid>
    </>
  );
};

const FreePlan = ({
  freePlan,
  activePlan,
  errorStripeInfo,
  stripeInfoIsLoading,
  stripeInfo,
}) => {
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const { error, succeed, warning } = useMessage();
  const { t } = useTranslation("public", { keyPrefix: "stripe" });
  const [extraCS, setExtraCS] = useState<any>("1");
  const [showCurrent, setShowCurrent] = useState(true);

  return (
    <>
      <Card withBorder mb="lg">
        <SimpleGrid cols={small || medium ? 2 : 2} mt="lg" mb="lg">
          <Title order={3} c="primary">
            {t("free_plan", "Free Plan")}
          </Title>
        </SimpleGrid>
      </Card>
      <SimpleGrid cols={small || medium ? 1 : 2} mt="lg" mb="lg">
        {showCurrent && (
          <Plan
            stripeInfo={stripeInfo}
            errorStripeInfo={errorStripeInfo}
            stripeInfoIsLoading={stripeInfoIsLoading}
            data={freePlan}
            activePlan={activePlan}
            onSubscribe={null}
          />
        )}
      </SimpleGrid>
    </>
  );
};
