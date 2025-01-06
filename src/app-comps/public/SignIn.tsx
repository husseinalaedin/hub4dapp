import { useEffect, useState } from "react";
import {
  TextInput,
  Button,
  LoadingOverlay,
  PasswordInput,
  Notification,
} from "@mantine/core";

import { IconCheck, IconX } from "@tabler/icons-react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";

import { useTranslation } from "react-i18next";
import { useAuth } from "../../providers/AuthProvider";
import { useForm } from "@mantine/form";
import { useAxiosPost } from "../../hooks/Https";
import { BUILD_API } from "../../global/G";
import { OutResponse } from "./OutResponse";

export const SignIn = () => {
  const { t } = useTranslation("public", { keyPrefix: "sign_in" });
  const { onLogin } = useAuth();
  const [values, setValues] = useState<any>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

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
        if (id && id != "") navigate(`/app/trades/t/${id}`);
        else {
          let co_id = searchParams.get("co_id");
          if (co_id && co_id != "") navigate(`/app/trades/t?co_id=${co_id}`);
          else {
            let hashtags_and = searchParams.get("hashtags_and");
            if (hashtags_and && hashtags_and != "") {
              hashtags_and = encodeURIComponent(hashtags_and);
              navigate(`/app/trades/t?hashtags_and=${hashtags_and}`);
            }
          }
        }
      }
    }
  }, [succeeded]);

  const post = (e: any) => {
    e.preventDefault();
    executePost();
  };

  return (
    <div
      style={{
        width: "100%",
        margin: "auto",
        position: "relative",
        marginTop: "50px",
        padding: "5px",
      }}
    >
      <LoadingOverlay
        visible={isLoading}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <OutResponse />
      <form onSubmit={post}>
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
        <Button type="submit" mt="md" size="lg" style={{ width: "175px" }}>
          {t("sign_in", "Sign In")}
        </Button>
        {errorMessage && (
          <Notification
            icon={<IconX size={18} />}
            color="red"
            title={t("sign_in_error", `Sign in error!`)}
            withCloseButton={false}
          >
            {errorMessage}
          </Notification>
        )}
      </form>
      {errorCode == "ACC_NOT_ACTIVATED_YET" && (
        <Button
          type="button"
          mt="md"
          size="lg"
          variant="outline"
          component={Link}
          to="/out-email-request/verif_email"
        >
          {/* {t("Send a verification email request!.")} */}
          {t(`send_verify_email`, "Send a verification email request!.")}
        </Button>
      )}
      <p>
        <Link to="/out-email-request/reset_pwd">
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

  let url = "",
    title = "",
    title_failed = "";
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
      url = BUILD_API("send_verif_email");
      title = t(
        "verif_email_sent_succ",
        `Verification email successfully sent!.`
      );
      title_failed = t(
        "verif_email_sent_failed",
        `Verification email sent failed!.`
      );
      break;
    case "reset_pwd":
      url = BUILD_API("send_reset_pwd_email");
      title = t(
        "reset_email_sent_succ",
        `Password reset email successfully sent!.`
      );
      title_failed = t(
        "reset_email_sent_failed",
        `Password reset email sent failed!.`
      );
      break;
    default:
      return <></>;
  }

  const post = (e: any) => {
    e.preventDefault();
    executePost();
    // setPostStamp((new Date()).getTime())
  };
  return (
    <div
      style={{
        width: "100%",
        margin: "auto",
        position: "relative",
        marginTop: "50px",
        padding: "5px",
      }}
    >
      <LoadingOverlay
        visible={isLoading}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <form onSubmit={post}>
        <TextInput
          size="lg"
          mt="md"
          withAsterisk
          label={t("email", `Email`)}
          placeholder={t("email", `Email`)}
          {...form.getInputProps("email")}
        />

        <Button type="submit" mt="md" size="lg" variant="outline">
          {t("request", "Request")}
        </Button>
      </form>
      {succeeded && (
        <Notification
          icon={<IconCheck size={18} />}
          color="teal"
          title={title}
          withCloseButton={false}
        >
          {data["message"]}
        </Notification>
      )}
      {errorMessage && (
        <Notification
          icon={<IconX size={18} />}
          color="red"
          title={title_failed}
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

    // functions will be used to validate values at corresponding key
    validate: {
      password: (value) =>
        value.length < 5 ? t("ivalid_password", "Invalid password") : null,
      conf_password: (value) =>
        value.length < 5 ? t("ivalid_password", "Invalid password") : null,
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
  } = useAxiosPost(BUILD_API("reset_pwd"), form.values);

  useEffect(() => {}, [data, postError, succeeded, errorMessage]);
  const post = (e: any) => {
    e.preventDefault();
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
        width: "500px",
        margin: "auto",
        position: "relative",
        marginTop: "50px",
        padding: "5px",
      }}
    >
      <LoadingOverlay
        visible={isLoading}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      {!succeeded && (
        <form onSubmit={post}>
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

          <Button type="submit" mt="md" size="lg">
            {t("reset_password", "Reset password")}
          </Button>
        </form>
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
