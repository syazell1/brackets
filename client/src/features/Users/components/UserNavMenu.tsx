'use client'

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useGetCurrentUser } from "@/features/Auth/hooks/useGetCurrentUser";
import UserMenu from "./UserMenu";
import { useContext } from "react";
import { authProviderContext } from "@/providers/AuthProvider";

const UserNavMenu = () => {
    // const {data, isLoading} = useGetCurrentUser();
    const {data, isLoading} = useContext(authProviderContext)
    
    return (
        <div>
            {isLoading ? <p>Loading...</p> : !data.username ? (
                <div className="flex gap-4">
                    <Link className="uppercase font-semibold" href="/auth/login">Login</Link>
                    <Link className="uppercase font-semibold" href="/auth/register">Register</Link>
                </div>
            ):(<UserMenu data={data}/>) 
            }
        </div>
    );
}

export default UserNavMenu;