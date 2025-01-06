import { Box, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useGlobalStyl } from "../hooks/useTheme";

export const NoDataFound = (props) => {
    const { t } = useTranslation('common', { keyPrefix: 'tool' });
    const title = props.title && props.title != "" ? props.title : t('no_data_avail', 'No Data Found!.')
    const { classes: classesG } = useGlobalStyl()
    return (
        <Box mt="md">
            <Box style={{ margin: "auto", textAlign: "center" }} mt="md">
                <Title order={1} p={100} className={`${classesG.paper} `}>{title}
                </Title>
                {props.children}
            </Box>
        </Box>


    )
}