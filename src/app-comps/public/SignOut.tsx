import { Box, Title } from "@mantine/core"
import { useAxiosPost } from "../../hooks/Https";
import { BUILD_API, BUILD_PORTAL_URL, useMessage } from "../../global/G";
import { useEffect } from "react";
import { useAuth } from "../../providers/AuthProvider";
import { useGlobalStyl } from "../../hooks/useTheme";
import { AppHeader } from "../private/app-admin/AppHeader";
import { useNavigate } from "react-router";

export const SignOut = () => {

    const { classes: classesG } = useGlobalStyl()
    const { error, succeed, warning } = useMessage();
    const { onLogout, islogged } = useAuth();
    const navigate = useNavigate();
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
        <AppHeader title={''}>
        {/* <Group justify="right" gap="xs">
          <Button
            variant="default"
            onClick={(val) => {
              executeGet();
            }}
          >
            <IconRefresh />
          </Button>
        </Group> */}
      </AppHeader>
        {!islogged && (
          <Box>
            <Title>You’ve successfully logged out!</Title>
            <Box>Thank you for visiting. We hope to see you again soon!</Box>

            <Box mt="lg">
              If you’d like to log back in, click{" "}
              <a href="../app/pub/sign-in" className={classesG.titleHref2}>
                here
              </a>{" "}
              or visit the{" "}
              {/* <a href={BUILD_PORTAL_URL('')} className={classesG.titleHref2}>
                Hub4D
              </a>{" "} */}
              <span
              className={classesG.titleHref2}
              onClick={() => {
                // setShowSiteLinks(true);
                // navigate(
                //   BUILD_PORTAL_URL('')
                // );
                window.location.href = BUILD_PORTAL_URL('');

              }}
              >Hub4D</span> {" "}portal .
            </Box>

            <Box>Have a great day!</Box>
          </Box>
        )}
      </Box>
    );
}