import {
  Box,
  darken,
  lighten,
  LoadingOverlay,
  SegmentedControl,
} from "@mantine/core";

import { IconBrightnessUp, IconMoon2, IconMoon } from "@tabler/icons-react";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAxiosPost } from "./Https";
import { useAppTheme } from "./useAppTheme";
import { useAuth } from "../providers/AuthProvider";

import {
  selectLarge,
  selectMedium,
  selectRestrictWidthLargeScreen,
  selectSmall,
  selectxLarger,
} from "../store/features/ScreenStatus";
import { BUILD_API, useMessage } from "../global/G";
import { createStyles } from "@mantine/emotion";
import { useMantineColorScheme } from "@mantine/core";

export const themesList = [
  {
    name: "Light",
    theme: "light",
    icon: IconBrightnessUp,
    active: false,
  },
  {
    name: "Dim",
    theme: "dim",
    icon: IconMoon2,
    active: true,
  },
  {
    name: "Dark",
    theme: "dark",
    icon: IconMoon,
    active: false,
  },
];
export const ActiveTheme = () => {
  for (let i = 0; i < themesList.length; i++) {
    if (themesList[i].active) return themesList[i].icon;
  }
  return IconBrightnessUp;
};
export const ActiveTheme2 = () => {
  for (let i = 0; i < themesList.length; i++) {
    if (themesList[i].active) return themesList[i].theme;
  }
  return "";
};
export const UseThemeSave = () => {
  const { islogged } = useAuth();
  let { theme } = useAppTheme();
  const { error, succeed } = useMessage();
  let {
    data: post_data,
    isLoading,
    succeeded: post_succeeded,
    errorMessage,
    executePost,
  } = useAxiosPost(BUILD_API("settings"), { key: "THEME", value: theme });
  const postTheme = () => {
    if (islogged) executePost();
  };
  useEffect(() => {
    if (post_succeeded) {
      succeed(post_data["message"]);
    }

    if (errorMessage) error(errorMessage);
  }, [post_succeeded, errorMessage]);
  return { postTheme, isLoading };
};
export const Themes = () => {
  let { theme } = useAppTheme();
  let { postTheme, isLoading } = UseThemeSave();
  // const [colorScheme, setColorScheme] = useState<any>("light");
  let { setColorScheme } = useMantineColorScheme();
  //  if (new_theme == "dark" || new_theme == "dim") setColorScheme("dark");
  //  else setColorScheme(new_theme);
  // const { error, succeed, warning } = useMessage();
  // let { data: post_data, isLoading: post_isLoading, succeeded: post_succeeded, errorMessage, executePost } = useAxiosPost(BUILD_API('settings'), { key: 'THEME', value: theme });

  // const toggleColorScheme = (new_theme:any) => {
  //   setColorScheme(new_theme);
  // };

  let { updateTheme } = useAppTheme();
  const setThem_ = (new_theme: any) => {
    if (new_theme == "dark" || new_theme == "dim") setColorScheme("dark");
    else setColorScheme(new_theme);
    themesList.map((them) => {
      if (them.theme != new_theme) them.active = false;
      else them.active = true;
    });

    updateTheme(new_theme);
    postTheme();
  };
  // useEffect(() => {
  //     if (post_succeeded) {
  //         succeed(post_data['message'])
  //     }

  //     if (errorMessage)
  //         error(errorMessage)
  // }, [post_succeeded, errorMessage])
  return (
    <Box pos="relative">
      <LoadingOverlay
        visible={isLoading}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <SegmentedControl
        size="md"
        transitionDuration={0}
        value={theme}
        onChange={(value) => {
          setThem_(value);
          // toggleColorScheme(value);
        }}
        data={[
          { label: themesList[0].name, value: themesList[0].theme },
          { label: themesList[1].name, value: themesList[1].theme },
          { label: themesList[2].name, value: themesList[2].theme },
        ]}
      />
    </Box>
  );
};

const GlobalStyleContext = React.createContext<any>({});

export const useGlobalStyl = () => {
  return useContext(GlobalStyleContext);
};
export const AppGlobalStylProvider = ({ children }: any) => {
  let { colorScheme } = useMantineColorScheme();
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const large = useSelector(selectLarge);
  const xlarger = useSelector(selectxLarger);
  const restrictWidthLargeScreen = useSelector(selectRestrictWidthLargeScreen);
  let classes0 = createStyles((theme: any): any => {
    return {
      mainHeader: {
        backgroundColor:
          colorScheme === "dark"
            ? darken(theme.colors.dark[7], 0.5)
            : lighten(theme.colors.gray[1], 0.5),
      },
      SmallTitle: {
        backgroundColor:
          colorScheme === "dark"
            ? darken(theme.colors.dark[7], 0.5)
            : lighten(theme.colors.gray[1], 0.5),
        // borderBottom: `3px solid ${
        //   colorScheme === "dark" ? theme.colors.gray[7] : theme.colors.gray[6]
        // }`,
        borderRadius: "10px",
        "*": { fontSize: "1rem" },
      },
      navTop: {
        backgroundColor:
          colorScheme === "dark"
            ? darken(theme.colors.dark[7], 0.1)
            : theme.colors.gray[9],
      },
      navLeft: {
        backgroundColor:
          colorScheme === "dark"
            ? darken(theme.colors.dark[7], 0.1)
            : darken(theme.colors.gray[1], 0.01),
      },
      subHeader: {
        backgroundColor:
          colorScheme === "dark"
            ? darken(theme.colors.dark[7], 0.3)
            : darken(theme.colors.gray[0], 0.01),
        border: `1px solid ${
          colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[5]
        }`,
      },
      navTopBorder: {
        borderBottom: `1px solid ${
          colorScheme === "dark" ? theme.colors.gray[7] : theme.colors.gray[6]
        }`,
        position: "absolute",
        left: 4,
        right: 4,
        bottom: 0,
      },
      titleForSmall: {
        backgroundColor:
          colorScheme === "dark"
            ? theme.colors.dark[9]
            : darken(theme.colors.gray[0], 0.1),
      },
      searchHandle: {},
      linkHover: {
        backgroundColor:
          colorScheme === "dark"
            ? darken(theme.colors.dark[7], 0.5)
            : theme.white,
        "&:hover": {
          backgroundColor: `${
            colorScheme === "dark"
              ? darken(theme.colors.dark[7], 0.9)
              : darken(theme.white, 0.02)
          } !important`,
        },
      },
      cardHover: {
        backgroundColor: `${
          colorScheme === "dark"
            ? darken(theme.colors.dark[6], 0.5)
            : darken(theme.white, 0.08)
        } `,
      },
      cardSelected: {
        backgroundColor: `${
          colorScheme === "dark"
            ? darken(theme.colors.dark[6], 0.6)
            : darken(theme.white, 0.09)
        } `,
      },
      cardRenew: {
        backgroundColor: `${
          colorScheme === "dark"
            ? darken(theme.colors.teal[9], 0.9)
            : lighten(theme.colors.teal[6], 0.9)
        }  !important`,
      },
      cardTerminate: {
        backgroundColor: `${
          colorScheme === "dark"
            ? darken(theme.colors.red[8], 0.8)
            : lighten(theme.colors.red[6], 0.9)
        }  !important`,
      },
      inputT: {
        position: "absolute",
        padding: "0px",
        paddingLeft: "2px",
        paddingRight: "2px",
        backgroundColor: `${
          colorScheme === "dark"
            ? darken(theme.colors.green[9], 0.9)
            : lighten(theme.colors.green[1], 0.9)
        }  !important`,
        border: "1px solid blue",
        height: "20px !important",
        fontSize: "8px" /* Adjust the font size if needed */,
        lineHeight: "18px !important",
      },
      editingExcelCell: {
        backgroundColor: `${
          colorScheme === "dark"
            ? darken(theme.colors.green[9], 0.9)
            : lighten(theme.colors.green[1], 0.9)
        }  !important`,
        border: `1px solid ${
          colorScheme === "dark" ? theme.colors.teal[5] : theme.colors.indigo[9]
        }  !important`,
      },
      excelCellcollapsed: {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
      excelRowEditMode: {
        backgroundColor: `${
          colorScheme === "dark"
            ? darken(theme.colors.teal[9], 1)
            : lighten(theme.colors.green[7], 0.9)
        }  !important`,
      },
      excelContainerFullScreen: {
        position: "fixed",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        zIndex: 100000000000000,
        backgroundColor: `${
          colorScheme === "dark" ? theme.colors.dark[7] : "white"
        }  !important`,
      },
      excelHeaderToolFullScreen: {
        position: "fixed",
        top: "0",
        left: "0",
        right: "0",
        height: "40px",
        zIndex: 100000000000001,
        backgroundColor: `${
          colorScheme === "dark" ? theme.colors.dark[7] : "white"
        }  !important`,
      },
      excelTableContainerFullScreen: {
        position: "fixed",
        top: "40px",
        left: "0",
        right: "0",
        bottom: "0",
        zIndex: 100000000000002,
        overflow: "auto",
      },
      excelTableHeaderFullScreen: {
        position: "sticky",
        top: "0px", // Adjust offset based on the header height
        backgroundColor: "black",
      },
      width75: {
        width: "75px !important",
      },
      readioRoot: {},
      //     white-space: nowrap;
      // overflow: hidden;
      // text-overflow: ellipsis;

      actionSides: {
        backgroundColor: `${
          colorScheme === "dark"
            ? darken(theme.colors.dark[9], 0.9)
            : lighten(theme.colors.gray[1], 0.9)
        }  !important`,
      },
      tableRenew: {
        td: {
          backgroundColor: `${
            colorScheme === "dark"
              ? darken(theme.colors.teal[9], 0.9)
              : lighten(theme.colors.teal[6], 0.9)
          }  !important`,
        },
      },
      tableTerminate: {
        td: {
          backgroundColor: `${
            colorScheme === "dark"
              ? darken(theme.colors.red[8], 0.8)
              : lighten(theme.colors.red[6], 0.9)
          }  !important`,
        },
      },
      expired_in: {
        color: `${
          colorScheme === "dark" ? theme.white : theme.black
        }  !important`,
        opacity: `${colorScheme === "dark" ? 0.6 : 0.8}  !important`,
        fontWeight: `normal`,
      },
      renewIcon: {
        opacity: 0.4,
        "&:hover": {
          color: `${
            colorScheme === "dark" ? theme.colors.teal[8] : theme.colors.teal[8]
          }  !important`,
          opacity: 1,
        },
      },
      terminateIcon: {
        opacity: 0.4,
        "&:hover": {
          color: `${
            colorScheme === "dark" ? theme.colors.red[8] : theme.colors.red[8]
          }  !important`,
          opacity: 1,
        },
      },
      reportCoIcon: {
        opacity: 0.4,
        cursor: "pointer",
        "&:hover": {
          color: `${theme.colors.red[5]}  !important`,
          opacity: 1,
        },
      },
      table: {
        border: `1px solid ${
          colorScheme === "dark" ? theme.colors.gray[7] : theme.colors.gray[4]
        }`,
        td: {
          backgroundColor:
            colorScheme === "dark"
              ? darken(theme.colors.dark[7], 0.05)
              : theme.white,
        },

        "tr:hover": {
          td: {
            backgroundColor: `${
              colorScheme === "dark"
                ? darken(theme.colors.dark[7], 0.9)
                : darken(theme.colors.gray[0], 0.09)
            } !important`,
          },
        },
        "tbody tr:nth-of-type(even)": {
          td: {
            backgroundColor:
              colorScheme === "dark"
                ? darken(theme.colors.dark[7], 0.4)
                : lighten(theme.colors.gray[0], 0.2),
          },
        },
        "thead tr": {
          th: {
            backgroundColor:
              colorScheme === "dark"
                ? darken(theme.colors.dark[7], 0.4)
                : lighten(theme.colors.gray[2], 0.1),
          },
        },
      },
      tableTradeItem: {
        td: { padding: "5px !important" },
        border: `1px solid ${
          colorScheme === "dark" ? theme.colors.gray[7] : theme.colors.gray[4]
        }`,
        "thead tr": {
          th: {
            backgroundColor:
              colorScheme === "dark"
                ? darken(theme.colors.dark[7], 0.4)
                : lighten(theme.colors.gray[5], 0.1),
          },
        },
      },
      tableTradeItemHover1: {
        td: {
          backgroundColor: `${
            colorScheme === "dark"
              ? darken(theme.colors.dark[7], 0.9)
              : darken(theme.colors.gray[0], 0.1)
          } !important`,
        },
      },
      tableTradeItemSelected: {
        td: {
          backgroundColor: `${
            colorScheme === "dark"
              ? darken(theme.colors.dark[7], 1)
              : lighten(theme.colors.gray[5], 0.5)
          } !important`,
        },
      },
      tableTrNoBorder: {
        td: {},
      },
      tableTrBottomBorder: {
        td: {
          borderBottom: `1px solid ${
            colorScheme === "dark" ? theme.colors.gray[7] : theme.colors.gray[4]
          }`,
        },
      },
      tableTrNoBottomBorder: {
        td: {
          borderBottom: `1px solid transparent`,
        },
      },
      tableTdBottomBorder: {
        borderBottom: `1px solid ${
          colorScheme === "dark" ? theme.colors.gray[7] : theme.colors.gray[4]
        } !important`,
      },
      tableTradeItemEven: {
        td: {
          backgroundColor:
            colorScheme === "dark"
              ? darken(theme.colors.dark[7], 0.4)
              : lighten(theme.colors.gray[0], 0.2),
        },
      },
      tableTradeItemOdd: {
        td: {
          td: {
            backgroundColor:
              colorScheme === "dark"
                ? darken(theme.colors.dark[6], 0.4)
                : lighten(theme.colors.gray[0], 0.5),
          },
        },
      },

      tableBk1: {
        backgroundColor: `${
          colorScheme === "dark"
            ? darken(theme.colors.dark[7], 0.7)
            : darken(theme.colors.gray[0], 0.04)
        } !important`,
      },
      tableBk2: {
        backgroundColor: `${
          colorScheme === "dark"
            ? darken(theme.colors.dark[7], 0.2)
            : darken(theme.colors.gray[0], 0.03)
        } !important`,
      },
      tableBk3: {
        backgroundColor: `${
          colorScheme === "dark"
            ? darken(theme.colors.dark[9], 10)
            : darken(theme.colors.gray[0], 0.03)
        } !important`,
      },
      help: {
        cursor: "help",
      },
      mainBody: {
        marginTop: small ? 0 : medium ? 15 : 20,
        padding: `${small ? "10px" : medium ? "20px" : "30px"} !important`,
        paddingTop: `${small ? "0px" : medium ? "15px" : "20px"} !important`, //small ? 0 : medium ? 15 : 20,
        maxWidth: restrictWidthLargeScreen ? 1100 : "100%",
        width: "100%",
      },
      mainBodyTradeNavig: {
        marginTop: 0,
        padding: `0px !important`,
        width: "100%",
      },
      mainBodyTradeNavigHeader: {
        maxWidth: 800,
        marginTop: 0,
        padding: `0px !important`,
        width: "100%",
      },
      cmpanyTrade: {
        backgroundColor: `${
          colorScheme === "dark"
            ? darken(theme.colors.dark[8], 0.2) //
            : darken(theme.colors.gray[0], 0.03)
        } !important`,
        borderBottom: "1px solid gray",
      },
      cmpanyTradeBody: {
        backgroundColor: `${
          colorScheme === "dark"
            ? theme.colors.dark[8] //
            : darken(theme.colors.gray[0], 0.03)
        } !important`,
        borderBottom: "1px solid gray",
      },
      cmpanyTradeUser: {
        backgroundColor: `${
          colorScheme === "dark"
            ? darken(theme.colors.dark[7], 0.1) //
            : darken(theme.colors.gray[0], 0.03)
        } !important`,
      },
      cmpanyTradePadding: {
        padding: `${small ? "10px" : medium ? "20px" : "30px"} !important`,
      },
      cmpanyTradeLeftRigthPadding: {
        paddingLeft: `${small ? "10px" : medium ? "20px" : "30px"} !important`,
        paddingRight: `${small ? "10px" : medium ? "20px" : "30px"} !important`,
      },
      cmpanyTradeSep: {
        borderTop: `1px solid ${
          colorScheme === "dark"
            ? theme.colors.orange[4]
            : theme.colors.orange[4]
        } `,
      },
      mainBodyTrade: {
        marginTop: 0,
        padding: `${small ? "10px" : medium ? "20px" : "30px"} !important`,
        paddingTop: `2px !important`,
        maxWidth: restrictWidthLargeScreen ? 1100 : "100%",
        width: "100%",
      },
      rightMainBody: {
        display: xlarger && restrictWidthLargeScreen ? "" : "none",
        maxWidth: restrictWidthLargeScreen
          ? "calc(100% - 1100px - 40px)"
          : "100%",
      },
      textAsLabel: {
        fontWeight: 500,
        fontSize: small ? theme.fontSizes.sm : theme.fontSizes.md,
      },
      user: {
        height: "100%", //small || medium ? "55px" : "65px",
        width: "100%",
        // borderRight: `1px solid ${
        //   colorScheme === "dark"
        //     ? theme.colors.orange[8]
        //     : theme.colors.gray[9]
        // }`,
        padding: 16,
        paddingTop: 5,
        paddingBottom: 5,
      },
      userBorder: {
        borderRight: `1px solid ${
          colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[1]
        }`,
      },
      fontNotes: {
        fontWeight: 500,
        fontSize: small ? 8 : medium ? 10 : 12,
      },
      primaryColor: {
        color:
          colorScheme == "dark" ? theme.colors.teal[9] : theme.colors.indigo[9],
      },
      paper: {
        backgroundColor:
          colorScheme === "dark"
            ? darken(theme.colors.dark[7], 0.05)
            : theme.white,
        border: `1px solid ${
          colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[5]
        }`,
        boxShadow: theme.shadows.sm,
        "&:hover": {
          border: `1px solid ${
            colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[9]
          }`,
        },
      },
      paperSelected: {
        backgroundColor:
          colorScheme === "dark"
            ? darken(theme.colors.dark[9], 1)
            : theme.colors.gray[1],
        border: `1px solid ${
          colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[5]
        }`,
        boxShadow: theme.shadows.sm,
        "&:hover": {
          border: `1px solid ${
            colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[9]
          }`,
        },
      },
      transparentBottomBorder: {
        borderBottom: `1px solid transparent`,
      },
      sessionPremium: {
        color:
          colorScheme === "dark"
            ? theme.colors.orange[9]
            : theme.colors.orange[9],
      },
      sessionCostEffective: {
        color:
          colorScheme === "dark"
            ? theme.colors.green[9]
            : theme.colors.green[9],
      },
      ChatAIMessage: {
        textarea: {
          border: `none !important`,
          fontSize: "18px !important",
        },
      },
      table1InMessage: {
        th: { padding: "5px !important" },
        td: { padding: "5px !important" },
      },
      ChatAIMessageLabel: {
        backgroundColor:
          colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.gray[3],
      },

      ChatAIMessageHelper: {
        input: {
          border: `none !important`,
          fontSize: "16px !important",

          backgroundColor:
            colorScheme === "dark"
              ? darken(theme.colors.dark[9], 1)
              : theme.colors.indigo[0],
        },
      },
      ChatAIMessageHelperArea: {
        height: "10px",
        left: "0px",
        top: "-9px",
        padding: "0px",

        "&:hover": {
          height: "50px",
          left: "0px",
          top: "-49px",
          padding: "10px",
        },
      },
      ChatAIMessageHelperAreaShow: {
        left: "0px",
        top: "-49px",
        padding: "10px",
        maxWidth: "100%",
        backgroundColor:
          colorScheme === "dark"
            ? darken(theme.colors.dark[6], 0.6)
            : lighten(theme.colors.gray[2], 0.5),
      },
      ChatAIMessageHelperAreaHide: {
        height: "25px",
        left: "0px",
        top: "-9px",
        padding: "0px",
        maxWidth: "0px",
        cursor: "pointer",
        border: "0px solid !important",
      },
      ChatAIMessagePromptWrap: {
        backgroundColor:
          colorScheme === "dark"
            ? darken(theme.colors.dark[6], 0.4)
            : lighten(theme.colors.gray[0], 0.6),
        position: "relative",
        width: "calc(100%)",
        border:
          "1px solid " +
          (colorScheme === "dark"
            ? lighten(theme.colors.gray[5], 0.5)
            : theme.colors.gray[5]),
        borderTop:
          "1px solid " +
          (colorScheme === "dark"
            ? theme.colors.gray[6]
            : theme.colors.gray[3]),
        borderRadius: "10px",
        borderTopLeftRadius: "0px",
        borderTopRightRadius: "0px",
        padding: "10px",
        paddingRight: "0px",
      },
      ChatAIMessagePromptWrapBorderTop: {
        borderTop:
          "1px solid " +
          (colorScheme === "dark"
            ? lighten(theme.colors.gray[5], 0.5)
            : theme.colors.gray[5]),
      },
      ChatAIMessagePromptWrapToolHidden: {
        borderTopRightRadius: "10px !important",
        borderTopLeftRadius: "10px !important",
      },
      ChatAIMessagePrompt2Wrap: {
        backgroundColor:
          colorScheme === "dark"
            ? darken(theme.colors.dark[9], 0.4)
            : lighten(theme.colors.gray[0], 1),
        position: "relative",
        width: "calc(100%)",
        border:
          "1px dashed " +
          (colorScheme === "dark"
            ? lighten(theme.colors.gray[5], 0.5)
            : theme.colors.gray[5]),

        borderRadius: "10px",
        padding: "2px",
        paddingRight: "0px",
      },
      AiGenericMessageHeader: {
        backgroundColor:
          colorScheme === "dark"
            ? darken(theme.colors.dark[6], 0.4)
            : theme.colors.gray[1],
      },
      AiGenericMessageBody: {
        backgroundColor: `${
          colorScheme === "dark"
            ? darken(theme.colors.dark[6], 0.2)
            : theme.colors.gray[1]
        }`,
      },
      AiGenericMessageHeaderEditMode: {
        backgroundColor:
          colorScheme === "dark"
            ? darken(theme.colors.orange[9], 0.7)
            : theme.colors.orange[1],
        color: colorScheme === "dark" ? "white" : theme.colors.dark[8],
      },
      AiGenericMessageBorderEditMode: {
        border: `2px solid  ${
          colorScheme === "dark"
            ? darken(theme.colors.orange[9], 0.7)
            : theme.colors.orange[5]
        } !important`,
      },
      AiGenericMessageHeaderOriginal: {
        backgroundColor:
          colorScheme === "dark"
            ? darken(theme.colors.dark[6], 0.7)
            : theme.colors.gray[1],
      },
      ChatAIMessageHelperAreaDrp: {
        visibility: "hidden",
        "&:hover": {
          visibility: "visible",
        },
      },
      NonAiActiveMessage: {
        backgroundColor:
          colorScheme === "dark"
            ? darken(theme.colors.dark[9], 120)
            : theme.colors.dark[9],
        color:
          colorScheme === "dark" ? theme.colors.gray[0] : theme.colors.dark[9],
        cursor: "pointer",
        border: `1px solid ${
          colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[5]
        }`,
        padding: "10px",
        opacity: 0.5,
        borderRadius: "8px",
        "&:hover": {
          opacity: 0.9,
        },
      },
      AiDateContent: {
        color:
          colorScheme === "dark"
            ? theme.colors.indigo[3]
            : theme.colors.indigo[9],
      },
      PopUpShareBackGRound: {
        ".mantine-Modal-content": {
          backgroundColor: "rgba(0, 0, 0, 0.5) !important",
        },
      },
      UpDownHover: {
        opacity: 0.07,
        "&:hover": {
          opacity: 1,
        },
      },
      selectedSort: {
        color:
          colorScheme == "dark" ? theme.colors.teal[9] : theme.colors.indigo[9],
        fontWeight: "bold",
      },
      comboBoxSelectedOption: {
        backgroundColor:
          colorScheme == "dark" ? theme.colors.teal[9] : theme.colors.indigo[9],
      },
      comboBoxPlaceHolder: {
        whiteSpace: "nowrap",
        overFlow: "hidden",
        textOverflow: "ellipsis",
      },
      seperator: {
        borderBottom: `1px solid #ffbf00`,
        paddingTop: small ? 20 : 40,
        marginBottom: small ? 15 : 30,
      },
      seperator2: {
        borderBottom: `1px solid #ffbf00`,
      },
      title: {
        fontSize: small
          ? theme.fontSizes.sm
          : medium
          ? theme.fontSizes.md
          : large
          ? theme.fontSizes.lg
          : theme.fontSizes.md,
      },
      titleHrefDashed: {
        borderBottom: `1px dotted ${
          colorScheme === "dark" ? theme.colors.gray[0] : theme.colors.dark[5]
        }`,
        opacity: 0.9,
        cursor: "pointer",
        "&:hover": {
          opacity: 1,
          borderBottom: `1px solid  ${
            colorScheme === "dark" ? theme.colors.gray[0] : theme.colors.dark[5]
          }`,
        },
      },
      titleHref: {
        cursor: "pointer",
        color:
          colorScheme == "dark" ? theme.colors.teal[3] : theme.colors.indigo[7],
        "&:hover": {
          color:
            colorScheme == "dark"
              ? theme.colors.teal[6]
              : theme.colors.indigo[9],
        },
      },
      titleHref2: {
        cursor: "pointer",
        color:
          colorScheme == "dark"
            ? theme.colors.violet[3]
            : theme.colors.indigo[8],
        opacity: colorScheme == "dark" ? 1 : 0.8,
        paddingBottom: 5,

        "&:hover": {
          color:
            colorScheme == "dark"
              ? theme.colors.violet[5]
              : theme.colors.indigo[9],
          opacity: 1,
        },
        fontWeight: "bolder",
      },
      titleHref2AsIs: {
        paddingBottom: 5,
        fontWeight: "bolder",
      },
      WhatsAppIconLink: {
        cursor: "pointer",
        color:
          colorScheme == "dark" ? theme.colors.green[4] : theme.colors.green[8],
        opacity: colorScheme == "dark" ? 1 : 0.8,
        "&:hover": {
          color: theme.colors.green[9],
          opacity: 1,
        },
      },
      titleDealsWTB: {
        cursor: "pointer",
        color:
          colorScheme == "dark" ? theme.colors.red[5] : theme.colors.red[5],
        opacity: colorScheme == "dark" ? 1 : 0.8,
        paddingBottom: 5,

        "&:hover": {
          color:
            colorScheme == "dark" ? theme.colors.red[9] : theme.colors.red[9],
          opacity: 1,
        },
        fontWeight: "bolder",
      },
      editMax800: {
        maxWidth: "900px",
      },
      max400: {
        maxWidth: "500px",
      },
      subTitleHref: {
        cursor: "pointer",
        color: colorScheme == "dark" ? "white" : "black",
        opacity: 0.6,
        "&:hover": {
          opacity: 0.9,
        },
      },
      border: {
        border: `1px solid ${
          colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[5]
        }`,
      },
      cursorAsPointer: {
        cursor: "pointer",
      },
      seperatorPop: {
        borderBottom: `1px solid #ffbf00`,
        paddingTop: small ? 15 : 20,
        marginBottom: small ? 15 : 20,
      },
      borderError: {
        border: `1px solid red !important`,
      },
      seperatorPopGray: {
        borderBottom: `1px solid ${
          colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[5]
        }`,
        paddingTop: small ? 15 : 20,
        marginBottom: small ? 15 : 20,
      },
      companyDir: {
        borderBottom: `1px dotted ${
          colorScheme === "dark" ? theme.colors.gray[0] : theme.colors.dark[5]
        }`,
        opacity: 0.9,
        cursor: "pointer",
        "&:hover": {
          opacity: 1,
          borderBottom: `1px solid  ${
            colorScheme === "dark" ? theme.colors.gray[0] : theme.colors.dark[5]
          }`,
        },
      },
      textToCopy: {
        borderBottom: `1px dotted ${
          colorScheme === "dark" ? theme.colors.gray[0] : theme.colors.dark[5]
        }`,
        opacity: 0.9,
        cursor: "pointer",
        "&:hover": {
          opacity: 1,
          borderBottom: `1px solid  ${
            colorScheme === "dark" ? theme.colors.gray[0] : theme.colors.dark[5]
          }`,
        },
      },
      borderToCopy: {
        border: `1px solid ${
          colorScheme === "dark" ? theme.colors.blue[5] : theme.colors.blue[7]
        } !important`,
      },
      originalMessageBorder: {
        border: `1px solid ${
          colorScheme === "dark" ? theme.colors.green[5] : theme.colors.blue[7]
        } !important`,
      },
      cursorNoDrop: {
        cursor: "no-drop !Important",
      },
      titleWTSB: {
        color:
          colorScheme == "dark" ? theme.colors.teal[3] : theme.colors.indigo[7],
      },
      clearmessages: {
        backgroundColor:
          colorScheme == "dark" ? theme.colors.dark[5] : theme.colors.gray[0],
      },
      rowSelected: {
        td: {
          backgroundColor: `${
            colorScheme === "dark"
              ? darken(theme.colors.dark[6], 0.8)
              : darken(theme.white, 0.09)
          } !important`,
        },
      },
      cellWhats: {
        backgroundColor:
          colorScheme === "dark"
            ? darken(theme.colors.dark[7], 0.05)
            : theme.white,
        border: `1px solid  ${
          colorScheme === "dark" ? theme.colors.gray[0] : theme.colors.dark[5]
        }`,
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: "bold",

        opacity: 0.8,
        "&:hover": {
          opacity: 1,
          backgroundColor:
            colorScheme === "dark"
              ? darken(theme.colors.teal[5], 0.5)
              : darken(theme.colors.teal[2], 0.5),
          color: "white",
        },
      },
      accordionPannel: {
        backgroundColor:
          colorScheme === "dark" ? theme.colors.dark[6] : "white",
      },
      accordionControl: {
        backgroundColor:
          colorScheme === "dark" ? theme.colors.dark[6] : "white",
      },
      borderBottomCard: {
        borderBottom: `1px solid ${
          colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[5]
        }`,
      },
      borderToMatchPost: {
        border: `1px solid ${
          colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[5]
        }`,
      },
      backgroundCard: {
        backgroundColor:
          colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[0],
      },
      popUpBackground: {
        backgroundColor:
          colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[2],
      },
      textInterpBox: {
        position: "relative",
      },
      textInterpBoxButtons: {
        position: "absolute",
        top: "-2px",
        right: "0px",
      },
      hideVisibility: {
        height: "0px",
        width: "0px",
        overflow: "hidden",
        visibility: "hidden",
      },
      hideVisibilityByOp: {
        position: "absolute",
        top: "-50000px",
      },
      opacityZero: {
        opacity: 0,
      },
      PopUpShareBg: {
        backgroundColor:
          colorScheme === "dark"
            ? darken(theme.colors.dark[6], 0.7)
            : theme.colors.gray[1],
      },
      editorDisabledControl: {
        cursor: "not-allowed !important",
        opacity: 0.5,
      },
      editorBulbMenuledControl: {
        color:
          colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.gray[0],
        backgroundColor:
          colorScheme === "dark" ? theme.colors.gray[0] : theme.colors.dark[9],
        "&:hover": {
          backgroundColor: `${
            colorScheme === "dark" ? theme.colors.gray[4] : theme.colors.dark[3]
          } !important`,
        },
      },
      editorThemeDark: {
        ".mantine-RichTextEditor-content": {
          backgroundColor: `#1A1B1E  !important`,
          color: `${theme.white}  !important`,
        },
      },
      editorThemeDim: {
        ".mantine-RichTextEditor-content": {
          backgroundColor: `#1d1e30  !important`,
          color: `${theme.white}  !important`,
        },
      },
      editorThemeLight: {
        ".mantine-RichTextEditor-content": {
          backgroundColor: `${theme.white}  !important`,
          color: `${theme.black}  !important`,
        },
      },
      editorTableDraft: {
        borderCollapse: "collapse",
        width: "150px",
        height: "150px",
        border: `1px solid ${
          colorScheme === "dark"
            ? theme.colors.indigo[5]
            : theme.colors.indigo[5]
        }`,
        td: {
          border: `1px solid ${
            colorScheme === "dark"
              ? theme.colors.teal[7]
              : theme.colors.indigo[8]
          }`,
          backgroundColor:
            colorScheme === "dark"
              ? darken(theme.colors.dark[7], 0.05)
              : theme.white,
          padding: "5px",
        },
      },
      editorTableDraftUpTo: {
        backgroundColor: `${
          colorScheme === "dark" ? theme.colors.teal[9] : theme.colors.indigo[2]
        } !important`,
      },
      hideByDisplayFixed: {
        opacity: 0.1,
        pointerEvents: "none",
      },
      showByDisplayFixed: {
        position: "absolute",
        top: 0,
        zIndex: 100000,
      },
      appDiv: {
        div: {
          lineHeight: "1.5",
        },
      },
      listZibra1: {
        backgroundColor:
          colorScheme === "dark"
            ? darken(theme.colors.dark[7], 0.05)
            : theme.white,
      },
      listZibra2: {
        backgroundColor:
          colorScheme === "dark"
            ? darken(theme.colors.dark[7], 0.4)
            : lighten(theme.colors.gray[0], 0.2),
      },
      list: {
        border: `1px solid ${
          colorScheme === "dark" ? theme.colors.gray[7] : theme.colors.gray[4]
        }`,
        td: {},

        "tr:hover": {
          td: {
            backgroundColor: `${
              colorScheme === "dark"
                ? darken(theme.colors.dark[7], 0.9)
                : darken(theme.colors.gray[0], 0.09)
            } !important`,
          },
        },
        "tbody tr:nth-of-type(even)": {
          td: {
            backgroundColor:
              colorScheme === "dark"
                ? darken(theme.colors.dark[7], 0.4)
                : lighten(theme.colors.gray[0], 0.2),
          },
        },
        "thead tr": {
          th: {
            backgroundColor:
              colorScheme === "dark"
                ? darken(theme.colors.dark[7], 0.4)
                : lighten(theme.colors.gray[2], 0.1),
          },
        },
      },
      hashtagboardContainer: {
        marginTop: "5px",
        alignItems: "center",
        display: "flex",
        flexWrap: "wrap",

        textAlign: "left",
        textSizeAdjust: "100%",
        boxSizing: "border-box",
        padding: "5px",
        border: `1px solid ${
          colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[5]
        }`,

        backgroundColor:
          colorScheme === "dark" ? theme.colors.dark[5] : "white",
      },
      hashtagboardContainer2: {
        alignItems: "center",
        display: "flex",
        flexWrap: "wrap",
        textAlign: "left",
        textSizeAdjust: "100%",
      },
      hashtagboardRadioBg: {
        border: `1px solid ${
          colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[5]
        }`,

        backgroundColor:
          colorScheme === "dark" ? theme.colors.dark[6] : "white",
        borderRadius: "5px",
      },
      hashtagboardElem: {
        boxSizing: "border-box",
        alignItems: "center",
        display: "block",
        marginBottom: "5px",
        marginTop: "5px",
        marginLeft: "0px",
        marginRight: "5px",
        border: `1px solid ${
          colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[5]
        }`,
        borderRadius: "8px",
        padding: "5px",
        paddingTop: "0px",
        paddingBottom: "0px",
        backgroundColor:
          colorScheme === "dark"
            ? darken(theme.colors.dark[7], 0.4)
            : lighten(theme.colors.gray[0], 0.2),
        "&:hover": {
          backgroundColor: `${
            colorScheme === "dark"
              ? darken(theme.colors.dark[7], 0.9)
              : darken(theme.white, 0.08)
          } !important`,
        },
        cursor: "pointer !important",
      },
      hashGo: {
        fontFamily: "Courier,Courier New,monospace",
        borderBottom: `1px dotted ${
          colorScheme === "dark" ? theme.colors.gray[0] : theme.colors.dark[5]
        }`,
        opacity: 0.9,
        cursor: "pointer",
        "&:hover": {
          opacity: 1,
          borderBottom: `1px solid  ${
            colorScheme === "dark" ? theme.colors.gray[0] : theme.colors.dark[5]
          }`,
        },
      },
      dropImagesZone: {
        opacity: 0.9,
        cursor: "pointer",
        "&:hover": {
          opacity: 1,

          backgroundColor: `${
            colorScheme === "dark"
              ? theme.colors.dark[5]
              : darken(theme.white, 0.08)
          } !important`,
        },
      },
      dropImage: {
        opacity: 0.8,
        cursor: "pointer",
        "&:hover": {
          opacity: 1,
        },
      },
      dropImageProgress: {
        backgroundColor: `${
          colorScheme === "dark"
            ? theme.colors.dark[8]
            : darken(theme.white, 0.08)
        } !important`,
      },
      dropImageTool: {
        backgroundColor: `${
          colorScheme === "dark"
            ? theme.colors.dark[8]
            : darken(theme.white, 0.08)
        } !important`,
      },
      dropImageToolSep: {
        backgroundColor: `${
          colorScheme === "dark"
            ? darken(theme.white, 0.08)
            : theme.colors.dark[8]
        } !important`,
      },
      ImageThumbContainer: {
        display: "block",
        overflow: "hidden",
        width: "100%",
      },
      ImageThumb: {
        width: "100%",
        maxWidth: "100%",

        height: "100%",
        left: 0,
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        transform: "translateY(0)",
      },
      ImageObjectPosition: {
        objectPosition: "top !important",
      },
      drawerBody:{
        height:'calc(100vh - 100px)'
      },
      violet:{
        color:theme.colors.violet[5]
      },
      modalBodyComboBox:{
        paddingTop:`0 !important`
      },
      modalBodyComboBoxTitle: {
        backgroundColor:
          colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.white,
      },
      modalBodyComboBoxTitleHover: {
        '&:hover':{
          backgroundColor:
        colorScheme == "dark" ? theme.colors.teal[7] : theme.colors.indigo[7],
        }
      },
      hoverAppPopComMulti: {
        backgroundColor:
        colorScheme == "dark" ? theme.colors.teal[7] : theme.colors.indigo[7],
      },
      
    };
  });
  const value = {
    classes: classes0().classes,
  };
  return (
    <GlobalStyleContext.Provider value={value}>
      {children}
    </GlobalStyleContext.Provider>
  );
};
