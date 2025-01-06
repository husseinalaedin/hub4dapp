import { Box } from "@mantine/core";
import { useAuth } from "../../providers/AuthProvider";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { BUILD_API, useMessage } from "../../global/G";
import { useEffect, useState } from "react";
import { useAxiosGet } from "../../hooks/Https";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSmall,
  selectMedium,
  selectLarge,
  selectxLarge,
  selectxLarger,
} from "../../store/features/ScreenStatus";
import { useGlobalStyl } from "../../hooks/useTheme";

export const Unsubscribe = () => {
  const { iscoadmin, islogged } = useAuth();
  const { t } = useTranslation("public", { keyPrefix: "unsubscribe" });
  const { classes: classesG } = useGlobalStyl();
  const navigate = useNavigate();
  let { shareidhex } = useParams();

  const { error, succeed, warning } = useMessage();
  const [note_by_user, setNote_by_user] = useState("");
  const [decision_by_user, setDecision_by_user] = useState("");
  const { data, getError, errorMessage, succeeded, isLoading, executeGet } =
    useAxiosGet(BUILD_API("public/unsubscribe/" + shareidhex), {});
  // const { data: dataPut, putError, isLoading: isLoadingPut, succeeded: succeededPut, errorMessage: errorMessagePut, errorCode, executePut } = useAxiosPut(BUILD_API('decision/channels/' + short_link + '/decision-noted/'), { note_by_user: note_by_user, decision_by_user: decision_by_user });
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const large = useSelector(selectLarge);
  const xlarge = useSelector(selectxLarge);
  const xlarger = useSelector(selectxLarger);
  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(changeActive('decisionnoted'))
  }, []);
  useEffect(() => {
    executeGet();
  }, []);
  // useEffect(() => {
  //     if (succeededPut) {
  //         succeed(dataPut?.message)
  //     }
  //     if (errorMessagePut) {
  //         error(errorMessagePut)
  //     }
  // }, [succeededPut, errorMessagePut])

  useEffect(() => {
    if (errorMessage) {
      error(errorMessage);
    }
  }, [errorMessage]);
  return (
    <>
      <Box>Unsubscribe</Box>
      {data && data.length > 0 && <Box>{data[0].company_name}</Box>}
    </>
  );
};
