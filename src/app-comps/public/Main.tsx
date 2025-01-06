import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { useAuth } from "../../providers/AuthProvider";
import { Box, Title } from "@mantine/core";
import { BUILD_URL, G, HIST } from "../../global/G";

export const Main = () => {
  let { shareidhex }: any = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  let hist_p = G.ifNull(searchParams.get("hist"), "");
  useEffect(() => {
    if (shareidhex[0] == "s") {
      // navigate(`../app/shareresponse/` + shareidhex, { replace: true })
      console.log("href:", window.location.href);
      navigate(`../app/trades/t/c/?hex=` + shareidhex, { replace: true });
      if (hist_p == "") HIST.add(BUILD_URL(shareidhex), "");
    }

    if (shareidhex[0] == "c")
      navigate(`../app/decision-noted/` + shareidhex, { replace: true });
    if (shareidhex[0] == "u")
      navigate(
        `../app/unsubscribe/` + shareidhex.substr(1, shareidhex.length - 1),
        { replace: true }
      );
  }, []);

  return (
    <Box>
      <Title order={1}>{"Redirecting............."}</Title>
    </Box>
  );
};
