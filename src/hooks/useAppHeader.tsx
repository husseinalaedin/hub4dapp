import React, { createContext, useContext, useState } from "react";

const HeaderContext = createContext({});

export const HeaderProvider = ({ children }:any) => {
  const [HeaderComponent, setHeaderComponent] = useState(null);

  return (
    <HeaderContext.Provider value={{ HeaderComponent, setHeaderComponent }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useAppHeader = () => useContext(HeaderContext);
