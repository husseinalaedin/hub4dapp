import { Select } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { AppSelect } from "./global-comp/AppSelect";

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
        <AppSelect
            // zIndex={501}
            forceDrop={true}
            clearable
            withinPortal={false}
            {...others}
            label={t('share_expired_option', "Expired?")}
            placeholder={t('share_expired_option', "Expired?")}
            maxDropdownHeight={300}
            data={data}
        />
    )
}
