import { useEffect, useState } from "react";
import {
  CloseButton,
  Combobox,
  InputBase,
  MantineSize,
  MantineStyleProps,
  Pill,
  PillsInput,
  ScrollArea,
  useCombobox,
} from "@mantine/core";
import { useGlobalStyl } from "../../hooks/useTheme";
import { useUncontrolled } from "@mantine/hooks";
interface AppMultiSelectProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "onChange">,
    MantineStyleProps {
  value?: readonly string[] | undefined;
  searchValue?: string;
  defaultValue?: readonly string[] | undefined;
  onChange?: any;
  onSearchChange?: any;
  error?: React.ReactNode;
  data?: any;
  placeholder?: string | undefined;
  label?: string | React.ReactNode;
  maxDropdownHeight?: number | string;
  searchable?: boolean;
  clearable?: boolean;
  limit?: number | undefined;
  disabled?: boolean;
  readOnly?: boolean;
  renderOption?: any;
  renderSelectedValue?: any;
  withAsterisk?: boolean;
  // inputSize?: MantineSize | (string & {});
  withinPortal?: boolean;
  leftSection?: React.ReactNode;
  description?: React.ReactNode;
  required?: boolean;
}
export function AppMultiSelect({
  value,
  searchValue,
  defaultValue,
  onChange,
  onSearchChange,
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
  renderSelectedValue,
  withAsterisk,
  onBlur,
  withinPortal,
  leftSection,
  description,
  required,
  ...others
}: AppMultiSelectProps) {
  const { classes: classesG } = useGlobalStyl();
  searchable = !!searchable;
  clearable = !!clearable;
  disabled = !!disabled;
  readOnly = !!readOnly;
  withAsterisk = !!withAsterisk;
  withinPortal = !!withinPortal;
  required = !!required;
  limit = limit && limit > 0 ? limit : 1000000;
  // value = !!value ? value : [];
  const [defaulted, setDefaulted] = useState(false);
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const [_value, setValue] = useUncontrolled<any>({
    value,
    defaultValue,
    finalValue: null,
    onChange,
  });
  const [_searchValue, setSearch] = useUncontrolled<string>({
    value: searchValue ,
    // defaultValue: "",
    // finalValue: "",
    onChange: onSearchChange,
  });
  // const [search, setSearch] = useState<string>("");

  useEffect(() => {}, [data, _value]);

  useEffect(() => {
    if (defaulted) return;
    setDefaulted(true);
    if (defaultValue && defaultValue.length > 0) setValue(defaultValue);
  }, [defaultValue]);
  const handleValueSelect = (val: string) => {
    setValue((current) => {
      if (!current) return [val];
      return current.includes(val)
        ? current.filter((v) => v !== val)
        : [...current, val];
    });
    setSearch('')
  };
  const handleValueRemove = (val: string) =>
    setValue((current) => current.filter((v) => v !== val));

  const _data = data && data.length > 0 ? data : [];
  const shouldFilterOptions =
    _searchValue && _searchValue !== "" &&
    _data.every((item) => item.label !== _searchValue);
  const filteredOptions = shouldFilterOptions
    ? _data
        .filter((item) => {
          const label = item.label.toLowerCase();
          const searchText = _searchValue?.toLowerCase().trim();
          return label.includes(searchText);
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

  const _renderOption = (item) => {
    if (renderOption) return renderOption(item);
    return item.label;
  };
  const _renderSelectedValue = (val) => {
    let item: any = current_object(val);
    if (renderSelectedValue) return renderSelectedValue(item);
    return item.label;
  };
  const options = filteredOptions?.map((item) => (
    <Combobox.Option
      value={item.value}
      key={item.value}
      className={value === item.value ? classesG.comboBoxSelectedOption : ""}
    >
      {_renderOption(item)}
    </Combobox.Option>
  ));

  const values = _value?.map((val) => (
    <Pill
      key={val}
      withRemoveButton={!readOnly}
      onRemove={() => handleValueRemove(val)}
    >
      {_renderSelectedValue(val)}
    </Pill>
  ));
  return (
    <Combobox
      store={combobox}
      withinPortal={withinPortal}
      onOptionSubmit={handleValueSelect}
      readOnly={readOnly}
    >
      <Combobox.DropdownTarget>
        <PillsInput
          onClick={() => {
            if (readOnly) return;
            combobox.openDropdown();
          }}
          error={error}
          onBlur={(e) => {
            if (readOnly) return;
            combobox.closeDropdown();
            if (onBlur) onBlur(e);
          }}
          description={description}
          required={required}
          label={label}
        >
          <Pill.Group>
            {values}

            <Combobox.EventsTarget>
              <PillsInput.Field
                required={required}
                readOnly={readOnly}
                onFocus={() => {
                  if (readOnly) return;
                  combobox.openDropdown();
                  combobox.updateSelectedOptionIndex();
                }}
                onBlur={() => {
                  if (readOnly) return;
                  combobox.closeDropdown();
                }}
                value={_searchValue}
                placeholder={placeholder}
                onChange={(event) => {
                  if (readOnly) return; 
                  combobox.updateSelectedOptionIndex();
                  setSearch(event.currentTarget.value);
                }}
                onKeyDown={(event) => {
                  if (readOnly) return;
                  if (event.key === "Backspace" && _searchValue?.length === 0) {
                    event.preventDefault();
                    if (value && value.length > 0)
                      handleValueRemove(value[value.length - 1]);
                  }
                }}
                {...others}
              />
            </Combobox.EventsTarget>
          </Pill.Group>
        </PillsInput>
      </Combobox.DropdownTarget>

      <Combobox.Dropdown>
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
