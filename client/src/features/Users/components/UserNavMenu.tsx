'use client'

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useGetCurrentUser } from "@/features/Auth/hooks/useGetCurrentUser";
import UserMenu from "./UserMenu";

const UserNavMenu = () => {
    const {data, isLoading} = useGetCurrentUser();
    const router = useRouter();

    return (
        <div>
            {isLoading ? <p>Loading...</p> : !data ? (
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