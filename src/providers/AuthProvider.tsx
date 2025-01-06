import React, {  useContext, useState } from "react";
 

import { hiddenProfile, userDataInit } from "../global/Misc";
import { useAppTheme } from "../hooks/useAppTheme";
import { useChangeLanguage, useChangeLocal } from "../hooks/useChangeLanLocal";

const AuthContext = React.createContext<any>({});

export const useAuth = () => {
  return useContext(AuthContext);
};
export const AuthProvider = ({ children }:any) => {
  // let { updateTheme } = useAppTheme();
  let { changeLang } = useChangeLanguage();
  let { changeLocal } = useChangeLocal(); 
  const [userData, setUserData] = useState<any>(() => {
    return userDataInit();
  });
  const [hidden, setHidden] = useState(() => {
    return hiddenProfile();
  });
  const [islogged, setIslogged] = useState<boolean>(() => {
    return !!localStorage.getItem("jwt") && localStorage.getItem("jwt") != "";
  });
  const [token, setToken] = useState<any>(() => {
    let prop = localStorage.getItem("jwt");
    return prop;
  });

  const [iscoadmin, setIscoadmin] = useState<boolean>(() => {
    return (
      !!localStorage.getItem("coadmin") &&
      localStorage.getItem("coadmin") == "X"
    );
  });
  // const navigate = useNavigate();
  // const location = useLocation();

  const handleLogin = async (data:any, error:any) => {
    let jwt = data ? data.jwt : null;
    if (jwt && jwt != "") {
      localStorage.setItem("jwt", jwt);
      localStorage.setItem("jwt_cpudt", new Date().getTime().toString());
      localStorage.setItem("coadmin", data.coadmin);

      setToken(jwt);
      setIslogged(!!jwt);
      // updateTheme(data.theme);
      changeLang(data.lang);
      changeLocal(data.local);
      setIscoadmin(data.co_admin == "X");
      setUserData(() => {
        let data2 = JSON.parse(JSON.stringify(data));
        delete data2["jwt"];
        delete data2["co_admin"];
        localStorage.setItem("userData", JSON.stringify(data2));
        return data2;
      });
      setHidden(() => {
        return hiddenProfile();
      });
      // let origin = location.state?.from?.pathname || "/app";
      // let search = location.search ? location.search : "";
      // if (!location.state?.from?.pathname && location.pathname != "")
      //   origin = location.pathname;
      // navigate(origin + search);
    }
  };
  const setUserDataLocal = (data:any) => {
    setUserData(data);
  };
  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("jwt_cpudt");
    localStorage.removeItem("userData");
    localStorage.removeItem("coadmin");
    setIscoadmin(false);
    setToken(null);
    setIslogged(false);
    setUserData({});
    // navigate('');
  };

  const value = {
    token,
    hidden,
    islogged,
    userData,
    iscoadmin,
    onLogin: handleLogin,
    onLogout: handleLogout,
    setUserData: setUserDataLocal,
    setHidden,
  };

  return <AuthContext.Provider value={value}>
     
    {children}
  </AuthContext.Provider>;
};
 
