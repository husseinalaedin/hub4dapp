import { Select } from "@mantine/core"
import { forwardRef, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppSelect } from "./AppSelect";

export const ConcernStatus = ({ data,changed=null, ...others }) => {
    const { t } = useTranslation('common', { keyPrefix: 'global-comp' });
    
    return (
        <AppSelect
           
           
            {...others}
            
            label={t('concern_status', "Concern Status")}
            placeholder={t('concern_status', "Concern Status")}
            limit={10}
            maxDropdownHeight={300}
            // value={value}
            // onChange={setValue}
            data={data?.map((itm) => {
                return {
                    value: itm.id,
                    label: itm.status
                }
            })}
        />
    )
}

export const ConcernPriorities = ({ data, ...others }) => {
    const { t } = useTranslation('common', { keyPrefix: 'global-comp' });
    return (
        <AppSelect
            
            {...others}
            // {...form.getInputProps('period')}
            label={t('concern_priorities', "Concern Priorities")}
            placeholder={t('concern_priorities', "Concern Priorities")}
            limit={10}
            maxDropdownHeight={300}

            data={data?.map((itm) => {
                return {
                    value: itm.id,
                    label: itm.priority
                }
            })}
        />
    )
}
export const ConcernCategories = ({ data, ...others }) => {
    const { t } = useTranslation('common', { keyPrefix: 'global-comp' });
    return (
      <AppSelect
        {...others}
        // {...form.getInputProps('period')}
        label={t("category", "Category")}
        placeholder={t("category", "Category")}
        limit={10}
        maxDropdownHeight={300}
        data={data?.map((itm) => {
          return {
            value: itm.id,
            label: itm.category,
          };
        })}
      />
    );
}




