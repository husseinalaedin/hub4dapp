import {
  
  MantineProvider,
  useMantineColorScheme,
} from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { Notifications } from "@mantine/notifications";
import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initTheme, setSettingLocal } from "../global/Misc";
import {
  close,
  screenBreaks,
  selectLarge,
  selectMedium,
  selectSmall,
  selectxLarger,
  update_large,
  update_medium,
  update_small,
  update_xlarge,
  update_xlarger,
} from "../store/features/ScreenStatus";
import { BUILD_API, useMessage } from "../global/G";
import { useAxiosPost } from "./Https";
import { useAuth } from "../providers/AuthProvider";
import { MantineEmotionProvider } from "@mantine/emotion";

export const ThemeContext = createContext<any>(null);
export const useAppTheme = () => {
  return useContext(ThemeContext);
};

export const AppThemeProvider = ({ children }:any) => {
    
  // const { islogged } = useAuth()
  const [theme, setTheme] = useState<string>(() => {
    let initThm=initTheme();
    // if (initThm=='dark' || initThm=='dim')
    //     setColorScheme('dark')
    //   else
    //     setColorScheme(initThm);
       return initThm;
  });
  // const { error, succeed, warning } = useMessage();
  // let { data: post_data, isLoading: post_isLoading, succeeded: post_succeeded, errorMessage, executePost } = useAxiosPost(BUILD_API('settings'), { key: 'THEME', value: theme });

  let smallScreeen = screenBreaks.small;
  let mediumScreeen = screenBreaks.medium;
  let largeScreeen = screenBreaks.large;
  let xlargeScreeen = screenBreaks.xlarge;
  const { width } = useViewportSize();
  const dispatch = useDispatch();
  useEffect(() => {
    if (width <= 0) return;
    let is_small = width <= smallScreeen;
    let is_medium = width > smallScreeen && width <= mediumScreeen;
    let is_larg = width > mediumScreeen && width <= largeScreeen;
    let is_xlarg = width > largeScreeen && width <= xlargeScreeen;
    let is_xlargr = width > xlargeScreeen;
    dispatch(update_small(is_small));
    dispatch(update_medium(is_medium));
    dispatch(update_large(is_larg));
    dispatch(update_xlarge(is_xlarg));
    dispatch(update_xlarger(is_xlargr));
    if (is_small) dispatch(close());
  }, [width]);

  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const large = useSelector(selectLarge);
  // const isDesktop = !isMobile && !isTablet;

  const updateTheme = (new_theme:any) => {
    setSettingLocal("theme", new_theme);
    setTheme(new_theme);
   
  };
  const toggleTheme = () => {
    switch (theme) {
      case "light":
        updateTheme("dark");
        break;
      case "dark":
        updateTheme("dim");
        break;
      default:
        updateTheme("light");
    }
  };

  const value = {
    theme,
    updateTheme: updateTheme,
    toggleTheme: toggleTheme,
  };
  // useEffect(() => {
  //     if (post_succeeded) {
  //         succeed(post_data['message'])
  //     }

  //     if (errorMessage)
  //         error(errorMessage)
  // }, [post_succeeded, errorMessage])
  const xs = "0.7rem",
    sm = "0.75rem",
    md = "0.9rem",
    lg = "1rem",
    xl = "1.2rem";
  let headingSizes = {
    h1: { fontSize: "1.6rem" },
    h2: { fontSize: "1.4rem" },
    h3: { fontSize: "1.2rem" },
    h4: { fontSize: "1rem" },
    h5: { fontSize: "0.8rem" },
    h6: { fontSize: "0.6rem" },
  };
  let default_size_text_input = {
    size: "md",
    mt: "0",
  };
  let default_size_text_calendar = {
    size: "md",
    mt: "0",
  };
  let default_size_switch = {
    size: "md",
    mt: "0",
  };
  let default_size_text = {
    size: "md",
  };
  let default_size_number_input = {
    size: "md",
    mt: "0",
  };
  let default_size_text_area = {
    size: "md",
    mt: "0",
  };
  let default_size_select = {
    size: "md",
    mt: "0",
  };
  let default_size_btn = {
    size: "md",
    fz: "sm",
  };
  let default_size_spoiler = {
    size: "md",
    mt: "0",
  };

  if (medium) {
    // headingSizes = {
    //     h1: { fontSize: 18 },
    //     h2: { fontSize: 16 },
    //     h3: { fontSize: 14 },
    //     h4: { fontSize: 12 },
    //     h5: { fontSize: 10 },
    //     h6: { fontSize: 8 },
    // }
    default_size_text_input = {
      size: "md",
      mt: "0",
    };
    default_size_text_calendar = {
      size: "md",
      mt: "0",
    };
    default_size_switch = {
      size: "md",
      mt: "0",
    };

    default_size_text = {
      size: "md",
    };
    default_size_number_input = {
      size: "md",
      mt: "0",
    };
    default_size_text_area = {
      size: "md",
      mt: "0",
    };
    default_size_select = {
      size: "md",
      mt: "0",
    };
    default_size_btn = {
      size: "md",
      fz: "sm",
    };
    default_size_spoiler = {
      size: "md",
      mt: "0",
    };
  }
  if (small) {
    // headingSizes = {
    //     h1: { fontSize: 18 },
    //     h2: { fontSize: 16 },
    //     h3: { fontSize: 14 },
    //     h4: { fontSize: 12 },
    //     h5: { fontSize: 10 },
    //     h6: { fontSize: 8 },
    // }
    default_size_text_input = {
      size: "sm",
      mt: "0",
    };
    default_size_text_calendar = {
      size: "sm",
      mt: "0",
    };
    default_size_switch = {
      size: "sm",
      mt: "0",
    };
    default_size_text = {
      size: "sm",
    };
    default_size_number_input = {
      size: "sm",
      mt: "0",
    };
    default_size_text_area = {
      size: "sm",
      mt: "0",
    };
    default_size_select = {
      size: "sm",
      mt: "0",
    };
    default_size_btn = {
      size: "sm",
      fz: "sm",
    };
    default_size_spoiler = {
      size: "sm",
      mt: "0",
    };
  }
  let components = {
    TextInput: {
      defaultProps: default_size_text_input,
    },
    DatePickerInput: {
      defaultProps: default_size_text_calendar,
    },
    Text: {
      defaultProps: {
        default_size_text,
      },
    },
    Switch: {
      defaultProps: default_size_switch,
    },
    NumberInput: {
      defaultProps: default_size_number_input,
    },
    Textarea: { defaultProps: default_size_text_area },
    Button: {
      defaultProps: default_size_btn,
    },
    Select: {
      defaultProps: default_size_select,
    },
    MultiSelect: {
      defaultProps: default_size_select,
    },
    Table: {
      defaultProps: {
        verticalSpacing: "md",
      },
    },
    Spoiler: {
      defaultProps: default_size_spoiler,
    },
  };
  // export const screenBreaks = {
  //     small: 800,
  //     medium: 1100,
  //     large: 1101
  // }
  return (
    <ThemeContext.Provider value={value}>
      <MantineProvider 
        theme={{
          // globalStyles: (theme) => ({
          //   body: {
          //     backgroundColor:
          //       theme.colorScheme === "dark"
          //         ? theme.colors.dark[7]
          //         : theme.fn.darken(theme.colors.gray[0], 0.01),
          //   },
          // }),

          breakpoints: {
            xs: "375px",
            sm: screenBreaks.small+'px',
            md: screenBreaks.medium+"px",
            lg: screenBreaks.large+"px",
            xl:screenBreaks.xlarge+ "px",
          },
          fontFamily: "Lato, Arial, Verdana, sans-serif",
          // fontFamily: "Helvetica, Arial, sans-serif",
          fontFamilyMonospace: "Monaco, Courier, monospace",
          components: components,
          // loader: "bars",
          // colorScheme: theme == "dark" || theme == "dim" ? "dark" : "light",
          primaryColor: theme == "dark" || theme == "dim" ? "teal" : "indigo",
          fontSizes: {
            xs: xs,
            sm: sm,
            md: md,
            lg: lg,
            xl: xl,
          },
          headings: {
            // properties for all headings
            // fontFamily: 'Arial',
            fontFamily: "Helvetica, Arial, sans-serif",
            // fontFamilyMonospace: 'Monaco, Courier, monospace',
            fontWeight: "700",
            // fontFamily: 'Publico',

            // properties for individual headings, all of them are optional
            sizes: headingSizes,
          },
          colors: {
            dark:
              theme == "dim"
                ? [
                    "#d5d7e0",
                    "#acaebf",
                    "#8c8fa3",
                    "#666980",
                    "#4d4f66",
                    "#34354a",
                    "#2b2c3d",
                    "#1d1e30",
                    "#0c0d21",
                    "#01010a",
                  ]
                : [
                    "#C1C2C5",
                    "#A6A7AB",
                    "#909296",
                    "#5C5F66",
                    "#373A40",
                    "#2C2E33",
                    "#25262B",
                    "#1A1B1E",
                    "#141517",
                    "#101113",
                  ],
          },
        }}
        // withGlobalStyles
        // withNormalizeCSS
      >
        <AppNotifications />
        <MantineEmotionProvider> {children}</MantineEmotionProvider>
      </MantineProvider>
    </ThemeContext.Provider>
  );
};

export const AppNotifications = () => {
  return <Notifications position="bottom-left" zIndex={2077} limit={5} />;
};
