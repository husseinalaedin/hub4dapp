import { Group, Select, Text } from "@mantine/core"
import { useTranslation } from "react-i18next";
import { AppSelect } from "./AppSelect";
export const YesNoBoth = ({label,placeholder, ...others }) => {
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
            searchable 
            clearable
            {...others}
            label={label}
            placeholder={placeholder}
            maxDropdownHeight={300}
            data={data}
        />
    )
}