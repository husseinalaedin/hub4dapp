import { useEffect, useState } from "react";
import {
  Button,
  CloseButton,
  Combobox,
  Input,
  InputBase,
  ScrollArea,
  SelectProps,
  useCombobox,
} from "@mantine/core";
import { useGlobalStyl } from "../../hooks/useTheme";
import { useUncontrolled } from "@mantine/hooks";
interface AppSelectProps {
  //   extends Omit<React.ComponentPropsWithoutRef<"input">, "onChange">
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string | null) => void;
  error?: React.ReactNode;
  data?: any;
  placeholder?: string | React.ReactNode;
  label?: string | React.ReactNode; // Add the label prop here
  maxDropdownHeight?: number | string;
  searchable: boolean;
  clearable: boolean;
}
export function AppSelect({
  value,
  defaultValue,
  onChange,
  error,
  label,
  placeholder,
  maxDropdownHeight,
  searchable,
  clearable,
  data,
  ...others
}: AppSelectProps) {
  const { classes: classesG } = useGlobalStyl();

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const _data = data && data.length > 0 ? data : [];
  const [_value, setValue] = useUncontrolled<any>({
    value,
    defaultValue,
    finalValue: null,
    onChange,
  });

  const current_object: any = () => {
    for (let i = 0; i < _data.length; i++)
      if (_data[i]["value"] === _value) return _data[i];
    return { value: null, label: null };
  };

  const [_label, setLabel] = useState("");
  useEffect(() => {
    setLabel(current_object().label);
  }, [_value]);

  const options = data?.map((item, index) => (
    <Combobox.Option
      value={item.value}
      key={item.value}
      //   onMouseOver={() => combobox.selectOption(index)}
      className={value === item.value ? classesG.comboBoxSelectedOption : ""}
    >
      {item.label}
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val: any) => {
        setValue(val);
        if (onChange) onChange(val);
        combobox.closeDropdown();
      }}
      width="100%"
    >
      <Combobox.Target>
        <InputBase
          w="100%"
          component="button"
          type="button"
          pointer
          rightSection={
            value != null ? (
              <CloseButton
                size="sm"
                onMouseDown={(event) => {
                  event.preventDefault();
                  //   setValue(null);
                  //   if (onChange) onChange(null);
                }}
                onClick={() => {
                  setValue(null);
                  if (onChange) onChange(null);
                }}
                aria-label="Clear value"
              />
            ) : (
              <Combobox.Chevron />
            )
          }
          onClick={() => combobox.toggleDropdown()}
          //   rightSectionPointerEvents="none"
          label={label}

          //   defaultChecked={props.defaultChecked}
        >
          {_label || (
            <Input.Placeholder className={classesG.comboBoxPlaceHolder}>
              {placeholder}
            </Input.Placeholder>
          )}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown
      //   onMouseLeave={() => combobox.resetSelectedOption()}
      >
        <Combobox.Options>
          <ScrollArea.Autosize
            mah={
              maxDropdownHeight &&
              (+maxDropdownHeight > 0 || maxDropdownHeight != "")
                ? maxDropdownHeight
                : ""
            }
            style={{ overflowY: "auto" }}
            type="scroll"
          >
            {options}
          </ScrollArea.Autosize>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
