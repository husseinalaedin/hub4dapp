import { useEffect, useState } from "react";
import {
  TextInput,
  Button,
  LoadingOverlay,
  PasswordInput,
  Notification,
} from "@mantine/core";
import { useForm } from "@mantine/form";

import { IconCheck, IconX } from "@tabler/icons-react";

import { useTranslation } from "react-i18next";
import { useParams, useSearchParams } from "react-router";
import { showNotification } from "@mantine/notifications";
import { useAxiosGet, useAxiosPost } from "../../hooks/Https";
import { BUILD_API, G } from "../../global/G";

export const SignUp = () => {
  let [signUpValues, setSignUpValues] = useState<any>(null);
  let { purpose } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  let token = searchParams.get("token");
  const [memberToJoinTeam, setMemberToJoinTeam] = useState<boolean>(() => {
    return purpose == "join-team";
  });
  const {
    data: team_company_data,
    getError,
    succeeded: team_company_succeeded,
    errorMessage: team_company_errorMessage,
    isLoading: team_company_isLoading,
    executeGet,
  } = useAxiosGet(BUILD_API("team_member_response_to_verif_email"), {
    token: token,
  });
  const { t } = useTranslation("public", { keyPrefix: "sign_up" });
  const form = useForm({
    initialValues: {
      company_name: "",
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },

    // functions will be used to validate values at corresponding key
    validate: {
      company_name: (value) =>
        value.length < 2
          ? t("co_at_least_2chars", "Company Name must have at least 2 letters")
          : null,
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
      password: (value) =>
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
  } = useAxiosPost(BUILD_API("sign_up"), signUpValues);

  useEffect(() => {
    if (purpose == "join-team") {
      executeGet();
    }
  }, [purpose]);
  useEffect(() => {
    if (team_company_succeeded) {
      form.setValues(team_company_data);
    }

    if (team_company_errorMessage)
      showNotification({
        id: "notify_failed",
        // disallowClose: true,
        autoClose: G.delay(team_company_errorMessage),
        title: t("post_failed", "Failed!."),
        message: team_company_errorMessage,
        color: "red", // theme_2.colors.red[9],
        icon: <IconX />,
        loading: false,
      });
  }, [team_company_succeeded, team_company_errorMessage]);
  const post = (e: any) => {
    let url = "";
    e.preventDefault();
    form.validate();
    if (!form.isValid()) return;
    if (!memberToJoinTeam) {
      setSignUpValues(form.values);
      url = BUILD_API("sign_up");
    } else {
      setSignUpValues({
        password: form.values.password,
        token: token,
      });
      url = BUILD_API("sign_up_as_team_member");
    }
    executePost({ url_e: url });
  };
  return (
    <div
      style={{
        width: "100%",
        // margin: "auto",
        position: "relative",
        // marginTop: "50px",
        padding: "5px",
      }}
    >
      <LoadingOverlay
        visible={isLoading}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      {!succeeded && (
        <form onSubmit={post}>
          <TextInput
            disabled={memberToJoinTeam}
            size="lg"
            mt="md"
            withAsterisk
            label={t("co_name", "Company Name")}
            placeholder={t("co_name", "Company Name")}
            {...form.getInputProps("company_name")}
          />
          <TextInput
            disabled={memberToJoinTeam}
            size="lg"
            mt="md"
            withAsterisk
            label={t("first_name", "First Name")}
            placeholder={t("first_name", "First Name")}
            {...form.getInputProps("first_name")}
          />
          <TextInput
            disabled={memberToJoinTeam}
            size="lg"
            mt="md"
            withAsterisk
            label={t("last_name", "Last Name")}
            placeholder={t("last_name", "Last Name")}
            {...form.getInputProps("last_name")}
          />
          <TextInput
            disabled={memberToJoinTeam}
            size="lg"
            mt="md"
            withAsterisk
            label={t("email", "Email")}
            placeholder={t("email", "Email")}
            {...form.getInputProps("email")}
          />
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

          <Button type="submit" mt="md" size="lg" style={{ width: "175px" }}>
            {t("sign_up", "Sign Up")}
          </Button>
        </form>
      )}
      {succeeded && (
        <Notification
          icon={<IconCheck size={18} />}
          color="teal"
          title={t("sign_up_succ", "Sign up succeeded!.")}
          withCloseButton={false}
        >
          {data.message}
        </Notification>
      )}
      {errorMessage && (
        <Notification
          icon={<IconX size={18} />}
          color="red"
          title={t("sign_up_error", "Sign up error!")}
          withCloseButton={false}
        >
          {errorMessage}
        </Notification>
      )}
    </div>
  );
};
