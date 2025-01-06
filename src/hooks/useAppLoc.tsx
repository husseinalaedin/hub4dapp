import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, matchPath, useSearchParams } from "react-router";

export const AppLoc = createContext<any>({});

// export const useAppLoc = () => {
//   return useContext(AppLoc);
// };

const AppLocProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isTraderPage, setIsTraderPage] = useState(false);
  const location = useLocation();

  const value = {
    isTraderPage,
    setIsTraderPage,
  };
  useEffect(() => {
    //
    let co_id: any = searchParams.get("co_id");
    setIsTraderPage(co_id && +co_id != 0);
  }, [location.pathname]);

  return <AppLoc.Provider value={value}>{children}</AppLoc.Provider>;
};

export default AppLocProvider;
