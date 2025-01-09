import { useEffect, useState } from "react";
import {
  Button,
  CloseButton,
  Combobox,
  Input,
  InputBase,
  MantineFontSize,
  MantineSize,
  MantineStyleProps,
  ScrollArea,
  SelectProps,
  StyleProp,
  Text,
  useCombobox,
} from "@mantine/core";
import { useGlobalStyl } from "../../hooks/useTheme";
import { useUncontrolled } from "@mantine/hooks";
interface AppSelectProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "onChange">,
    MantineStyleProps {
  value?: string | number | readonly string[] | undefined;
//   defaultValue?: string | number | readonly string[] | undefined;
  onChange?: any; 
  error?: React.ReactNode;
  data?: any;
  placeholder?: string | undefined;
  label?: string | React.ReactNode; 
  maxDropdownHeight?: number | string;
  searchable?: boolean;
  clearable?: boolean;
//   w?: string | number | undefined;
//   maw?: number | string;
  limit?: number | undefined;
  disabled?: boolean;
  readOnly?: boolean;
  renderOption?: any;
  withAsterisk?: boolean;
//   validate?: any;
//   fz?: StyleProp<
//     MantineFontSize | `h${1 | 2 | 3 | 4 | 5 | 6}` | number | (string & {})
//   >;
  size?: MantineSize | (string & {});
//   description?: React.ReactNode;
  withinPortal?: boolean;
  leftSection?: React.ReactNode;
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
  w,
  maw,
  limit,
  disabled,
  readOnly,
  renderOption,
  withAsterisk,
  onBlur,
  withinPortal,
  leftSection,
  ...others
}: AppSelectProps) {
  const { classes: classesG } = useGlobalStyl();
  searchable = !!searchable;
  clearable = !!clearable;
  disabled = !!disabled;
  readOnly = !!readOnly;
  withAsterisk = !!withAsterisk;
  withinPortal = !!withinPortal;
  limit = limit && limit > 0 ? limit : 1000000;
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const [_value, setValue] = useUncontrolled<any>({
    value,
    defaultValue,
    finalValue: null,
    onChange,
  });
  const [search, setSearch] = useState<string>("");
  useEffect(() => {

    SetSearchDrop(value);
  }, [value,data]);
  const _data = data && data.length > 0 ? data : [];
  const shouldFilterOptions = _data.every((item) => item.label !== search);
  const filteredOptions = shouldFilterOptions
    ? _data
        .filter((item) => {
          let v = item.label.toString();
          try {
            v = v.toLowerCase().includes(search.toLowerCase().trim());
          } catch (error) {
            console.log(error);
          }

          return v;
        })
        .slice(0, limit)
    : _data.slice(0, limit);

  const current_object: (val) => {
    value: string | null | undefined;
    label: string | null | undefined;
  } = (val) => {
    for (let i = 0; i < _data.length; i++)
      if (_data[i]["value"] === val) return _data[i];
    return { value: null, label: null };
  };

  //   const [valueLabel, setValueLabel] = useState<string|null>("");

  //   useEffect(() => {
  //     setValueLabel(current_object().label);
  //   }, [_value]);
  const _renderOption = (item) => {
    if (renderOption) return renderOption(item);
    return item.label;
  };
  const options = filteredOptions?.map((item, index) => (
    <Combobox.Option
      value={item.value}
      key={item.value}
      //   onMouseOver={() => combobox.selectOption(index)}
      className={value === item.value ? classesG.comboBoxSelectedOption : ""}
    >
      {_renderOption(item)}
    </Combobox.Option>
  ));
  const SetSearchDrop = (val) => {
    let srch = "";
    let srchv = current_object(val).label;
    srch = srchv && srchv !== "" ? srchv.toString() : "";
    setSearch(srch);
  };
  return (
    <Combobox
      store={combobox}
      withinPortal={withinPortal}
      onOptionSubmit={(val: any) => {
        // SetSearchDrop(val);
        setValue(val);
        if (onChange) onChange(val);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          //   component="button"
          //   type="button"
          leftSection={leftSection}
          withAsterisk={withAsterisk}
          disabled={disabled}
          w={w && (w !== "" || +w > 0) ? w : ""}
          maw={maw && (maw !== "" || +maw > 0) ? maw : ""}
          readOnly={!searchable || readOnly}
          pointer
          rightSection={
            value != null && value != "" && clearable ? (
              <CloseButton
                size="sm"
                onMouseDown={(event) => {
                  event.preventDefault();
                  //   setValue(null);
                  //   if (onChange) onChange(null);
                }}
                onClick={() => {
                  //   SetSearchDrop("");
                  setValue(null);
                  if (onChange) onChange(null);
                }}
                aria-label="Clear value"
              />
            ) : (
              <Combobox.Chevron />
            )
          }
          onClick={() => combobox.openDropdown()}
          //   rightSectionPointerEvents="none"
          label={label}
          value={search}
          placeholder={placeholder}
          onFocus={() => combobox.openDropdown()}
          onBlur={(e) => {
            combobox.closeDropdown();
            SetSearchDrop(value);
            if (onBlur) onBlur(e);
          }}
          onChange={(event) => {
            combobox.openDropdown();
            combobox.updateSelectedOptionIndex();
            setSearch(event.currentTarget.value);
          }}
          {...others}
          error={error}

          //   onInvalid={(e)=>{
          //     setError(true);
          //   }}
        />
        {/* {valueLabel || (
            <Input.Placeholder className={classesG.comboBoxPlaceHolder}>
              {placeholder}
            </Input.Placeholder>
          )} */}
        {/* </InputBase> */}
      </Combobox.Target>
      {/* {<Text c="red">{limit}</Text>} */}

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
