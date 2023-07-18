import React from "react"
import { getUser } from "./getCurrentUser";
import { redirect } from "next/navigation";


const AuthGuard = (Component: React.FC<{}>, isProtected : boolean = true) => {
    return async () => {

        const user = await getUser();

        if (user == null && isProtected)
            redirect('/')

        // if(user != null)
        //     redirect('/')

        return (
            <Component />
        )
    }
}

export default AuthGuard 