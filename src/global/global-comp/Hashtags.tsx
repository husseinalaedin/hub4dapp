import { Box, CloseButton, Flex, MultiSelect, rem } from "@mantine/core";
import { forwardRef, useEffect, useState } from "react";
import { useAxiosGet } from "../../hooks/Https";
import { BUILD_API, G, useMessage } from "../G";
import { IconHash } from "@tabler/icons-react"; 
import { useGlobalStyl } from "../../hooks/useTheme";

// export const Hashtags = ({ initval,...others }) => {
//     const { error, succeed, info } = useMessage();
//     const [searchValue, onSearchChange] = useState('');
//     const [data, setData] = useState<any>(() => {
//         return []
//     })
//     const [val, setVal] = useState<any>(initval)
//     const { data: hashGet, errorMessage: errorMessageHashGet, succeeded: succeededHashGet, executeGet: executeHashGet } = useAxiosGet(BUILD_API('hashtags'), { searchterm: searchValue });
    
//     useEffect(() => {
//         let errorMsg = errorMessageHashGet
//         if (errorMsg)
//             error(errorMsg)
//         if (succeededHashGet && hashGet) {
//             setData(() => {
//                 if (hashGet) {
//                     let hashtags = val ? val:[]//form.values.hashtags
//                     if (hashtags && hashtags.length > 0) {
//                         hashtags.map((item) => {
//                             let found = false
//                             hashGet.map((itemS) => {
//                                 if (item == itemS) {
//                                     found = true;
//                                     return;
//                                 }
//                             })
//                             if (!found) {
//                                 hashGet.push(item)
//                             }
//                         })
//                     }
//                     return hashGet
//                 }
//                 return []
//             })
//         }
//     }, [errorMessageHashGet, succeededHashGet])
//     return (

//         <MultiSelect
//             value={val}
            
//             onKeyDown={(event) => {
//                 if (event.code === 'Space') {
//                     event.preventDefault();
//                 }
//             }}
            
//             data={data}
//             label="Hashtag#"
//             placeholder="#"
//             searchable
//             searchValue={searchValue}
//             onSearchChange={(event) => {
//                 executeHashGet()
//                 return onSearchChange(event)
//             }}
             
//             clearable
//             creatable
//             maxDropdownHeight={250}
//             valueComponent={HashValue}
//             itemComponent={HashItem}
//             limit={20}
//             getCreateLabel={(query) => `+ Create ${query}`}
//             onCreate={(query) => {
//                 const item = { value: query, label: query };
//                 setData((current) => [...current, item]);
//                 return item;
//             }}
//             {...others}
//         />
//     )
// }

export function HashValue({
    value,
    label,
    onRemove,
    classNames,
    ...others
}: any) {
    // const Flag = flags[value];
    return (
        <div {...others}>
            <Box
                style={(theme) => ({
                    display: 'flex',
                    cursor: 'default',
                    alignItems: 'center',
                    // backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
                    // border: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[4]
                    //     }`,
                    paddingLeft: theme.spacing.xs,
                    borderRadius: theme.radius.sm,
                })}
            >
                <Box>
                    <IconHash size={12} />
                </Box>
                <Box style={{ lineHeight: 1, fontSize: rem(12) }}
                >{G.replace_all(label, '#', '')}</Box>
                <CloseButton
                    onMouseDown={onRemove}
                    variant="transparent"
                    size={22}
                    iconSize={14}
                    tabIndex={-1}
                />

            </Box>
        </div>
    );
}
export function HashValue4BoardSearch({
    value,
    onRemove2,
    label,
    onRemove,
    classNames,
    ...others
}: any) {
    // const Flag = flags[value];
    return (
        <div {...others}>
            <Box
                style={(theme) => ({
                    display: 'flex',
                    cursor: 'default',
                    alignItems: 'center',
                    // backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
                    // border: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[4]
                    //     }`,
                    paddingLeft: theme.spacing.xs,
                    borderRadius: theme.radius.sm,
                })}
            >
                <Box>
                    <IconHash size={13} />
                </Box>
                <Box style={{ lineHeight: 1.5, fontSize: rem(18) }}>{G.replace_all(label, '#', '')}</Box>
                <CloseButton
                    onMouseDown={() => {
                        if (onRemove2)
                            onRemove2(value)
                    }}
                    variant="transparent"
                    size={22}
                    iconSize={14}
                    tabIndex={-1}
                />

            </Box>
        </div>
    );
}
export function HashValue4Board({
    value,
    label,
    onRemove,
    classNames,
    
    ...others
}:any //MultiSelectValueProps
 & { value: string }) {
    // const Flag = flags[value];
    return (
        <div {...others}>
            <Box
                // fz={"30px"}
                style={(theme) => ({
                    display: 'flex',
                    cursor: 'default',
                    alignItems: 'center',
                    // backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
                    // border: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[4]
                    //     }`,
                    paddingLeft: theme.spacing.xs,
                    borderRadius: theme.radius.sm,
                })}
            >
                <Box mt={10}>
                    <IconHash size={14} />
                </Box>
                <Box style={{ lineHeight: 2, fontSize: rem(20) }}>{G.replace_all(value, '#', '')}</Box>
                <Box ml="5px" mt="-20px" mr="5px" c="red">
                    {label && +label > 200 ? "200+" : label}
                </Box>
            </Box>
        </div>
    );
}
// export const HashItem = forwardRef<HTMLDivElement, SelectItemProps>(({ label, value, ...others }, ref) => {

//     return (
//         <div ref={ref} {...others}>
//             <Flex align="center">
//                 <Box>
//                     <IconHash size={12} />
//                 </Box>
//                 <div>{G.replace_all(label, '#', '')}</div>
//             </Flex>
//         </div>
//     );
// });

export function HashValue4Boardd({
     
    label,
    postcount
}) {
    // const Flag = flags[value];
    const { classes: classesG } = useGlobalStyl()
    return (
        <div >
            <Box
                style={(theme) => ({
                    display: 'flex',
                    
                    alignItems: 'center',
                   
                })}
            >
                {/* <Box mt={10}>
                    <IconHash size={16} />
                </Box> */}
                <Box style={{ lineHeight: 2, fontSize: rem(20) }} className={`${"hash-underline-child"}`}>{label}</Box>
                <Box ml="15px" mt="-10px" mr="-2px" c="red" className={`${"hash-no-underline-child"}`}>
                    {postcount && +postcount > 200 ? "200+" : postcount}
                    {/* {postcount} */}
                </Box>
            </Box>
        </div>
    );
}
export function HashValue4Boardd2({

    label
}) {
    // const Flag = flags[value];
    return (
        <div >
            <Box
                style={(theme) => ({
                    display: 'inline-block',

                    alignItems: 'center',

                })}
            >
                {/* <Box mt={10}>
                    <IconHash size={18} />
                </Box> */}
                <Box className={`${"hash-underline-child"}`}  style={{ lineHeight: 2, fontSize: rem(16) }}>{label}</Box>
                
            </Box>
        </div>
    );
}
export function Wtsb4BoardSearch({
    value,
    onRemove2,
    label,
    onRemove,
    classNames,
    ...others
}: any) {
    // const Flag = flags[value];
    return (
        <div {...others} style={{display:"none"}}>
             
        </div>
    );
}