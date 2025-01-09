import { Select } from "@mantine/core"
import { useTranslation } from "react-i18next";
import { AppSelect } from "./AppSelect";

export const DatePeriods = ({ dataLastDays, ...others }) => {
    const { t } = useTranslation('common', { keyPrefix: 'global-comp' });
    return (
      <AppSelect
        defaultValue={"1"}
        style={{ zIndex: 501 }}
        // withinPortal={true}
        {...others}
        // {...form.getInputProps('period')}
        label={t("date_period", "Date Period")}
        placeholder={t("date_period", "Date Period")}
        limit={10}
        maxDropdownHeight={300}
        data={dataLastDays?.map((itm) => {
          return {
            value: itm.id,
            label: itm.last_desc,
          };
        })}
      />
    );
}
