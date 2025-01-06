import {
  Box,
  Button,
  CopyButton,
  Grid,
  Group,
  Text,
  Tooltip,
} from "@mantine/core";
import {
  IconBrandWhatsapp,
  IconCheck,
  IconCircleCheck,
  IconCircleCheckFilled,
  IconCopy,
  IconExternalLink,
} from "@tabler/icons-react";
import { G, useMessage } from "./G";
import { useTranslation } from "react-i18next";
import { useOs } from "@mantine/hooks";
import { openWhatsappAsWeb } from "./Misc";
import { useEffect, useState } from "react";
import { useGlobalStyl } from "../hooks/useTheme";

export const Cell = ({ cell, user, fz, message, show_op, verified }) => {
  const os = useOs();
  const isPhone = () => {
    return os == "ios" || os == "android";
  };
  const opengroupurl = () => {
    if (!isPhone() && openWhatsappAsWeb()) window.open(href, "_blank");
    else window.location.href = href;
  };
  const build_whats_url = () => {
    try {
      if (!cell || cell == "") return "";
      let url = "";
      let decoded_message = "";
      let msg = false;
      if (message && message != "") {
        decoded_message = encodeURIComponent(message);
        msg = true;
      }
      if (!isPhone() && openWhatsappAsWeb())
        url =
          "https://wa.me/" +
          G.form_cell_whats(cell) +
          (msg ? "?text=" + decoded_message : "");
      else
        url =
          "whatsapp://send?phone=" +
          G.form_cell_whats(cell) +
          (msg ? "&text=" + decoded_message : "");
      return url;
    } catch (error) {
      let e = error;
    }
    return "";
  };

  const [href, setHref] = useState<any>(() => {
    let url = build_whats_url();
    return url;
  });
  useEffect(() => {
    setHref(() => {
      let url = build_whats_url();
      return url;
    });
  }, [message]);

  const { t } = useTranslation("common", { keyPrefix: "global-comp" });
  const { classes: classesG } = useGlobalStyl();
  const { succeed } = useMessage();
  return (
    <>
      {show_op == "COPY_OR_SEND" && cell && cell != "" && (
        <Group justify="left" gap={0}>
          <Group
            justify="right"
            className={classesG.WhatsAppIconLink}
            onClick={() => {
              opengroupurl();
            }}
          >
            <IconBrandWhatsapp />
          </Group>

          <CopyButton value={cell}>
            {({ copied, copy }) => (
              <Text
                fz={fz}
                className={classesG.textToCopy}
                onClick={() => {
                  copy();
                  succeed(t("cell_copied", "Cell number copied!."));
                }}
                c={copied ? "indigo.7" : ""}
              >
                {cell}
              </Text>
            )}
          </CopyButton>
        </Group>
      )}
      {show_op == "COPY_OR_SEND" && !(cell && cell != "") && (
        <Group justify="left" gap={0}>
          <Group justify="center" opacity={0}>
            <IconBrandWhatsapp />
          </Group>

          <Text fz={fz} span={true}>
            {t("NA", "N/A")}
          </Text>
        </Group>
      )}
      {show_op == "SEND" && (
        <Group
          opacity={message != "" ? 1 : 0.8}
          justify="left"
          gap={10}
          className={message && message != "" ? "" : classesG.cursorNoDrop}
        >
          {/* <a href={href}> */}

          <Grid
            className={
              classesG.cellWhats +
              ` ` +
              (message && message != "" ? "" : classesG.cursorNoDrop)
            }
            p={15}
            w="100%"
            onClick={() => {
              if (!message || message == "") return;
              opengroupurl();
            }}
            gutter={0}
          >
            <Grid.Col span={6}>
              <Text lineClamp={1}>{user}</Text>
            </Grid.Col>
            <Grid.Col span={4}>
              <Group justify="left">
                <Box>{cell}</Box>
                {verified == "X" && (
                  <Box w={0} ml={-15} mt={-10} c="green">
                    <IconCheck size={15} stroke={5} />
                  </Box>
                )}
              </Group>
            </Grid.Col>
            <Grid.Col span={2}>
              <Group
                justify="left"
                gap={0}
                className={
                  message && message != "" ? "" : classesG.cursorNoDrop
                }
              >
                <IconCopy />
                <IconBrandWhatsapp />
              </Group>
            </Grid.Col>
          </Grid>
          {/* </a> */}
          {/* <Group w="100%" justify="apart">
                    <Group justify="apart" gap={0}>
                        <Box mr={5}>{user}</Box>
                        <Box>{cell}</Box>
                    </Group>
                    <Group justify="left" gap={0} className={message && message != "" ? '' : classesG.cursorNoDrop}>
                        <IconCopy />
                        <IconBrandWhatsapp />
                    </Group>
                </Group> */}
          {/* </Tooltip> */}
        </Group>
      )}
    </>
  );
};
{
  /* {verified == 'X' && <Box ml={-5} mr={5} mb={10}><IconCheck size={18} stroke={3} /></Box>}  */
}
{
  /* <Box ml={-10} mb={14}><IconExternalLink size={15} stroke={3} /></Box> */
}
{
  /* <Tooltip label={t('copy_n_launch_whatsapp', 'Copy message and launch Whatsapp!.')}> */
}
