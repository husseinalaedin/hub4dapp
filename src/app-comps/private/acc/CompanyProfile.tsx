import { useEffect, useRef, useState } from "react";
import {
  TextInput,
  Button,
  LoadingOverlay,
  Paper,
  Group,
  useMantineTheme,
  Chip,
  Input as InputMantine,
  Autocomplete,
  HoverCard,
  Checkbox,
  Popover,
  Menu,
  Modal,
  Box,
  UnstyledButton,
  Avatar,
  Text,
  Accordion,
  Card,
  Badge,
  Image,
  Grid,
  SimpleGrid,
  Flex,
  Title,
  Divider,
  Textarea,
  Switch,
} from "@mantine/core";
import { useForm } from "@mantine/form";

import { useTranslation } from "react-i18next";

import "react-phone-number-input/style.css";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Input from "react-phone-number-input/input";
import { useAuth } from "../../../providers/AuthProvider";
import {
  selectMedium,
  selectSmall,
} from "../../../store/features/ScreenStatus";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { changeActive } from "../../../store/features/ActiveNav";
import { BUILD_API, useMessage } from "../../../global/G";
import {
  useCountryCode,
  useLangCountries,
} from "../../../global/CountrySelect";
import { useAxiosGet, useAxiosPost } from "../../../hooks/Https";
import { setSettingLocal } from "../../../global/Misc";
import { AppHeader } from "../app-admin/AppHeader";
import { EditSave } from "../../../global/EditSave";
import { InputPopUpListSelect } from "../../../global/InputPopUpListSelect";

import { useGlobalStyl } from "../../../hooks/useTheme";
import { EditorApp, MemoEditorApp } from "../../../global/AppEditor";

export const CompanyProfile = () => {
  const [canShowDialogLeavingPage, setCanShowDialogLeavingPage] =
    useState(false);
  // const [
  //     showDialogLeavingPage,
  //     confirmNavigation,
  //     cancelNavigation
  // ] = useNavigatingAway(canShowDialogLeavingPage);
  const { setHidden } = useAuth();
  const { classes: classesG } = useGlobalStyl();
  const dispatch = useDispatch();
  let { theme } = useAppTheme();
  const theme_2 = useMantineTheme();

  // const [aboutBeforeSave, setAboutBeforeSave] = useState('')
  useEffect(() => {
    dispatch(changeActive("NONE"));
  }, []);

  const { t } = useTranslation("private", { keyPrefix: "user_profile" });

  const [edit, setEdit] = useState<boolean>(false);
  const [provinceName, setProvinceName] = useState("");

  const [cellValue, setCellValue] = useState("");
  const [tellValue, setTellValue] = useState("");
  const [listValue, setListValue] = useState(["1", "2", "3"]);
  const [popoverOpened, setPopoverOpened] = useState(false);
  const [hiddenProfile, setHiddenProfile] = useState(false);

  const { error, succeed, warning } = useMessage();
  const { countries } = useLangCountries();
  let { countryCode, country }: any = useCountryCode();
  const aboutRef = useRef<any>(null);
  let [companyAbout, setCompanyAbout] = useState("");
  const form = useForm({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      tell: "",
      cell: "",
      cell_verified: "",
      company_name: "",
      hidden: "",
      address: "",
      city: "",
      province_code: "",
      zip: "",
      country: "",
      about: "",
      url: "",
    },

    // functions will be used to validate values at corresponding key
    validate: {
      first_name: (value) =>
        value.length < 2
          ? t(
              "first_name_at_least_2chars",
              "First Name must have at least 2 letters"
            )
          : null,
      last_name: (value) =>
        value.length < 2
          ? t(
              "last_name_at_least_2chars",
              "Last Name must have at least 2 letters"
            )
          : null,
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : t("invalid_eamil", "Invalid email"),
      cell: (value) =>
        !value || value == ""
          ? t("invalid_phone", "Cell pnone number required")
          : null,
      company_name: (value) =>
        value.length < 1 ? t("co_required", "Company name is required") : null,
      address: (value) =>
        value.length < 1 ? t("address_required", "Address is required") : null,
      city: (value) =>
        value.length < 1 ? t("city_required", "City is required") : null,
      country: (value) =>
        value.length < 1 ? t("country_required", "Country is required") : null,
      province_code: (value) =>
        value.length < 1
          ? t("province_required", "State/Province is required")
          : null,
      about: (value) =>
        value.length < 1 ? t("about_required", "About is required") : null,
    },
  });
  const {
    data,
    getError,
    errorMessage: errorMessageProfile,
    succeeded: get_succeeded,
    isLoading,
    executeGet,
  } = useAxiosGet(BUILD_API("company/profile"), null);
  const {
    data: provinces_data,
    getError: provinces_getError,
    succeeded: provinces_succeeded,
    isLoading: provinces_isLoading,
    executeGet: provinces_executeGet,
  } = useAxiosGet(BUILD_API("util/provinces"), {
    country_code: form.values.country,
  });
  let {
    data: post_data,
    postError,
    isLoading: post_isLoading,
    succeeded: post_succeeded,
    errorMessage,
    errorCode,
    executePost,
  } = useAxiosPost(BUILD_API("company/profile"), form.values);
  let {
    data: verify_data,
    isLoading: verify_post_isLoading,
    succeeded: verify_post_succeeded,
    errorMessage: verify_errorMessage,
    executePost: executVerifyPost,
  } = useAxiosPost(BUILD_API("send_sms_veirifcation_code"), {
    phone_number_to_verify: form.values.cell,
  });
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);

  // let companyAbout = useEditorApp({ content: data?.about })
  useEffect(() => {
    executeGet();
  }, []);
  useEffect(() => {
    if (get_succeeded && data) {
      setCompanyAbout(data.about);
    }
  }, [errorMessageProfile, get_succeeded]);
  useEffect(() => {
    aboutRef?.current?.editorObject?.save();
  }, [companyAbout]);
  useEffect(() => {
    if (!data) return;
    form.setValues(data);
    // setAboutBeforeSave(data.about)
    // companyAbout.setCurrentContent(data?.about)
    setProvinceName(data["province_name"]);
    setHiddenProfile(() => {
      return data["hidden"] == "X";
    });
  }, [get_succeeded, getError]);

  const post = (e: any) => {
    const aboutContent = aboutRef?.current?.editorObject?.currentContent;
    // e.preventDefault();
    if (!aboutContent || aboutContent === "") {
      return;
    }

    form.setValues({ about: aboutContent });
    if (!form.isDirty()) {
      warning(t("no_change", "No data got changed!."));
      return;
    }
    form.validate();
    if (!form.isValid()) return;

    executePost();
  };
  useEffect(() => {
    if (post_succeeded) {
      succeed(post_data["message"]);
      setEdit(false);
      form.resetDirty();
      setSettingLocal("hidden", hiddenProfile ? "X" : "");
      setHidden(hiddenProfile);
      // companyAbout.save()
    }

    if (errorMessageProfile) error(errorMessageProfile);
    if (errorMessage) error(errorMessage);
  }, [post_succeeded, errorMessageProfile, errorMessage]);
  const verifyPhone = () => {
    executVerifyPost();
  };
  // useEffect(() => {
  //     setCanShowDialogLeavingPage(form.isDirty());
  // }, [form.isDirty()])
  return (
    <>
      <AppHeader title={t("company_profile", "Company Profile")}>
        {/* <ConfirmDialog showDialog,cancelNavigation,confirmNavigation /> */}
        <EditSave
          setEditCompletedFromPrarent={post_succeeded}
          initEdit={false}
          onSave={(e: any) => {
            post(e);
          }}
          onEdit={(e: boolean | ((prevState: boolean) => boolean)) => {
            setEdit(e);
          }}
        />
      </AppHeader>
      <Box className={classesG.editMax800}>
        <LoadingOverlay visible={isLoading || post_isLoading} />
        {/* <ConfirmDialog
                showDialog={showDialogLeavingPage}
                // setShowDialog={setCanShowDialogLeavingPage}
                confirmNavigation={confirmNavigation}
                cancelNavigation={cancelNavigation}
            /> */}
        <form>
          <Grid gutter={small ? 5 : medium ? 10 : 15}>
            <Grid.Col span={{ base: 12 }}>
              <TextInput
                readOnly={true}
                disabled={true}
                withAsterisk
                label={t("email", "Email")}
                placeholder={t("email", "Email")}
                {...form.getInputProps("email")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                readOnly={!edit}
                withAsterisk
                label={t("first_name", "First Name")}
                placeholder={t("first_name", "First Name")}
                {...form.getInputProps("first_name")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                readOnly={!edit}
                withAsterisk
                label={t("last_name", "Last Name")}
                placeholder={t("last_name", "Last Name")}
                {...form.getInputProps("last_name")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12 }}>
              <Menu
                width={200}
                position="bottom-start"
                returnFocus={true}
                disabled={
                  !edit || (!!form.values.cell && form.values.cell != "")
                }
              >
                <Menu.Target>
                  <Input
                    readOnly={!edit}
                    withAsterisk
                    autoComplete="off"
                    inputComponent={TextInput}
                    placeholder={t(
                      "cell_p",
                      "Please enter Cell Phone with country area code"
                    )}
                    label={t("cell_p_label", "Cell Phone")}
                    // value={cellValue}
                    {...form.getInputProps("cell")}
                    rightSectionWidth={100}
                    rightSection={
                      <>
                        {form.values.cell_verified == "" && (
                          <Button size="sm" onClick={verifyPhone}>
                            {t("VERIFY_PHONE", "Verify")}
                          </Button>
                        )}
                        {form.values.cell_verified == "X" && (
                          <Chip size="sm" checked radius="md">
                            {t("VERIFIED", "Verified")}
                          </Chip>
                        )}
                      </>
                    }
                    onFocusCapture={() => setPopoverOpened(true)}
                    onBlurCapture={() => setPopoverOpened(false)}
                  />
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    onClick={() => {
                      form.setValues({ cell: countryCode });
                    }}
                  >
                    {" "}
                    {t("are_code", "Area code found:") +
                      `${country} - ${countryCode}`}
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Grid.Col>
            <Grid.Col span={{ base: 12 }}>
              <Menu
                width={200}
                position="bottom-start"
                returnFocus={true}
                disabled={
                  !edit || (!!form.values.tell && form.values.tell != "")
                }
              >
                <Menu.Target>
                  <Input
                    readOnly={!edit}
                    autoComplete="off"
                    inputComponent={TextInput}
                    placeholder={t(
                      "tell_p",
                      "Please enter Phone with country area code"
                    )}
                    label={t("tell_p_label", "Phone")}
                    // value={tellValue}

                    {...form.getInputProps("tell")}
                    // onChange={setTellValue}
                  />
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    onClick={() => {
                      form.setValues({ tell: countryCode });
                    }}
                  >
                    {" "}
                    {t("are_code", "Area code found:") +
                      `${country} - ${countryCode}`}
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Grid.Col>
          </Grid>
          <Box className={classesG.seperator} />
          <Grid gutter={small ? 5 : medium ? 10 : 15}>
            <Grid.Col span={{ base: 12 }}>
              <TextInput
                disabled={true}
                withAsterisk
                label={t("co_name", "Company Name")}
                placeholder={t("co_name", "Company Name")}
                {...form.getInputProps("company_name")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12 }}>
              <TextInput
                readOnly={!edit}
                label={t("co_url", "Company Url")}
                placeholder={t("co_url", "Company Url")}
                {...form.getInputProps("url")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12 }}>
              <Text className={classesG.textAsLabel}>
                {t("hidden_profile", "Hidden Profile?")}
              </Text>
              <Card className={classesG.border}>
                <Group justify="center" style={{ maxWidth: "500px" }}>
                  <Switch
                    disabled={!edit}
                    checked={hiddenProfile}
                    onChange={(event) => {
                      setHiddenProfile(event.currentTarget.checked);
                      let val = event.currentTarget.checked === true ? "X" : "";
                      form.setValues({ hidden: val });
                      form.setTouched({ hidden: true });
                      form.setDirty({ hidden: true });
                    }}
                    mt={-12}
                    label={t("yes", "Yes")}
                  />
                </Group>
                {!hiddenProfile && (
                  <Text className={classesG.primaryColor} mt="sm" size="sm">
                    {t(
                      "co_profile_is_not_hidden",
                      "Your company profile is not hidden"
                    )}
                  </Text>
                )}
                {hiddenProfile && (
                  <Text c="red" mt="sm" size="sm">
                    {t(
                      "co_profile_is_hidden",
                      "Your company profile is hidden"
                    )}
                  </Text>
                )}
                <Text mt={0} size="sm">
                  {t(
                    "hidden_profile_info",
                    "If your company profile is hidden, no one else will be able to view your company activities or profile unless the user has an Unexpired sharing post link!."
                  )}
                </Text>
              </Card>
            </Grid.Col>
          </Grid>
          <Box className={classesG.seperator} />

          <Grid gutter={small ? 5 : medium ? 10 : 15}>
            <Grid.Col span={{ base: 12 }}>
              <TextInput
                readOnly={!edit}
                withAsterisk
                label={t("address", "Stree Address")}
                placeholder={t("address", "Stree Address")}
                {...form.getInputProps("address")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                readOnly={!edit}
                withAsterisk
                label={t("city", "City")}
                placeholder={t("city", "City")}
                {...form.getInputProps("city")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                readOnly={!edit}
                label={t("zip", "Postal Code")}
                placeholder={t("zip", "Postal Code")}
                {...form.getInputProps("zip")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputPopUpListSelect
                readOnly={!edit}
                withAsterisk
                label={t("country", "Country")}
                placeholder={t("country", "Country")}
                {...form.getInputProps("country")}
                form={form}
                formKey="country"
                dataList={countries ? countries : []}
                keySearch="key"
                labelSearch="label"
                canedit={edit}
                textBeforeEdit=""
                onSelected={(elem: any) => {
                  form.values.province_code = "";
                  setProvinceName("");
                }}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputPopUpListSelect
                readOnly={!edit}
                withAsterisk
                label={t("province", "State/Province")}
                placeholder={t("province", "State/Province")}
                {...form.getInputProps("province_code")}
                form={form}
                formKey="province_code"
                dataList={provinces_data ? provinces_data : []}
                keySearch="province_code"
                labelSearch="province_name"
                canedit={edit}
                textBeforeEdit={provinceName}
                onSelected={() => {}}
                onPopUp={() => {
                  provinces_executeGet();
                }}
                isLoading={provinces_isLoading}
              />
            </Grid.Col>
          </Grid>

          <Box className={classesG.seperator} />
          <Text className={`${classesG.textAsLabel}`}>
            {t("about", "About")}
            <span style={{ color: "red" }}> *</span>{" "}
          </Text>
          <Text size="xs">
            {t(
              "company_desc",
              "Please provide information as much as possible about your company and the products you deal with, the details will be showing in screen when the usera visit your company profile!."
            )}
          </Text>
          <Grid gutter={small ? 5 : medium ? 10 : 15}>
            <Grid.Col span={{ base: 12 }}>
              {/* <div className={`${edit ? 'hide-visibility ' : ''}`}>
                                <Card radius="sm" p="sm" pt="xs" withBorder>
                                    <div dangerouslySetInnerHTML={{ __html: form.values.about }}>

                                    </div>
                                </Card>
                            </div>
                            {
                                <Card className={`${!edit ? 'hide-visibility ' : ''}`} withBorder style={{ padding: 0 }}>
                                   
                                    <AppEditor error={null} refreshStamp={null} editorFor={null} content={form.values.about}
                                        right={null} left={null} edit={edit} extra={{ withcopy: true }}
                                        onChange={(content) => {
                                            setAboutBeforeSave(content)
                                            form.setDirty({ about: true })

                                        }} />
                                </Card>

                            } */}
            </Grid.Col>
          </Grid>
        </form>
        {<EditorApp ref={aboutRef} content={data?.about} edit={true} />}
      </Box>
    </>
  );
};
