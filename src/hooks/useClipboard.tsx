import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Card,
  Center,
  Group,
  Kbd,
  Modal,
  Paper,
  ScrollArea,
  Tooltip,
} from "@mantine/core";
import { useClickOutside, useDisclosure } from "@mantine/hooks";
import { closeModal, modals } from "@mantine/modals";
import {
  IconAlertCircle,
  IconCheck,
  IconCopy,
  IconX,
} from "@tabler/icons-react";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { selectMedium, selectSmall } from "../store/features/ScreenStatus";
import { useSelector } from "react-redux";
import { useGlobalStyl } from "../hooks/useTheme";
import { AppDiv } from "../global/AppDiv";

export const useClipBoard = ({ timeout, timeouthtml }) => {
  const [error, setError] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [copyTimeout, setCopyTimeout] = useState<any>(null);
  const [supportedTimeout, setSupportedTimeout] = useState<any>(timeouthtml);

  const [htmlSupported, setHtmlSupported] = useState(true);
  const handleCopyResult = (value) => {
    clearTimeout(copyTimeout);
    setCopyTimeout(setTimeout(() => setCopied(false), timeout));
    setCopied(value);
  };
  const fakecopy = () => {
    handleCopyResult(true);
  };
  const copy = async (valueToCopy) => {
    if ("clipboard" in navigator) {
      await navigator.clipboard
        .writeText(valueToCopy)
        .then(() => handleCopyResult(true))
        .catch((err) => setError(err));
    } else {
      setError(new Error("useClipboard: navigator.clipboard is not supported"));
    }
  };
  const copydiv = async (htmlref: MutableRefObject<any>, select_text) => {
    let clipboardItem: any = null;
    let plaintext = "";
    let html = "";
    setHtmlSupported(true);

    if (htmlref && htmlref.current && select_text) {
      try {
        plaintext = htmlref.current.innerText;
        html = htmlref.current.innerHTML;
        let range = document.createRange();
        range.selectNodeContents(htmlref.current);
        let selection: any = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      } catch (err) {
        console.log("clipboard error:", err);
      }
      await copyhtml(html, plaintext);
    }
    return {
      html: html,
      plaintext: plaintext,
    };
  };
  const copyhtml = async (html, plaintext) => {
    let clipboardItem: any = null;
    setHtmlSupported(true);
    if (!plaintext || plaintext === "" || !html || html === "") return;
    try {
      clipboardItem = new ClipboardItem({
        "text/html": new Blob([html], { type: "text/html" }),
        "text/plain": new Blob([plaintext], { type: "text/plain" }),
      });
    } catch (error) {}
    if (!clipboardItem) {
      clearTimeout(supportedTimeout);
      setSupportedTimeout(
        setTimeout(() => setHtmlSupported(true), timeouthtml)
      );
      setHtmlSupported(false);
    }
    try {
      if ("clipboard" in navigator) {
        if (clipboardItem) {
          try {
            await navigator.clipboard.write([clipboardItem]);
            handleCopyResult(true);
          } catch (error) {
            setError(error);
          }

          //    cpy.then(() => handleCopyResult(true)).catch((err) => setError(err));
        } else {
          try {
            await navigator.clipboard.writeText(plaintext);
            handleCopyResult(true);
          } catch (error) {
            setError(error);
          }
          // navigator.clipboard.writeText(plaintext).then(() => handleCopyResult(true)).catch((err) => setError(err));
        }
      } else {
        setError(
          new Error("useClipboard: navigator.clipboard is not supported")
        );
      }
    } catch (err) {
      console.log("clipboard error2:", err);
    }
  };
  const isHtmlOk = (html, plaintext) => {
    let ok = true;
    let clipboardItem: any = null;
    try {
      clipboardItem = new ClipboardItem({
        "text/html": new Blob([""], { type: "text/html" }),
        "text/plain": new Blob([""], { type: "text/plain" }),
      });
    } catch (error) {
      ok = false;
    }
    return ok && clipboardItem;
  };
  const reset = () => {
    setCopied(false);
    setError(null);
    clearTimeout(copyTimeout);
    setHtmlSupported(true);
  };
  return {
    fakecopy,
    copy,
    copydiv,
    copyhtml,
    reset,
    error,
    copied,
    htmlSupported,
    isHtmlOk,
  };
};
const ClipBoardPopCom = ({
  timeout: timeout,
  timeouthtml: timeouthtml,
  html,
  t,
}) => {
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const { classes: classesG } = useGlobalStyl();
  const clipboard = useClipBoard({
    timeout: timeout,
    timeouthtml: timeouthtml,
  });
  const contentMsg = useRef<any>(null);
  const ref = useClickOutside(() => closeModal("clipboard_copy"));
  useEffect(() => {
    let tim = setTimeout(() => {
      clipboard.copydiv(contentMsg, true);
    }, 100);
    return () => {
      clearTimeout(tim);
    };
  }, []);

  return (
    <Center mah={"calc(100vh - 20px)"} mt="10px" mb="10px">
      <Box
        p={small || medium ? "5px" : "10px"}
        pt={0}
        ref={ref}
        w={small || medium ? "100vw" : "65vw"}
        style={{ borderRadius: "10px", height: "100%" }}
        className={classesG.popUpBackground}
      >
        <Group justify="right" m="0" p={0} pr="sm" style={{ height: "50px" }}>
          <Tooltip
            withinPortal={true}
            color={clipboard?.copied ? "blue" : ""}
            label={
              !clipboard?.copied ? t("copy", "Copy") : t("copied", "Copied")
            }
          >
            <ActionIcon
              variant="transparent"
              onClick={() => {
                clipboard.copydiv(contentMsg, true);
              }}
            >
              <Box c={clipboard?.copied ? "blue" : ""}>
                {!clipboard?.copied && <IconCopy size={24} />}
                {clipboard?.copied && <IconCheck size={24} />}
              </Box>
            </ActionIcon>
          </Tooltip>
          <ActionIcon
            variant="transparent"
            onClick={() => {
              closeModal("clipboard_copy");
            }}
          >
            <Box c="red">
              <IconX size={24} />
            </Box>
          </ActionIcon>
        </Group>

        <Card
          shadow="0"
          radius="md"
          p="0"
          style={{ maxHeight: "calc(100vh - 85px)" }}
          withBorder
          m="0px"
          mt={0}
          className={`${clipboard?.copied ? classesG.borderToCopy : ""}`}
        >
          <ScrollArea.Autosize mah={"calc(100vh - 85px)"}>
            <Box m="5px">
              <CopyAlert t={t} clipboard={clipboard} />
              {/* <div ref={contentMsg} dangerouslySetInnerHTML={{ __html: tbl(html) }} style={{ whiteSpace: "pre-line", maxWidth: "670px", margin: "auto" }}></div> */}
              <AppDiv contRef={contentMsg} html={html} />
            </Box>
          </ScrollArea.Autosize>
        </Card>
      </Box>
    </Center>
  );
};
export const useClipBoarHtml = ({ timeout, timeouthtml, t }) => {
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const clipboard = useClipBoard({
    timeout: timeout,
    timeouthtml: timeouthtml,
  });
  const { classes: classesG } = useGlobalStyl();
  const openModel = (htmll) => {
    modals.open({
      styles: {
        content: { backgroundColor: "rgba(0, 0, 0, 0.5) !important" },
      },
      padding: 0,
      yOffset: 0,
      xOffset: 0,
      modalId: "clipboard_copy",
      fullScreen: true,
      withCloseButton: false,
      withOverlay: true,
      withinPortal: true,
      size: small || medium ? "100%" : "65vw",
      children: (
        <ClipBoardPopCom
          timeout={timeout}
          timeouthtml={timeouthtml}
          t={t}
          html={htmll}
        />
      ),
    });
  };
  const copyhtml = (html, text) => {
    // if (clipboard.isHtmlOk(html, text)) {
    //     clipboard.copyhtml(html, text)
    //     return
    // }
    // setHtmll(html)
    openModel(html);
  };
  return { copyhtml, isHtmlOk: clipboard.isHtmlOk, clipboard };
};

// export const model=()=>{
//     return(

//     )
// }

export const CopyAlert = ({ clipboard, t }) => {
  return (
    <>
      {!clipboard.htmlSupported && (
        <Box>
          <Alert
            withCloseButton
            onClose={() => {
              clipboard.reset();
            }}
            icon={<IconAlertCircle size="1rem" />}
            title={t("copy_alert", "Copy Alert")}
            color="red"
          >
            <Box>
              {t(
                "browser_not_supported",
                `Your browser doesn't support copying formatted text. The data has been copied in plain text.`
              )}
            </Box>
            <Group style={{ whiteSpace: "nowrap" }} gap={2}>
              <Box>{t("browser_not_supported_ctrl_c", `Press`)}</Box>
              <Box>
                <Kbd>Ctrl</Kbd> + <Kbd>C</Kbd>
              </Box>
              <Box>
                {t("browser_not_supported_ctrl_c", `for an improved copy.`)}
              </Box>
            </Group>
            <Box>
              {t(
                "browser_not_supported_switch",
                `Switch to Chrome or Safari for optimal experience.`
              )}
            </Box>
          </Alert>
        </Box>
      )}
    </>
  );
};

export const AppCopyButton = ({ timeout, value, onCopied, children }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);

    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      if (onCopied) onCopied();
    }, timeout); // Reset after 2 seconds
  };

  return children({ copied, copy, onCopied });
};
