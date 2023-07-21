'use client'

import { AUTH_URL } from "@/constants/server-config"
import { getCurrentUser } from "@/features/Auth/services/authApiService"
import { UserInfo } from "@/features/Users/types/Users"
import client from "@/lib/axios"
import { AxiosError } from "axios"
import { ReactNode, createContext, useEffect, useState } from "react"

type AuthProviderType = {
    data : UserInfo,
    isLoading: boolean,
    setUserInfoHandler: (data: UserInfo) => void
}

export const authProviderContext = createContext<AuthProviderType>({} as AuthProviderType)

const AuthProvider = ({children} : {children : ReactNode}) => {
    const [isLoading, setIsLoading] = useState(true)
    const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo)

    useEffect(() => {
        const fetchData = async () => {
            try
            {
                const res = await client.get<UserInfo>(`${AUTH_URL}/users`);
                setUserInfo(res.data);
                setIsLoading(false)
            }
            catch(err)
            {
                if(err instanceof AxiosError) {
                    setUserInfo({} as UserInfo)
                    setIsLoading(false)
                }
            }
        }
        fetchData()
    }, [])

    const setUserInfoHandler = (data : UserInfo) => {
        setUserInfo(data)
    }

    const val = {
        data : userInfo,
        isLoading,
        setUserInfoHandler
    }

    return (
        <authProviderContext.Provider value={val}>
            {children} 
        </authProviderContext.Provider>
    )
}

export default AuthProvider