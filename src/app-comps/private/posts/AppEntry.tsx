import { useEffect } from "react";
import { createSearchParams, useNavigate, useParams } from "react-router";
import { BUILD_API, BUILD_URL, HIST, useMessage } from "../../../global/G";
import { useAxiosGet } from "../../../hooks/Https";

export const AppEntry = () => {
  const navigate = useNavigate();
  let { shareidhex } = useParams();
  const { error, succeed, warning } = useMessage();
  const {
    data,
    getError,
    isLoading,
    succeeded,
    errorMessage,
    errorCode,
    executeGet,
  } = useAxiosGet(BUILD_API("shareisok/" + shareidhex), null);
  useEffect(() => {
    executeGet();
  }, []);
  useEffect(() => {
    if (succeeded) {
      // succeed('succeded')
      HIST.add(BUILD_URL(shareidhex), data.co_name);
      navigate("../trades/t/?hex=" + shareidhex);
      // navigate({pathname:'../trades',search: createSearchParams({q:'123'}).toString() })
    }
    if (errorMessage) {
      error(errorMessage); //SHARE_WITH_ID_NOT_EXIST LINK_WITH_ID_EXPIRED
    }
  }, [succeeded, errorMessage]);
  return (
    <>
      <div>redirect..</div>
    </>
  );
};
