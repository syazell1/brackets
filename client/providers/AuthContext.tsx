'use client'
import { AuthDetails } from 'client/features/auth/types/auth.types'
import { ReactNode, createContext, useState } from 'react'

type AuthProviderType = {
  authDetails: AuthDetails,
  setDetails: (data: AuthDetails) => void
}

export const authContextProvider = createContext<AuthProviderType>({} as AuthProviderType)

const AuthContext = ({ children }: { children: ReactNode }) => {
  const [authDetails, setAuthDetails] = useState<AuthDetails>({} as AuthDetails);


  const setDetails = (data: AuthDetails) => {
    setAuthDetails(data)
  }

  const val = {
    authDetails,
    setDetails
  }

  return (
    <authContextProvider.Provider value={val}>
      {children}
    </authContextProvider.Provider>
  )

}

export default AuthContext;
