import React, { createContext, useContext, useState } from "react";

const HeaderNdSideContext = createContext({});

export const HeaderNdSideProvider = ({ children }:any) => {
  const [HeaderComponent, setHeaderComponent] = useState(null);
  const [desktopFocus,setDesktopfocus]=useState<boolean>(false)
  return (
    <HeaderNdSideContext.Provider
      value={{
        HeaderComponent,
        setHeaderComponent,
        desktopFocus,
        setDesktopfocus,
      }}
    >
      {children}
    </HeaderNdSideContext.Provider>
  );
};

export const useAppHeaderNdSide = () => useContext(HeaderNdSideContext);
