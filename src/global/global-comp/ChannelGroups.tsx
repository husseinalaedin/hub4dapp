import { Group, Select, SelectProps, Text } from "@mantine/core";
import { forwardRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { IconBrands } from "../IconBrands";
import { AppSelect } from "./AppSelect";

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

export const renderChannelGroupsDropVOption: SelectProps["renderOption"] = (
  item: any
) => {
  let { value, label } = item;
  return (
    <div >
      <Group style={{ whiteSpace: "nowrap" }}>
        <IconBrands brand={value} size={20} />
        <Text>{label}</Text>
      </Group>
    </div>
  );
};
export const ChannelGroups = ({ dataChannelsGroups, ...others }) => {
  const { t } = useTranslation("common", { keyPrefix: "global-comp" });
  // const [value,setValue]=useState(null)
  let { value } = others;
  return (
    <AppSelect
    
      // comboboxProps={{ withinPortal: false }}
      style={{ zIndex: 501 }}
      withinPortal={false}
      // dropdownjustify="bottom"
      // itemComponent={SelectItem}
      leftSection={<IconBrands brand={value} size={20} />}
      renderOption={renderChannelGroupsDropVOption}
      searchable
      clearable
      {...others}
      // onChange={(val) => {
      //   setValue(val);
      //   if (others && others.onChange) {
      //     others.onChange(val);
      //   }
      // }}
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
