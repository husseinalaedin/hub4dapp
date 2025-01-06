import { Select } from "@mantine/core";
import { useTranslation } from "react-i18next";

export const ExpiredSelect = ({ ...others }) => {
    const { t } = useTranslation('private', { keyPrefix: 'shares' });
    let data = [{
        value: 'no',
        label: t('no', 'No')
    }, {
        value: 'yes',
        label: t('yes', 'Yes')
    }, {
        value: 'A',
        label: t('both', 'Both')
    }]
    return (
        <Select
            zIndex={501}
            
            withinPortal={true}
            {...others}
            label={t('share_expired_option', "Expired?")}
            placeholder={t('share_expired_option', "Expired?")}
            maxDropdownHeight={300}
            data={data}
        />
    )
}
