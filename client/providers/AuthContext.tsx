'use client'

import { AxiosError } from 'axios'
import { AUTH_URL } from 'client/constants/server-config'
import { AuthDetails } from 'client/features/auth/types/auth.types'
import { UsersInfo } from 'client/features/users/types/users.types'
import client from 'client/libs/axios'
import { ReactNode, createContext, useEffect, useState } from 'react'

type AuthProviderType = {
  usersInfo: UsersInfo,
  setDetails: (data: UsersInfo) => void,
  isLoggedIn: boolean,
  setIsLoggedInHandler: (v: boolean) => void,
  isLoading: boolean,
  setIsLoadingHandler: (v: boolean) => void
}

export const authContextProvider = createContext<AuthProviderType>({} as AuthProviderType)

const AuthContext = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [usersInfo, setUsersInfo] = useState<UsersInfo>({} as UsersInfo);

  // get current authenticated user 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await client.get<UsersInfo>(`${AUTH_URL}/current_user`)

        if (res.status === 200) {
          setUsersInfo(res.data)
          setIsLoggedIn(true)
        }
        setIsLoading(false)
      }
      catch (ex) {
        if (ex instanceof AxiosError) {
          setUsersInfo({} as UsersInfo)
          setIsLoggedIn(false)
        }
        setIsLoading(false)
      }
    }

    fetchData();
  }, [])


  const setDetails = (data: UsersInfo) => {
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
