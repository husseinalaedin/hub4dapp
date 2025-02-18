import { forwardRef, useEffect, useRef, useState } from "react";
import {
  ActionIcon,
  Box,
  CloseButton,
  Combobox,
  FocusTrap,
  Group,
  InputBase,
  List,
  MantineSize,
  MantineStyleProp,
  MantineStyleProps,
  Modal,
  Pill,
  PillsInput,
  ScrollArea,
  useCombobox,
} from "@mantine/core";
import { useGlobalStyl } from "../../hooks/useTheme";
import { useDisclosure, useUncontrolled } from "@mantine/hooks";
import { G } from "../G";
import { IconCheck, IconX } from "@tabler/icons-react";
import { selectMedium, selectSmall } from "../../store/features/ScreenStatus";
import { useSelector } from "react-redux";
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
  onEmptyEnter?: any;
  addOnNotFound?: any;
  forceDrop?:any
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
      onEmptyEnter,
      addOnNotFound,
      forceDrop,
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
    forceDrop = !!forceDrop;
    limit = limit && limit > 0 ? limit : 1000000;
    // value = !!value ? value : [];
    const small = useSelector(selectSmall);
    const medium = useSelector(selectMedium);
    const [charNotAllowed, setCharNotAllowed] = useState("");
    const [enterClicked, setEnterClicked] = useState("");
    const [defaulted, setDefaulted] = useState(false);
    const [hoverIndex, setHoverIndex] = useState(-1);
    const [handlePopFocus,setHandlePopFocus]=useState("")
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
      // setHandlePopFocus('F'+new Date().getTime().toString())
      setHoverIndex(-1);
      setSearch("");
      setValue((current) => {
        if (!current) return [val];
        return current?.includes(val)
          ? current?.filter((v) => v !== val)
          : [...current, val];
      });
    };
    const handleValueByEnter = async () => {
      if (!searchValue || searchValue == "") return;
      let item: any = current_object(searchValue);
      if (!(!item || !item.value)) {
        handleValueSelect(item.label);
        return;
      }
      if (createOnNotFound && addOnNotFound) {
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
      _data.every(
        (item) => item?.label !== _searchValue && item?.value !== _searchValue
      );
    const filteredOptions = shouldFilterOptions
      ? _data
          .filter((item) => {
            const label = item?.label?.toLowerCase();
            const value = item?.value?.toLowerCase();
            const searchText = _searchValue?.toLowerCase().trim();
            return label?.includes(searchText) || value?.includes(searchText);
          })
          .slice(0, limit)
      : _data.slice(0, limit);

    const current_object: (val) => {
      value: string | null | undefined;
      label: string | null | undefined;
    } = (val) => {
      for (let i = 0; i < _data.length; i++)
        if (_data[i]["label"] === val || _data[i]["value"] === val)
          return _data[i];
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
      ?.filter(
        (item) =>
          !_value?.includes(item?.label) && !_value?.includes(item?.value)
      )
      ?.map((item) => (
        <Combobox.Option
          value={item.value}
          key={item.value}
          className={
            value === item?.value ? classesG.comboBoxSelectedOption : ""
          }
        >
          {_renderOption(item)}
        </Combobox.Option>
      ));
    const handleKeyDown = (event) => {
      if (optionsLength === 0) return;

      if (event.key === "ArrowDown") {
        setHandlePopFocus('B'+new Date().getTime().toString())
        setHoverIndex((prev) => (prev + 1) % optionsLength);
      } else if (event.key === "ArrowUp") {
        setHandlePopFocus('B'+new Date().getTime().toString())
        setHoverIndex((prev) => (prev - 1 + optionsLength) % optionsLength);
      } else if (event.key === "Enter" && hoverIndex >= 0) {
        handleValueSelect(optionsPup[hoverIndex].props.value);
      }
    };
    const optionsPup = filteredOptions
      ?.filter(
        (item) =>
          !_value?.includes(item?.label) && !_value?.includes(item?.value)
      )
      ?.map((item, index) => (
        <List.Item
          style={{ cursor: "pointer" }}
          value={item.value}
          key={item.value}
          onClick={() => {
            handleValueSelect(item.label);
          }}
          className={`${
            hoverIndex === index ? classesG.hoverAppPopComMulti : ""
          }`}
        >
          {_renderOption(item)}
        </List.Item>
      ));
    const optionsLength = optionsPup.length;
    useEffect(() => {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [hoverIndex, optionsPup]);
    const values =
      _value &&
      _value?.map &&
      _value?.map((val) => {
        if (!val || val == "") return <></>;
        return (
          <Pill
            key={val}
            withRemoveButton={!readOnly}
            onRemove={() => handleValueRemove(val)}
          >
            {_renderSelectedValue(val)}
          </Pill>
        );
      });
    const getAllowedValue = (val) => {
      if (charsNotAllowed && charsNotAllowed.length > 0) {
        for (let i = 0; i < charsNotAllowed.length; i++) {
          val = G.replace_all(val, charsNotAllowed[i], "");
        }
      }
      return val;
    };
    useEffect(() => {
      if (enterClicked == "" || !searchValue || searchValue?.trim() == "")
        return;
      handleValueByEnter();
    }, [enterClicked]);
    const showAsPop = small && !forceDrop;;
    return (
      <>
        {!showAsPop && (
          <Combobox
            store={combobox}
            withinPortal={withinPortal}
            onOptionSubmit={handleValueSelect}
            readOnly={readOnly}
            offset={2}
            zIndex={1000000000000000}
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
                withAsterisk={withAsterisk}
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
                        let allowed_v = getAllowedValue(
                          event.currentTarget.value
                        );
                        combobox.updateSelectedOptionIndex();
                        setSearch(allowed_v);
                      }}
                      onKeyDown={(event) => {
                        if (readOnly) return;
                        let lnt =
                          _searchValue && _searchValue.length > 0
                            ? _searchValue.length
                            : 0;
                        if (event.key === "Backspace" && lnt === 0) {
                          event.preventDefault();
                          if (_value && _value.length > 0)
                            handleValueRemove(_value[_value.length - 1]);
                        }
                        if (event.key === "Enter" && lnt > 0) {
                          setEnterClicked(new Date().getTime().toString());
                          event.preventDefault();
                        }
                        if (event.key === "Enter" && lnt == 0) {
                          if (onEmptyEnter) onEmptyEnter();
                          event.preventDefault();
                        }

                        if (event.key === "Escape") {
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
        )}
        {showAsPop && (
          <PopUpMulti
            values={values}
            options={optionsPup}
            readOnly={readOnly}
            error={error}
            description={description}
            required={required}
            label={label}
            style={style}
            withAsterisk={withAsterisk}
            placeholder={placeholder}
            _searchValue={_searchValue}
            getAllowedValue={getAllowedValue}
            setSearch={setSearch}
            _value={_value}
            handleValueRemove={handleValueRemove}
            setEnterClicked={setEnterClicked}
            onEmptyEnter={onEmptyEnter}
            onEscape={onEscape}
            handlePopFocus={handlePopFocus}
            onFocus={()=>{
              setHoverIndex(-1)
            }}
          />
        )}
      </>
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
const PopUpMulti = (props) => {
  let {
    values,
    options,
    readOnly,
    error,
    description,
    required,
    label,
    style,
    withAsterisk,
    placeholder,
    _searchValue,
    getAllowedValue,
    setSearch,

    _value,
    handleValueRemove,
    setEnterClicked,
    onEmptyEnter,
    onEscape,
    handlePopFocus,
    onFocus
  } = props;
  const [opened, { open, close }] = useDisclosure(false);
  const { classes: classesG } = useGlobalStyl();
  const inputRef = useRef<any>(null);

  useEffect(() => {
    if (handlePopFocus == "") return;
    try {
      if (handlePopFocus.slice(0, 1) == "F") inputRef.current.focus();
      else inputRef.current.blur();
    } catch (error) {}
  }, [handlePopFocus]);
  const MultiPop = () => {
    return (
      <>
        <List icon={<></>}>{options}</List>
      </>
    );
  };
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation(); 
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return (
    <>
      <PillsInput
        onClick={() => {
          if (readOnly) return;
          open();
        }}
        error={error}
        description={description}
        required={required}
        label={label}
        style={style}
        w="100%"
        withAsterisk={withAsterisk}
      >
        <Pill.Group>
          {values}

          <PillsInput.Field placeholder={placeholder} readOnly={true} />
        </Pill.Group>
      </PillsInput>
      <Modal
        fullScreen
        withCloseButton={false}
        opened={opened}
        onClose={() => {
          close();
        }}
        scrollAreaComponent={ScrollArea.Autosize}
        yOffset={0}
        pt={0}
        classNames={{ body: classesG.modalBodyComboBox }}
        zIndex={1000000000000000}
        closeOnEscape={false}
      >
        <Box pos="relative">
          <Box pos="sticky" top={0} className={classesG.modalBodyComboBoxTitle}>
            <Group justify="space-between">
              <Box style={{ flex: 1 }}>
                <PillsInput
                  error={error}
                  description={description}
                  required={required}
                  label={label}
                  style={style}
                  w="100%"
                  withAsterisk={withAsterisk}
                >
                  <Pill.Group>
                    {values}
                    <PillsInput.Field
                    data-autofocus
                      ref={inputRef}
                      placeholder={placeholder}
                      value={_searchValue}
                      onChange={(event) => {
                        if (readOnly) return;
                        let allowed_v = getAllowedValue(
                          event.currentTarget.value
                        );

                        setSearch(allowed_v);
                      }}
                      onKeyDown={(event) => {
                        if (readOnly) return;
                        let lnt =
                          _searchValue && _searchValue.length > 0
                            ? _searchValue.length
                            : 0;
                        if (event.key === "Backspace" && lnt === 0) {
                          event.preventDefault();
                          if (_value && _value.length > 0)
                            handleValueRemove(_value[_value.length - 1]);
                        }
                        if (event.key === "Enter" && lnt > 0) {
                          setEnterClicked(new Date().getTime().toString());
                          event.preventDefault();
                        }
                        if (event.key === "Enter" && lnt == 0) {
                          if (onEmptyEnter) onEmptyEnter();
                          event.preventDefault();
                        }

                        if (event.key === "Escape") {
                          event.preventDefault();
                          onEscape(event);
                        }
                      }}
                      onFocus={()=>{
                        if(onFocus)
                          onFocus()
                      }}
                    />
                  </Pill.Group>
                </PillsInput>
              </Box>

              <ActionIcon onClick={close} variant="transparent" c="teal">
                <IconCheck />
              </ActionIcon>
            </Group>
          </Box>
          <MultiPop />
        </Box>
      </Modal>
    </>
  );
};
