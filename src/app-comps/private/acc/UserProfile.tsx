import { useEffect, useState } from "react";
import {
  TextInput,
  Button,
  LoadingOverlay,
  Paper,
  Group,
  useMantineTheme,
  Chip,
  Menu,
  Modal,
  Box,
  UnstyledButton,
  Text,
  Grid,
  Alert,
  type UnstyledButtonProps,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { createStyles } from "@mantine/emotion";

import { IconCheck, IconChevronRight, IconX } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import { showNotification } from "@mantine/notifications";

import { useMediaQuery } from "@mantine/hooks";

import "react-phone-number-input/style.css";
import Input from "react-phone-number-input/input";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { BUILD_API, useMessage } from "../../../global/G";
import {
  selectMedium,
  selectSmall,
} from "../../../store/features/ScreenStatus";
import { useCountryCode } from "../../../global/CountrySelect";
import { useAxiosGet, useAxiosPost } from "../../../hooks/Https";
import { changeActive } from "../../../store/features/ActiveNav";
import { AppHeader } from "../app-admin/AppHeader";
import { EditSave } from "../../../global/EditSave";
import { useGlobalStyl } from "../../../hooks/useTheme";

const useStyles2 = createStyles((theme, _, u) => ({
  wrapper: {
    [u.dark]: {
      backgroundColor: theme.colors.dark[9],
      border: `1px solid ${theme.colors.dark[8]}`,
    },
    [u.light]: {
      backgroundColor: theme.white,
      border: `1px solid ${theme.colors.gray[2]}`,
    },
    borderRadius: theme.radius.lg,
    padding: 4,
  },
  phoneCountryCode: {
    cursor: "pointer",
    [u.dark]: {
      backgroundColor: theme.colors.dark[9],
    },
    [u.light]: {
      backgroundColor: theme.colors.gray[2],
    },
  },
  initials: {
    width: "45px",
    height: "45px",
    borderRadius: "50%", // creates the circle shape
    [u.dark]: {
      backgroundColor: theme.colors.teal[9],
    },
    [u.light]: {
      backgroundColor: theme.colors.indigo[8],
    },
    display: "flex",
    alignItems: "center",
    justifyContent: "center", // positions the text in the middle
    fontSize: "20px",
    fontWeight: "bold",
    color: "white",
  },
}));
export const UserProfile = () => {
  const { classes: classesG } = useGlobalStyl();
  const { error, succeed, warning } = useMessage();
  const dispatch = useDispatch();

  const theme_2 = useMantineTheme();
  const [popoverOpened, setPopoverOpened] = useState(false);

  const [cellValue, setCellValue] = useState("");
  const [tellValue, setTellValue] = useState("");

  let { countryCode, country }: any = useCountryCode();
  // const [country, setCountry] = useState()

  const { t } = useTranslation("private", { keyPrefix: "user_profile" });
  // const { t: tcomon } = useTranslation('common', { keyPrefix: 'tool' });
  // const [refresh, setRefresh] = useState<any>(null);
  const [cancelEdit, setCancelEdit] = useState(1);
  const [edit, setEdit] = useState(false);
  const { classes } = useStyles2();
  // const [visible, setVisible] = useState(false);
  const {
    data,
    getError,
    succeeded: get_succeeded,
    isLoading,
    executeGet,
  } = useAxiosGet(BUILD_API("profile"), null);
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);

  const form = useForm({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      tell: "",
      cell: "",
      cell_verified: "",
    },

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
      cell: (value) =>
        !value || value == ""
          ? t("invalid_phone", "Cell pnone number required")
          : null,
    },
  });
  let {
    data: post_data,
    postError,
    isLoading: post_isLoading,
    succeeded: post_succeeded,
    errorMessage,
    errorCode,
    executePost,
  } = useAxiosPost(BUILD_API("profile"), form.values);
  let {
    data: verify_data,
    isLoading: verify_post_isLoading,
    succeeded: verify_post_succeeded,
    errorMessage: verify_errorMessage,
    executePost: executVerifyPost,
  } = useAxiosPost(BUILD_API("send_sms_veirifcation_code"), {
    phone_number_to_verify: form.values.cell,
  });
  useEffect(() => {
    dispatch(changeActive("NONE"));
  }, []);
  useEffect(() => {
    executeGet();
  }, []);
  useEffect(() => {
    if (!data) return;

    form.setValues(data);
  }, [get_succeeded, getError]);
  useEffect(() => {
    if (!data) return;
  }, [cancelEdit]);

  const save = () => {
    // e.preventDefault();
    if (!form.isDirty()) {
      warning(t("no_change", "No data got changed!."));
      return;
    }
    form.validate();
    if (!form.isValid()) return;
    executePost();
  };
  useEffect(() => {
    console.log("too many ++", post_succeeded, errorMessage);
    if (post_succeeded) {
      succeed(post_data["message"]);
      form.resetDirty();
    }

    if (errorMessage) error(errorMessage);
  }, [post_succeeded, errorMessage]);
  const verifyPhone = () => {
    executVerifyPost();
  };
  useEffect(() => {
    if (verify_errorMessage) error(verify_errorMessage);
  }, [verify_errorMessage]);
  return (
    <>
      <AppHeader title={t("user_profile", "User Profile")}>
        <EditSave
          setEditCompletedFromPrarent={post_succeeded}
          initEdit={false}
          onSave={(e) => {
            save();
          }}
          onEdit={(e) => {
            setEdit(e);
          }}
        />
      </AppHeader>
      <Box className={classesG.editMax800}>
        <LoadingOverlay
          visible={isLoading || post_isLoading}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <VerifyPhoneCode
          openModeal={verify_post_succeeded}
          onSucceeeded={() => {
            form.values.cell_verified = "X";
          }}
        />
        <form>
          <Grid gutter={small ? 5 : medium ? 10 : 15}>
            <Grid.Col span={{ base: 12 }}>
              <TextInput
                readOnly={true}
                disabled={true}
                withAsterisk
                label={t("email", "Email")}
                placeholder={t("email", "Email")}
                {...form.getInputProps("email")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                readOnly={!edit}
                withAsterisk
                label={t("first_name", "First Name")}
                placeholder={t("first_name", "First Name")}
                {...form.getInputProps("first_name")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                readOnly={!edit}
                withAsterisk
                label={t("last_name", "Last Name")}
                placeholder={t("last_name", "Last Name")}
                {...form.getInputProps("last_name")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Menu
                width={200}
                position="bottom-start"
                returnFocus={true}
                disabled={
                  !edit || (!!form.values.cell && form.values.cell != "")
                }
              >
                <Menu.Target>
                  <Input
                    readOnly={!edit}
                    withAsterisk
                    autoComplete="off"
                    inputComponent={TextInput}
                    placeholder={t(
                      "cell_p",
                      "Please enter Cell Phone with country area code"
                    )}
                    label={t("cell_p_label", "Cell Phone")}
                    // value={cellValue}
                    {...form.getInputProps("cell")}
                    rightSectionWidth={100}
                    rightSection={
                      <>
                        {form.values.cell_verified == "" && (
                          <Button size="sm" onClick={verifyPhone}>
                            {t("VERIFY_PHONE", "Verify")}
                          </Button>
                        )}
                        {form.values.cell_verified == "X" && (
                          <Chip size="sm" checked radius="md">
                            {t("VERIFIED", "Verified")}
                          </Chip>
                        )}
                      </>
                    }
                    onFocusCapture={() => setPopoverOpened(true)}
                    onBlurCapture={() => setPopoverOpened(false)}
                  />
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    onClick={() => {
                      form.setValues({ cell: countryCode });
                    }}
                  >
                    {" "}
                    {t("are_code", "Area code found:") +
                      `${country} - ${countryCode}`}
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Grid.Col>
            {!(small || medium) && (
              <Grid.Col span={{ base: 12, md: 6 }}></Grid.Col>
            )}
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Menu
                width={200}
                position="bottom-start"
                returnFocus={true}
                disabled={
                  !edit || (!!form.values.tell && form.values.tell != "")
                }
              >
                <Menu.Target>
                  <Input
                    readOnly={!edit}
                    autoComplete="off"
                    inputComponent={TextInput}
                    placeholder={t(
                      "tell_p",
                      "Please enter Phone with country area code"
                    )}
                    label={t("tell_p_label", "Phone")}
                    // value={tellValue}
                    // onChange={setTellValue}
                    {...form.getInputProps("tell")}
                  />
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    onClick={() => {
                      form.setValues({ tell: countryCode });
                    }}
                  >
                    {" "}
                    {t("are_code", "Area code found:") +
                      `${country} - ${countryCode}`}
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Grid.Col>
          </Grid>
        </form>
      </Box>
      <Alert mt="lg">
        <Text fz="md">
          {t(
            "cel_phone_whastapp_msg",
            "Kindly be advised that your cell number is presumed to have a WhatsApp account and will display the WhatsApp link for message transmission."
          )}
        </Text>
      </Alert>
    </>
  );
};
const VerifyPhoneCode = ({ openModeal, onSucceeeded }) => {
  const theme_2 = useMantineTheme();
  const { t } = useTranslation("private", { keyPrefix: "user_profile" });
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [opened, setOpened] = useState(false);
  const [code, setCode] = useState("");
  let {
    data: data,
    postError,
    isLoading: post_isLoading,
    succeeded,
    errorMessage,
    errorCode,
    executePost,
  } = useAxiosPost(BUILD_API("verify_phone"), { code: code });

  useEffect(() => {
    if (openModeal) setOpened(true);
  }, [openModeal]);

  // useEffect(() => {
  //     executePost()
  // }, [])
  useEffect(() => {
    if (!data) return;
  }, [succeeded, errorMessage]);

  const send = (e: any) => {
    if (code != "") executePost();
  };
  useEffect(() => {
    if (succeeded) {
      if (onSucceeeded) {
        onSucceeeded();
      }
      showNotification({
        id: "notify_send_verif_succ",
        // disallowClose: true,
        autoClose: 5000,
        title: t("succ", "Succeeded!."),
        message: data["message"],
        color: theme_2.primaryColor,
        icon: <IconCheck />,
        loading: false,
      });
      setOpened(false);
    }

    if (errorMessage)
      showNotification({
        id: "notify_send_verif_failed",
        // disallowClose: true,
        autoClose: 5000,
        title: t("failed", "Failed!."),
        message: errorMessage,
        color: "red", // theme_2.colors.red[9],
        icon: <IconX />,
        loading: false,
      });
  }, [errorMessage, succeeded]);
  return (
    <>
      <Modal
        closeButtonProps={{ "aria-label": t("close", "Close") }}
        withCloseButton={true}
        fullScreen={isMobile}
        opened={opened}
        onClose={() => {
          setOpened(false);
          setCode("");
        }}
        title={t(
          "enter_sms_code",
          "Enter the SMS code sent to your mobile phone..."
        )}
      >
        <TextInput
          label={t("sms_code", "SMS code")}
          placeholder={t("enter_sms_code", "Please enter the SMS code")}
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
          }}
        />

        <Group justify="right" mt="md">
          <Button
            type="button"
            variant="default"
            radius="xs"
            ta="right"
            onClick={() => {
              setOpened(false);
            }}
          >
            {t("cancel", "Cancel")}
          </Button>

          <Button type="submit" onClick={send}>
            {t("send", "Send")}
          </Button>
        </Group>
      </Modal>
    </>
  );
};

interface UserButtonProps extends UnstyledButtonProps {
  initials: string;
  image: string;
  name: string;
  company: string;
  icon?: React.ReactNode;
}

export function UseProfileMenu({
  initials,
  image,
  name,
  company,
  icon,
  ...others
}: UserButtonProps) {
  const { classes } = useGlobalStyl();

  return (
    <Box className={classes.user}>
      <UnstyledButton style={{ height: "100%", width: "100%" }} {...others}>
        <Group gap={0}>
          {/* <Avatar src={image} radius="xl" /> */}
          <InitialsCircle initials={initials} color="#3498db" />
          <div style={{ flex: 1 }}>
            <Text
              size="xs"
              fw={700}
              style={{
                textAlign: "center",
                textOverflow: "ellipsis",
                height: 30,
                lineHeight: 2,
                overflow: "hidden",
                maxWidth: 130,
              }}
            >
              {company}
            </Text>

            <Text
              size="xs"
              mt="-10px"
              style={{
                textAlign: "center",
                textOverflow: "ellipsis",
                height: 30,
                lineHeight: 2,
                overflow: "hidden",
                maxWidth: 130,
              }}
            >
              {name}
            </Text>
          </div>
          {<IconChevronRight size={20} stroke={1.5} />}
        </Group>
      </UnstyledButton>
    </Box>
  );
}

const InitialsCircle = ({ initials, color }) => {
  const { classes } = useStyles2();

  return <Box className={classes.initials}>{initials}</Box>;
};
