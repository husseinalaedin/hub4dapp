import { Box, Center, Group, Stack, Textarea } from "@mantine/core";
import { Link, Outlet, useNavigate } from "react-router";

import { useTranslation } from "react-i18next";
import { useAuth } from "../../providers/AuthProvider";
import { LanguageSelect } from "../../global/Language";
import { useRef } from "react";
import { BUILD_PORTAL_URL } from "../../global/G";
import { useGlobalStyl } from "../../hooks/useTheme";
// import TextareaAutosize from "react-textarea-autosize";

const Home = () => {
  const { islogged } = useAuth();
  const { classes: classesG } = useGlobalStyl();
  const { t } = useTranslation("public");
  const navigate = useNavigate();
  return (
    <>
      <Group justify="right" m="md">
        <Box
          className={classesG.titleHref2}
          onClick={() => {
            window.location.href = BUILD_PORTAL_URL("");
          }}
        >
          {t("hub4d", "Hub4d")}
        </Box>
        {!islogged && (
          <>
            <Box
              className={classesG.titleHref2}
              onClick={() => {
                navigate("/app/pub/sign-up");
              }}
            >
              {t("sign_up0", "Sign Up")}
            </Box>
            <Box
              className={classesG.titleHref2}
              onClick={() => {
                navigate("/app/pub/sign-in");
              }}
            >
              {t("sign_in0", "Sign In")}
            </Box>
          </>
        )}
        {islogged && (
          <>
            <Box
              c="red"
              className={classesG.titleHref2}
              onClick={() => {
                navigate("/app/sign-out");
              }}
            >
              {t("sign_out0", "Sign Out")}
            </Box>
            <Box
               
              className={classesG.titleHref2}
              onClick={() => {
                navigate("/app");
              }}
            >
              {t("go_to_app", "Go To App")}
            </Box>
          </>
        )}
      </Group>
      <Center>
        <Box w={'100%'} maw={600} p="xs">
        <h1>{t(`welcome_to_hub4d_app`, "Welcome To HUB4D App")}</h1>
          <Outlet />
        </Box>
        
      </Center>
      
      {/* <Stack>
        <h1>{t(`welcome_to_hub4d`, "Welcome To HUB4D")}</h1>

        <ul>
          <li>
            <Link to={BUILD_PORTAL_URL("")}>{t("home", "Home")}</Link>
          </li>
          {!islogged ? (
            <li>
              <Link to="/app/pub/sign-up">{t("sign_up0", "Sign Up")}</Link>
            </li>
          ) : null}
          {!islogged ? (
            <li>
              <Link to="/app/pub/sign-in">{t("sign_in0", "Sign In")}</Link>
            </li>
          ) : null}
          {islogged ? (
            <>
              <li>
                <Link to="/app/sign-out">
                  <Box c="red">{t("sign_out0", "Sign Out")}</Box>
                </Link>
              </li>
              <li>
                <Link to="/app">{t("go_to_app", "Go To App")}</Link>
              </li>
            </>
          ) : null}
        </ul>
       
      </Stack> */}
    </>
  );
};
export default Home;
const Home2 = () => {
  return <>{"Home is here Mantine"}</>;
};
// export default Home2;
