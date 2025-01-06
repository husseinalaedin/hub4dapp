import { Button, Group } from "@mantine/core";
import { IconAdjustmentsOff } from "@tabler/icons-react";

export const ClearButton = ({ t, small, onClear }) => {
  return (
    <Button variant="outline" type="button" color="red.9" onClick={onClear}>
      {/* <Group justify="apart">
                <IconAdjustmentsOff style={{ transform: 'rotate(90deg)' }} />
                {!small && <>{t('clear_filters', 'Clear Filters')}</>}
            </Group> */}
      <IconAdjustmentsOff style={{ transform: "rotate(90deg)" }} />
    </Button>
  );
};

export const ClearButton1 = ({ t, small, onClear }) => {
  return (
    <Button
      variant="default"
      color="red"
      c="red"
      m={0}
      radius={0}
      onClick={onClear}
    >
      <IconAdjustmentsOff size={20} />
    </Button>
  );
};

export const ClearButton2 = ({ t, small, onClear }) => {
  return (
    <Button variant="filled" type="button" color="red" onClick={onClear}>
      <Group justify="apart">
        <IconAdjustmentsOff style={{ transform: "rotate(90deg)" }} />
        {!small && <>{t("clear_filters", "Clear Filters")}</>}
      </Group>
    </Button>
  );
};
