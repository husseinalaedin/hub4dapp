import { Group, Select, Text } from "@mantine/core";
import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { IconBrands } from "../IconBrands";

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  image: string;
  label: string;
  value: string;
  description?: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ image, label, value, description, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group style={{whiteSpace:"nowrap"}}>
        <IconBrands brand={value} size={20} />
        <Text>{label}</Text>
      </Group>
    </div>
  )
);
export const ChannelGroups = ({ dataChannelsGroups, ...others }) => {
  const { t } = useTranslation("common", { keyPrefix: "global-comp" });
  return (
    <Select
      style={{ zIndex: 501 }}
      // withinPortal={true}
      // dropdownjustify="bottom"
      // itemComponent={SelectItem}
      searchable
      clearable
      {...others}
      label={t("channel_group", "Group")}
      placeholder={t("channel_group", "Group")}
      maxDropdownHeight={400}
      data={dataChannelsGroups?.map((itm) => {
        return {
          value: itm.channel_group_id,
          label: itm.channel_group,
        };
      })}
    />
  );
};
