import { forwardRef, useEffect, useState } from "react";
import { useDbData } from "../DbData";
import { Box, Button, Combobox, InputBase, useCombobox } from "@mantine/core";
import { useTranslation } from "react-i18next";

export const UomsDropped = forwardRef<any, any>(
  ({ onSubmit, defaultValue, ...others }, ref) => {
    const { t } = useTranslation("common", { keyPrefix: "global-comp" });
    const [value, setValue] = useState<string | null>(defaultValue);
    const [search, setSearch] = useState(defaultValue);
    const [submitOnEnter, setSubmitOnEnter] = useState("");
    let { uom: dataUOM } = useDbData();
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const combobox = useCombobox({
      onDropdownClose: () => combobox.resetSelectedOption(),
    });
    useEffect(() => {
      combobox.openDropdown();
    }, []);
    useEffect(() => {
      if (submitOnEnter == "") return;
      submit(search);
    }, [submitOnEnter]);
    const shouldFilterOptions = dataUOM && dataUOM.length > 0;
    const valueFound = dataUOM.some((item) => item.uom === search.trim());
    
    const filteredOptions = shouldFilterOptions
      ? dataUOM.filter((item) =>
          item.uom.toLowerCase().includes(search.toLowerCase().trim())
        )
      : dataUOM;
    const options = filteredOptions.map((item) => (
      <Combobox.Option value={item.uom} key={item.uom}>
        {item.uom}
      </Combobox.Option>
    ));
    const submit = (val) => {
      setValue(val);
      setSearch(val);
      setSelectedItem(val);
      combobox.closeDropdown();
      if (onSubmit) {
        onSubmit(val);
      }
    };

    return (
      <>
        <Combobox
          withinPortal={true}
          store={combobox}
          width={100}
          position="bottom-end"
          withArrow
          onOptionSubmit={submit}
        >
          <Combobox.Target ref={ref}>
            <InputBase
              variant="unstyled"
              w="70px"
              rightSectionPointerEvents="none"
              onClick={() => combobox.openDropdown()}
              onFocus={() => combobox.openDropdown()}
              onBlur={() => {
                combobox.closeDropdown();
                setSearch(value || "");
              }}
              value={search}
              onChange={(event) => {
                combobox.updateSelectedOptionIndex();
                setSearch(event.currentTarget.value);
              }}
              placeholder={t("uom", "UOM")}
              {...others}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  if (valueFound) {
                    setSubmitOnEnter(new Date().getTime().toString());
                  } else combobox.openDropdown();
                }
              }}
            />
          </Combobox.Target>
          <Combobox.Dropdown>
            <Combobox.Options>{options}</Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>
      </>
    );
  }
);

export const CurrenciesDropped = forwardRef<any, any>(
  ({ onSubmit, defaultValue, ...others }, ref) => {
    const { t } = useTranslation("common", { keyPrefix: "global-comp" });
    const [value, setValue] = useState<string | null>(defaultValue);
    const [search, setSearch] = useState(defaultValue);
    const [submitOnEnter, setSubmitOnEnter] = useState("");
    let { curr: dataCURR } = useDbData();
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const combobox = useCombobox({
      onDropdownClose: () => combobox.resetSelectedOption(),
    });
    useEffect(() => {
      combobox.openDropdown();
    }, []);
    useEffect(() => {
      if (submitOnEnter == "") return;
      submit(search);
    }, [submitOnEnter]);
    const shouldFilterOptions = dataCURR && dataCURR.length > 0;
    const valueFound = dataCURR.some(
      (item) => item?.curr_symbol === search?.trim()
    );

    const filteredOptions = shouldFilterOptions
      ? dataCURR.filter((item) =>
          item?.curr_symbol
            ?.toLowerCase()
            ?.includes(search?.toLowerCase().trim())
        )
      : dataCURR;
    const options = filteredOptions.map((item) => (
      <Combobox.Option value={item.curr_symbol} key={item.curr_symbol}>
        {item.curr_symbol}
      </Combobox.Option>
    ));
    const submit = (val) => {
      setValue(val);
      setSearch(val);
      setSelectedItem(val);
      combobox.closeDropdown();
      if (onSubmit) {
        onSubmit(val);
      }
    };

    return (
      <>
        <Combobox
          withinPortal={true}
          store={combobox}
          width={100}
          position="bottom-end"
          withArrow
          onOptionSubmit={submit}
        >
          <Combobox.Target ref={ref}>
            <InputBase
              variant="unstyled"
              w="70px"
              rightSectionPointerEvents="none"
              onClick={() => combobox.openDropdown()}
              onFocus={() => combobox.openDropdown()}
              onBlur={() => {
                combobox.closeDropdown();
                setSearch(value || "");
              }}
              value={search}
              onChange={(event) => {
                combobox.updateSelectedOptionIndex();
                setSearch(event.currentTarget.value);
              }}
              placeholder={t("currency", "Currency")}
              {...others}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  if (valueFound) {
                    setSubmitOnEnter(new Date().getTime().toString());
                  } else combobox.openDropdown();
                }
              }}
            />
          </Combobox.Target>
          <Combobox.Dropdown>
            <Combobox.Options>{options}</Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>
      </>
    );
  }
);
