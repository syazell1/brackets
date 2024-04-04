'use client'

import {ReactNode, createContext, useState, useEffect} from 'react'
import {AuthInfo} from "@/features/auth/types/auth.types";
import axios from '@/lib/axios';
import { AxiosError } from 'axios';

type AuthProviderType = {
  usersInfo: AuthInfo,
  setDetails: (data: AuthInfo) => void,
  isLoggedIn: boolean,
  setIsLoggedInHandler: (v: boolean) => void,
  isLoading: boolean,
  setIsLoadingHandler: (v: boolean) => void
}

export const authContextProvider = createContext<AuthProviderType>({} as AuthProviderType)

const AuthContext = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [usersInfo, setUsersInfo] = useState<AuthInfo>({} as AuthInfo);

  // get current authenticated user
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await axios.get<AuthInfo>(`/auth/current_user`)

  //       if (res.status === 200) {
  //         setUsersInfo(res.data)
  //         setIsLoggedIn(true)
  //       }
  //       setIsLoading(false)
  //     }
  //     catch (ex) {
  //       if (ex instanceof AxiosError) {
  //         setUsersInfo({} as AuthInfo)
  //         setIsLoggedIn(false)
  //       }
  //       setIsLoading(false)
  //     }
  //   }

  //   fetchData();
  // }, [])


  const setDetails = (data: AuthInfo) => {
    setUsersInfo(data)
  }

  const setIsLoggedInHandler = (v: boolean) => {
    setIsLoggedIn(v)
  }

  const setIsLoadingHandler = (v: boolean) => {
    setIsLoading(v)
  }

  const val = {
    usersInfo,
    setDetails,
    setIsLoggedInHandler,
    isLoggedIn,
    isLoading,
    setIsLoadingHandler
  }

  return (
    <authContextProvider.Provider value={val}>
      {children}
    </authContextProvider.Provider>
  )

}

export default AuthContext;
