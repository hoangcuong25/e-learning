/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { LogoutApi } from "@/api/auth.api";
import { getUser } from "@/api/user.api";
import { useRouter } from "next/navigation";
import React, { createContext, ReactNode, useEffect, useState } from "react";

interface AppContextType {
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AppContext = createContext<AppContextType>({
  user: null,
  setUser: () => { },
  fetchUser: async () => { },
  logout: async () => { },
});

interface AppContextProviderProps {
  children: ReactNode;
}

const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
}) => {
  const route = useRouter();

  const [user, setUser] = useState<UserType | null>(null);

  const fetchUser = async () => {
    try {
      const reponse = await getUser();

      setUser(reponse);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem("access_token");
      setUser(null);
      route.push("/login");

      await LogoutApi();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };


  const value = {
    user,
    setUser,
    fetchUser,
    logout
  };

  useEffect(() => {
    const isToken = localStorage.getItem("access_token");

    if (isToken) {
      fetchUser();
    }
  }, []);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
