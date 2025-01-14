import "@mantine/core/styles.css";
// import { MantineProvider } from "@mantine/core";
// import { theme } from "./theme";

// export default function App() {
//   return <MantineProvider theme={theme}>App</MantineProvider>;
// }

import { AppThemeProvider } from "./hooks/useAppTheme";
import { AuthProvider } from "./providers/AuthProvider";
import { ModalsProvider } from "@mantine/modals";
import { AppGlobalStylProvider } from "./hooks/useTheme";

// import { AppRoutes } from "./global/AppRoutes";
// import { BrowserRouter } from "react-router";
import React from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { I18nextProvider } from "react-i18next";

import { AppRoutes } from "./global/AppRoutes";
import i18n from "./locales/I18next";
import { HeaderNdSideProvider } from "./hooks/useAppHeaderNdSide";
import { BrowserRouter } from "react-router";

export default function AppMain() {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <AppThemeProvider>
            <AuthProvider>
              <AppGlobalStylProvider>
                <ModalsProvider>
                  <HeaderNdSideProvider>
                    {/* <BrowserRouter> */}
                    <AppRoutes />
                    {/* </BrowserRouter> */}
                  </HeaderNdSideProvider>
                </ModalsProvider>
              </AppGlobalStylProvider>
            </AuthProvider>
          </AppThemeProvider>
        </I18nextProvider>
      </Provider>
    </React.StrictMode>
  );
}
