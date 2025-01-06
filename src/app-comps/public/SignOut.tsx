import { Box, Title } from "@mantine/core"
import { useAxiosPost } from "../../hooks/Https";
import { BUILD_API, BUILD_PORTAL_URL, useMessage } from "../../global/G";
import { useEffect } from "react";
import { useAuth } from "../../providers/AuthProvider";
import { useGlobalStyl } from "../../hooks/useTheme";

export const SignOut = () => {

    const { classes: classesG } = useGlobalStyl()
    const { error, succeed, warning } = useMessage();
    const { onLogout, islogged } = useAuth();
    const { data, postError, isLoading, succeeded, errorMessage, errorCode, executePost } = useAxiosPost(BUILD_API('sign_out'), {});
    useEffect(() => {
        if (!islogged)
            return
        executePost()
    }, [])
    useEffect(() => {
        let errorMsg = errorMessage
        if (errorMsg)
            error(errorMsg)
        if (succeeded)
            onLogout();
    }, [succeeded, errorMessage])
    return (
      <Box>
        {!islogged && (
          <Box>
            <Title>You’ve successfully logged out!</Title>
            <Box>Thank you for visiting. We hope to see you again soon!</Box>

            <Box mt="lg">
              If you’d like to log back in, click{" "}
              <a href="../pub/sign-in" className={classesG.titleHref2}>
                here
              </a>{" "}
              or visit the{" "}
              <a href={BUILD_PORTAL_URL('back')} className={classesG.titleHref2}>
                Hub4D
              </a>{" "}
              portal .
            </Box>

            <Box>Have a great day!</Box>
          </Box>
        )}
      </Box>
    );
}