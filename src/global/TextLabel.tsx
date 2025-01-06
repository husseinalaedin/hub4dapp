import { Card, Group, Stack, Text } from "@mantine/core";

export const TextLabel = ({ label, labelleft, text }) => {
  return (
    <Stack gap={2}>
      <Group justify="left">
        <Text fz="md" style={{ opacity: 0.7 }}>
          {" "}
          {label}
        </Text>
        {labelleft}
      </Group>
      <Text fz="lg" mt={-5} bga={"red"}>
        {text}
      </Text>
    </Stack>
  );
};
