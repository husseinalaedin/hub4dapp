import {
  Alert,
  Box,
  Button,
  Card,
  Grid,
  LoadingOverlay,
  Select,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { emailUser } from "../../../global/Misc";
import { AppHeader } from "../app-admin/AppHeader";
import { useTranslation } from "react-i18next";
import { useGlobalStyl } from "../../../hooks/useTheme";
import { useDispatch, useSelector } from "react-redux";
import {
  selectMedium,
  selectSmall,
} from "../../../store/features/ScreenStatus";
import { useForm } from "@mantine/form";
import { useAxiosGet, useAxiosPost } from "../../../hooks/Https";
import { BUILD_API, useMessage } from "../../../global/G";
import { useEffect } from "react";
import { changeActive } from "../../../store/features/ActiveNav";
import { useSearchParams } from "react-router";
import { CardIn } from "../../../global/CardIn";
import {
  ConcernCategories,
  ConcernPriorities,
} from "../../../global/global-comp/Concerns";

export const ConcernPrivate = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(changeActive("concern"));
  }, []);
  const { error, succeed, warning } = useMessage();
  let email = emailUser();
  const { classes: classesG } = useGlobalStyl();
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const { t } = useTranslation("private", { keyPrefix: "concerns" });
  const [searchParams, setSearchParams] = useSearchParams();
  let co_id = searchParams.get("co_id");
  let co_name = searchParams.get("co_name");
  const form = useForm({
    initialValues: {
      email: email,
      subject: "",
      body: "",
      priority_id: "",
      category_id: !!co_id && co_id != "" ? "CR" : "",
      co_id_concern: co_id,
    },
    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value)
          ? null
          : t("email_cannot_be_blank", "Email cannot be blank"),
      subject: (value) =>
        value.length < 1
          ? t("subject_cannot_be_blank", "Subject cannot be blank")
          : null,
      body: (value) =>
        value.length < 1
          ? t("message_cannot_be_blank", "Message cannot be blank")
          : null,
      priority_id: (value) =>
        value.length < 1
          ? t("priority_cannot_be_blank", "Priority cannot be blank")
          : null,
      category_id: (value) =>
        value.length < 1
          ? t("category_cannot_be_blank", "Category cannot be blank")
          : null,
    },
  });
  const {
    data: dataPriorities,
    errorMessage: errorMessagePriorities,
    succeeded: succeededPriorities,
    isLoading: isLoadingPriorities,
    executeGet: executeGetPriorities,
  } = useAxiosGet(BUILD_API("concerns/priorities"), null);
  const {
    data: dataCategories,
    errorMessage: errorMessageCategories,
    succeeded: succeededCategories,
    isLoading: isLoadingCategories,
    executeGet: executeGetCategories,
  } = useAxiosGet(BUILD_API("concerns/categories"), null);
  let {
    data: dataPost,
    isLoading: isLoadingPost,
    succeeded: succeededPost,
    errorMessage: errorMessagePost,
    executePost,
  } = useAxiosPost(BUILD_API("concerns"), form.values);
  useEffect(() => {
    executeGetPriorities();
    executeGetCategories();
  }, []);
  useEffect(() => {
    if (errorMessagePriorities && errorMessagePriorities != "")
      error(errorMessagePriorities);
    if (errorMessageCategories && errorMessageCategories != "")
      error(errorMessageCategories);
  }, [errorMessagePriorities, errorMessageCategories]);
  useEffect(() => {
    if (errorMessagePost && errorMessagePost != "") error(errorMessagePost);

    if (succeededPost) {
      let succeededMsg = dataPost?.message;
      succeed(succeededMsg);
      form.resetDirty();
    }
  }, [errorMessagePost, succeededPost]);
  const save = () => {
    if (!form.isDirty()) {
      warning(t("no_change", "No data got changed!."));
      return;
    }
    form.validate();
    if (!form.isValid()) return;
    executePost();
  };
  return (
    <>
      <AppHeader title={t("report_to_us", "Report To Us")}></AppHeader>

      <Box className={classesG.editMax800}>
        <LoadingOverlay
          visible={isLoadingPriorities || isLoadingPost}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <form>
          <Grid gutter={small ? 7 : medium ? 10 : 15}>
            <Grid.Col span={{base:12}}>
              {succeededPost && (
                <Alert mt="lg">
                  <Title order={4}>
                    {t(
                      "succeeded_concern_message",
                      `We've received your message about the issue/concern. Our team is on it and will keep you posted. Thanks for reaching out!`
                    )}
                  </Title>
                </Alert>
              )}
            </Grid.Col>
            {co_id && co_id != "" && (
              <Grid.Col  span={{base:12}}>
                <Card>
                  <Title order={small ? 3 : 1}> {co_name}</Title>
                </Card>
              </Grid.Col>
            )}
            <Grid.Col  span={{base:12}}>
              <TextInput
                readOnly={succeededPost}
                w={small ? "100%" : "50%"}
                withAsterisk
                autoComplete="off"
                label={t("email", "Email")}
                placeholder={t("email", "Email")}
                {...form.getInputProps("email")}
              />
            </Grid.Col>

            <Grid.Col  span={{base:12}}>
              {/* <Select readOnly={succeededPost} w={small ? "100%" : "50%"} withAsterisk clearable withinPortal={true}
                                {...form.getInputProps('priority_id')}
                                label={t('priority', "Priority")}
                                placeholder={t('priority', "Priority")}

                                maxDropdownHeight={400}
                                data={dataPriorities?.map((itm) => {
                                    return {
                                        value: itm.id,
                                        label: itm.priority
                                    }
                                })}
                            /> */}
              <ConcernPriorities
                data={dataPriorities}
                readOnly={succeededPost}
                w={small ? "100%" : "50%"}
                withAsterisk
                clearable
              />
            </Grid.Col>
            <Grid.Col  span={{base:12}}>
              <ConcernCategories
                data={dataCategories}
                readOnly={succeededPost || (!!co_id && co_id != "")}
                w={small ? "100%" : "50%"}
                withAsterisk
                clearable
              />
              {/* <Select readOnly={succeededPost || (!!co_id && co_id!='')} w={small ? "100%" : "50%"} withAsterisk clearable withinPortal={true}
                                {...form.getInputProps('category_id')}
                                label={t('category', "Category")}
                                placeholder={t('category', "Category")}

                                maxDropdownHeight={400}
                                data={dataCategories?.map((itm) => {
                                    return {
                                        value: itm.id,
                                        label: itm.category
                                    }
                                })}
                            /> */}
            </Grid.Col>
            <Grid.Col  span={{base:12}}>
              <TextInput
                readOnly={succeededPost}
                withAsterisk
                autoComplete="off"
                label={t("subject", "Subject")}
                placeholder={t("subject", "Subject")}
                {...form.getInputProps("subject")}
              />
            </Grid.Col>
            <Grid.Col  span={{base:12}}>
              <Textarea
                readOnly={succeededPost}
                minRows={10}
                withAsterisk
                autoComplete="off"
                label={t("message", "Message")}
                placeholder={t("message", "Message")}
                {...form.getInputProps("body")}
              />
            </Grid.Col>
            <Grid.Col  span={{base:12}}>
              {!succeededPost && (
                <Button
                  mt="md"
                  size="lg"
                  style={{ width: "175px" }}
                  onClick={() => {
                    save();
                  }}
                >
                  {t("submit_message", "Submit Message")}
                </Button>
              )}
            </Grid.Col>
          </Grid>
        </form>
      </Box>
    </>
  );
};
