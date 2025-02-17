import { Group, Select, Text } from "@mantine/core" 
import { useTranslation } from "react-i18next"; 
import { renderSelectOption } from "./RenderOptions";
import { AppSelect } from "./AppSelect";
export const ActiveSelect = ({ ...others }) => {
    const { t } = useTranslation('common', { keyPrefix: 'global-comp' });
    let data = [{
        value: 'no',
        label: t('no', 'No')
    }, {
        value: 'yes',
        label: t('yes', 'Yes')
    }, {
        value: 'both',
        label: t('both', 'Both')
    }]
    return (
      <AppSelect
      forceDrop={true}
        label={t("channel_active", "Active?")}
        // searchable
        clearable
        {...others}

        placeholder={t("channel_active", "Active?")}
        maxDropdownHeight={300}
        data={data}
        // comboboxProps={{ withinPortal: false }}
      />
    );
}