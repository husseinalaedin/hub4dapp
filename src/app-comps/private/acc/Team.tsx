import {
  ActionIcon,
  Alert,
  Button,
  LoadingOverlay,
  Overlay,
  Menu,
  TextInput,
  useMantineTheme,
  Tabs,
  Group,
  Box,
  Grid,
  Title,
  Text,
  Stack,
  Paper,
} from "@mantine/core";
import { useForm } from "@mantine/form";

import {
  IconCircleCheck,
  IconAlertCircle,
  IconPassword,
  IconUserExclamation,
  IconUserCheck,
  IconPlus,
  IconUserX,
  IconRefresh,
  IconDots,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { BUILD_API, useMessage } from "../../../global/G";
import { useGlobalStyl } from "../../../hooks/useTheme";
import { useAxiosGet, useAxiosPost } from "../../../hooks/Https";
import {
  selectMedium,
  selectSmall,
} from "../../../store/features/ScreenStatus";
import { AppHeader } from "../app-admin/AppHeader";

export const Team = () => {
  const dispatch = useDispatch();

  const { error, succeed } = useMessage();
  const { t } = useTranslation("private", { keyPrefix: "user_profile" });
  const [teamTitle, setTeamTitle] = useState(t("team_title_team", "Team"));
  const { classes: classesG } = useGlobalStyl();

  const [team, setTeam] = useState<any>([]);
  const [addTeam, setAddTeam] = useState(false);
  const [email, setEmail] = useState(false);
  const [action, setAction] = useState("");
  const [userToDisplay, setUserToDisplay] = useState<any>("users");
  // let userToDisplay='users';
  const { data, getError, errorMessage, succeeded, isLoading, executeGet } =
    useAxiosGet(BUILD_API("team"), null);
  let {
    data: dataAction,
    isLoading: isLoadingAction,
    succeeded: succeededAction,
    errorMessage: errorMessageAction,
    executePost: executePostAction,
  } = useAxiosPost(BUILD_API("send_team_member_reset_pwd_email"), {
    email: email,
  });
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);

  useEffect(() => {
    executeGet();
  }, []);
  useEffect(() => {
    if (succeeded && data) {
      setTeam(data[userToDisplay]);
    }
    if (errorMessage) error(errorMessage);
  }, [succeeded, errorMessage]);
  const actionGo = (actionToDo, email) => {
    setEmail(email);
    setAction(actionToDo);

    let url = "";
    switch (actionToDo) {
      case "RESEND_INV_EMAIL":
        url = BUILD_API("re_send_team_member_invitation_email");
        break;
      case "ACTIVATE":
        url = BUILD_API("activate_team_member");
        break;
      case "DE_ACTIVATE":
        url = BUILD_API("deactivate_team_member");
        break;
      case "DELETE_MMBR_ON_HOLD":
        url = BUILD_API("delete_member_on_hold");
        break;
    }
    if (url != "") executePostAction({ url_e: url });
  };

  useEffect(() => {
    // G.delay(errorMessageAction)
    if (succeededAction) {
      succeed(dataAction.message);
      // showNotification({
      //     id: 'notify_succ' + (new Date()).getTime().toString(),
      //     autoClose: G.delay(dataAction.message),
      //     title: t('post_succ', 'Succeeded!.'),
      //     message: dataAction.message,
      //     color: theme_2.primaryColor,
      //     icon: <IconCheck />,
      //     loading: false,
      // });
      executeGet();
    }
    if (errorMessageAction) error(errorMessageAction);
    // showNotification({
    //     id: 'notify_failed' + (new Date()).getTime().toString(),
    //     autoClose: G.delay(errorMessageAction),
    //     title: t('post_failed', 'Failed!.'),
    //     message: errorMessageAction,
    //     color: "red",
    //     icon: <IconX />,
    //     loading: false
    // });
  }, [succeededAction, errorMessageAction]); //, succeededActivate, errorMessageActivate, succeededDeActivate, errorMessageDeActivate])
  useEffect(() => {
    if (addTeam) setTeamTitle(t("team_title_new_mmbr", "New Team Member"));
    else setTeamTitle(t("team_title_team", "Company Team"));
  }, [addTeam]);
  const changeUserToDisplay = (val) => {
    if (!data) {
      setTeam([]);
    }
    setUserToDisplay(val);

    setTeam(data[val]);
  };
  const teamAdded = (teamData) => {
    changeUserToDisplay("users_on_hold");
    setAddTeam(false);
    executeGet();
  };
  const refresh = () => {
    executeGet();
  };
  return (
    <>
      {(isLoadingAction || isLoading) && (
        <Overlay opacity={1} color="#000" zIndex={5} />
      )}
      {(isLoadingAction || isLoading) && (
        <LoadingOverlay
          visible={isLoading}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
      )}

      <AppHeader title={teamTitle}>
        <Group mt="xs" justify="right" gap="xs">
          <Button
            variant="default"
            onClick={(val) => {
              refresh();
            }}
          >
            <IconRefresh />
          </Button>
          <Button
            variant="filled"
            onClick={(val) => {
              setAddTeam(true);
            }}
          >
            <IconPlus />
          </Button>
        </Group>
      </AppHeader>
      {!addTeam && (
        <Box style={{ width: "100%" }}>
          <Tabs
            defaultValue="users"
            onChange={(val) => {
              changeUserToDisplay(val);
              // setUserToDisplay(val)
              setAddTeam(false);
            }}
            style={{ marginBottom: 10 }}
          >
            <Tabs.List>
              <Tabs.Tab
                value="users"
                leftSection={
                  <IconUserCheck size={25} className={classesG.primaryColor} />
                }
              >
                {/* {t('users', 'Users')} */}
                <Title size="h2" style={{ marginRight: 10 }}>
                  {t("users", "Users")}
                </Title>
              </Tabs.Tab>
              <Tabs.Tab
                value="users_on_hold"
                leftSection={<IconUserExclamation size={25} />}
              >
                {/* {t('users_on_hold', 'Users to be')} */}
                <Title size="h2" style={{ marginRight: 10 }}>
                  {" "}
                  {t("users_on_hold", "Users On Hold")}{" "}
                </Title>
              </Tabs.Tab>
            </Tabs.List>
          </Tabs>
          {team?.map((element, index) => {
            return (
              <Paper
                key={element.email}
                p={small ? 15 : medium ? 25 : 35}
                className={classesG.paper}
                style={{
                  paddingRight: 45,
                  marginTop: index == 0 ? 50 : 0,
                  width: "100%",
                  marginBottom: small ? 10 : medium ? 20 : 30,
                  position: "relative",
                }}
              >
                <Grid gutter="md">
                  <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                    <Text>{element.email}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                    <Text>
                      {element.first_name}, {element.last_name}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <Stack>
                      {userToDisplay == "users_on_hold" && (
                        <Alert
                          p={10}
                          radius="md"
                          variant="outline"
                          title=""
                          color="gray"
                        >
                          {t("email_status", "Email Status")}:
                          {element.email_process_status}
                        </Alert>
                      )}
                      <Box>
                        {element.verified == "X" && (
                          <Alert
                            p={10}
                            radius="md"
                            variant="outline"
                            icon={<IconCircleCheck size={34} stroke={1.5} />}
                            title=""
                            color="teal"
                          >
                            {t("email_verified", "Email Verified")}
                          </Alert>
                        )}
                        {element.verified != "X" && (
                          <Alert
                            p={10}
                            radius="md"
                            variant="outline"
                            icon={<IconAlertCircle size={34} stroke={1.5} />}
                            title=""
                            color="red"
                          >
                            {t("email_not_verified", "Email Not Verified")}
                          </Alert>
                        )}
                      </Box>
                      <Box>
                        {element.active == "X" && (
                          <Alert
                            p={10}
                            radius="md"
                            variant="light"
                            icon={<IconCircleCheck size={34} stroke={1.5} />}
                            title=""
                            color="teal"
                          >
                            {t("acc_active", "Activated")}
                          </Alert>
                        )}
                        {element.active != "X" && (
                          <Alert
                            p={10}
                            radius="md"
                            variant="light"
                            icon={<IconAlertCircle size={34} stroke={1.5} />}
                            title=""
                            color="red"
                          >
                            {t("acc_not_active", "Not Activated")}
                          </Alert>
                        )}
                      </Box>
                    </Stack>
                  </Grid.Col>
                </Grid>

                <Box
                  style={{
                    width: 20,
                    position: "absolute",
                    marginLeft: 5,
                    right: 15,
                    top: 5,
                  }}
                >
                  <Menu shadow="md" width={250}>
                    <Menu.Target>
                      <ActionIcon
                        loading={element.email == email && isLoadingAction}
                        size="md"
                        variant="subtle"
                      >
                        <IconDots size={25} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      {element.on_hold == "X" && (
                        <Menu.Item
                          leftSection={<IconPassword size={20} stroke={1.5} />}
                          onClick={() =>
                            actionGo("RESEND_INV_EMAIL", element.email)
                          }
                        >
                          {t(
                            "resend_invitation_email",
                            "Resend Invitation Email"
                          )}
                        </Menu.Item>
                      )}
                      {element.on_hold == "X" && (
                        <Menu.Item
                          leftSection={<IconUserX size={20} stroke={1.5} />}
                          onClick={() =>
                            actionGo("DELETE_MMBR_ON_HOLD", element.email)
                          }
                        >
                          {t("delete_on_hold_user", "Delete Member")}
                        </Menu.Item>
                      )}
                      {element.active != "X" && (
                        <Menu.Item
                          leftSection={
                            <IconCircleCheck size={20} stroke={1.5} />
                          }
                          onClick={() => actionGo("ACTIVATE", element.email)}
                        >
                          {t("activate_acc", "Activate Account")}
                        </Menu.Item>
                      )}
                      {element.active == "X" && (
                        <Menu.Item
                          leftSection={
                            <IconAlertCircle size={20} stroke={1.5} />
                          }
                          onClick={() => actionGo("DE_ACTIVATE", element.email)}
                        >
                          {t("de_activate_acc", "Deactivate Account")}
                        </Menu.Item>
                      )}
                    </Menu.Dropdown>
                  </Menu>
                </Box>
              </Paper>
            );
          })}
        </Box>
      )}
      {addTeam && (
        <AddTeamMember
          onSucceed={teamAdded}
          onCanceled={() => {
            setAddTeam(false);
          }}
        />
      )}
    </>
  );
};

const AddTeamMember = ({ onSucceed, onCanceled }) => {
  const { error, succeed } = useMessage();
  const theme_2 = useMantineTheme();
  const { t } = useTranslation("private", { keyPrefix: "user_profile" });
  const form: any = useForm({
    initialValues: { first_name: "", last_name: "", email: "" },

    // functions will be used to validate values at corresponding key
    validate: {
      first_name: (value) =>
        value.length < 2
          ? t(
              "first_name_at_least_2chars",
              "First Name must have at least 2 letters"
            )
          : null,
      last_name: (value) =>
        value.length < 2
          ? t(
              "last_name_at_least_2chars",
              "Last Name must have at least 2 letters"
            )
          : null,
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : t("invalid_eamil", "Invalid email"),
    },
  });
  let {
    data,
    postError,
    isLoading,
    succeeded,
    errorMessage,
    errorCode,
    executePost,
  } = useAxiosPost(BUILD_API("add_team_member"), form.values);
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  useEffect(() => {
    form.setValues([]);
  }, []);
  useEffect(() => {
    if (succeeded) {
      succeed(data.message);
      // showNotification({
      //     id: 'notify_succ' + (new Date()).getTime().toString(),
      //     autoClose: G.delay(data.message),
      //     title: t('post_succ', 'Succeeded!.'),
      //     message: data.message,
      //     color: theme_2.primaryColor,
      //     icon: <IconCheck />,
      //     loading: false,
      // });
    }
    if (errorMessage) error(errorMessage);
    // showNotification({
    //     id: 'notify_failed' + (new Date()).getTime().toString(),
    //     autoClose: G.delay(errorMessage),
    //     title: t('post_failed', 'Failed!.'),
    //     message: errorMessage,
    //     color: "red",
    //     icon: <IconX />,
    //     loading: false
    // });
    if (succeeded && onSucceed) {
      onSucceed(form.values);
    }
  }, [data, postError, succeeded, errorMessage]);
  const deal = (e: any) => {
    e.preventDefault();
    form.validate();
    if (!form.isValid()) return;
    executePost();
  };
  return (
    <>
      <LoadingOverlay
        visible={isLoading}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      {!succeeded && (
        <form onSubmit={deal}>
          <Grid gutter={5} pb={small ? 20 : medium ? 30 : 40}>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Title size="h2" style={{ marginRight: 10 }}>
                {t("personal_information", "Personal Information")}{" "}
              </Title>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 9 }}>
              <Grid gutter={small ? 5 : medium ? 10 : 15}>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    withAsterisk
                    autoComplete="off"
                    label={t("first_name", "First Name")}
                    placeholder={t("first_name", "First Name")}
                    {...form.getInputProps("first_name")}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    withAsterisk
                    autoComplete="off"
                    label={t("last_name", "Last Name")}
                    placeholder={t("last_name", "Last Name")}
                    {...form.getInputProps("last_name")}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12}}>
                  <TextInput
                    withAsterisk
                    autoComplete="off"
                    label={t("email", "Email")}
                    placeholder={t("email", "Email")}
                    {...form.getInputProps("email")}
                  />
                </Grid.Col>
              </Grid>
            </Grid.Col>
          </Grid>
          <Group justify="right">
            <Button
              type="button"
              variant="default"
              style={{ width: 100 }}
              onClick={() => {
                if (onCanceled) onCanceled();
              }}
            >
              {t("cancel", "Cancel")}
            </Button>
            <Button type="submit" style={{ width: 100 }}>
              {t("add", "Add")}
            </Button>
          </Group>
        </form>
      )}
    </>
  );
};
