import { Group, SelectProps } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";

const iconProps = {
  stroke: 1.5,
  color: "currentColor",
  opacity: 0.6,
  size: 18,
};

// const icons: Record<string, React.ReactNode> = {
//   left: <IconAlignLeft {...iconProps} />,
//   center: <IconAlignCenter {...iconProps} />,
//   right: <IconAlignRight {...iconProps} />,
//   justify: <IconAlignJustified {...iconProps} />,
// };

export const renderSelectOption: SelectProps["renderOption"] = ({
  option,
  checked,
}) => (
  <Group flex="1" h="100%" style={{ background: checked ? "red" : "" }}>
    {/* {icons[option.value]} */}
    {option.label}
    {checked && (
      <IconCheck style={{ marginInlineStart: "auto" }} {...iconProps} />
    )}
  </Group>
);
