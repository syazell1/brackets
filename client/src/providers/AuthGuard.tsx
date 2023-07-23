import React from "react"
import { getUser } from "./getCurrentUser";
import { redirect } from "next/navigation";


const AuthGuard = (Component: React.FC<{}>) => {
    return async () => {

        const user = await getUser();

        if (user == null )
            redirect('/')

        return (
            <Component />
        )
    }
}

export default AuthGuard 