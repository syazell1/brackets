import React from "react"
import { getUser } from "./getCurrentUser";
import { redirect } from "next/navigation";
import { UserInfo } from "@/features/Users/types/Users";


const IsAuth = (Component: React.FC<UserInfo>) => {
    return async () => {

        const user = await getUser();

        if (user == null)
            redirect('/')

        return (
            <Component {...user} />
        )
    }
}

export default IsAuth