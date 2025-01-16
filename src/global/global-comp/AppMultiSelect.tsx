import { forwardRef, useEffect, useState } from "react";
import {
  Box,
  CloseButton,
  Combobox,
  InputBase,
  MantineSize,
  MantineStyleProp,
  MantineStyleProps,
  Pill,
  PillsInput,
  ScrollArea,
  useCombobox,
} from "@mantine/core";
import { useGlobalStyl } from "../../hooks/useTheme";
import { useUncontrolled } from "@mantine/hooks";
import { G } from "../G";
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
  createOnNotFound?: any;
  onEscape?: any;
  rightSection?: any;
  ref?: any;
  charsNotAllowed?: string[];
}
export const AppMultiSelect = forwardRef<any, AppMultiSelectProps>(
  (
    {
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
      createOnNotFound,
      style,
      onEscape,
      rightSection,
      charsNotAllowed,
      ...others
    }: AppMultiSelectProps,
    ref // Receive the ref as the second argument
  ) => {
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
    const [charNotAllowed, setCharNotAllowed] = useState("");
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
      value: searchValue,
      // defaultValue: "",
      // finalValue: "",
      onChange: onSearchChange,
    });
    useEffect(() => {
      if (charNotAllowed == "") return;
      const timer = setTimeout(() => {
        setCharNotAllowed("");
      }, 2000);

      return () => clearTimeout(timer);
    }, [charNotAllowed]);
    useEffect(() => {
      if (defaulted) return;
      setDefaulted(true);
      if (defaultValue && defaultValue.length > 0) setValue(defaultValue);
    }, [defaultValue]);
    const handleValueSelect = (val: string) => {
      //  const newArr = !value
      //    ? [val]
      //    : value.includes(val)
      //    ? value
      //    : [...value, val];
      //  setValue(newArr);
      setValue((current) => {
        if (!current) return [val];
        return current.includes(val)
          ? current.filter((v) => v !== val)
          : [...current, val];
      });
      setSearch("");
    };
    const handleValueByEnter = async () => {
      if (!searchValue || searchValue == "") return;
      let item: any = current_object(searchValue);
      if (!(!item || !item.value)) {
        handleValueSelect(item.label);
        return;
      }
      if (createOnNotFound) {
        let result = await createOnNotFound(searchValue);
        if (result.added) {
          handleValueSelect(String(searchValue));
        }
      }
    };
    const handleValueRemove = (val: string) =>
      setValue((current) => current.filter((v) => v !== val));

    const _data = data && data.length > 0 ? data : [];
    const shouldFilterOptions =
      _searchValue &&
      _searchValue !== "" &&
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
        if (_data[i]["label"] === val) return _data[i];
      return { value: null, label: null };
    };

    const _renderOption = (item) => {
      if (renderOption) return renderOption(item);
      return item.label;
    };
    const _renderSelectedValue = (val) => {
      let item: any = current_object(val);
      if (renderSelectedValue) return renderSelectedValue(item);
      if (!item || !item.label) return val;
      return item.label;
    };
    const options = filteredOptions
      ?.filter((item) => !_value?.includes(item.label))
      ?.map((item) => (
        <Combobox.Option
          value={item.label}
          key={item.value}
          className={
            value === item.value ? classesG.comboBoxSelectedOption : ""
          }
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
    const getAllowedValue = (val) => {
      if (charsNotAllowed && charsNotAllowed.length > 0) {
        for (let i = 0; i < charsNotAllowed.length; i++) {
          val = G.replace_all(val, charsNotAllowed[i], "");
        }
      }
      return val;
    };
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
            style={style}
            rightSection={rightSection}
            w="100%"
          >
            <Pill.Group>
              {values}

              <Combobox.EventsTarget>
                <PillsInput.Field
                  {...others}
                  ref={ref}
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
                    let allowed_v = getAllowedValue(event.currentTarget.value);
                    combobox.updateSelectedOptionIndex();
                    setSearch(allowed_v);
                  }}
                  onKeyDown={(event) => {
                    console.log(event.key, "ENTER");
                    if (readOnly) return;
                    let lnt =
                      _searchValue && _searchValue.length > 0
                        ? _searchValue.length
                        : 0;
                    if (event.key === "Backspace" && lnt === 0) {
                      console.log(event.key, "DELETE", lnt, "VALUE", _value);
                      event.preventDefault();
                      if (_value && _value.length > 0)
                        handleValueRemove(_value[_value.length - 1]);
                    }
                    if (event.key === "Enter" && lnt > 0) {
                      event.preventDefault();
                      handleValueByEnter();
                    }
                    if (event.key === "Escape" && lnt > 0) {
                      event.preventDefault();
                      onEscape(event);
                    }
                  }}
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
);
export function useAppMultiSelectToAddMissedSearchVal<T>(
  setData: React.Dispatch<React.SetStateAction<T[]>>
) {
  const [pendingUpdate, setPendingUpdate] = useState<{
    value: T;
    callback: (result: { added: boolean }) => void;
  } | null>(null);

  useEffect(() => {
    if (pendingUpdate !== null) {
      // Update the data array
      setData((prevData) => {
        const updatedData = [...prevData, pendingUpdate.value];
        // Call the callback after the update
        pendingUpdate.callback({ added: true });
        return updatedData;
      });

      // Clear the pending update
      setPendingUpdate(null);
    }
  }, [pendingUpdate, setData]);

  const addPendingUpdate = (value: T) => {
    return new Promise<{ added: boolean }>((resolve) => {
      setPendingUpdate({ value, callback: resolve });
    });
  };

  return addPendingUpdate;
}
