import {
  ActionIcon,
  Alert,
  Box,
  CloseButton,
  Flex,
  MultiSelect,
  Popover,
  rem,
  Text,
} from "@mantine/core";
import { forwardRef, useEffect, useState } from "react";
import { useAxiosGet } from "../../hooks/Https";
import { BUILD_API, G, useMessage } from "../G";
import {
  IconHash,
  IconInfoCircle,
  IconQuestionMark,
} from "@tabler/icons-react";
import { useGlobalStyl } from "../../hooks/useTheme";
import {
  AppMultiSelect,
  useAppMultiSelectToAddMissedSearchVal,
} from "./AppMultiSelect";
import { ArrayToAppSelect } from "../Hashtags";
import { useTranslation } from "react-i18next";
import { useDisclosure } from "@mantine/hooks";

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
//             placeholder=HASHTAGS_SEP
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
export const HASHTAGS_SEP = ["#", ","];
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
          display: "flex",
          cursor: "default",
          alignItems: "center",
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
        <Box style={{ lineHeight: 1, fontSize: rem(12) }}>
          {G.replace_all_arr(label, HASHTAGS_SEP, "")}
        </Box>
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
          display: "flex",
          cursor: "default",
          alignItems: "center",
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
        <Box style={{ lineHeight: 1.5, fontSize: rem(18) }}>
          {G.replace_all_arr(label, HASHTAGS_SEP, "")}
        </Box>
        <CloseButton
          onMouseDown={() => {
            if (onRemove2) onRemove2(value);
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
}: any & { value: string }) {
  //MultiSelectValueProps
  // const Flag = flags[value];
  return (
    <div {...others}>
      <Box
        // fz={"30px"}
        style={(theme) => ({
          display: "flex",
          cursor: "default",
          alignItems: "center",
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
        <Box style={{ lineHeight: 2, fontSize: rem(20) }}>
          {G.replace_all_arr(value, HASHTAGS_SEP, "")}
        </Box>
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
//                 <div>{G.replace_all_arr(label, HASHTAGS_SEP, '')}</div>
//             </Flex>
//         </div>
//     );
// });

export function HashValue4Boardd({ label, postcount }) {
  // const Flag = flags[value];
  const { classes: classesG } = useGlobalStyl();
  return (
    <div>
      <Box
        style={(theme) => ({
          display: "flex",

          alignItems: "center",
        })}
      >
        {/* <Box mt={10}>
                    <IconHash size={16} />
                </Box> */}
        <Box
          style={{ lineHeight: 2, fontSize: rem(20) }}
          className={`${"hash-underline-child"}`}
        >
          {label}
        </Box>
        <Box
          ml="15px"
          mt="-10px"
          mr="-2px"
          c="red"
          className={`${"hash-no-underline-child"}`}
        >
          {postcount && +postcount > 200 ? "200+" : postcount}
          {/* {postcount} */}
        </Box>
      </Box>
    </div>
  );
}
export function HashValue4Boardd2({ label }) {
  // const Flag = flags[value];
  return (
    <div>
      <Box
        style={(theme) => ({
          display: "inline-block",

          alignItems: "center",
        })}
      >
        {/* <Box mt={10}>
                    <IconHash size={18} />
                </Box> */}
        <Box
          className={`${"hash-underline-child"}`}
          style={{ lineHeight: 2, fontSize: rem(16) }}
        >
          {label}
        </Box>
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
  return <div {...others} style={{ display: "none" }}></div>;
}

export const HashTagsInput = forwardRef<any, any>(
  ({ readOnly, ...others }, ref) => {
    let {initSearchValue}:any = { ...others };
    const { error, succeed, info } = useMessage();
    const [searchValue, onSearchChange] = useState(initSearchValue);
    //   const [value, setValue] = useState<any>(defaultValue);
    const {
      data: hashGet,
      errorMessage: errorMessageHashGet,
      succeeded: succeededHashGet,
      executeGet: executeHashGet,
    } = useAxiosGet(BUILD_API("hashtags"), { searchterm: searchValue });
    const [hashData, setHashData] = useState<any>(() => {
      return [];
    });
    let handlnotfound = useAppMultiSelectToAddMissedSearchVal<any>(setHashData);
    useEffect(() => {
      let errorMsg = errorMessageHashGet;
      if (errorMsg) error(errorMsg);
      if (succeededHashGet && hashGet) {
        setHashData(() => {
          if (hashGet) {
            let {value}: any = { others };
            let hashtags = value;
            if (hashtags && hashtags.length > 0) {
              hashtags.map((item) => {
                let found = false;
                hashGet.map((itemS) => {
                  if (item == itemS) {
                    found = true;
                    return;
                  }
                });
                if (!found) {
                  hashGet.push(item);
                }
              });
            }
            return hashGet;
          }
          return [];
        });
      }
    }, [errorMessageHashGet, succeededHashGet]);
    return (
      <AppMultiSelect
        charsNotAllowed={HASHTAGS_SEP}
        ref={ref}
        readOnly={readOnly}
        {...others}
        required
        
        data={ArrayToAppSelect(hashData && hashData.length > 0 ? hashData : [])}
        // label="Hashtag#"
        // placeholder=HASHTAGS_SEP
        searchable
        searchValue={searchValue}
        onSearchChange={(event) => {
          onSearchChange(event);
          executeHashGet();
        }}
        clearable
        maxDropdownHeight={250}
        limit={20}
        //   value={value}
        //   onChange={(val)=>setValue(val)}
        createOnNotFound={async (val) => {
          return await handlnotfound({ value: val, label: val });
        }}
        // description={t(
        //   "hashtags_infor_message",
        //   "Add hashtags that best fit your deal, as they will help improve its visibility in searches."
        // )}
      />
    );
  }
);
export const SplitHashtags = (hashtags) => {
  if (!hashtags) return [];
  let hash_consolid = G.replace_all(hashtags, HASHTAGS_SEP[1], HASHTAGS_SEP[0]);
  if (hash_consolid.split) {
    let hash_split = hash_consolid.split(HASHTAGS_SEP[0]);
    const cleanedArray = hash_split
      .map((item) => item.trim())
      .filter((item) => item !== "");
    return cleanedArray;
  }
  let trm = hashtags.trim();
  if (trm === "") return [];
  return [trm];
};
export const HashtagsAlert = ({ withinPortal }) => {
  const { t } = useTranslation("common", { keyPrefix: "table" });
  return (
    <Popover
      width={400}
      position="bottom"
      withArrow
      shadow="md"
      withinPortal={withinPortal}
      zIndex={200000000000000000}
    >
      <Popover.Target>
        <ActionIcon c="orange" variant="transparent">
          <IconQuestionMark stroke={1.5} size="1.2rem" />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown p="xs">
        <Alert variant="light" color="blue">
          <Text size="md" mt="xs">
            {t(
              "hashtag_autocomplete",
              `Please start typing to show the existing hashtags.`
            )}
          </Text>
          <Text size="md" mt="xs">
            {t(
              "hashtag_restrictions",
              `Hashtags cannot contain the # symbol or commas, but it can contains spaces.`
            )}
          </Text>
          <Text size="md" mt="xs">
            {t(
              "hashtag_end",
              `When you press Enter, it marks the end of the hashtag, and it will be treated as a single hashtag phrase.`
            )}
          </Text>
          <Text size="md" mt="xs">
            {t(
              "hashtag_allowence",
              `However, if you want to paste the hashtags, they must be separated either by the # symbol or by commas.`
            )}
          </Text>
        </Alert>
        <Alert variant="light" color="teal" mt="xs">
          <Text size="md" mt="xs">
            {t("hashtag_example", `e.g grade A,Grade B,iphone 15 promax,used`)}
          </Text>
          <Text size="md">
            {t("hashtag_example2", `e.g grade A#Grade B#iphone 15 promax#used`)}
          </Text>
          <Text size="md" c="indigo">
            {t(
              "hashtag_example_result",
              `Either one will be converted to: [grade A] [Grade B] [iphone 15 promax] [used]`
            )}
          </Text>
        </Alert>
      </Popover.Dropdown>
    </Popover>
  );
};
