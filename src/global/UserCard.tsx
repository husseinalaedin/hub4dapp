import {
  ActionIcon,
  Box,
  Card,
  Chip,
  CopyButton,
  Grid,
  Group,
  Stack,
  Text,
  rem,
} from "@mantine/core";
import {
  IconAt,
  IconCopy,
  IconDeviceMobile,
  IconUserCircle,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useMessage } from "./G";
import { Cell } from "./Cell";
import { selectSmall } from "../store/features/ScreenStatus";
import { useSelector } from "react-redux";
import { useGlobalStyl } from "../hooks/useTheme";

export const UserCard = ({ usr }) => {
  const small = useSelector(selectSmall);
  const { error, succeed } = useMessage();
  const { classes: classesG } = useGlobalStyl();
  const { t } = useTranslation("common", { keyPrefix: "global-comp" });
  const lspan = small ? 2 : 3;
  const rspan = small ? 10 : 9;
  return (
    <Box p="lg">
      <Grid p={5}>
        <Grid.Col span={lspan} pb="xs" className={classesG.borderBottomCard}>
          <Group justify="left" opacity={0.6}>
            {!small && <IconUserCircle />}
            <Text ml={-12} fz={rem("1rem")}>
              {t("name", "Name")}
            </Text>
          </Group>
        </Grid.Col>
        <Grid.Col span={rspan} pb="xs" className={classesG.borderBottomCard}>
          <Text fz={rem("1rem")}>
            {usr.first_name}, {usr.last_name}
          </Text>
        </Grid.Col>

        <Grid.Col
          span={lspan}
          pb="xs"
          pt="xs"
          className={classesG.borderBottomCard}
        >
          <Group justify="left" opacity={0.6}>
            {!small && <IconAt opacity={0.6} />}
            <Text ml={-12} fz={rem("1rem")}>
              {t("email", "E-mail")}
            </Text>
          </Group>
        </Grid.Col>
        <Grid.Col
          span={rspan}
          pb="xs"
          pt="xs"
          className={classesG.borderBottomCard}
        >
          <Group justify="apart" gap={0}>
            <Text fz={rem("1rem")}>
              <CopyButton value={usr.email}>
                {({ copied, copy }) => (
                  <Text
                    fz={rem("1rem")}
                    span={true}
                    className={classesG.textToCopy}
                    onClick={() => {
                      copy();
                      succeed(t("email_copied", "Email copied!."));
                    }}
                    c={copied ? "indigo.7" : ""}
                  >
                    {usr.email}
                  </Text>
                )}
              </CopyButton>
            </Text>
            <CopyButton value={usr.email}>
              {({ copied, copy }) => (
                <ActionIcon
                  onClick={() => {
                    copy();
                    succeed(t("email_copied", "Email copied!."));
                  }}
                  color={copied ? "indigo.7" : "gray.6"}
                >
                  <IconCopy size={34} />
                </ActionIcon>
              )}
            </CopyButton>
          </Group>
        </Grid.Col>
        {/* <Grid.Col span={1} pb="xs" pt="xs" className={classesG.borderBottomCard}>
                    <Group justify="right">
                        <CopyButton value={usr.email}>
                            {({ copied, copy }) => (
                                <ActionIcon onClick={() => {
                                    copy();
                                    succeed(t('email_copied', 'Email copied!.'))
                                }} color={copied ? 'indigo.7' : 'gray.6'}>
                                    <IconCopy size={34} />
                                </ActionIcon>
                            )}
                        </CopyButton>
                    </Group>

                </Grid.Col> */}
        <Grid.Col span={lspan} pt="xs">
          <Group justify="left" opacity={0.6}>
            {!small && <IconDeviceMobile />}
            <Text ml={-12} fz={rem("1rem")}>
              {t("cell", "Cell")}
            </Text>
          </Group>
        </Grid.Col>
        <Grid.Col span={rspan} pt="xs">
          <Group justify="apart" gap={0}>
            <Cell
              fz={rem("1rem")}
              cell={usr.cell}
              verified={usr.cell_verified}
              message={null}
              show_op="COPY_OR_SEND"
              user=""
            />
            <Group justify="right" gap={2}>
              {usr.cell_verified == "X" && (
                <Chip size="sm" checked radius="md">
                  {t("VERIFIED", "Verified")}
                </Chip>
              )}
              <CopyButton value={usr.cell}>
                {({ copied, copy }) => (
                  <ActionIcon
                    onClick={() => {
                      copy();
                      succeed(t("cell_copied", "Cell number copied!."));
                    }}
                    color={copied ? "indigo.7" : "gray.6"}
                  >
                    <IconCopy size={34} />
                  </ActionIcon>
                )}
              </CopyButton>
            </Group>
          </Group>
        </Grid.Col>

        {/* <Grid.Col span={4} pt="xs">
                    

                </Grid.Col> */}
      </Grid>
      {/* <Stack>
                <Group justify="left" opacity={0.6}>
                    <IconUserCircle />
                    <Text ml={-12} fz={rem('1rem')}>{t('name', 'Name')}</Text>
                </Group>
                <Group justify="left" opacity={0.6}>
                    <IconAt opacity={0.6} />
                    <Text ml={-12} fz={rem('1rem')}>{t('email', 'E-mail')}</Text>
                </Group>
                <Group justify="left" opacity={0.6}>
                    <IconDeviceMobile />
                    <Text ml={-12} fz={rem('1rem')}>{t('cell', 'Cell')}</Text>
                </Group>
            </Stack> */}
    </Box>
  );
};
