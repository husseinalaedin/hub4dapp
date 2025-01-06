import { Group, Select, Text } from "@mantine/core" 
import { useTranslation } from "react-i18next"; 
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
        <Select
            searchable clearable
            {...others}
            label={t('channel_active', "Active?")}
            placeholder={t('channel_active', "Active?")}
            maxDropdownHeight={300}
            data={data}
        />
    )
}