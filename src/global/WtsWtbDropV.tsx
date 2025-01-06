import {
  Box,
  Flex,
  Group,
  Text,
  type ComboboxItem,
  type ComboboxLikeRenderOptionInput,
  type SelectProps,
} from "@mantine/core";
import { IconAsterisk } from "@tabler/icons-react";
import { IconPlaylistX } from "@tabler/icons-react";
import {
  IconArrowBigLeftFilled,
  IconArrowBigRightFilled,
  IconListSearch,
} from "@tabler/icons-react";
import { forwardRef } from "react";
interface WtsWtbItemProps extends React.ComponentPropsWithoutRef<"div"> {
  value: string;
  label: string;
  dir: string;
}
export const WtsWtbDropV = forwardRef<HTMLDivElement, WtsWtbItemProps>(
  ({ label, value, dir, ...others }, ref) => {
    return (
      <Box ref={ref} {...others}>
        {dir === "I" && (
          <Flex align="center">
            <Box c={dir == "I" ? "red.5" : ""}>
              <IconArrowBigRightFilled size={15} />
            </Box>
            <Box ml={2}>{label}</Box>
          </Flex>
        )}
        {dir == "O" && (
          <Flex align="center">
            <IconArrowBigLeftFilled size={15} />
            <Box ml={2}>{label}</Box>
          </Flex>
        )}
        {dir !== "I" && dir !== "O" && (
          <Flex align="center">
            <IconAsterisk size={15} />
            <Box ml={2}>{label}</Box>
          </Flex>
        )}
      </Box>
    );
  }
);

export const renderWtsWtbDropVOption: SelectProps["renderOption"] = (item: any) => {
  let { ref, dir, label } = item;
  return (
    <Box ref={ref}>
      {dir === "I" && (
        <Flex align="center">
          <Box c={dir == "I" ? "red.5" : ""}>
            <IconArrowBigRightFilled size={15} />
          </Box>
          <Box ml={2}>{label}</Box>
        </Flex>
      )}
      {dir == "O" && (
        <Flex align="center">
          <IconArrowBigLeftFilled size={15} />
          <Box ml={2}>{label}</Box>
        </Flex>
      )}
      {dir !== "I" && dir !== "O" && (
        <Flex align="center">
          <IconAsterisk size={15} />
          <Box ml={2}>{label}</Box>
        </Flex>
      )}
    </Box>
  );
};

interface PrivacyItemProps extends React.ComponentPropsWithoutRef<"div"> {
  value: string;
  label: string;
  privacy: string;
}
export const PrivacyDropV = forwardRef<HTMLDivElement, PrivacyItemProps>(
  ({ label, value, privacy, ...others }, ref) => {
    return (
      <div ref={ref} {...others}>
        <Group style={{whiteSpace:"nowrap"}}>
          <>
            {value == "P" && (
              <Box c="blue">
                <IconListSearch />{" "}
              </Box>
            )}
            {value !== "P" && (
              <Box c="red">
                <IconPlaylistX />{" "}
              </Box>
            )}
          </>
          <div>
            <Text>{label}</Text>
            <Text size="xs" color="dimmed">
              {privacy}
            </Text>
          </div>
        </Group>
      </div>
    );
  }
);
