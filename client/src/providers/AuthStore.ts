import { AuthResponse } from '@/features/auth/types/auth.types'
import {create} from 'zustand'

type AuthStoreType = {
    authInfo : AuthResponse,
    setAuthInfo : (data : AuthResponse) => void
    isLoggedIn : boolean,
    setIsLoggedIn : (v : boolean) => void,
    isLoading: boolean,
    setIsLoading: (v : boolean) => void,
}

export const defaultAuthInfo : AuthResponse = {
    access_token : "",
    username: "",
    id: ""
}

export const authStore = create<AuthStoreType>(set => ({
    authInfo : defaultAuthInfo,
    setAuthInfo : (data : AuthResponse) => set(() => ({authInfo: data})),
    isLoggedIn:  false,
    setIsLoggedIn: (v : boolean) => set(() => ({isLoggedIn:v})),
    isLoading:  true,
    setIsLoading: (v : boolean) => set(() => ({isLoading:v})),
}))