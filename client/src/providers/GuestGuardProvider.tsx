'use client'

import { ReactNode } from "react"

const GuestGuardProvider = ({children} : {children : ReactNode}) => {
    return <>{children}</> 
}

export default GuestGuardProvider;