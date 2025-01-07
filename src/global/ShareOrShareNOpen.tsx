import { Box, Button, CopyButton, Group } from "@mantine/core";
import {
  IconCopy,
  IconDeviceFloppy,
  IconEditCircle,
  IconExternalLink,
  IconPencil,
  IconShare,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useSelector } from "react-redux";
import { selectOpened, selectSmall } from "../store/features/ScreenStatus";

export const ShareOrShareNOpen = ({
  disableShare,
  onShare,
  onShareNOpen,
  shareableDeals,
  disablesharenopen,
}) => {
  const { t } = useTranslation("common", { keyPrefix: "tool" });
  const opened = useSelector(selectOpened);
  const small = useSelector(selectSmall);

  return (
    <div>
      <Group
        justify="right"
        gap="xs"
        style={{ display: small && opened ? "none" : "" }}
      >
        <CopyButton value={shareableDeals}>
          {({ copied, copy }) => (
            <Button
              disabled={disableShare || disablesharenopen}
              leftIcon={<IconShare size={18} />}
              type="button"
              onClick={() => {
                copy();
                onShareNOpen(copied);
              }}
            >
              {!copied && (
                <>
                  <Box mr="sm">{t("share_and_open", "Share")}</Box>
                  {<IconExternalLink />}
                </>
              )}
              {copied && <Box mr="sm">{t("is_copying", "Copying..")}</Box>}
            </Button>
          )}
        </CopyButton>

        <CopyButton value={shareableDeals}>
          {({ copied, copy }) => (
            <Button
              disabled={disableShare}
              leftIcon={<IconShare size={18} />}
              type="button"
              onClick={() => {
                copy();
                onShare(copied);
              }}
            >
              {!copied && <Box>{t("share", "Share")}</Box>}{" "}
              {copied && <Box mr="sm">{t("is_copying", "Copying..")}</Box>}
            </Button>
          )}
        </CopyButton>
      </Group>
    </div>
  );
};
