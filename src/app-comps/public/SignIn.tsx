import { useEffect, useState } from "react";
import {
  TextInput,
  Button,
  LoadingOverlay,
  PasswordInput,
  Notification,
  Popover,
  Progress,
} from "@mantine/core";

import { IconCheck, IconX } from "@tabler/icons-react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";

import { useTranslation } from "react-i18next";
import { useAuth } from "../../providers/AuthProvider";
import { useForm } from "@mantine/form";
import { useAxiosPost } from "../../hooks/Https";
import { BUILD_API } from "../../global/G";
import { OutResponse } from "./OutResponse";
import { getStrength, PasswordRequirement, requirements } from "./PasswordExt";

export const SignIn = () => {
  const { t } = useTranslation("public", { keyPrefix: "sign_in" });
  const { onLogin } = useAuth();
  const [values, setValues] = useState<any>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  // const [value, setValue] = useState("");
  const form = useForm({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      company_name: "",
    },

    // functions will be used to validate values at corresponding key
    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : t("invalid_email", "Invalid email"),
      password: (value) =>
        value.length < 5 ? t("invalid_password", "'Invalid Password'") : null,
    },
  });

  // const onCompleted=()=>{
  //     onLogin(data, null);
  // }
  const {
    data,
    postError,
    isLoading,
    succeeded,
    errorMessage,
    errorCode,
    executePost,
  } = useAxiosPost(BUILD_API("sign_in"), form.values);

  useEffect(() => {
    if (succeeded) {
      onLogin(data, postError);
      if (searchParams) {
        let id = searchParams.get("id");
        if (id && id != "") {
          navigate(`/app/trades/t/${id}`);
          return;
        } else {
          let co_id = searchParams.get("co_id");
          if (co_id && co_id != "") {
            navigate(`/app/trades/t?co_id=${co_id}`);
            return;
          } else {
            let hashtags_and = searchParams.get("hashtags_and");
            if (hashtags_and && hashtags_and != "") {
              hashtags_and = encodeURIComponent(hashtags_and);
              navigate(`/app/trades/t?hashtags_and=${hashtags_and}`);
              return;
            }
          }
        }
      }
      navigate(`/app`);
    }
  }, [succeeded]);

  const post = () => {
    executePost();
  };

  return (
    <div
      style={{
        width: "100%",
        position: "relative",
        padding: "5px",
      }}
    >
      {isLoading && (
        <LoadingOverlay
          visible={isLoading}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
      )}
      <OutResponse />
      <>
        <TextInput
          size="lg"
          mt="md"
          withAsterisk
          label={t("email", `Email`)}
          placeholder={t("email", `Email`)}
          {...form.getInputProps("email")}
        />

        <PasswordInput
          size="lg"
          mt="md"
          withAsterisk
          label={t("password", `Password`)}
          placeholder={t("password", `Password`)}
          {...form.getInputProps("password")}
        />
        <Button
          mt="md"
          size="lg"
          style={{ width: "175px" }}
          onClick={() => {
            post();
          }}
        >
          {t("sign_in", "Sign In")}
        </Button>
        {errorMessage && (
          <Notification
            mt="xs"
            icon={<IconX size={18} />}
            color="red"
            title={t("sign_in_error", `Sign in error!`)}
            withCloseButton={false}
          >
            {errorMessage}
          </Notification>
        )}
      </>
      {errorCode == "ACC_NOT_ACTIVATED_YET" && (
        <Button
          type="button"
          mt="md"
          size="lg"
          variant="outline"
          component={Link}
          to="/app/pub/out-email-request/verif_email"
        >
          {/* {t("Send a verification email request!.")} */}
          {t(`send_verify_email`, "Send a verification email request!.")}
        </Button>
      )}
      <p>
        <Link to="/app/pub/out-email-request/reset_pwd">
          {t(`trouble_sign_in`, "Trouble sign in?")}
        </Link>
      </p>
    </div>
  );
};
export const SendVeriOrResetPwdfEmail = () => {
  let { purpose } = useParams();
  const { t } = useTranslation("public", { keyPrefix: "sign_in" });
  const [postStamp, setPostStamp] = useState<any>(null);

  const form = useForm({
    initialValues: { email: "" },
    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : t("invalid_email", `Invalid email`),
    },
  });

  let title = "",
    url = "",
    notif_title_msg = "",
    failed_notif_title_msg = "";

  const {
    data,
    postError,
    isLoading,
    succeeded,
    errorMessage,
    errorCode,
    executePost,
  } = useAxiosPost(url, form.values);

  switch (purpose) {
    case "verif_email":
      title = t("verify_email", "Verify Email");
      url = BUILD_API("send_verif_email");
      notif_title_msg = t(
        "verif_email_sent_succ",
        `Verification email successfully sent!.`
      );
      failed_notif_title_msg = t(
        "verif_email_sent_failed",
        `Verification email sent failed!.`
      );
      break;
    case "reset_pwd":
      title = t("reset_pwd", "Reset Password");
      url = BUILD_API("send_reset_pwd_email");
      notif_title_msg = t(
        "reset_email_sent_succ",
        `Password reset email successfully sent!.`
      );
      failed_notif_title_msg = t(
        "reset_email_sent_failed",
        `Password reset email sent failed!.`
      );
      break;
    default:
      return <></>;
  }

  const post = (e: any) => {
    executePost({ url_e: url });
    // setPostStamp((new Date()).getTime())
  };
  return (
    <div
      style={{
        width: "100%",
        position: "relative",
        padding: "5px",
      }}
    >
      <LoadingOverlay
        visible={isLoading}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <h3>{title}</h3>
      {!succeeded && (
        <>
          <TextInput
            size="lg"
            mt="md"
            withAsterisk
            label={t("email", `Email`)}
            placeholder={t("email", `Email`)}
            {...form.getInputProps("email")}
          />

          <Button
            mt="md"
            size="lg"
            variant="outline"
            onClick={(e) => {
              post(e);
            }}
          >
            {t("request", "Request")}
          </Button>
        </>
      )}
      {succeeded && (
        <Notification
          icon={<IconCheck size={18} />}
          color="teal"
          title={notif_title_msg}
          withCloseButton={false}
        >
          {data["message"]}
        </Notification>
      )}
      {errorMessage && (
        <Notification
          icon={<IconX size={18} />}
          color="red"
          title={failed_notif_title_msg}
          withCloseButton={false}
        >
          {errorMessage}
        </Notification>
      )}
    </div>
  );
};

export const ResetPWD = () => {
  // const [errorMessage, setErrrorMessage] = useState<any>(null);
  const { t } = useTranslation("public", { keyPrefix: "sign_in" });
  const [searchParams, setSearchParams] = useSearchParams();
  let token = searchParams.get("token");
  const form = useForm({
    initialValues: { password: "", conf_password: "", token: token },

    validate: {
      password: (value) =>
        value.length < 5 ? t("ivalid_password", "Invalid password") : null,
      conf_password: (value) =>
        getStrength(t, form.values.password) < 100
          ? t("ivalid_password", "Invalid password")
          : null,
    },
  });
  const strength = getStrength(t, form.values.password);
  const color = strength === 100 ? "teal" : strength > 40 ? "yellow" : "red";
  const [popoverOpened, setPopoverOpened] = useState(false);
  const checks = requirements(t).map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(form.values.password)}
    />
  ));

  let {
    data,
    postError,
    isLoading,
    succeeded,
    errorMessage,
    errorCode,
    executePost,
  } = useAxiosPost(BUILD_API("reset_pwd"), form.values);

  useEffect(() => {}, [data, postError, succeeded, errorMessage]);
  const post = () => {
    form.validate();
    if (!form.isValid()) return;
    if (form.values.password != form.values.conf_password) {
      form.setErrors({
        conf_password: t("pwd_not_matched", "Password does not match!."),
      });
      return;
    }
    executePost();
  };
  return (
    <div
      style={{
        width: "100%",
        position: "relative",
        padding: "5px",
      }}
    >
      <LoadingOverlay
        visible={isLoading}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      {!succeeded && (
        <>
          <Popover
            opened={popoverOpened}
            position="bottom"
            width="target"
            transitionProps={{ transition: "pop" }}
          >
            <Popover.Target>
              <div
                onFocusCapture={() => setPopoverOpened(true)}
                onBlurCapture={() => setPopoverOpened(false)}
              >
                <PasswordInput
                  size="lg"
                  mt="md"
                  withAsterisk
                  label={t("password", "Password")}
                  placeholder={t("password", "Password")}
                  {...form.getInputProps("password")}
                  description={t(
                    "pass_must_include_xyz",
                    "Password must include at least one letter, number and special character"
                  )}
                />
              </div>
            </Popover.Target>
            <Popover.Dropdown>
              <Progress color={color} value={strength} size={5} mb="xs" />
              <PasswordRequirement
                label={t(
                  "pwd_include_atlst_6chars",
                  "Includes at least 6 characters"
                )}
                meets={form.values.password.length > 5}
              />
              {checks}
            </Popover.Dropdown>
          </Popover>

          <PasswordInput
            size="lg"
            mt="md"
            withAsterisk
            label={t("conf_password", "Confirm password")}
            placeholder={t("conf_password", "Confirm password")}
            {...form.getInputProps("conf_password")}
          />
          <div style={{ width: "0px", height: "0px", overflow: "hidden" }}>
            <PasswordInput
              size="lg"
              mt="md"
              withAsterisk
              {...form.getInputProps("token")}
            />
          </div>

          <Button
            mt="md"
            size="lg"
            onClick={() => {
              post();
            }}
          >
            {t("reset_password", "Reset password")}
          </Button>
        </>
      )}
      {succeeded && (
        <Notification
          icon={<IconCheck size={18} />}
          color="teal"
          title={t("pwd_change_succ", "Password change succeeded!.")}
          withCloseButton={false}
        >
          {data["message"]}
        </Notification>
      )}
      {errorMessage && (
        <Notification
          icon={<IconX size={18} />}
          color="red"
          title={t("pwd_change_error", "Password change error!")}
          withCloseButton={false}
        >
          {errorMessage}
        </Notification>
      )}
    </div>
  );
};
