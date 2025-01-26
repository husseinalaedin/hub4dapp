import { Box, Stack, Textarea } from "@mantine/core";
import { Link, Outlet } from "react-router";

import { useTranslation } from "react-i18next";
import { useAuth } from "../../providers/AuthProvider";
import { LanguageSelect } from "../../global/Language";
import { useRef } from "react";

const Home = () => {
  const { islogged } = useAuth();

  const { t } = useTranslation("public");
const textareaRef:any = useRef(null);

const handleChange = (event) => {
  const textarea = textareaRef.current;
  if (textarea) {
    textarea.style.height = "auto"; // Reset height
    textarea.style.height = `${textarea.scrollHeight}px`; // Adjust height
    
  }
};
  return (
    <>
      <Stack>
        <Textarea
          ref={textareaRef}
          placeholder="Autosize with no rows limit"
          minRows={5}
          maxRows={20}
          onChange={handleChange}
        />
        <h1>{t(`welcome`, "Welcome")}</h1>
        <h1>Home Screen</h1>
        <LanguageSelect />
        <ul>
          <li>
            <Link to="/pub">{t("home", "Home")}</Link>
          </li>
          {!islogged ? (
            <li>
              <Link to="/pub/sign-up">{t("sign_up0", "Sign Up")}</Link>
            </li>
          ) : null}
          {!islogged ? (
            <li>
              <Link to="/pub/sign-in">{t("sign_in0", "Sign In")}</Link>
            </li>
          ) : null}
          {islogged ? (
            <>
              <li>
                <Link to="/pub/sign-out">
                  <Box c="red">{t("sign_out0", "Sign Out")}</Box>
                </Link>
              </li>
              <li>
                <Link to="/app">{t("go_to_app", "Go To App")}</Link>
              </li>
            </>
          ) : null}
        </ul>
        <Outlet />
      </Stack>
    </>
  );
};
export default Home;
const Home2 = () => {
  return <>{"Home is here Mantine"}</>;
};
// export default Home2;
