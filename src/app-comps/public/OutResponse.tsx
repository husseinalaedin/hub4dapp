import { LoadingOverlay, Notification } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams, useSearchParams } from "react-router";
import { BUILD_API } from "../../global/G";
import { useAxiosPost } from "../../hooks/Https";
import { useAuth } from "../../providers/AuthProvider";

import { ResetPWD } from "./SignIn";
import { SignUp } from "./SignUp";
export const OutResponse = () => {
  const { onLogout } = useAuth();
  const { t } = useTranslation("public");
  let { purpose } = useParams();
  // useEffect(()=>{
  //     if (purpose == 'join-team'){
  //         onLogout()
  //     }
  // }, [purpose])
  return (
    <div
      style={{
        width: "100%",
        margin: "auto",
        position: "relative",
        // marginTop: "50px",
        padding: "5px",
      }}
    >
      {purpose == "verify-email" && <VerifyEmail />}
      {purpose == "reset-pwd" && <ResetPWD />}
      {purpose == "join-team" && <SignUp />}
    </div>
  );
};

export const VerifyEmail = () => {
  const { t } = useTranslation("public");

  const [searchParams, setSearchParams] = useSearchParams();
  let token = searchParams.get("token");

  const {
    data,
    postError,
    isLoading,
    succeeded,
    errorMessage,
    errorCode,
    executePost,
  } = useAxiosPost(BUILD_API("verify_email"), {
    token: token,
  });

  useEffect(() => {
    executePost();
  }, []);

  useEffect(() => {}, [succeeded]);

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

      {succeeded && (
        <Notification
          icon={<IconCheck size={18} />}
          color="teal"
          title={t("email_verif_succ", "Email verification succeeded!.")}
          withCloseButton={false}
        >
          {data["message"]}
        </Notification>
      )}
      {succeeded && (
        <p>
          <Link to="/sign-in">{t(`go_n_sign_in`, "Sign in")}</Link>
        </p>
      )}
      {errorMessage && (
        <Notification
          icon={<IconX size={18} />}
          color="red"
          title={t("email_verif_error", "Email verification failed!")}
          withCloseButton={false}
        >
          {errorMessage}
        </Notification>
      )}
    </div>
  );
};
